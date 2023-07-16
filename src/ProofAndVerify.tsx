import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

import {
  Dialog,
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Modal,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  CircularProgress,
  Tooltip,
  Alert,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

import { ethers } from "ethers";
import HashiModuleABI from "./contract/abi/HashiModule.json";
import ShoyuBashiABI from "./contract/abi/ShoyuBashi.json";
import DeployedContract from "./utils/contract.json";
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";

import { InputLabel, TextField } from "@material-ui/core";

import { getRPC } from "./utils/helper";

import { get } from "http";

const SDK = new SafeAppsSDK();
const steps = [
  {
    label: "Get Proof from provider",
    description: "Getting proof from RPC Provider using eth_getProof method",
  },
  { label: "verify Proof", description: "Verifying Proof from Tree" },
];

export default function ProofAndVerify() {
  const [signerAddr, setSignerAddr] = useState<string>();
  const [safeAddr, setSafeAddr] = useState<string>();
  const [sourceChain, setSourceChain] = useState<string>();
  const [isValidationModalOpen, setIsValidationModalOpen] =
    useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [proof, setProof] = useState<any>();
  const [block, setBlock] = useState<any>();
  const [response, setResponse] = useState<any>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleNext = async () => {
    if (activeStep == 0) {
      await getProof();
    } else {
      await verifyProof();
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setResponse(null)
  };

  async function getProof() {

    //TODO: Notice user to switch network to the source chain
    const gno_rpc = getRPC("100");
    // const goerli_rpc = getRPC("5")
    // console.log("Goerli rpc",goerli_rpc)
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const gno_provider = new ethers.providers.JsonRpcProvider(gno_rpc);
    // const goerli_provider = new ethers.providers.JsonRpcProvider(goerli_rpc)
    // const ShoyuBashiAddr = DeployedContract.ShoyuBashi;
    // const ShoyuBashi = new ethers.Contract(
    //   ShoyuBashiAddr,
    //   ShoyuBashiABI,
    //   gno_provider
    // );

    // await provider?.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    // console.log(await signer.getAddress())
    // console.log("Blocknumber", await provider.getBlockNumber());

    // Index slot
    // TODO: explain why it is 0x2
    const slot = "0x2";

    const paddedAddress = ethers.utils.hexZeroPad(signerAddr!, 32);
    const paddedSlot = ethers.utils.hexZeroPad(slot, 32);
    const concatenated = ethers.utils.concat([paddedAddress, paddedSlot]);
    // key/indexof the storage slot

    const hash = ethers.utils.keccak256(concatenated);

    const blockNumber = (await provider.getBlockNumber()) - 25;

    window.ethereum
      .request({
        method: "eth_getProof",
        params: [safeAddr, [hash], ethers.utils.hexlify(blockNumber)],
      })
      .then((result: any) => {
        setProof(result);
      })
      .catch((error: any) => {
        console.log(error);
      });

    // window.ethereum
    //   .request({
    //     method: "eth_getBlockByNumber",
    //     params: [ethers.utils.hexlify(blockNumber), false],
    //   })
    //   .then((result: any) => {
    //     console.log(result);
    //     setBlock(result);
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //   });
  }

  async function verifyProof() {
    //TODO: generate MPT Proof

    // Fetch Proof and Verify at backend
    fetch(`http://localhost:8000/proof?address=${signerAddr}`, {
      method: "POST",

      body: JSON.stringify(proof),

      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsValid(data.result);
      })
      .catch((error) => {
        console.log(error);
        setResponse("Server Error, Try Again");
      });
  }

  async function loadAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    // Prompt user for account connections
    await provider?.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    setSignerAddr(signerAddress);
  }
  useEffect(() => {
    loadAddress();
    handleReset();
  }, []);

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
  return (
    <React.Fragment>
      <h3>Proof that this address</h3>
      <div style={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          value={signerAddr}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSignerAddr(event.target.value);
            setActiveStep(0);
          }}
        />
        <Tooltip title="Owner address on Ethereum/Goerli chain, the main proxy Safe">
          <HelpIcon />
        </Tooltip>
      </div>
      <h3>is the owner of</h3>
      <div style={{ display: "flex" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Ethereum/Goerli Safe Address"
          value={safeAddr}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSafeAddr(event.target.value);
            setActiveStep(0);
            setIsValid(true);
          }}
        />
        <Tooltip title="Safe address on Ethereum/Goerli chain, the main proxy Safe">
          <HelpIcon />
        </Tooltip>
      </div>
      <h3>From</h3>
      <div style={{ display: "flex" }}>
        <Select
          variant="outlined"
          label="Select Chain"
          value={sourceChain}
          onChange={(event: SelectChangeEvent<string>) => {
            setSourceChain(event.target.value as string);
            setActiveStep(0);
            setIsValid(true);
          }}
        >
          <MenuItem value="Ethereum">Ethereum</MenuItem>
          <MenuItem value="Goerli">Goerli</MenuItem>
        </Select>
        <Tooltip title="Chain that Safe belongs to">
          <HelpIcon />
        </Tooltip>
      </div>
      <Button
        onClick={() => {
          setIsValidationModalOpen(true);
        }}
      >
        Verify
      </Button>
      {isValidationModalOpen && (
        <Modal
          open={isValidationModalOpen}
          onClose={() => {
            setIsValidationModalOpen(false);
          }}
        >
          <Box sx={Boxstyle}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>
                   
                    {step.label}
                  </StepLabel>
          
                  <StepContent>
                    {step.description}
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? "Finish" : "Continue"}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {!isValid && activeStep === steps.length && (
              <Alert severity="error">Proof is invalid!</Alert>
            )}
            {response != null && <Alert severity="error">{response}</Alert>}
          </Box>
        </Modal>
      )}
    </React.Fragment>
  );
}
