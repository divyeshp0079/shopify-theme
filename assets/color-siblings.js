document.addEventListener('DOMContentLoaded', () => {

  const siblings = document.querySelectorAll('.js-color-sibling');
  const variantRadios = document.querySelectorAll(
    'variant-radios input[type="radio"]'
  );

  if (!siblings.length || !variantRadios.length) return;

  siblings.forEach(sibling => {
    sibling.addEventListener('click', e => {

      /* 🔥 PAGE RELOAD STOP */
      e.preventDefault();
      e.stopPropagation();

      const color = sibling.dataset.color;
      if (!color) return;

      /* UI active state */
      siblings.forEach(s => s.classList.remove('active'));
      sibling.classList.add('active');

      /* 🔥 REAL VARIANT CHANGE */
      variantRadios.forEach(radio => {
        if (radio.value.toLowerCase() === color) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
          radio.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      /* 🔥 URL CHANGE WITHOUT RELOAD */
      const targetUrl = sibling.dataset.url;
      if (targetUrl) {
        window.history.pushState({}, '', targetUrl);
      }

    });
  });

});
