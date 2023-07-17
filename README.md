# Safe on Hashi App

## Description

The project aims to provide a [Safe](https://safe.global/) app interface for user to create cross-chain transactions, secured by [Hashi](<(https://github.com/gnosis/hashi)>). Besides, it focus on tackling the issues discussed from this forum [how-can-a-safe-hold-asset-on-multiple-chains](https://forum.safe.global/t/how-can-a-safe-hold-asset-on-multiple-chains/2242) by building a cross-chain Safe prototype.

## Problem

In the current phase(up to Safe v1.4.0), you have to deploy Safe on each chain respectively to enable transaction on each chain, and these Safe wallets are independent of each other, with different addresses. There is no link of connection between these Safe.
To create a transaction on a specific chain, one has to switch to that network, and can only create transaction if one is the owner(s) of the Safe.

## Solution

Making a Safe as a proxy/main Safe, which can 'control' Safe on other chains, let's call them secondary Safe.
In this project, Safe on Ethereum/Goerli is referred to main Safe, where Safe on Gnosis Chain is referred to secondary Safe.

There are two approaches outlined in [the forum](https://forum.safe.global/t/how-can-a-safe-hold-asset-on-multiple-chains/2242): Push flow and Pull flow.
In push flow, main Safe calls AMB to specific which chain, contract & function to call, initiated by secondary Safe. If secondary Safe is not deployed, it will be deployed by AMB.

In this project, main Safe will call Yaho contract and spefici which chain, contract & function to call, and which bridge solution to use (only AMB is available at the moment). Yaho will dispatch the message with messageId and message Hash, then pass it to AMB to relay over to Gnosis Chain. The hash will stored in Adapter contract eventually.
The message has to be claimed in order to finish the whole workflow. With messageId and original message, anyone can call Yaru to claim the message. The transaction will be called by Hashi Module of secondary Safe and complete the workflow.
The security of push flow rely on the hash of message, check out how to create hash of the message [in this repo](https://github.com/gnosis/hashi/blob/main/packages/evm/contracts/utils/MessageHashCalculator.sol#L13-L21).

In pull flow, data of Ethereum is read from time to time. Transaction will be initiated on Gnosis Chain, with the 'permission' from Ethereum, by validating Merkle Proof generated using data from Ethereum.

In this project, a scenario is tested: an owner from main Safe (which doesn't from secondary Safe) is able to create a transaction for secondary Safe, even though it is not the owner for secondary Safe.
The security of pull flow rely on: block header provided by [ShoyuBashi](https://docs.gnosischain.com/bridges/hashi/#goerli---gnosis-chain) and proof provided by [`eth_getProof`]((https://docs.alchemy.com/reference/eth-getproof) API from Ethereu node.
The proof is verified by an off-chain verifier at the current version, check out [server](./server/README.MD) folder to understand how to run the off-chain verifier. In the future roadmap, on-chain verification will be implemented.
For more details on how pull flow works, check out

## Running the app

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
[How to initiate from source chain Safe](/doc/Instruction.md#initiate-transactation-on-source-chain)  
[How to claim from destination chain Safe](/doc/Instruction.md#claim-transaction-on-destination-chain)
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
2. Auto claim transaction on destinatin chain
3. Enable multiple bridge solutions
4. On-chain verification

## Credits

The app is based on a template built by Kris Urbas ([@krzysu](https://twitter.com/krzysu)).
Thanks to Usame, Ivan, German from the Safe team, Georgios and Auryn from Gnosis Chain for giving the technical advice and support.
