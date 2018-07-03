import React,{Component} from 'react';
import Link from 'next/link';
import Container from '../lib/StreamerContainer';

class Streamer extends Component {

  state = {
    deployed: false,
  }

  // add arguments somehow
  getSubs = async () => {
    const { contract } = this.props
    const address = await contract.subscribers
    console.log(address);
  }

  setInitialToken = async (amount) => {
    const { accounts, contract } = this.props
    await contract.setInitialSubToken.call()
  }

  render () {
    const { balance = 'N/A', ethBalance = "N/A" } = this.state
    return (
      <div>
        <h1>Home</h1>
        <div>{this.getSubs}</div>
      </div>
    )
  }
}

export default () => (
  <Container
    renderLoading={() => <div>Loading Home Page...</div>}
    render={({ web3, contract }) => (
      <Streamer contract={contract} web3={web3} />
    )}
  />
)