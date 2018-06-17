# Cartmine
Easy JavaScript carts.

### What is it?
Cartmine is a client-side (Javascript) cart system designed to support basic carts with minimal code.
Avoid setting up complex databases, handling data persistence, sessions, and complex cart software.

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

```
<script src="https://checkout.stripe.com/checkout.js"></script>

// Upon clicking checkout, create a Stripe charge.
// Cartmine sends the authToken to your server (specified in data-checkout-page above) along with all Cartmine items and data
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
*If you do not add an onCheckout function, Cartmine will default to making a POST request to the data-checkout-page specified in the included script.
By default this will include all items and totals in the cart, but optionally you can send an auth token as shown above*

4. The customer can checkout with their name and email. The cart data is sent to your server (a POST request to the url provided in `data-checkout-page`). Use this to easily charge your customers.


## Best Practices
Cartmine is a client side cart system and should be used with care. It is recommended that you validate data as authentic using the unique identifiers (`data-id`) you used when creating the HTML elements along with the other information.
