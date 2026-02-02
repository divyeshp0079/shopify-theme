// Simple accessible toggle for mega menu on touch / keyboard
(function () {
  const menu = document.querySelector('.mega-menu');
  if (!menu) return;

  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const style = menu.getAttribute('data-style') || 'simple';

  function closeAll() {
    menu.querySelectorAll('.mega-menu__item.open').forEach(function (el) {
      el.classList.remove('open');
      el.querySelector('.mega-menu__dropdown')?.setAttribute('aria-hidden', 'true');
    });
  }

  // Click toggles for touch / small screens
  menu.addEventListener('click', function (e) {
    const item = e.target.closest('.mega-menu__item');
    if (!item) return;
    if (!item.classList.contains('has-children')) return;

    // On touch or small screens, toggle on click
    if (isTouch || window.innerWidth < 900) {
      e.preventDefault();
      const isOpen = item.classList.contains('open');
      closeAll();
      if (!isOpen) {
        item.classList.add('open');
        item.querySelector('.mega-menu__dropdown')?.setAttribute('aria-hidden', 'false');
      }
    }
  });

  // Hover behavior for desktop when style is `flyout` or `simple`
  if (!isTouch) {
    menu.querySelectorAll('.mega-menu__item.has-children').forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        if (window.innerWidth >= 900) {
          closeAll();
          item.classList.add('open');
          item.querySelector('.mega-menu__dropdown')?.setAttribute('aria-hidden', 'false');
        }
      });
      item.addEventListener('mouseleave', function () {
        if (window.innerWidth >= 900) {
          item.classList.remove('open');
          item.querySelector('.mega-menu__dropdown')?.setAttribute('aria-hidden', 'true');
        }
      });
    });
  }

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.mega-menu')) {
      closeAll();
    }
  });

  // Close on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll();
    }
  });
})();

