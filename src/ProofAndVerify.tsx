import * as React from "react";
import { useState, useEffect } from "react";

import Button from "@mui/material/Button";

import {
  Dialog,
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Modal,
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from "@mui/material";

import { ethers } from "ethers";
import HashiModuleABI from "./contract/abi/HashiModule.json";
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";

import { InputLabel, TextField } from "@material-ui/core";
import detectEthereumProvider from "@metamask/detect-provider";

const SDK = new SafeAppsSDK();
const steps = [
  {
    label: "Get Proof from provider",
    description: "Getting proof from RPC Provider using eth_getProof method",
  },
  {
    label: "Generate Merkle Patricia Tree from Proof",
    description: "Generating Merkle Patricia Tree from proof as nodes of tree",
  },
  { label: "verify Proof", description: "Verifying Proof from Tree" },
];

export default function ProofAndVerify() {
  const [signerAddr, setSignerAddr] = useState<string>();
  const [isValidationModalOpen, setIsValidationModalOpen] =
    useState<boolean>(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  async function getProof() {
    //TODO: eth_getProof
  }

  async function generateProof() {
    //TODO: generate MPT Proof
  }

  async function verifyProof() {
    //TODO: verify proof
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
      <h2>Proof that this address {signerAddr} is the owner from main Safe</h2>
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
                <StepLabel>{step.label}</StepLabel>
                <StepContent>{step.description}
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
          </Box>
        </Modal>
      )}
    </React.Fragment>
  );
}
