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

---

## Getting started
1. Include the Cartmine script on your page:

```
<script src="cartmine_min.js"
    data-cartmine
    data-checkout-url="checkout.php"
    data-currency="USD">
</script>
```

2. Markup HTML elements with the Cartmine data attributes to create add to cart buttons:

```
<button
    data-cartmine-item                                               // REQUIRED
    data-id="rainbow-tshirt-small"                                   // REQUIRED - every ID must be unique
    data-amount="500"                                                // OPTIONAL - amount is in base units (cents)
    data-name="Rainbow T (Small)"                                    // OPTIONAL
    data-description="Soft & beautiful t-shirt made of pure..."      // OPTIONAL
>
    Add to cart
</button>
```

3. Create a checkout button:

```
<button data-cartmine-checkout>
    Checkout
</button>
```

4. Handle payment processor integration with minimal code:

```
<script src="https://checkout.stripe.com/checkout.js"></script>

// Upon clicking checkout, create a Stripe charge.
// Cartmine sends the authToken to your server (specified in data-checkout-url above) along with all Cartmine items and data
Cartmine.onCheckout(() => {
    StripeCheckout.configure({
        key: 'pk_test_g6do5S237ekq10r65BnxO6S0', // Your public stripe key
        token: (token) => {
            // Transaction is finished.
            Cartmine.submit({ token });
        }
    }).open({
        amount: Cartmine.getSubtotal()
    });
});
```

5. The customer enters checkout. Cartmine data is sent to your server (a POST request to the url provided in `data-checkout-url`). Use this to charge your customers


## Best Practices
Cartmine is a client side cart system and should be used with care. It is recommended that you validate data as authentic using the unique identifiers (`data-id`) you used when creating the HTML elements along with the other information.

---

# API

## Cartmine
Access to the core Cartmine object which stored on `window`.

#### Cartmine.getSubtotal()
Get the subtotal in base units (cents)

#### Cartmine.submit(token)
Submit the current cart to your server. Will POST values to the endpoint specified in data-checkout-url.
Optionally accepts a token value which will be sent along with the request.

---

# Advanced

## Optional configuration
Additional options to set when including the Cartmine script (see Step 1 in Getting Started).

`data-testing='true'`
Shows you errors, warnings, and information about your Cartmine implementation. Open the developer console to see any issues found.

`data-tax='0.75'`
If you have a predefined tax rate, specify it here.

`data-currency='EUR'`
3 letter ISO currency code. Default is USD. 
