import React, { useState } from 'react';
import { Button, Form, Message, Header, Checkbox } from 'semantic-ui-react';

export default function Checkout() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [memberNumber, setMemberNumber] = useState('');
  const [ccName, setCcName] = useState('');
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [result, setResult] = useState();
  const [subscription, setSubscription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { name: name, email: email, memberNumber: memberNumber };
    console.log(`Creating a customer: ${JSON.stringify(data)}`);

    const response = await fetch('http://localhost:5000/subscription', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const customer = await response.json();

    if (customer) {
      setResult(customer.id);
    }

    console.log(`Customer: ${JSON.stringify(customer)}`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header as='h2'>
        Customer Information
        <Header.Subheader>Enter customer information</Header.Subheader>
      </Header>
      <Form.Field>
        <label>Name</label>
        <input
          placeholder='Full Name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <input
          placeholder='test@test.com'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Membership Number</label>
        <input
          placeholder='6202725555555555'
          type='text'
          value={memberNumber}
          onChange={(e) => setMemberNumber(e.target.value)}
        />
      </Form.Field>

      <Header as='h2'>
        Payment Information
        <Header.Subheader>Enter payment information</Header.Subheader>
      </Header>
      <Form.Field>
        <label>Credit Card Name</label>
        <input
          placeholder='Full Name'
          type='text'
          value={ccName}
          onChange={(e) => setCcName(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Credit Card Number</label>
        <input
          placeholder='4242********4242'
          type='text'
          value={ccNumber}
          onChange={(e) => setCcNumber(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Credit Card Expiry</label>
        <input
          placeholder='08/24'
          type='text'
          value={ccExpiry}
          onChange={(e) => setCcExpiry(e.target.value)}
        />
      </Form.Field>

      <Header as='h2'>
        Subscription
        <Header.Subheader>Select subscription</Header.Subheader>
      </Header>
      <Form.Field>
        <Checkbox
          radio
          label='Annually ($92/year)'
          name='checkboxRadioGroup'
          checked={subscription === 'annual'}
          value='annual'
          onChange={(e) => setSubscription('annual')}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          radio
          label='Monthly ($8/year)'
          name='checkboxRadioGroup'
          checked={subscription === 'monthly'}
          value='monthly'
          onChange={(e) => setSubscription('monthly')}
        />
      </Form.Field>

      {result && (
        <Message icon='alarm' header='Customer created:' content={result} />
      )}

      <Button primary type='submit' value='Submit'>
        Submit
      </Button>
    </Form>
  );
}
