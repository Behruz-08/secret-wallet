
import axios from 'axios';

// Интерфейс для транзакции
export interface Transaction {
  hash: string;
}


const API_KEYS: Record<string, string> = {
  polygonMainnet: 'D76AKR6KAGRA5XSK19UTQWCPAV4J5C7JEM',
  polygonTestnet: 'D76AKR6KAGRA5XSK19UTQWCPAV4J5C7JEM',
  zkevmMainnet: '2YY973WZDE9J4KXVPDBMFWY47HT5MB3IYY',
  zkevmTestnet: '2YY973WZDE9J4KXVPDBMFWY47HT5MB3IYY',
  ethMainnet: '555FINDADVVENJ1DQUNYPJEQZ6KYUV2SFM',
  sepolia: '555FINDADVVENJ1DQUNYPJEQZ6KYUV2SFM',
  bscMainnet: 'UDJENJ9M24ZSG93IE8KUETI7MZEKQ6JYVF',
  arbitrumMainnet: 'ENR1FRSY1EXT5AT2AI55KBMMAH1527XXP9',
  baseMainnet: 'SDVY69N12V2DX55WVRDYE1BU4HM4YBQ5MA',
  gnosisMainnet: '8cd55ae2-0caf-466f-b527-8dec049f0f9c',
  optimismMainnet:'HKEAJKFJZTUH4CBF3MZZSGWD8KBEQR1SBM',
  lineaMainnet:'29RNMMKN2DQY9Z8JZ6TQAA83WVAR7M3J66',
  scrollMainnet:'KXNZ9GTCJDAADAUKVFP1IKKYDRPRPD14YK',
  zksyncMainnet:'5IJSVFNDBM9AXFF8VC912WVZHDVUF61HBV',
};

export const API_SERVICES = {
  ethMainnet: 'https://api.etherscan.io/api',
  lineaMainnet: 'https://api.lineascan.build/api',
  baseMainnet: 'https://api.basescan.org/api',
  polygonMainnet: 'https://api.polygonscan.com/api',
  polygonTestnet: 'https://api-amoy.polygonscan.com/api',
  zksyncMainnet: 'https://explorer.zksynk.io/api',
  // zksyncMainnet: 'https://block-explorer-api.mainnet.zksync.io/api',
  arbitrumMainnet: 'https://api.arbiscan.io/api',
  scrollMainnet: 'https://api.scrollscan.com/api',
  avalancheMainnet: 'https://api.snowtrace.io/api',
  gnosisMainnet: 'https://eth.blockscout.com/api',
  bscMainnet: 'https://api.bscscan.com/api',
  optimismMainnet: 'https://api-optimistic.etherscan.io/api',
  sepolia: 'https://api-sepolia.etherscan.io/api',
  zkevmMainnet: 'https://api-zkevm.polygonscan.com/api',
  zkevmTestnet: 'https://api-testnet-zkevm.polygonscan.com/api',
} as const;

export type ApiNetwork = keyof typeof API_SERVICES;

const getAPIServiceBaseUrl = (network: ApiNetwork): string => {
  const baseURL = API_SERVICES[network];
  if (!baseURL) {
    throw new Error(`No API service found for network ${network}`);
  }
  return baseURL;
};


const handleEtherscanError = (response: any) => {
  if (
    response.data.status === '0' &&
    response.data.message === 'No transactions found'
  ) {
    console.log('No transactions found for this address.');
    return;
  }

  if (response.data.status === '0') {
    console.error('API error:', response.data.result);
    throw new Error(response.data.result || 'API error');
  }
};




// Получение транзакций через Etherscan-подобные API (включая PolygonScan)
const getTransactionsFromEtherscanLike = async (
  address: string,
  network: ApiNetwork,
  startBlock: number,
  endBlock: number,
  page: number,
  offset: number,
  sort: string
): Promise<Transaction[]> => {
  const baseUrl = getAPIServiceBaseUrl(network);
  const apiKey = API_KEYS[network];
  console.log('Making request to:', baseUrl);

  const params = {
    module: 'account',
    action: 'txlist',
    address,
    startblock: startBlock,
    endblock: endBlock,
    page,
    offset,
    sort,
    apikey: apiKey,
  };

  console.log('With params:', { module: 'account', action: 'txlist', address, startblock: startBlock, endblock: endBlock, page, offset, sort, apikey: apiKey });

  const response = await axios.get<{ result: Transaction[] }>(baseUrl, { params });
  handleEtherscanError(response);
  return response.data.result;
};

// Унифицированная функция получения транзакций
export const getTransactions = async (
  address: string,
  startBlock: number,
  endBlock: number,
  page: number,
  offset: number,
  sort: string,
  network: ApiNetwork
): Promise<Transaction[]> => {
  return await getTransactionsFromEtherscanLike(address, network, startBlock, endBlock, page, offset, sort);
};
