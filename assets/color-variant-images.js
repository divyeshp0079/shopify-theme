if (!customElements.get('variant-radios')) {
  customElements.define('variant-radios', class VariantRadios extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantChange() {
      this.updateVariantImages();
    }

    updateVariantImages() {
      // Get the selected variant
      const selectedValue = this.querySelector('input[name]:checked')?.value;
      if (!selectedValue) return;

      // Get all variants from JSON
      const variantsJson = this.querySelector('script[type="application/json"]');
      if (!variantsJson) return;

      const variants = JSON.parse(variantsJson.textContent);
      
      // Find the variant with matching title
      const selectedVariant = variants.find(v => {
        return v.title.includes(selectedValue) || 
               v.option1 === selectedValue ||
               v.option2 === selectedValue ||
               v.option3 === selectedValue;
      });

      if (!selectedVariant || !selectedVariant.featured_image) return;

      // Update the media gallery
      this.updateMediaGallery(selectedVariant);
      this.loadVariantImages(selectedVariant);
    }

    updateMediaGallery(variant) {
      const sectionId = this.getAttribute('data-section');
      const mediaGallery = document.querySelector(`#MediaGallery-${sectionId}`);
      
      if (!mediaGallery || !variant.featured_image) return;

      // Get the featured image for this variant
      const featuredImageUrl = variant.featured_image.src;
      
      // Find or update the active media item
      const activeMedia = mediaGallery.querySelector('.product__media-item.is-active');
      const activeImage = activeMedia?.querySelector('img');

      if (activeImage && featuredImageUrl) {
        // Update the main image
        activeImage.src = featuredImageUrl;
        activeImage.srcset = this.generateSrcSet(featuredImageUrl);
      }
    }

    loadVariantImages(variant) {
      if (!variant.featured_image) return;

      const sectionId = this.getAttribute('data-section');
      const mediaGallery = document.querySelector(`#MediaGallery-${sectionId}`);
      if (!mediaGallery) return;

      // Fetch the variant URL to get all associated images
      const variantUrl = `${window.location.pathname}?variant=${variant.id}`;
      
      fetch(variantUrl)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const variantPage = parser.parseFromString(html, 'text/html');
          
          // Get images from variant page
          const variantImages = variantPage.querySelectorAll('[data-media-id]');
          
          if (variantImages.length > 0) {
            // Update gallery with variant-specific images
            this.swapGalleryImages(variantImages, sectionId);
          }
        })
        .catch(error => console.error('Error loading variant images:', error));
    }

    swapGalleryImages(variantImages, sectionId) {
      const mediaGallery = document.querySelector(`#MediaGallery-${sectionId}`);
      if (!mediaGallery) return;

      const currentGallery = mediaGallery.querySelector('[id^="Slider-Gallery"]');
      const variantGalleryItems = Array.from(variantImages);

      // Only swap if we found variant-specific images
      if (variantGalleryItems.length > 0) {
        // Update the media gallery display
        const mediaItems = currentGallery.querySelectorAll('.product__media-item');
        
        mediaItems.forEach((item, index) => {
          if (index < variantGalleryItems.length) {
            const variantItem = variantGalleryItems[index];
            const variantImage = variantItem.querySelector('img');
            
            if (variantImage) {
              const itemImage = item.querySelector('img');
              if (itemImage) {
                itemImage.src = variantImage.src;
                itemImage.srcset = variantImage.srcset || this.generateSrcSet(variantImage.src);
                itemImage.alt = variantImage.alt;
              }
            }
          }
        });
      }
    }

    generateSrcSet(imageSrc) {
      // Generate responsive image srcset from image URL
      const widths = [165, 360, 533, 720, 940, 1066];
      return widths
        .map(width => {
          const resizedUrl = imageSrc.replace(/\?.*$/, `?width=${width}`);
          return `${resizedUrl} ${width}w`;
        })
        .join(', ');
    }
  });
}

if (!customElements.get('variant-selects')) {
  customElements.define('variant-selects', class VariantSelects extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', this.onVariantChange.bind(this));
    }

    onVariantChange() {
      this.updateVariantImages();
    }

    updateVariantImages() {
      // Get all selected values from dropdowns
      const selects = this.querySelectorAll('select');
      if (!selects.length) return;

      // Get all variants from JSON
      const variantsJson = this.querySelector('script[type="application/json"]');
      if (!variantsJson) return;

      const variants = JSON.parse(variantsJson.textContent);
      
      // Find matching variant based on selected options
      const selectedOptions = Array.from(selects).map(select => select.value);
      const selectedVariant = variants.find(v => {
        return v.option1 === selectedOptions[0] &&
               (!selectedOptions[1] || v.option2 === selectedOptions[1]) &&
               (!selectedOptions[2] || v.option3 === selectedOptions[2]);
      });

      if (!selectedVariant || !selectedVariant.featured_image) return;

      // Update the media gallery
      this.updateMediaGallery(selectedVariant);
      this.loadVariantImages(selectedVariant);
    }

    updateMediaGallery(variant) {
      const sectionId = this.getAttribute('data-section');
      const mediaGallery = document.querySelector(`#MediaGallery-${sectionId}`);
      
      if (!mediaGallery || !variant.featured_image) return;

      const featuredImageUrl = variant.featured_image.src;
      const activeMedia = mediaGallery.querySelector('.product__media-item.is-active');
      const activeImage = activeMedia?.querySelector('img');

      if (activeImage && featuredImageUrl) {
        activeImage.src = featuredImageUrl;
        activeImage.srcset = this.generateSrcSet(featuredImageUrl);
      }
    }

    loadVariantImages(variant) {
      if (!variant.featured_image) return;

      const sectionId = this.getAttribute('data-section');
      const mediaGallery = document.querySelector(`#MediaGallery-${sectionId}`);
      if (!mediaGallery) return;

      const variantUrl = `${window.location.pathname}?variant=${variant.id}`;
      
      fetch(variantUrl)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const variantPage = parser.parseFromString(html, 'text/html');
          const variantImages = variantPage.querySelectorAll('[data-media-id]');
          
          if (variantImages.length > 0) {
            this.swapGalleryImages(variantImages, sectionId);
          }
        })
        .catch(error => console.error('Error loading variant images:', error));
    }

    swapGalleryImages(variantImages, sectionId) {
      const mediaGallery = document.querySelector(`#MediaGallery-${sectionId}`);
      if (!mediaGallery) return;

      const currentGallery = mediaGallery.querySelector('[id^="Slider-Gallery"]');
      const variantGalleryItems = Array.from(variantImages);

      if (variantGalleryItems.length > 0) {
        const mediaItems = currentGallery.querySelectorAll('.product__media-item');
        
        mediaItems.forEach((item, index) => {
          if (index < variantGalleryItems.length) {
            const variantItem = variantGalleryItems[index];
            const variantImage = variantItem.querySelector('img');
            
            if (variantImage) {
              const itemImage = item.querySelector('img');
              if (itemImage) {
                itemImage.src = variantImage.src;
                itemImage.srcset = variantImage.srcset || this.generateSrcSet(variantImage.src);
                itemImage.alt = variantImage.alt;
              }
            }
          }
        });
      }
    }

    generateSrcSet(imageSrc) {
      const widths = [165, 360, 533, 720, 940, 1066];
      return widths
        .map(width => {
          const resizedUrl = imageSrc.replace(/\?.*$/, `?width=${width}`);
          return `${resizedUrl} ${width}w`;
        })
        .join(', ');
    }
  });
}
