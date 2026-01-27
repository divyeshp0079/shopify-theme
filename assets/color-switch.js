document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".js-color-sibling");
  const mainSection = document.querySelector("[data-section-id]");

  if (!links.length || !mainSection) return;

  const sectionId = mainSection.dataset.sectionId;

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const url = link.dataset.url;
      if (!url) return;

      // Update URL (no reload)
      window.history.pushState({}, "", url);

      // Active state
      links.forEach(l => {
        l.classList.remove("active");
        l.setAttribute("aria-current", "false");
      });
      link.classList.add("active");
      link.setAttribute("aria-current", "true");

      // Fetch ONLY product section
      fetch(`${url}?section_id=${sectionId}`)
        .then(res => res.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          const newSection = doc.querySelector(`#MainProduct-${sectionId}`);
          const currentSection = document.querySelector(`#MainProduct-${sectionId}`);

          if (newSection && currentSection) {
            currentSection.innerHTML = newSection.innerHTML;
          }
        })
        .catch(err => {
          console.error("Color switch failed", err);
          window.location.href = url; // fallback
        });
    });
  });
});
