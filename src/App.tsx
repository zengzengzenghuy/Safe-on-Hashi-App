import React, { useState, useEffect, useMemo,createContext } from 'react';
import styled from 'styled-components';
import { Spinner, Heading, SegmentedControl } from 'evergreen-ui';
import SafeAppsSDK, { SafeInfo } from '@gnosis.pm/safe-apps-sdk';
import { AppTabs } from './types';
import Main from './tabs/Main';
import RpcCalls from './tabs/RpcCalls';
import { Modal, MenuItem, TextField ,Menu, Select, FormControlLabel, InputLabel, Box,Typography,Switch}  from '@material-ui/core';
import { Button, SelectChangeEvent } from '@mui/material';
import { AddressInput, Divider, Text, Title } from '@gnosis.pm/safe-react-components'
import { ContractInterface,ContractMethod } from './typing/models';
import FormGroup from '@material-ui/core';
import InterfaceRepository,{ InterfaceRepo } from './libs/interfaceRepository';
import { ethers } from 'ethers';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FunctionFragment } from 'ethers/lib/utils';
import YahoABI from './contract/abi/Yaho.json'
import YaruABI from './contract/abi/Yaru.json'
import HashiABI from './contract/abi/HashiModule.json'
import deployedContract from "./utils/contract.json"


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

const tabs = [
  {
    value: '0',
    label: 'main',
  },
  { value: '1', label: 'RPC' },
];

const SDK = new SafeAppsSDK();
const ModeContext = createContext<boolean>(true)

const App = (): React.ReactElement => {


  const [safeInfo, setSafeInfo] = useState<SafeInfo | undefined>();
  const [sourceChain,setSourceChain] = useState<any>()
  const [chain,setChain] = useState<string>('')
  const [crossChainId, setcrossChainId] = useState<string>('')
  const [hashiModuleAddr, setHashiModuleAddr] = useState<string>('')
  const [crossChainSafe, setCrossChainSafe] = useState<string>('')
  const [sourceSafe,setsourceSafe] = useState<string>('')
  const [contractAddr, setcontractAddr] = useState<string>('')
  const [abi,setAbi] = useState<string>('')
  const [selectedFunction, setSelectedFunction] = useState<string>('')
  const [param, setParam] = useState<string>()
  const [isInput, setIsInput] = useState<boolean>(false)
  const interfaceRepo = new InterfaceRepository()
  // const [method,setMethod] = useState<ContractMethod[]>()
  const [contract, setContract] = useState<ContractInterface | null>(null)
  const [functionIndex,setFunctionIndex] = useState<any>()
  const [bridge,setBridge] = useState<string>('')
  const [isDetailOpen,setIsDetailOpen]  = useState<boolean>(false)
  const [message, setMessage] = useState<Object>()
  const [claimMessage, setClaimMessage] = useState<string>('')
  const [messageId, setMessageId] = useState<string>('')
  const [initMode,setInitMode] = useState<boolean>(false)
  const [copyToClipboard,setCopyToClipboard] = useState<boolean>(false)

  useEffect(() => {
    async function loadSafeInfo() {
      const safuInfo = await SDK.safe.getInfo()
      const chainInfo = await SDK.safe.getChainInfo()
      setSourceChain(chainInfo)
      console.log({ safuInfo, chainInfo })
      setSafeInfo(safuInfo)
    }
    loadSafeInfo();
  }, []);
 

  const [currentTab, setCurrentTab] = useState<string>('0');


useEffect(()=>{
  console.log("Use effect triggered")
  contract?.methods.map((option,index)=>{
  if(option.name == selectedFunction){
    setFunctionIndex(index)
    setIsInput(Object.keys(option.inputs).length!=0 ? true : false)
    
  }
 setParam('')

})
console.log("Selected function",selectedFunction)
},[selectedFunction])

useEffect(()=>{

},[bridge])

  const handleClick = ( ) =>{
    console.log("ABI: ",abi)
    console.log("type ",typeof(abi))
    const method: ContractInterface = interfaceRepo.getMethods(abi)
    setContract(method)
    console.log("method ",method.methods)


  }

  const createTxClick = async () =>{
    setIsDetailOpen(true)
    const params: string[]|undefined = param?.split(",")
    const iface = new ethers.utils.Interface(abi)
    const toAddr = contractAddr;
    const func = selectedFunction;
    console.log(typeof(params))
    let calldata 
    if(params?.length==1 && params[0] == '' ){
      console.log('null')
      
       calldata =  iface.encodeFunctionData(func)
    }
    else 
    {
       calldata =  iface.encodeFunctionData(func,params)
    }

    console.log("calldata: ",calldata)
    
   
    const hashiModuleiFace = new ethers.utils.Interface(HashiABI)
    const txData =  hashiModuleiFace.encodeFunctionData("executeTransaction",[toAddr,0,calldata,0])
    
    const message = {
      to: hashiModuleAddr,
      toChainId: Number(crossChainId),
      data: txData,
    }
    setMessage(message)
    console.log("Message:",message)
    console.log("JSON STRING: ",JSON.stringify(message))

  }
  const confirmTx = async() =>{
      console.log("Param split",param?.split(","))
    const params: string[]|undefined = param?.split(",")
    const iface = new ethers.utils.Interface(abi)
    const toAddr = contractAddr;
    const func = selectedFunction;
    console.log(typeof(params))
    let calldata 
    if(params?.length==1 && params[0] == '' ){
      console.log('null')
      
       calldata =  iface.encodeFunctionData(func)
    }
    else 
    {
       calldata =  iface.encodeFunctionData(func,params)
    }

    console.log("calldata: ",calldata)
    
   
    const hashiModuleiFace = new ethers.utils.Interface(HashiABI)
    const txData =  hashiModuleiFace.encodeFunctionData("executeTransaction",[toAddr,0,calldata,0])
    
    const message = {
      to: hashiModuleAddr,
      toChainId: Number(crossChainId),
      data: txData,
    }
    setMessage(message)

    const Yaho = new ethers.utils.Interface(YahoABI)
       // only testing with AMB at the moment
       console.log(typeof(deployedContract.GoerAMBMessageRelay) + deployedContract.GoerAMBMessageRelay)
       console.log(typeof(deployedContract.GCAMBAdapter) + deployedContract.GCAMBAdapter)
       console.log(typeof(message) + message)
    const SafeTxData = Yaho.encodeFunctionData("dispatchMessagesToAdapters",[[message],[deployedContract.GoerAMBMessageRelay],[deployedContract.GCAMBAdapter]])
 

    console.log("Create tx")

     const safeTxHash = await SDK.txs.send({txs:[{
      to:deployedContract.Yaho,
      value: '0',
      data: SafeTxData
    }]})
        console.log("Tx hash: ",safeTxHash)

  }

  const claimTxClick = async () =>{

    if(JSON.stringify(message) === claimMessage){
      console.log("matched!")
    }
    else{
      console.log("Message ",message)
      console.log("type: ",typeof(message))
      console.log("claimMessage ",JSON.parse(claimMessage))
      console.log("type ",typeof(JSON.parse(claimMessage)))
    }
    const Yaru = new ethers.utils.Interface(YaruABI);
    
    const safeTxData = Yaru.encodeFunctionData("executeMessages",[[JSON.parse(claimMessage)],[messageId],[sourceSafe],[deployedContract.GCAMBAdapter]])
    console.log("Claim transaction")

    const safeTxHash = await SDK.txs.send({txs:[{
      to:deployedContract.Yaru,
      value: '0',
      data: safeTxData
    }]})
        console.log("Tx hash: ",safeTxHash)

  }
  const Boxstyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  if (!safeInfo) {
    return <Spinner size={24} />;
  }
  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  return (
    <Container>
      <Heading size={700} marginTop="default">
        Safe on Hashi Demo
      </Heading>

       <Box>
          <FormControlLabel  label="Init mode" control={<Switch checked={initMode} onChange= {(event:React.ChangeEvent<HTMLInputElement>) =>{
            setInitMode(event.target.checked)}}/>}
          />
      </Box>
    
      {initMode && 
        <>
          <>
            <InputLabel>Bridge to Chain</InputLabel>
            <Select variant="outlined" label="Select Chain" value={chain} onChange={(event:React.ChangeEvent<{value:unknown}>)=>{setChain(event.target.value as string); (event.target.value=="Gnosis Chain"?setcrossChainId('100'):setcrossChainId('1'))}}>
            <MenuItem value="Ethereum">Ethereum</MenuItem>
            <MenuItem value="Gnosis Chain">Gnosis Chain</MenuItem>
            </Select>

          </>
              
          <>
            <InputLabel>Select Bridge Solution</InputLabel>
              <Select variant="outlined" label="Select Bridge" value={bridge} onChange={(event:React.ChangeEvent<{value:unknown}>)=>{setBridge(event.target.value as string)}}>
                <MenuItem value="AMB">AMB</MenuItem>
                <MenuItem disabled={true} value="Telepathy">Telepathy</MenuItem>
                <MenuItem disabled={true} value="Connext">Connext</MenuItem>
                <MenuItem disabled={true} value="DendrETH">DendrETH</MenuItem>
                <MenuItem disabled={true} value="Sygma">Sygma</MenuItem>
                <MenuItem disabled={true} value="Wormhole">Wormhole</MenuItem>
                <MenuItem disabled={true} value="Axiom">Axiom</MenuItem>
              </Select>
          </>
              
          
          <TextField fullWidth  variant="outlined" label="Hashi Module" value={hashiModuleAddr} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setHashiModuleAddr(event.target.value);}}
          />
          <TextField fullWidth  variant="outlined" label="Cross Chain Safe" value={crossChainSafe} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCrossChainSafe(event.target.value);}}
          />
          <TextField fullWidth  variant="outlined" label="Enter Cross Chain Contract Address" value={contractAddr} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setcontractAddr(event.target.value);}}
          />

          <TextField fullWidth  variant="outlined" label="Enter ABI" value={abi} onChange={e=>setAbi(e.target.value)}/>
              
          {abi&&<Button variant="contained" onClick={handleClick}>Filter ABI</Button>}
          {contract && (
            <TextField  fullWidth select  variant="outlined" label="Select Function">
              {contract?.methods.map((option)=>(
                <MenuItem key={option.name} value={option.name} onClick={()=>{
                  console.log("click: ",option.name)
                  setSelectedFunction(option.name)}}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          {(selectedFunction&&isInput)&&(<TextField fullWidth variant="outlined" label="Parameter"  onChange={(e)=>{setParam(e.target.value)}}></TextField>)}

          <Button variant="contained" onClick={createTxClick}>Create Transaction</Button>
          <Modal open={isDetailOpen} onClose={()=>{setIsDetailOpen(false)}}>
            <Box sx={Boxstyle}>
              <Typography>
              From {sourceChain.chainName} to {chain}<br/>   
              Choose {bridge} <br/> 
              Calling function: {selectedFunction} <br/> 
              wih parameter: {param} <br/> 
              Called by Safe address: {crossChainSafe} <br/> 
              <CopyToClipboard text={JSON.stringify(message)} onCopy={()=>setCopyToClipboard(true)}><Button>Click to Copy Message</Button></CopyToClipboard>
                <Button variant="contained" onClick={confirmTx}>Confirm Transaction</Button>
              </Typography>
            </Box>
          </Modal>
      </>
    }
    {!initMode && 
      <>
        <Typography>Claim mode</Typography>

        <TextField fullWidth  variant="outlined" label="Cross Chain Safe" value={sourceSafe} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setsourceSafe(event.target.value);}}
        />
        <InputLabel>Select Bridge Solution</InputLabel>
          <Select variant="outlined" label="Select Bridge" value={bridge} onChange={(event:React.ChangeEvent<{value:unknown}>)=>{setBridge(event.target.value as string)}}>
            <MenuItem value="AMB">AMB</MenuItem>
            <MenuItem disabled={true} value="Telepathy">Telepathy</MenuItem>
            <MenuItem disabled={true} value="Connext">Connext</MenuItem>
            <MenuItem disabled={true} value="DendrETH">DendrETH</MenuItem>
            <MenuItem disabled={true} value="Sygma">Sygma</MenuItem>
            <MenuItem disabled={true} value="Wormhole">Wormhole</MenuItem>
            <MenuItem disabled={true} value="Axiom">Axiom</MenuItem>
          </Select>
        
        <TextField fullWidth  variant="outlined" label="Message" value={claimMessage} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setClaimMessage(event.target.value);}}
        />

        <TextField fullWidth  variant="outlined" label="Message ID" value={messageId} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setMessageId(event.target.value);}}
        />

        <Button variant="contained" onClick={claimTxClick}>Claim Transaction</Button>
      </>
    }

    </Container>
  );
};

export default App;
