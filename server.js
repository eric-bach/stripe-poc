const express = require('express');
const stripe = require('stripe')(
  'sk_test_51JS0PTHFPm42d8JmI4SjoOCeWZfPUXWvIols3VG8eJcJjgft60UWNQ5zxIgJrnqusxCUAC0rSLElZyjFbZaQHOgt00WCPN8lRj'
);

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// Server - health check
app.get('/health', (req, res) => {
  res.send({ express: 'CONNECTED' });
});

// Stripe - create customer
app.post('/customer', (req, res) => {
  try {
    console.log(req.body);

    stripe.customers
      .create({
        name: req.body.name,
        email: req.body.email,
      })
      .then((cust) => {
        res.send(cust);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    res.send(err);
  }
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
