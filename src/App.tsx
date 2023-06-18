import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Spinner, Heading, SegmentedControl } from 'evergreen-ui';
import SafeAppsSDK, { SafeInfo } from '@gnosis.pm/safe-apps-sdk';
import { AppTabs } from './types';
import Main from './tabs/Main';
import RpcCalls from './tabs/RpcCalls';
import { MenuItem, TextField } from '@material-ui/core';
import { Button } from '@mui/material';
import { AddressInput, Divider, Switch, Text, Title } from '@gnosis.pm/safe-react-components'
import { ContractInterface,ContractMethod } from './typing/models';
import FormControlLabel from '@material-ui/core';
import FormGroup from '@material-ui/core';
import InterfaceRepository,{ InterfaceRepo } from './libs/interfaceRepository';
import { ethers } from 'ethers';
import { FunctionFragment } from 'ethers/lib/utils';


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

const App = (): React.ReactElement => {
  const [safeInfo, setSafeInfo] = useState<SafeInfo | undefined>();

  const [crossChainId, setcrossChainId] = useState<string>('')
  const [hashiModuleAddr, setHashiModuleAddr] = useState<string>('')
  const [crossChainSafe, setCrossChainSafe] = useState<string>('')
  const [contractAddr, setcontractAddr] = useState<string>('')
  const [abi,setAbi] = useState<string>('')
  const [selectedFunction, setSelectedFunction] = useState<string>('')
  const [param, setParam] = useState<string>()
  const interfaceRepo = new InterfaceRepository()
  // const [method,setMethod] = useState<ContractMethod[]>()
  const [contract, setContract] = useState<ContractInterface | null>(null)
  const [functionIndex,setFunctionIndex] = useState<any>()
  useEffect(() => {
    async function loadSafeInfo() {
      const safuInfo = await SDK.safe.getInfo()
      const chainInfo = await SDK.safe.getChainInfo()
      console.log({ safuInfo, chainInfo })
      setSafeInfo(safuInfo)
    }
    loadSafeInfo();
  }, []);

  // useEffect(() => {
  //   if (!abi) {
  //     setContract(null)
  //     return
  //   }

  //   // setContract(interfaceRepo.getMethods(abi))

  // }, [abi])

  // const showABI = (input:string) =>{
  //   setAbi(input)
  // }

  const [currentTab, setCurrentTab] = useState<string>('0');

  const handleParam = () =>{
    console.log("handleParam")
   

    // let input: any
    // contract?.methods.map((e)=>{
    //   console.log(e)
      // if(e.name==selectedFunction){
      //   // e.inputs.map((parameter)=>{
      //   //  <TextField fullWidth  variant="outlined" label={parameter.name}></TextField>
      //   // })
      //   input = e.inputs
      //   console.log("Match")
      // }
    // })
    // input.map((i:any)=>{
    //  return  <TextField fullWidth  variant="outlined" key={i.name} label={i.name}></TextField>
    // })
  }

useEffect(()=>{
  console.log("Use effect triggered")
  contract?.methods.map((option,index)=>{
  if(option.name == selectedFunction){
    setFunctionIndex(index)
  }
 
})
console.log("Selected function",selectedFunction)
},[selectedFunction])
  const handleClick = ( ) =>{
    console.log("ABI: ",abi)
    console.log("type ",typeof(abi))
    const method: ContractInterface = interfaceRepo.getMethods(abi)
    setContract(method)
    console.log("method ",method.methods)


  }

  const createTxClick = () =>{

    const iface = new ethers.utils.Interface(abi)
    const to = contractAddr;
    const func = selectedFunction;
    // const param = 
    //SDK.txs.send({})

    console.log("Create tx")
  }
  if (!safeInfo) {
    return <Spinner size={24} />;
  }
  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  return (
    <Container>
      <Heading size={700} marginTop="default">
        Safe on Hashi Demo
      </Heading>
      {/* <SegmentedControl
        value={currentTab}
        onChange={(val) => setCurrentTab(val as AppTabs)}
        options={tabs}
      /> */}
{/*  
      <FormControlLabel control={<Switch defaultChecked/>} label="Cross Chain Tx"/>
       */}
  
      <TextField fullWidth  variant="outlined" label="crossChainId" value={crossChainId} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setcrossChainId(event.target.value);
          }}/>
                <TextField fullWidth  variant="outlined" label="Hashi Module" value={hashiModuleAddr} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setHashiModuleAddr(event.target.value);
          }}/>

<TextField fullWidth  variant="outlined" label="Enter Cross Chain Cibtract Address" value={contractAddr} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setcontractAddr(event.target.value);
          }}/>

          <TextField fullWidth  variant="outlined" label="Enter ABI" value={abi} onChange={e=>setAbi(e.target.value)}
          />
          <Button variant="contained" onClick={handleClick}>Filter ABI</Button>
          {contract && (
            <TextField  fullWidth select  variant="outlined" label="Select Function">
              {contract?.methods.map((option)=>(
                <MenuItem key={option.name} value={option.name} onClick={()=>{
                  console.log("click: ",option.name)
                  setSelectedFunction(option.name)
                  handleParam()}}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          {selectedFunction && (
            // contract?.methods.map((option)=>{
            //   (option.name == selectedFunction) ? ((option.inputs.length>1) ? 
            //     (option.inputs.map((e,index)=>{
            //       (<TextField fullWidth  variant="outlined" key={index} label={e.name}></TextField> )
            //     })):
            //   (<TextField fullWidth  variant="outlined" key='0' label={option.inputs[0].name}></TextField> ))
            //   :
            //   setParam('null')
            // })
            // contract?.methods.map((option,index)=>{
            //   if(option.name == selectedFunction){
            //       setFunctionIndex(index)
            //   }
            // })
            // contract?.methods[functionIndex].inputs.map((e,index)=>{
              
            // })
         
            // console.log("Contract:",contract!.methods[functionIndex])
            contract?.methods[functionIndex].inputs.map((e,index)=>{
              return <TextField fullWidth  variant="outlined" key={index} label={e.name}></TextField> 
            })
          )}

<Button variant="contained" onClick={createTxClick}>Create Transaction</Button>
<div>
  <p>Select: {selectedFunction}</p>
  <p>Param: {param}</p>
</div>
{/* 
          <AddressInput
            id="hashiModuleAddress"
            name="hashiModuleAddress"
            label="Enter Hashi Module"
            hiddenLabel={false}
            address={hashiModuleAddr}
            fullWidth
            showNetworkPrefix={!!networkPrefix}
            networkPrefix={networkPrefix}
            showErrorsInTheLabel={false}
            onChangeAddress={(address:string) => {
              setHashiModuleAddr(address)}}
            InputProps={{
              endAdornment: isValidAddress(hashiModuleAddr) && (
                <InputAdornment position="end">
                  <CheckIconAddressAdornment />
                </InputAdornment>
              ),
            }}
          />

        <AddressInput
            id="crossChainSafe"
            name="crossChainSafe"
            label="Enter Safe address on the destination chain"
            hiddenLabel={false}
            address={crossChainSafe}
            fullWidth
            showNetworkPrefix={!!networkPrefix}
            networkPrefix={networkPrefix}
            showErrorsInTheLabel={false}
            onChangeAddress={(address:string) => {
              setCrossChainSafe(address)}}
            InputProps={{
              endAdornment: isValidAddress(crossChainSafe) && (
                <InputAdornment position="end">
                  <CheckIconAddressAdornment />
                </InputAdornment>
              ),
            }}
          /> */}


      {/* {currentTab === '0' && <Main sdk={SDK} safeInfo={safeInfo} />} */}
      {/* {currentTab === '1' && <RpcCalls sdk={SDK} />} */}
    </Container>
  );
};

export default App;
