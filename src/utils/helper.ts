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

export default getTxServiceURL;
