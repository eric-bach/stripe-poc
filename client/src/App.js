import React, { Component } from 'react';
import Checkout from './Checkout';

class App extends Component {
  state = {
    status: null,
  };

  componentDidMount() {
    this.callBackendAPI()
      .then((res) => this.setState({ data: res.express }))
      .catch((err) => console.log(err));
  }

  // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/health');
    const body = await response.json();

    console.log(`Server response: ${JSON.stringify(body)}`);

    if (response.status !== 200) {
      throw Error(body.message);
    }

    this.setState({ status: body.express });

    return body;
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
