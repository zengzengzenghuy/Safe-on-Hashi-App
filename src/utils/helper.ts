const getTxServiceURL = (chainId: string) => {
  switch (chainId) {
    case "5":
      return "https://safe-transaction-goerli.safe.global/";
      break;
    case "1":
      return "https://safe-transaction-mainnet.safe.global/";
      break;
    case "100":
      return "https://safe-transaction-gnosis-chain.safe.global/";
      break;
    default:
      return "https://safe-transaction-goerli.safe.global/";
  }
};

const getExplorerURL = (chainId: number|undefined) =>{
    switch (chainId) {
        case 5:
          return "https://goerli.etherscan.io/tx/";
          break;
        case 1:
          return "https://etherscan.io/tx/";
          break;
        case 100:
          return "https://gnosisscan.io/tx/";
          break;
        default:
          return "https://goerli.etherscan.io/tx/";
      }
}

export  {getTxServiceURL,getExplorerURL};

