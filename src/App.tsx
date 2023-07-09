import React, { useState } from "react";

import { Tab, Tabs } from "@mui/material";

import CreateTx from "./CreateTx";
import History from "./History";
import UserGuide from "./UserGuide";

const App = (): React.ReactElement => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const handleTabChange = (e: any, tabIndex: any) => {
    console.log(tabIndex);
    setCurrentTabIndex(tabIndex);
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
          <UserGuide />
        </>
      )}
    </>
  );
};

export default App;
