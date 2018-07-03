import React,{Component} from 'react';
import Link from 'next/link';
import FactoryContainer from '../lib/FactoryContainer';

class Home extends Component {

  state = {
    deployed: false,
  }

  // add arguments somehow
  deployStreamer = async (tokeName, tokenAlias, tokenAmount, tokenDecs, event) => {
    const { contract } = this.props
    const address = await contract.deployStreamer.call()
    this.setState({deployed: true})
    console.log(address);
  }

  getDeployed = async () => {
    const { accounts, contract } = this.props
    const response = await contract.returnDeployed.call()
    console.log(response)
  }

  render () {
    const { balance = 'N/A', ethBalance = "N/A" } = this.state
    return (
      <div>
        <h1>Home</h1>
        <form>
          <input type="text" name="tokeName"/>
          <input type="text" name="tokenAlias"/>
          <input type="text" name="tokenAmount"/>
          <input type="text" name="tokenDecs"/>
          <input type="submit" value="Submit" />
        </form>
        <button onClick={this.deployStreamer}>Become a streamer with your own token</button>
        <button onClick={this.getDeployed}>Get available streamers</button>
      </div>
    )
  }
}

export default () => (
  <FactoryContainer
    renderLoading={() => <div>Loading Home Page...</div>}
    render={({ web3, contract }) => (
      <Home contract={contract} web3={web3} />
    )}
  />
)