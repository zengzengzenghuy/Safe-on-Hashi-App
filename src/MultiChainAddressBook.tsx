import * as React from "react";
import { useState, useEffect } from "react";

import Button from "@mui/material/Button";

import { Dialog, Box, FormControl, MenuItem, Select } from "@mui/material";

import { ethers } from "ethers";
import HashiModuleABI from "./contract/abi/HashiModule.json";
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";

import { InputLabel, TextField } from "@material-ui/core";

const SDK = new SafeAppsSDK();

export default function MultiChainAddressBook() {
  return <React.Fragment></React.Fragment>;
}
