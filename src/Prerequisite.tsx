import * as React from "react";
import { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Dialog, Box, FormControl, MenuItem, Select } from "@mui/material";

import { ethers } from "ethers";
import HashiModuleABI from "./contract/abi/HashiModule.json";
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import Safe from "@safe-global/protocol-kit";
import { InputLabel, TextField } from "@material-ui/core";
import { TextInput } from "evergreen-ui";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { getTxServiceURL } from "./utils/helper";
import deployedContract from "./utils/contract.json";
const SDK = new SafeAppsSDK();
const Boxstyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Prerequisite() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [binaryData, setBinaryData] = useState<ArrayBuffer>();
  const [isHashiModuleOpen, setIsHashiModuleOpen] = useState<boolean>(false);
  const [safeInfo, setSafeInfo] = useState<SafeInfo | undefined>();
  const [chain, setChain] = useState<any>();
  const [sourceChainId, setSourChainId] = useState<any>();
  const [sourceChain, setSourceChain] = useState<string>();
  const [sourceSafe, setSourceSafe] = useState<any>();
  useEffect(() => {
    async function loadSafeInfo() {
      const safuInfo = await SDK.safe.getInfo();
      const chainInfo = await SDK.safe.getChainInfo();
      setChain(chainInfo);
      console.log({ safuInfo, chainInfo });
      setSafeInfo(safuInfo);
    }
    loadSafeInfo();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/src/contract/HashiModuleBytecode.bin");
      const data = await response.arrayBuffer();
      setBinaryData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching binary file:", error);
    }
  };
  const handleDeployHashiModule = async () => {
    setIsHashiModuleOpen(true);
  };
  const deployHashiModule = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAddr = await signer.getAddress();
    console.log("Account:", signerAddr);

    fetchData();
    let chainID: number;
    switch (sourceChain) {
      case "Ethereum":
        chainID = 1;
        break;
      case "Goerli":
        chainID = 5;
        break;
      default:
        chainID = 5;
        break;
    }
    const bytecode = new Uint8Array(binaryData!);
    console.log("bytecode ", bytecode);
    const hashiModuleFactory = new ethers.ContractFactory(
      HashiModuleABI,
      bytecode,
      signer
    );
    // TODO: fix Metamask Internal JSON_RPC error
    // const hashiModule = await hashiModuleFactory.deploy(
    //   safeInfo?.safeAddress,
    //   safeInfo?.safeAddress,
    //   safeInfo?.safeAddress,
    //   deployedContract.Yaru,
    //   sourceSafe,
    //   chainID,
    // );
    // console.log(hashiModule.address);

    // const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });

    // const TxServiceUrl: string = getTxServiceURL(`${chainID}`);
    // const safeSdk = await Safe.create({
    //   ethAdapter,
    //   safeAddress: safeInfo?.safeAddress!,
    // });
    // const safeTx = await safeSdk.createEnableModuleTx(hashiModule.address);
    // const txHash = await safeSdk.getTransactionHash(safeTx);
    // const senderSignature = await safeSdk.signTransactionHash(txHash);

    // const safeService = new SafeApiKit({
    //   txServiceUrl: TxServiceUrl,
    //   ethAdapter: ethAdapter,
    // });
    // await safeService.proposeTransaction({
    //   safeAddress: safeInfo?.safeAddress!,
    //   safeTransactionData: safeTx.data,
    //   safeTxHash: txHash,
    //   senderAddress: signerAddr,
    //   senderSignature: senderSignature.data,
    // });
  };
  return (
    <React.Fragment>
      <h2>Prerequisite</h2>
      <h3>1. Deploy Safe on Destination Chain</h3>
      <p>Switch to Destination Chain and Create new account</p>
      <Button variant="outlined" href="https://app.safe.global/welcome">
        Click to deploy
      </Button>
      <h3>2. Deploy Hashi Module for Safe on Destination Chain</h3>
      <p>Deploy and Enable Hashi Module for Safe on Destination Chain</p>
      <Button
        variant="outlined"
        onClick={() => {
          setIsHashiModuleOpen(true);
          handleDeployHashiModule();
        }}
      >
        Click to deploy
      </Button>
      <Dialog
        open={isHashiModuleOpen}
        onClose={() => {
          setIsHashiModuleOpen(false);
        }}
      >
        <Box sx={{ width: 400, height: 400, bgColor: "background.paper" }}>
          <Box sx={{ width: "90%", justifyContent: "center", marginLeft: 2 }}>
            <TextField
              margin="normal"
              variant="outlined"
              label="Source Chain Safe"
              value={sourceSafe}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSourceSafe(event.target.value);
              }}
            ></TextField>
            <FormControl>
              <InputLabel>Source Chain</InputLabel>
              <Select
                variant="outlined"
                label="Source Chain"
                value={sourceChain}
                onChange={(event: any) => {
                  setSourceChain(event.target.value as string);
                }}
              >
                <MenuItem value="Ethereum">Ethereum</MenuItem>
                <MenuItem value="Goerli">Goerli</MenuItem>
              </Select>
            </FormControl>

            <Button variant="outlined" onClick={deployHashiModule}>
              Confirm Deploy
            </Button>
          </Box>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
