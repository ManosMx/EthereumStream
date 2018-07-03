import React from 'react';
import ReactDom from 'react-dom';
import Link from 'next/link';

// import Components here


export default () =>
  <div>
    <h1>Home</h1>
    <p>Note that Web3 is not loaded for this page.</p>
    <div><Link href='/home'><a>Home</a></Link></div>
    <div><Link href='/streamer'><a>Streamers</a></Link></div>
    <div><Link href='/accounts'><a>My Accounts</a></Link></div>
  </div>