# Cartmine
Easy JavaScript carts.

### What is it?
Cartmine is a client-side (Javascript) cart system designed to support basic carts with minimal code.
By adding HTML elements with a data attribute `data-cartmine-item`, you create add to cart functionality.
Integrates easily with Stripe checkout for a full cart to checkout solution.

### Under the hood
Cartmine keeps track of items in your cart through local storage or cookies (when local storage is not supported).
Include the Cartmine javascript in your page and define items that can be added to cart using data attributes in HTML.

## Getting started
1. Include the Cartmine script on your page:

```
<script src="cartmine_min.js"
    data-cartmine
    data-currency="USD">
</script>
```

2. Markup HTML elements with the Cartmine data attributes to create add to cart buttons:

```
<button
    data-cartmine-item
    data-id="rainbow-tshirt-small"
    data-amount="500"
    data-description="Awesome Rainbow T-Shirt (Small)">
    ADD
</button>
```
