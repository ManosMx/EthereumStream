import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	constructor(props){
		super(props);
	}

  render() {
    return (
      <div className="App">
        {this.props.children}
      </div>
    );
  }
}

export default App;