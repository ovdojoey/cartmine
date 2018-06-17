# Cartmine
Easy JavaScript carts.

### What is it?
Cartmine is a client-side (Javascript) cart system designed to support basic carts with minimal code.
By adding HTML elements with a data attribute `data-cartmine-item`, you create add to cart functionality.
Integrates easily with Stripe for a full checkout solution.

### Under the hood
Cartmine keeps track of items in your cart through local storage or cookies when local storage is not supported.
The page is searched for Cartmine DOM elements and click event listeners are attached which add items to the cart.

## Getting started
1. Include the Cartmine script on your page:

```
<script src="cartmine_min.js"
    data-cartmine
    data-checkout-page="checkout.php"
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

3. Integrate with a payment processor using minimal code:

```
// Upon clicking checkout, create a Stripe charge (requires minimal Stripe integration)
// Cartmine sends the auth_token to your server along with all Cartmine items and data
Cartmine.onCheckout(() => {
    let auth_token;
    StripeCheckout.configure({
        key: 'pk_test_g6do5S237ekq10r65BnxO6S0', // Your stripe key
        token: function(token) {
            auth_token = token;
            // Send token.id to your server for processing the charge `token.id`.
        }
    }).open({
        amount: this.cart.getSubtotal()
    });
});
```
