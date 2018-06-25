import StreamerFactory from './contracts/StreamerFactory.json';
import Streamer from './contracts/Streamer.json';
import StreamToken from './contracts/StreamToken.json';

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    StreamerFactory//,
    //Streamer,
    //StreamToken
  ]
};

export default drizzleOptions;