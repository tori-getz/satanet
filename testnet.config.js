require('dotenv').config();

const ip = require('ip');
const path = require('node:path');

const NODES_COUNT = process.env.NODES_COUNT ? process.env.NODES_COUNT : 3;
const NAMESPACE = process.env.NAMESPACE ?? 'satanet';

const API_PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 3000;
const PEER_HOST = process.env.PEER_HOST ?? ip.address();
const PEER_PORT = process.env.PEER_PORT
  ? parseInt(process.env.PEER_PORT)
  : 4000;

let apps = [];
let peers = [];

for (let i = 0; i < NODES_COUNT; i++) {
  const url = [PEER_HOST, PEER_PORT + i].join(':');
  peers.push(url);
}

for (let i = 0; i < NODES_COUNT; i++) {
  const url = [PEER_HOST, PEER_PORT + i].join(':');

  const filteredPeers = peers.filter((peer) => peer !== url);

  apps.push({
    name: `node-${i}`,
    script: 'yarn workspace @satanet/node start:dev',
    out_file: '/dev/null',
    error_file: '/dev/null',
    namespace: NAMESPACE,
    env: {
      API_PORT: API_PORT + i,
      PEER_HOST: PEER_HOST,
      PEER_PORT: PEER_PORT + i,
      PEERS: filteredPeers.join(','),
      DATABASE_URL: path.resolve(__dirname, 'db', `node-${i}.sqlite`),
    },
  });
}

module.exports = { apps };
