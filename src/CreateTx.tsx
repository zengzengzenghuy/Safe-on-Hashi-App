import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CreateTransaction from "./CreateTransaction";
import { Create } from "@mui/icons-material";
import ClaimTransaction from "./ClaimTransaction";
import { ethers } from "ethers";
import HashiModuleABI from "./contract/abi/HashiModule.json";
import { Dialog } from "@mui/material";
import Prerequisite from "./Prerequisite";
const steps = ["Prerequisite", "Create Transaction", "Claim Transaction"];

export default function CreateTx() {
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

  const [binaryData, setBinaryData] = useState<ArrayBuffer>();
  const [isHashiModuleOpen, setIsHashiModuleOpen] = useState<boolean>(false);
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
    fetchData();
    const bytecode = new Uint8Array(binaryData!);
    const hashiModuleFactory = new ethers.ContractFactory(
      HashiModuleABI,
      bytecode
    );
    console.log(hashiModuleFactory);
    hashiModuleFactory.deploy([]);
  };

  return (
    <Box sx={{ width: "50%", "margin-left": "70px", "margin-top": "20px" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          {activeStep === 0 && <Prerequisite />}
          {activeStep === 1 && <CreateTransaction />}
          {activeStep === 2 && <ClaimTransaction />}

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
