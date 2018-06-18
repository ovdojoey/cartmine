# Cartmine
Easy JavaScript carts in the Browser.

### What is it?
Cartmine is a client-side Javascript cart system designed to support basic carts with minimal code.
Avoid setting up complex databases, handling data persistence, sessions, or complex cart software.

By adding HTML elements with a data attribute `data-cartmine-item`, you'll have add-to-cart functionality out of the box.
Integrates easily with Stripe for a full checkout solution.

### Under the hood
Cartmine keeps track of items in your cart through local storage or cookies.
The document is searched for Cartmine DOM elements and click event listeners are attached. Upon checkout,
Cartmine can send cart data to your server using a POST request with JSON body.  With a few lines of back-end code,
you can charge your customers and fulfill orders.

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

3. Alternatively, instead of using HTML elements in Step 2, you can pass a JSON map to define all shopping cart items:
```
// Define your items as JSON. Note: a unique ID on the script tag is required
<script id="items_map" type="application/json">
    {
        "tshirt": {
            "amount": 400,
            "name": "T-shirt",
            "selector": "#cm_tshirt_1" // Points to an DOM node with the specified ID
        },
        "sweatshirt": {
            "amount": 400,
            "name": "Sweat shirt",
            "selector": ".cm_sweatshirt"
        }
    }
</script>

// Include the Cartmine script. Note the data-items-map-id pointing to the ID of the script above
<script src="cartmine_min.js"
    data-cartmine
    data-testing="true"
    data-items-map-id="items_map"
    data-currency="USD">
</script>
```


4. Create a checkout button:

```
<button data-cartmine-checkout>
    Checkout
</button>
```

5. Handle payment processor integration with minimal code:

```
<script src="https://checkout.stripe.com/checkout.js"></script>

// Upon clicking checkout, create a Stripe charge.
// Cartmine sends the authToken to your server along with all Cartmine items
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

6. The customer enters checkout. Cartmine data is sent to your server (a POST request to the url provided in `data-checkout-url`). Use this to charge your customers


## Best Practices
Cartmine is a client side cart system and should be used with care. It is imperative that you validate the data passed your server-side script. One approach may be to use the unique identifiers (`data-id`) for each item and verify the price matches what's expected.


---

# API

## Cartmine
Access to the core Cartmine object stored on `window`.

#### Cartmine.onCheckout(func)
Pass in a custom function which is called the user is ready to checkout. This is where you could hook-up Stripe integration, or others.

#### Cartmine.getSubtotal()
Get the subtotal in base units (cents)

#### Cartmine.submit(token)
Submit the current cart to your server. This will POST JSON data to the endpoint specified in data-checkout-url.
Optionally accepts a token value which will be sent along with the request.

---


# Examples

- [Stripe enabled basic cart](sample.html) - A few items ready to be added to cart. When ready to checkout, Stripe Checkout is called. A Stripe token is passed to your server.
- [Stripe enabled basic cart with JSON map](sample_json.html) - Uses JSON items map to enable add-to-cart functionality.  Useful if your shopping items data is consistent and would be re-verified server-side.

---

# Something's wrong

Add `data-testing='true'` as a data attribute to your script tag and open the Console. See if any errors show up there.

---

## Optional configuration
Additional options to set when including the Cartmine script (see Step 1 in Getting Started).

`data-testing='true'`
Shows you errors, warnings, and information about your Cartmine implementation. Open the developer console to see any issues found.

`data-currency='EUR'`
3 letter ISO currency code. Default is USD.

`data-items-map-id=my-element-id`
Used to specify a JSON map of shopping items.  See the [Stripe enabled basic cart with JSON map](sample_json.html) example.

`data-checkout-url=checkout.php`
Endpoint where the Cartmine data is sent to when checkout is complete.


---

# Future

- Include a visual cart on page (through iFrame or DOM)
    - Allow add, delete, update quantity interactions
- Create pub/sub model when any action is taken
    - Allow users to hook into add/remove/quantity change actions and fire custom handlers upon changes. Will be useful for those who want to render their own client-side cart implementation.
- Support coupons, item customization, possibly stock, and free-form price (donations).
