import React,{Component} from 'react';
import Link from 'next/link';
import FactoryContainer from '../lib/FactoryContainer';

class Home extends Component {
  
  state = {
    deployed: false,
    tokeName: "",
    tokenAlias: "",
    tokenAmount: 0,
    tokenDecs: 0
  }

  // add arguments somehow
  deployStreamer = async (event) => {
    event.preventDefault()

    const { contract } = this.props
    console.log(this.state.tokeName)
    const address = await contract.deployStreamer(this.state.tokeName, this.state.tokenAlias, Number(this.state.tokenAmount), Number(this.state.tokenDecs))
    console.log(address) 
  }

  getDeployed = async () => {
    const { accounts, contract } = this.props
    const response = await contract.returnDeployed()
    console.log(response)
  }

  render () {
    const { balance = 'N/A', ethBalance = "N/A" } = this.state
    return (
      <div>
        <h1>Home</h1>
        <form onSubmit={this.deployStreamer}>
          <input type="text" name="tokeName" onChange={event => this.setState({tokeName: event.target.value})}/>
          <input type="text" name="tokenAlias" onChange={event => this.setState({tokenAlias: event.target.value})}/>
          <input type="text" name="tokenAmount" onChange={event => this.setState({tokenAmount: event.target.value})}/>
          <input type="text" name="tokenDecs" onChange={event => this.setState({tokenDecs: event.target.value})}/>
          <input type="submit" value="Submit"/>
        </form>

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