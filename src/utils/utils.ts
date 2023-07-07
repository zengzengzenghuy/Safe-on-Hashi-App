import { isAddress } from "web3-utils";

export const isValidAddress = (address: string | null) => {
  if (!address) {
    return false;
  }
  return isAddress(address);
};
