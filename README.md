# Safe on Hashi App

## Description

The project aims to provide a [Safe](https://safe.global/) app interface for user to create cross-chain transactions, secured by [Hashi](<(https://github.com/gnosis/hashi)>). Besides, it focus on tackling the issues discussed from this forum [how-can-a-safe-hold-asset-on-multiple-chains](https://forum.safe.global/t/how-can-a-safe-hold-asset-on-multiple-chains/2242) by building a cross-chain Safe prototype.

## Problem

In the current phase(up to Safe v1.4.0), you have to deploy Safe on each chain respectively to enable transaction on each chain, and these Safe wallets are independent of each other, with different addresses. There is no link of connection between these Safe.
To create a transaction on a specific chain, one has to switch to that network, and can only create transaction if one is the owner(s) of the Safe.

## Solution

Making a Safe as a proxy/main Safe, which can 'control' Safe on other chains, let's call them secondary Safe(s). 
In this project, Safe on Goerli is referred to as main Safe, where Safe on Gnosis Chain is referred to as secondary Safe.
There are two approaches outlined in the forum: Push flow and Pull flow. In push flow, main Safe calls AMB to specify which chain, contract & function to call, initiated by secondary Safe. If secondary Safe is not deployed, it will be deployed by AMB.
### Push Flow
For pull flow in this project, main Safe will call the Yaho contract and specify which chain, contract & function to call, and which bridge solution to use (only AMB is demonstrated at the moment). Yaho will dispatch the message with messageId and message Hash, then pass it to AMB to relay over to Gnosis Chain. The hash will be stored in the Adapter(s) contract eventually. The message has to be claimed in order to finish the whole workflow. With messageId and original message, anyone can call Yaru to claim the message. The transaction will be called by Hashi Module of secondary Safe and complete the workflow. The security of push flow relies on the hash of the message, check out how to create a hash of the message in this repo.

Video Demo: https://www.youtube.com/watch?v=vXuffnJCcTM/ 

### Pull Flow
In pull flow, data from Ethereum/Goerli is read from time to time. Transaction will be initiated on Gnosis Chain, with the 'permission' from Ethereum/Goerli, by validating Merkle Proof generated using data from Ethereum/Goerli. In this project, a scenario is tested: an owner from main Safe is able to create a transaction for secondary Safe, even though it is not the owner for secondary Safe. The security of pull flow relies on: block header provided by ShoyuBashi and proof provided by eth_getProof API from Ethereum/Goerli node. The proof is verified by an off-chain verifier at the current version, check out the  server folder to understand how to run the off-chain verifier. In the future roadmap, on-chain verification will be implemented.



Video demo: https://www.youtube.com/watch?v=g-vRKNFmQXc



## Running the app

```
nvm use
```

```
yarn install
yarn start
```

Then:

- Go to [Safe app](https://safe.global/)
- Go to Apps -> Manage Apps -> Add Custom App
- Paste your localhost URL, default is http://localhost:3000/
- You should see Safe on Hashi App as a new app

## Running the off chain verifier

[Check out server/README.md](./server/README.MD) for instruction.

### Using the App

**Push Flow**    
[How to initiate a tx from source chain Safe](/doc/Instruction.md#initiate-transactation-on-source-chain)      
[How to claim a tx from destination chain Safe](/doc/Instruction.md#claim-transaction-on-destination-chain)    
[How to deploy Hashi Module](/doc/Instruction.md#how-to-deploy-hashi-module)    
[How to use History section](/doc/Instruction.md#how-to-use-history-section)    

**Pull Flow**    
[How to get prove and verify for your address]()

## Understanding the logic

[What is the contract calling logic for push flow?](/doc/PullFlowLogic.md#understanding-the-workflow)     
[What is the workflow for pull flow?](/doc/PullFlowLogic.md)

## Feature

**Push Flow**

- Create Transaction from Goerli
- Claim Transaction from Gnosis Chain
- Check Transaction History
- User Guide
- To fix: Deploy Hashi Module for Safe

**Pull Flow**

- Get proof from Goerli
- Generate Merkle Trie and verify proof from off-chain verifier
- Create Transaction from Gnosis Chain

## Roadmap

1. Auto Deploy Safe on destination chain
2. Auto claim transaction on destination chain
3. Enable multiple bridge solutions
4. On-chain verification

## Credits

The app is based on a template built by Kris Urbas ([@krzysu](https://twitter.com/krzysu)).
Thanks to Usame, Ivan, German from the Safe team, Georgios and Auryn from Gnosis Chain for giving the technical advice and support.
