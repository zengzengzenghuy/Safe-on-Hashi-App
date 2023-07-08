import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Spinner, Heading, SegmentedControl } from "evergreen-ui";
import SafeAppsSDK, { SafeInfo } from "@gnosis.pm/safe-apps-sdk";

import {
  MenuItem,
  TextField,
  Menu,
  Select,
  FormControlLabel,
  InputLabel,
  Box,
  Typography,
  Switch,
} from "@material-ui/core";
import {
  Button,
  SelectChangeEvent,
  Modal,
  Alert,
  AlertTitle,
  Dialog,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import Tooltip from "@mui/material/Tooltip";
import {
  AddressInput,
  Divider,
  Text,
  Title,
} from "@gnosis.pm/safe-react-components";

import { Signer, ethers } from "ethers";

import YaruABI from "./contract/abi/Yaru.json";

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

const ClaimTransaction = (): React.ReactElement => {
  const [safeInfo, setSafeInfo] = useState<SafeInfo | undefined>();
  const [sourceChain, setSourceChain] = useState<any>();
  const [sourceSafe, setsourceSafe] = useState<string>("");

  const [bridge, setBridge] = useState<string>("");

  const [claimMessage, setClaimMessage] = useState<string>("");
  const [messageId, setMessageId] = useState<any>();

  const [emptyFieldCheck, setEmptyFieldCheck] = useState<boolean>(false);

  useEffect(() => {
    async function loadSafeInfo() {
      const safuInfo = await SDK.safe.getInfo();
      const chainInfo = await SDK.safe.getChainInfo();
      setSourceChain(chainInfo);
      console.log({ safuInfo, chainInfo });
      setSafeInfo(safuInfo);
    }
    loadSafeInfo();
  }, []);

  const claimTxClick = async () => {
    if (
      sourceSafe == "" ||
      bridge == "" ||
      messageId == "" ||
      claimMessage == ""
    ) {
      setEmptyFieldCheck(true);
      return;
    }
    const Yaru = new ethers.utils.Interface(YaruABI);

    const safeTxData = Yaru.encodeFunctionData("executeMessages", [
      [JSON.parse(claimMessage)],
      [messageId],
      [sourceSafe],
      [deployedContract.GCAMBAdapter],
    ]);
    console.log("Claim transaction");

    const safeTxHash = await SDK.txs.send({
      txs: [
        {
          to: deployedContract.Yaru,
          value: "0",
          data: safeTxData,
        },
      ],
    });
  };
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
  if (!safeInfo) {
    return <Spinner size={24} />;
  }
  return (
    <>
      <Container>
        <Typography variant="h4">Claim mode</Typography>
        <div style={{ display: "flex" }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Source Chain Safe"
            value={sourceSafe}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setsourceSafe(event.target.value);
            }}
          />
          <Tooltip title="Safe address from source chain">
            <HelpIcon />
          </Tooltip>
        </div>
        <InputLabel>Select Bridge Solution</InputLabel>
        <div style={{ display: "flex" }}>
          <Select
            variant="outlined"
            label="Select Bridge"
            value={bridge}
            onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
              setBridge(event.target.value as string);
            }}
          >
            <MenuItem value="AMB">AMB</MenuItem>
            <MenuItem value="Telepathy">Telepathy</MenuItem>
            <MenuItem value="Connext">Connext</MenuItem>
            <MenuItem value="DendrETH">DendrETH</MenuItem>
            <MenuItem value="Sygma">Sygma</MenuItem>
            <MenuItem disabled={true} value="Wormhole">
              Wormhole
            </MenuItem>
            <MenuItem disabled={true} value="Axiom">
              Axiom
            </MenuItem>
          </Select>
          <Tooltip title="Bridge solution used to create transaction from source chain">
            <HelpIcon />
          </Tooltip>
        </div>
        <div style={{ display: "flex" }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Message"
            value={claimMessage}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setClaimMessage(event.target.value);
            }}
          />

          <Tooltip title="Message copied from previous step">
            <HelpIcon />
          </Tooltip>
        </div>
        <div style={{ display: "flex" }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Message ID"
            value={messageId}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMessageId(event.target.value);
            }}
          />
          <Tooltip title="MessageID emitted from MessageDispatched event">
            <HelpIcon />
          </Tooltip>
        </div>

        <Button variant="contained" onClick={claimTxClick}>
          Claim Transaction
        </Button>
        <Dialog
          open={emptyFieldCheck}
          onClose={() => {
            setEmptyFieldCheck(false);
          }}
        >
          <Alert severity="error">
            <AlertTitle>Fields cannot be empty</AlertTitle>
          </Alert>
        </Dialog>
      </Container>
    </>
  );
};

export default ClaimTransaction;
