# Shopify Theme Development Guide

## Architecture Overview

This is a **Shopify Liquid theme** using a modular section-based architecture. The codebase combines server-side Liquid templating with client-side JavaScript custom elements.

### Directory Structure
- **`sections/`**: Reusable page sections with embedded JSON schemas (e.g., `main-product.liquid`, `footer.liquid`). Each section is independently configurable in the Shopify theme editor.
- **`layout/`**: Root template (`theme.liquid`) that wraps all pages. Sets up global CSS variables, fonts, and loads core JavaScript files.
- **`snippets/`**: Reusable Liquid partials (e.g., `card-product.liquid`, `price.liquid`). Use `{% render %}` to include them.
- **`templates/`**: Page-level templates (e.g., `product.json`, `collection.json`). JSON templates compose sections.
- **`assets/`**: CSS files and JavaScript modules. JS files use Web Components (`customElements.define()`) and pub/sub pattern.
- **`locales/`**: Translation files (`t:` prefix references these).
- **`config/`**: `settings_schema.json` (theme editor controls) and `settings_data.json` (active settings).

## Key Patterns & Conventions

### Liquid Sections
Every section follows this structure:
```liquid
{{ 'component-name.css' | asset_url | stylesheet_tag }}

{%- style -%}
  .section-{{ section.id }}-padding {
    padding-top: {{ section.settings.padding_top | times: 0.75 | round: 0 }}px;
  }
  @media screen and (min-width: 750px) {
    .section-{{ section.id }}-padding {
      padding-top: {{ section.settings.padding_top }}px;
    }
  }
{%- endstyle -%}

<!-- Markup -->

{% schema %}
{
  "name": "t:sections.section-name.name",
  "settings": [
    {"type": "range", "id": "padding_top", "min": 0, "max": 100, "unit": "px"}
  ]
}
{% endschema %}
```
- **Responsive padding**: Use `times: 0.75` factor for mobile, full value for desktop (750px+ breakpoint).
- **Color schemes**: `color-{{ section.settings.color_scheme }}` applies predefined color classes from `settings_schema.json`.
- **Sections are self-contained**: Each loads its own CSS and deferred JS. Check examples in [main-product.liquid](../sections/main-product.liquid) and [footer.liquid](../sections/footer.liquid).

### JavaScript: Web Components & Pub/Sub
- **Custom Elements**: Use `customElements.define()` to create reusable JS components. See [product-form.js](../assets/product-form.js) and [cart-drawer.js](../assets/cart-drawer.js).
- **Pub/Sub Communication**: Global `publish()` and `subscribe()` from [pubsub.js](../assets/pubsub.js) coordinate cross-component events.
  - Example: `publish(PUB_SUB_EVENTS.cartUpdate, {source: 'product-form', productVariantId: id})`
  - Events referenced in `constants.js`
- **Focus management**: `trapFocus()` and `removeTrapFocus()` utilities in [global.js](../assets/global.js) for modals/drawers.

### Snippets with Comments
Snippets document parameters in comment blocks (see [card-product.liquid](../snippets/card-product.liquid)):
```liquid
{% comment %}
  Renders a product card
  Accepts:
  - card_product: {Object} Product Liquid object
  - show_vendor: {Boolean} Show vendor. Default: false
  Usage:
  {% render 'card-product', show_vendor: section.settings.show_vendor %}
{% endcomment %}
```

### CSS Conventions
- Component CSS prefixed with `component-` (e.g., `component-card.css`, `component-price.css`)
- Section CSS prefixed with `section-` (e.g., `section-main-product.css`)
- Template CSS prefixed with `template-` (e.g., `template-collection.css`)
- CSS variables (custom properties) set in [theme.liquid](../layout/theme.liquid) at `:root`, e.g., `--font-body-family`, `--color-base-text`, `--product-card-image-padding`

## Critical Workflows

### Adding a New Section
1. Create `sections/my-section.liquid` with HTML, inline styles, and `{% schema %}` block
2. Add settings to schema (use existing examples for consistency)
3. Create corresponding CSS: `assets/my-section.css` (if complex)
4. Load CSS with: `{{ 'my-section.css' | asset_url | stylesheet_tag }}`
5. Add section to template via `templates/*.json` or make it available globally in `config/settings_schema.json`

### Adding JavaScript to a Section
- Create Web Component in `assets/component-name.js`
- Load with deferred script tag: `<script src="{{ 'component-name.js' | asset_url }}" defer="defer"></script>`
- Export custom element class and register with `customElements.define()`
- Use pub/sub for cross-section communication

### Modifying Product Form Behavior
[product-form.js](../assets/product-form.js) handles "Add to Cart". It:
1. Fetches cart state
2. Publishes `cartUpdate` or `cartError` events
3. Renders updated cart drawer via `this.cart.renderContents(response)`
4. Supports selling plans (see `getCurrentSellingPlanId()` call)

### Localization
- All user-facing strings use `t:namespace.key` Liquid filters
- Strings defined in `locales/` JSON files
- Theme settings reference: `t:settings_schema.colors.label`

## Integration Points & Dependencies

### Cart System
- Cart drawer and cart notification (custom elements) subscribe to cart events
- Product form publishes updates; cart components render new state
- See [cart-drawer.js](../assets/cart-drawer.js) and [cart-notification.js](../assets/cart-notification.js)

### Settings System
- `config/settings_schema.json` defines all theme-editor controls
- Sections read settings via Liquid: `{{ section.settings.setting_id }}`
- CSS variables in `theme.liquid` expose color/font settings globally

### Shopify Liquid Objects & Filters
- `{{ product }}`, `{{ collection }}`, `{{ cart }}` are global Shopify objects
- Common filters: `| image_url`, `| asset_url`, `| t:` (translation), `| divided_by`, `| times`
- Design mode: `{%- if request.design_mode -%}` loads editor-specific JS

## Common Patterns to Reuse

1. **Responsive Image Loading**: Use `image_url: width: X` with multiple srcsets (see [card-product.liquid](../snippets/card-product.liquid#L49-L53))
2. **Accordion/Collapsible**: Built with `<details>` + accessibility handling in [global.js](../assets/global.js#L8-L20)
3. **Modal Focus Trap**: Use `trapFocus()` when opening dialogs (see [cart-drawer.js](../assets/cart-drawer.js#L31))
4. **Section Padding**: Always include responsive padding block (mobile 75%, desktop 100%)
5. **Color Schemes**: Use `color-{{ settings.color_scheme }}` with `gradient` class for built-in color support

## Theme Settings Reference
Key settings in `config/settings_schema.json`:
- `type_body_font`, `type_header_font` (Google Fonts)
- `colors_text`, `colors_background_1`, `colors_accent_1`, `colors_accent_2`
- `gradient_background_1`, `gradient_accent_1`, etc.
- `page_width`, `card_style`, `card_corner_radius`
- Media/product card styling: `media_padding`, `media_radius`, `card_image_padding`

These are exposed as CSS variables in `:root` for use across all assets.
