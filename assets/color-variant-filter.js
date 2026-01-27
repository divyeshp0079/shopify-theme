function filterImagesByColor(color) {
  if (!color) return;

  color = color.toLowerCase();

  const medias = document.querySelectorAll('[data-media-id]');
  let hasColorImages = false;
  let matched = false;
  let firstColorMedia = null;

  // First check: does this product have color-specific images?
  medias.forEach((media) => {
    const img = media.querySelector('img');
    if (!img) return;

    const alt = (img.getAttribute('alt') || '').toLowerCase();
    if (alt.includes('color:')) {
      hasColorImages = true;
    }
  });

  // If no color images exist, show all images
  if (!hasColorImages) {
    medias.forEach((media) => {
      media.removeAttribute('hidden');
    });
    return;
  }

  // Apply actual color-based filtering
  medias.forEach((media) => {
    const img = media.querySelector('img');
    if (!img) return;

    const alt = (img.getAttribute('alt') || '').toLowerCase();

    if (alt.includes(`color:${color}`)) {
      media.removeAttribute('hidden');
      if (!firstColorMedia) firstColorMedia = media;
      matched = true;
    } else {
      media.setAttribute('hidden', 'true');
    }
  });

  // Fallback: if no image matched the selected color, show all images
  if (!matched) {
    medias.forEach((media) => {
      media.removeAttribute('hidden');
    });
  } else if (firstColorMedia) {
    // Set the matched color image as active in the gallery
    setTimeout(() => {
      const mediaId = firstColorMedia.getAttribute('data-media-id');
      if (mediaId) {
        const mediaGallery = document.querySelector('[id^="MediaGallery-"]');
        if (mediaGallery && mediaGallery.setActiveMedia) {
          mediaGallery.setActiveMedia(mediaId, true);
        }
      }
    }, 0);
  }

  // Shopify gallery refresh
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 0);
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  const checkedRadio = document.querySelector('input[type="radio"]:checked');
  if (checkedRadio) {
    filterImagesByColor(checkedRadio.value);
  }
});

// On variant change
document.addEventListener('change', function (e) {
  const radio = e.target.closest('input[type="radio"]');
  if (!radio) return;

  filterImagesByColor(radio.value);
});
