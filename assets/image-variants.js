if (!customElements.get('image-variant-selector')) {
  customElements.define('image-variant-selector', class ImageVariantSelector extends HTMLElement {
    constructor() {
      super();
      this.setupImageVariants();
    }

    setupImageVariants() {
      const variantItems = this.querySelectorAll('.image-variant-item');
      
      variantItems.forEach(item => {
        const radio = item.querySelector('input[type="radio"]');
        
        if (radio) {
          if (radio.checked) {
            item.classList.add('is-active');
          }

          item.addEventListener('click', (e) => {
            e.preventDefault();
            radio.checked = true;
            this.updateActiveVariants();
            radio.dispatchEvent(new Event('change', { bubbles: true }));
          });

          radio.addEventListener('change', () => {
            this.updateActiveVariants();
          });
        }
      });
    }

    updateActiveVariants() {
      const items = this.querySelectorAll('.image-variant-item');
      items.forEach(item => {
        const radio = item.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
    }
  });
}

// Multi-variant image swatch system
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const swatches = document.querySelectorAll('.variant-image-swatch');
    if (!swatches.length) return;

    function clearSelected() {
      swatches.forEach(s => s.classList.remove('selected'));
    }

    // Find form and variant inputs
    const variantInput = document.querySelector('form[action*="/cart/add"] input[name="id"], form.product-form input[name="id"]');
    const variantSelect = document.querySelector('form[action*="/cart/add"] select[name="id"], form.product-form select[name="id"]');
    
    // Find main product image
    const mainImage = document.querySelector('.product__media img, .product-single__photo img, .product-featured img, .product__gallery img, .product-main-image img, .product-media-item.is-active img');
    
    // Find price and title elements
    const priceEl = document.querySelector('[data-price], .price-item--regular, .product__price, .price, [id^="ProductPrice"]');
    const titleEl = document.querySelector('.product__title, .product-single__title, h1.product-title');

    swatches.forEach(function(swatch) {
      swatch.addEventListener('click', function() {
        const variantId = this.dataset.variantId;
        const imageSrc = this.dataset.imageSrc;
        const price = this.dataset.price;
        const title = this.dataset.title;
        const available = this.dataset.available === "true";

        clearSelected();
        this.classList.add('selected');

        // Update main image
        if (imageSrc && mainImage) {
          mainImage.src = imageSrc;
          mainImage.removeAttribute('srcset');
          
          // Trigger image update for media gallery
          const mediaGallery = mainImage.closest('.product__media-item, [id^="Slide-"]');
          if (mediaGallery) {
            mediaGallery.classList.add('is-active');
          }
        }

        // Update variant selection
        if (variantInput) {
          variantInput.value = variantId;
          variantInput.dispatchEvent(new Event('change', { bubbles: true }));
          variantInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        if (variantSelect) {
          const opt = variantSelect.querySelector(`option[value="${variantId}"]`);
          if (opt) {
            variantSelect.value = variantId;
            variantSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }

        // Update product title and price
        if (titleEl && title) {
          titleEl.textContent = title;
        }
        if (priceEl && price) {
          priceEl.textContent = price;
        }

        // Update "Add to cart" button state
        const addToCartBtn = document.querySelector('form[action*="/cart/add"] [type="submit"], .product-form__submit, #AddToCart, [type="submit"]');
        if (addToCartBtn) {
          addToCartBtn.disabled = !available;
          addToCartBtn.textContent = available ? "Add to cart" : "Sold out";
        }

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('variantImageSwatch:changed', { detail: { variantId } }));
      });
    });

    // Mark initial selected variant on page load
    (function markInitial() {
      const currentId = variantInput?.value || variantSelect?.value;
      if (currentId) {
        const selected = document.querySelector(`.variant-image-swatch[data-variant-id="${currentId}"]`);
        if (selected) {
          clearSelected();
          selected.classList.add('selected');
        }
      }
    })();
  });
})();

