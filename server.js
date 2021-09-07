https://github.com/stripe-samples/subscription-use-cases/blob/master/fixed-price-subscriptions/

const express = require('express');
require('dotenv').config({ path: './.env' });
const cors = require('cors');

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
  console.log(
    'The .env file is not configured. Follow the instructions in the readme to configure the .env file. https://github.com/stripe-samples/subscription-use-cases'
  );
  console.log('');
  process.env.STRIPE_SECRET_KEY
    ? ''
    : console.log('Add STRIPE_SECRET_KEY to your .env file.');

  process.env.STRIPE_PUBLISHABLE_KEY
    ? ''
    : console.log('Add STRIPE_PUBLISHABLE_KEY to your .env file.');

  process.exit();
}

var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'eric-bach/stripe-poc',
    version: '0.0.1',
    url: 'https://github.com/eric-bach/stripe-poc',
  },
});
//stripe = stripe(process.env.STRIPE_SECRET_ID);

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// Server - health check
app.get('/health', (req, res) => {
  res.send({ express: 'CONNECTED' });
});

// Stripe - create subscription
app.post('/subscription', async (req, res) => {
  console.log(`Received request: ${JSON.stringify(req.body)}`);

  console.log('Creating customer');
  var customer = await stripe.customers.create({
    name: req.body.name,
    email: req.body.email,
    metadata: {
      memberNumber: req.body.memberNumber,
    },
  });
  console.log(`Customer created: ${customer.id}`);

  console.log('Creating paymentMethod');
  var paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 8,
      exp_year: 2024,
      cvc: '314',
    },
  });
  paymentMethod = await stripe.paymentMethods.attach(paymentMethod.id, {
    customer: customer.id,
  });
  console.log(`Payment method created: ${paymentMethod.id}`);

  console.log('Creating product');
  const product = await stripe.products.create({
    name: 'Basic Membership',
    description: 'Basic Membership Service',
  });
  console.log(`Product created: ${product.id}`);

  console.log('Creating price');
  const price = await stripe.prices.create({
    unit_amount: 800,
    currency: 'cad',
    recurring: { interval: 'month' },
    product: product.id,
  });
  console.log(`Price created: ${price.id}`);

  // Create subscription
  console.log('Creating subscription');
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: price.id }],
    default_payment_method: paymentMethod.id,
  });
  console.log(`Subscription created: ${subscription.id}`);

  res.send(customer);

  console.log('Completed request');
});

// TEMP - Stripe - checkout demo
app.post('/charge', (req, res) => {
  try {
    stripe.customers
      .create({
        name: 'Test',
        email: 'test@test.com',
      })
      .then((customer) =>
        stripe.charges.create({
          amount: 5 * 100,
          currency: 'usd',
          customer: customer.id,
          description: 'Thank you for your generous donation.',
        })
      )
      .then(() => res.render('complete.html'))
      .catch((err) => console.log(err));
  } catch (err) {
    res.send(err);
  }
});
