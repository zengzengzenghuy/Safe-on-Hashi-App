import { useEffect, useState } from "react";
import { FormControl, Menu, Typography } from "@material-ui/core";
import {
  Box,
  Button,
  SelectChangeEvent,
  List,
  TextField,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { ethers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import { SafeMultisigTransactionListResponse } from "@safe-global/api-kit";
import {
  SafeMultisigTransactionResponse,
  SafeTransactionData,
} from "@safe-global/safe-core-sdk-types";
import SafeApiKit from "@safe-global/api-kit";
import { getTxServiceURL } from "./utils/helper";
import TxCard from "./component/TxCard";
import { TextFieldsOutlined } from "@mui/icons-material";

const SDK = new SafeAppsSDK();

const History = () => {
  const [safeInfo, setSafeInfo] = useState<SafeInfo | undefined>();

  const [sourceChain, setSourceChain] = useState<any>("");
  const [chain, setChain] = useState<any>();
  const [txHash, setTxHash] = useState<any>();
  const [txList, setTxList] = useState<SafeMultisigTransactionListResponse>();
  const [status, setStatus] = useState<string>();
  async function loadSafeInfo() {
    const safuInfo = await SDK.safe.getInfo();
    const chainInfo = await SDK.safe.getChainInfo();
    setChain(chainInfo);
    console.log({ safuInfo, chainInfo });
    setSafeInfo(safuInfo);
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAddr = await signer.getAddress();
    console.log("Account:", signerAddr);
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });

    const txServiceUrl = getTxServiceURL(chainInfo.chainId);
    const safeService = new SafeApiKit({
      txServiceUrl,
      ethAdapter: ethAdapter,
    });

    console.log("Get transaction List");
    const multisigTxs: SafeMultisigTransactionListResponse =
      await safeService.getMultisigTransactions(safuInfo.safeAddress);

    console.log(multisigTxs);
    console.log("typeof ", typeof multisigTxs.results);
    setTxList(multisigTxs);
    console.log("TxList ", txList);
  }

  useEffect(() => {
    loadSafeInfo();
  }, []);

  const handleClick = async () => {
    console.log(txList);
    console.log(typeof txList);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          "padding-left": "20px",
        }}
      >
        <div style={{ display: "flex" }}>
          <FormControl>
            <InputLabel>From</InputLabel>
            <Select
              variant="outlined"
              label="From"
              value={chain}
              onChange={(event: any) => {
                setSourceChain(event.target.value as string);
              }}
            >
              <MenuItem value="Ethereum">Ethereum</MenuItem>
              <MenuItem value="Goerli">Goerli</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              variant="outlined"
              label="From"
              value={chain}
              onChange={(event: any) => {
                setSourceChain(event.target.value as string);
              }}
            >
              <MenuItem value="Initiated">Initiated</MenuItem>
              <MenuItem value="Bridged">Bridged</MenuItem>
              <MenuItem value="Claimed">Claimed</MenuItem>
            </Select>
          </FormControl>
        </div>
        <List>
          {txList &&
            txList?.results?.length > 0 &&
            txList?.results.map((tx: SafeMultisigTransactionResponse) => {
              if (tx.to === "0x9ec14c28fdcB2B325b7505E749A5C4618da70D95") {
                return <TxCard txs={tx} chainId={safeInfo?.chainId} />;
              }
            })}
        </List>
      </Box>
    </>
  );
};

export default History;
