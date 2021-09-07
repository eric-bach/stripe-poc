import React, { Component } from 'react';
import Checkout from './Checkout';

class App extends Component {
  state = {
    status: null,
  };

  componentDidMount() {
    this.callBackendAPI()
    .catch((err) => console.log(err));
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
      <div className='App'>
        <h1 className='App-title'>Server status: {this.state.status}</h1>
        <Checkout />
      </div>
    );
  }
}

export default App;
