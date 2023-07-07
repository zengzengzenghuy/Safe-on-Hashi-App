import React, { useState, useEffect } from "react";

import { Typography } from "@material-ui/core";

import { Tab, Tabs } from "@mui/material";

import CreateTransaction from "./CreateTransaction";
import CreateTx from "./CreateTx";
import History from "./History";
import UserGuide from "./UserGuide";
import HashReader from "./HashReader";

const App = (): React.ReactElement => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const handleTabChange = (e: any, tabIndex: any) => {
    console.log(tabIndex);
    setCurrentTabIndex(tabIndex);
  };

  const [currentTab, setCurrentTab] = useState<string>("0");

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
    <>
      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        centered
        variant="fullWidth"
        indicatorColor="secondary"
      >
        <Tab label="Create Transaction" />
        <Tab label="History" />
        <Tab label="Hash Reader" />
        <Tab label="User Guide" />
      </Tabs>
      {currentTabIndex === 0 && (
        <>
          <CreateTx />
        </>
      )}
      {currentTabIndex === 1 && (
        <>
          <History />
        </>
      )}
      {currentTabIndex === 2 && (
        <>
          <HashReader />
        </>
      )}
      {currentTabIndex === 3 && (
        <>
          <UserGuide />
        </>
      )}
    </>
  );
};

export default App;
