# Safe on Hashi App

## Description

The project aims to provide a Safe app interface for user to create cross-chain transactions, secured by Hashi.

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

## Using the App

[How to initiate from source chain Safe](/doc/HowTo.md#initiate-transactation-on-source-chain)  
[How to claim from destination chain Safe](/doc/HowTo.md#claim-transaction-on-destination-chain)
[How to deploy Hashi Module](/doc/HowTo.md#how-to-deploy-hashi-module)
[How to use History section](/doc/HowTo.md#how-to-use-history-section)

## Understanding the logic

[What is the contract calling logic?](/doc/Logic.md#understanding-the-workflow)

## Feature

- [*] Create Transaction from Goerli
- [*] Claim Transaction from Gnosis Chain
- [*] Check Transaction History
- [*] User Guide
- [] To fix: Deploy Hashi Module for Safe

## Roadmap

1. Auto Deploy Safe on destination chain
2. Auto claim transaction on destinatin chain
3. Enable multiple bridge solutions

## Credits

The app is based on a template built by Kris Urbas ([@krzysu](https://twitter.com/krzysu)).
