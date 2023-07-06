import { useEffect,useState } from 'react';
import { Typography}  from '@material-ui/core';
import { Box, Button, SelectChangeEvent } from '@mui/material';
import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';
import SafeAppsSDK, { SafeInfo } from '@gnosis.pm/safe-apps-sdk';
import { SafeMultisigTransactionListResponse } from '@safe-global/api-kit';
import { SafeMultisigTransactionResponse, SafeTransactionData } from '@safe-global/safe-core-sdk-types';
import SafeApiKit from '@safe-global/api-kit'
import getTxServiceURL from './utils/helper';
import TxCard from './component/TxCard';

const SDK = new SafeAppsSDK();
let multisigTxs: SafeMultisigTransactionListResponse 
const History = () =>{
    const [safeInfo, setSafeInfo] = useState<SafeInfo | undefined>();

    const [sourceChain,setSourceChain] = useState<any>('')
    
    const [txList,setTxList] = useState<SafeMultisigTransactionListResponse>()
    useEffect(() => {
        async function loadSafeInfo() {
          const safuInfo = await SDK.safe.getInfo()
          const chainInfo = await SDK.safe.getChainInfo()
          setSourceChain(chainInfo)
          console.log({ safuInfo, chainInfo })
          setSafeInfo(safuInfo)
          const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const signerAddr = await signer.getAddress()
        console.log("Account:", signerAddr);
        const ethAdapter = new EthersAdapter({ethers,signerOrProvider:signer})
        
        const txServiceUrl = getTxServiceURL(chainInfo.chainId)
        const safeService = new SafeApiKit({txServiceUrl,ethAdapter:ethAdapter})
        
        console.log("Get transaction List")
        multisigTxs = await safeService.getMultisigTransactions(
            safuInfo.safeAddress
          )
          console.log(multisigTxs)
          console.log("typeof ",typeof(multisigTxs.results))
        setTxList(multisigTxs)
        console.log("TxList ",txList)
    }
        loadSafeInfo();
      }, []);

      const handleClick = async() =>{
        console.log(txList)
      }
     
    return(
        <>

            {
                multisigTxs?.results.map((tx:SafeMultisigTransactionResponse)=>{
                    <p>{tx}</p>

                })
        
            
        }
        </>
    )
}

export default History;