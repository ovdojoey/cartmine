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

3. Handle checkout and payment processor integration with minimal code:

*If you do not add an onCheckout function, Cartmine will default to making a POST request to the data-checkout-page specified in the included script.
By default this will include all items and totals in the cart, but optionally you can send an auth token as shown below*

```
<script src="https://checkout.stripe.com/checkout.js"></script>

// Upon clicking checkout, create a Stripe charge.
// Cartmine sends the authToken to your server along with all Cartmine items and data
Cartmine.onCheckout(() => {
    StripeCheckout.configure({
        key: 'pk_test_g6do5S237ekq10r65BnxO6S0', // Your public stripe key
        token: function(token) {
            this.setAuthToken(token);
        }
    }).open({
        amount: this.cart.getSubtotal()
    });
});
```
