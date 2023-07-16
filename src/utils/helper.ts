
const getRPC = (chainId: string | undefined) => {
  switch (chainId) {
    case "1":
      return process.env.REACT_APP_ETHEREUM_RPC;
    case "5":
      return process.env.REACT_APP_GOERLI_RPC;
    case "100":
      return process.env.REACT_APP_GNOSIS_RPC;
    default:
      return process.env.REACT_APP_GNOSIS_RPC;
  }
};

const getTxServiceURL = (chainId: string) => {
  switch (chainId) {
    case "5":
      return "https://safe-transaction-goerli.safe.global/";

    case "1":
      return "https://safe-transaction-mainnet.safe.global/";

    case "100":
      return "https://safe-transaction-gnosis-chain.safe.global/";

    default:
      return "https://safe-transaction-goerli.safe.global/";
  }
};

const getExplorerURL = (chainId: number | undefined) => {
  switch (chainId) {
    case 5:
      return "https://goerli.etherscan.io/tx/";

    case 1:
      return "https://etherscan.io/tx/";

    case 100:
      return "https://gnosisscan.io/tx/";

    default:
      return "https://goerli.etherscan.io/tx/";
  }
};

export { getRPC, getTxServiceURL, getExplorerURL };
