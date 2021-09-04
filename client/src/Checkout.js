import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

export default function Checkout() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { name: name, email: email };
    console.log(`Creating a customer: ${JSON.stringify(data)}`);

    const response = await fetch('/customer', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const customer = await response.json();

    console.log(`Customer: ${JSON.stringify(customer)}`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label>Name</label>
        <input placeholder='Full Name' type='text' value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <input placeholder='test@test.com' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Field>

      <Button primary type='submit' value='Submit'>
        Submit
      </Button>
    </Form>
  );
}
