import { useState, useEffect } from "react";
import {
  Typography,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Box,
} from "@mui/material";
import { SafeMultisigTransactionResponse } from "@safe-global/safe-core-sdk-types";
import { getExplorerURL } from "../utils/helper";
import deployedContract from "../utils/contract.json";
const TxCard = (props: {
  txs: SafeMultisigTransactionResponse;
  chainId: number | undefined;
}) => {
  const Boxstyle = {
    position: "absolute" as "absolute",
    top: "10%",
    left: "10%",
    transform: "translate(-10%, -10%)",
    width: "70%",
    height: "70%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [isTxOpen, setIsTxOpen] = useState<boolean>(false);
  const [explorerURLPrefix, setExplroerURLPrefix] = useState<string>();
  const [status, setStatus] = useState<string>();
  const handleClick = () => {
    setIsTxOpen(true);
    setExplroerURLPrefix(getExplorerURL(props.chainId));
  };

  const checkStatus = () => {
    const now = new Date();
    const initiatedDate = new Date(props.txs.executionDate);
    // For AMB, need to wait for 20 block confirmation
    // For testing purpose, this status does not actually reflect the real status

    if (now.getTime() - initiatedDate.getTime() < 20000 * 12) {
      setStatus("Initiated");
    } else if (now.getTime() - initiatedDate.getTime() < 50000 * 12) {
      setStatus("Bridged");
    } else {
      setStatus("Claimed");
    }
  };
  useEffect(() => {
    checkStatus();
  }, []);
  return (
    <ListItem
      sx={{ boxShadow: 2, borderRadius: 2, width: "100%", color: "primary" }}
    >
      <ListItemButton onClick={handleClick}>
        ''
        <ListItemText
          primary={
            "Tx: " +
            props.txs.transactionHash +
            "            Status:  " +
            status
          }
        />
        <Modal
          open={isTxOpen}
          onClose={() => {
            setIsTxOpen(false);
          }}
        >
          <Box sx={Boxstyle}>
            <Typography
              variant="body2"
              align="left"
              style={{ wordWrap: "break-word" }}
              sx={{ mt: 3 }}
            >
              <h3>Transaction Information</h3>
              SafeTxHash:{" "}
              <a
                href={explorerURLPrefix + props.txs.transactionHash}
                target="_blank"
              >
                {props.txs.transactionHash}
              </a>
              <br />
              To: {props.txs.to}
              <br />
              Data: {props.txs.data}
              <br />
              IsSuccessful: {props.txs.isSuccessful}
              <br />
              Bridge Solution:{" "}
              {props.txs.to === deployedContract.GoerAMBMessageRelay
                ? "AMB"
                : "Others"}
              <br />
              Executed on: {props.txs.executionDate}
              <br />
              Block Number: {props.txs.blockNumber}
              <br />
              <h3>Status</h3>
              {status}
              <br />
              <br />
              Press Esc to Exit
            </Typography>
          </Box>
        </Modal>
      </ListItemButton>
    </ListItem>
  );
};

export default TxCard;
