import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Spinner } from "evergreen-ui";
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";

import {
  Modal,
  MenuItem,
  TextField,
  Select,
  InputLabel,
  Box,
  Typography,
} from "@material-ui/core";
import { Alert, AlertTitle, Dialog } from "@mui/material";
import { Button } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";

import { ContractInterface } from "./typing/models";

import InterfaceRepository from "./libs/interfaceRepository";
import { ethers } from "ethers";
import { CopyToClipboard } from "react-copy-to-clipboard";
import YahoABI from "./contract/abi/Yaho.json";
import HashiABI from "./contract/abi/TestHashiModule.json";
import deployedContract from "./utils/contract.json";

const Container = styled.div`
  padding: 24px;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 480px;

  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;

const SDK = new SafeAppsSDK();
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const CreateTransactionFromPull = (): React.ReactElement => {
  const [safeInfo, setSafeInfo] = useState<SafeInfo | undefined>();
  const [sourceChain, setSourceChain] = useState<any>();
  const [chain, setChain] = useState<string>("");
  const [crossChainId, setcrossChainId] = useState<string>("");
  const [hashiModuleAddr, setHashiModuleAddr] = useState<string>("");
  const [crossChainSafe, setCrossChainSafe] = useState<string>("");
  const [contractAddr, setcontractAddr] = useState<string>("");
  const [abi, setAbi] = useState<string | undefined>("");
  const [selectedFunction, setSelectedFunction] = useState<string>("");
  const [param, setParam] = useState<string>();
  const [isInput, setIsInput] = useState<boolean>(false);
  const interfaceRepo = new InterfaceRepository();
  const [contract, setContract] = useState<ContractInterface | null>(null);
  const [functionIndex, setFunctionIndex] = useState<any>();
  const [bridge, setBridge] = useState<string>("");
    const [message, setMessage] = useState<Object>();
  const [emptyFieldCheck, setEmptyFieldCheck] = useState<boolean>(false);
  const [signerAddr, setSignerAddr] = useState<string>();

  useEffect( () => {
    console.log("provider",provider)
    async function loadSafeInfo() {
      const safuInfo = await SDK.safe.getInfo();
      const chainInfo = await SDK.safe.getChainInfo();
      setSourceChain(chainInfo);
      console.log({ safuInfo, chainInfo });
      setSafeInfo(safuInfo);
      await provider?.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      setSignerAddr(signerAddress);
      console.log("signer address",signerAddr);
   // TODO get network from provider
    }
    loadSafeInfo();

   
  }, []);

  useEffect(() => {
    contract?.methods.map((option, index) => {
      if (option.name == selectedFunction) {
        setFunctionIndex(index);
        setIsInput(Object.keys(option.inputs).length != 0 ? true : false);
      }
      setParam("");
    });
  }, [selectedFunction]);

  useEffect(() => {}, [bridge]);

  const handleClick = () => {
    if (abi === undefined) {
      setEmptyFieldCheck(true);
    } else {
      const method: ContractInterface = interfaceRepo.getMethods(abi);
      setContract(method);
    }
  };

  const createTxClick = async () => {
    if (abi == "" || hashiModuleAddr == "" || contractAddr == "") {
      setEmptyFieldCheck(true);
      return;
    }

    const params: string[] | undefined = param?.split(",");
    const iface = new ethers.utils.Interface(abi!);
    const toAddr = contractAddr;
    const func = selectedFunction;

    let calldata;
    if (params?.length == 1 && params[0] == "") {
      calldata = iface.encodeFunctionData(func);
    } else {
      calldata = iface.encodeFunctionData(func, params);
    }

    const hashiModuleiFace = new ethers.utils.Interface(HashiABI);
    const txData = hashiModuleiFace.encodeFunctionData(
      "executeTransactionFromNonOwner",
      [toAddr, 0, calldata, 0]
    );

    const parameter = [
      {
        from: signerAddr,
        to: hashiModuleAddr,
        data: txData,
      },
    ];

    try {

      // TODO switch Metamask to the correct network
      const tx = await provider.send("eth_sendTransaction", parameter);

    } catch (err) {
      console.log("err:", err);
    }

   
  };
  


  return (
    <Container>
      <Typography variant="h4">Safe details</Typography>
      <Typography variant="h6">
        From {sourceChain?.chainName}: {safeInfo?.safeAddress}
      </Typography>

      <div style={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Hashi Module"
          value={hashiModuleAddr}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setHashiModuleAddr(event.target.value);
          }}
        />
        <Tooltip title="Hashi Module w.r.t Safe.">
          <HelpIcon />
        </Tooltip>
      </div>

      <Typography variant="h4">Transaction details</Typography>

      <div style={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Contract to call"
          value={contractAddr}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setcontractAddr(event.target.value);
          }}
        />
        <Tooltip title="Contract address to call to">
          <HelpIcon />
        </Tooltip>
      </div>
      <div style={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Enter ABI"
          value={abi}
          onChange={(e) => setAbi(e.target.value)}
        />
        <Tooltip
          title={
            <>
              <Typography>Format</Typography>
              <p>
                &#91;&#123;"type": "function", "inputs": [&#123;
                "name":"a","type":"uint256"&#125;], "name":"foo", "outputs":
                []&#125; &#93;
              </p>
            </>
          }
        >
          <HelpIcon />
        </Tooltip>
      </div>
      {abi && (
        <Button variant="contained" onClick={handleClick}>
          Filter ABI
        </Button>
      )}
      {contract && (
        <TextField fullWidth select variant="outlined" label="Select Function">
          {contract?.methods.map((option) => (
            <MenuItem
              key={option.name}
              value={option.name}
              onClick={() => {
                console.log("click: ", option.name);
                setSelectedFunction(option.name);
              }}
            >
              {option.name}
            </MenuItem>
          ))}
        </TextField>
      )}

      {selectedFunction && isInput && (
        <TextField
          fullWidth
          variant="outlined"
          label="Parameter"
          onChange={(e) => {
            setParam(e.target.value);
          }}
        ></TextField>
      )}

      <Button variant="contained" onClick={createTxClick}>
        Create Transaction
      </Button>

      
    </Container>
  );
};

export default CreateTransactionFromPull;
