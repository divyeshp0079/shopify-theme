if (!customElements.get('color-swatch-variant')) {
  customElements.define('color-swatch-variant', class ColorSwatchVariant extends HTMLElement {
    constructor() {
      super();
      this.setupColorSwatches();
    }

    setupColorSwatches() {
      const swatches = this.querySelectorAll('.color-swatch');
      
      swatches.forEach(swatch => {
        const radio = swatch.querySelector('input[type="radio"]');
        
        if (radio) {
          // Set active state on page load if checked
          if (radio.checked) {
            swatch.classList.add('is-active');
          }

          // Handle swatch click
          swatch.addEventListener('click', (e) => {
            e.preventDefault();
            radio.checked = true;
            this.updateActiveSwatches();
            
            // Trigger change event to update variant images
            radio.dispatchEvent(new Event('change', { bubbles: true }));
          });

          // Handle radio change from other sources
          radio.addEventListener('change', () => {
            this.updateActiveSwatches();
          });
        }
      });
    }

    updateActiveSwatches() {
      const swatches = this.querySelectorAll('.color-swatch');
      
      swatches.forEach(swatch => {
        const radio = swatch.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
          swatch.classList.add('is-active');
        } else {
          swatch.classList.remove('is-active');
        }
      });
    }
  });
}

// Auto-enhance color option fields
document.addEventListener('DOMContentLoaded', () => {
  // Find all product form inputs that are for color options
  const colorInputs = document.querySelectorAll('.product-form__input');
  
  colorInputs.forEach(input => {
    const legend = input.querySelector('legend');
    if (legend && legend.textContent.toLowerCase().includes('color')) {
      input.classList.add('color-input');
      
      // Wrap radios in color-swatches container if they're not already
      const radios = input.querySelectorAll('input[type="radio"]');
      if (radios.length > 0 && !input.querySelector('.color-swatch-variant')) {
        // Create wrapper
        const wrapper = document.createElement('color-swatch-variant');
        wrapper.className = 'product-form__color-swatches';
        
        // Move radios into wrapper as color swatches
        radios.forEach(radio => {
          const swatchDiv = document.createElement('div');
          swatchDiv.className = 'color-swatch';
          
          // Get the color value from the radio
          const colorValue = radio.value.toLowerCase().trim();
          
          // Create color circle with CSS color or image
          const colorCircle = document.createElement('div');
          colorCircle.style.width = '100%';
          colorCircle.style.height = '100%';
          colorCircle.style.borderRadius = '50%';
          colorCircle.style.backgroundColor = getColorFromName(colorValue);
          
          swatchDiv.appendChild(radio);
          swatchDiv.appendChild(colorCircle);
          
          // Add color name as text
          const label = document.createElement('span');
          label.className = 'color-swatch-text';
          label.textContent = radio.value;
          swatchDiv.appendChild(label);
          
          wrapper.appendChild(swatchDiv);
        });
        
        // Insert wrapper after legend
        legend.parentElement.insertBefore(wrapper, legend.nextElementSibling);
        
        // Remove old radio labels/text
        const oldLabels = input.querySelectorAll('label');
        oldLabels.forEach(label => {
          if (label !== legend.parentElement) {
            label.style.display = 'none';
          }
        });
      }
    }
  });
});

// Map color names to hex codes
function getColorFromName(colorName) {
  const colorMap = {
    'black': '#1a1a1a',
    'white': '#ffffff',
    'red': '#c41e3a',
    'blue': '#0052cc',
    'green': '#22c55e',
    'yellow': '#fbbf24',
    'brown': '#8b4513',
    'tan': '#d2b48c',
    'beige': '#f5f5dc',
    'cream': '#fffdd0',
    'gray': '#808080',
    'grey': '#808080',
    'olive': '#808000',
    'burnt olive': '#c9b037',
    'light burnt olive': '#a39963',
    'navy': '#000080',
    'burgundy': '#800020',
    'charcoal': '#36454f',
    'pink': '#ffc0cb',
    'purple': '#800080',
    'gold': '#ffd700',
    'silver': '#c0c0c0'
  };

  // Try exact match first
  if (colorMap[colorName]) {
    return colorMap[colorName];
  }

  // Try partial match
  for (const [key, value] of Object.entries(colorMap)) {
    if (colorName.includes(key) || key.includes(colorName)) {
      return value;
    }
  }

  // Default to a neutral gray
  return '#cccccc';
}
