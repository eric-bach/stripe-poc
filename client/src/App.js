import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';

import Checkout from './Checkout';

class App extends Component {
  state = {
    status: null,
  };

  componentDidMount() {
    this.callBackendAPI().catch((err) => console.log(err));
  }

  // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    var status = 'NOT CONNECTED';

    try {
      const response = await fetch('http://localhost:5000/health');
      const body = await response.json();

      console.log(`Server response: ${JSON.stringify(body)}`);
      status = body.express;

      if (response.status !== 200) {
        throw Error(body.message);
      }
    } catch (e) {}

    this.setState({
      status: status,
    });

    return status;
  };

  render() {
    return (
      <Container style={{ paddingTop: '15px' }}>
        <div className='App'>
          <Header as='h2'>
            Stripe POC
            <Header.Subheader>
              Server status: {this.state.status}
            </Header.Subheader>
          </Header>
          <Checkout />
        </div>
      </Container>
    );
  }
}

export default App;
