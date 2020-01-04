const networkKey = process.env.APP_NETWORK_KEY as 'jungle' | 'mainnet'

const isServer = typeof window === 'undefined'

const mainnet = {
  blockchain: 'eos',
  protocol: 'https',
  // host: 'eos.newdex.one',
  host: 'nodes.get-scatter.com',
  port: 443,
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
}

if (isServer) {
  mainnet.host = 'eos.newdex.one'
}

const jungle = {
  blockchain: 'eos',
  protocol: 'https',
  host: 'jungle2.cryptolions.io',
  port: 443,
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
}

export const networkConfig = networkKey === 'jungle' ? jungle : mainnet

export const contract = networkKey === 'jungle' ? 'betgamedotcn' : 'thegamesclub'