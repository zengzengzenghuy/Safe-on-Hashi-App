const trie = require("@ethereumjs/trie");
const util = require("ethereumjs-util");
const ethers = require("ethers");
const ProofAndVerify = async (req, res) => {
  console.log("req body", req.body);
  console.log("param address ", req.query.address);
  const proof = req.body;
  try {
    // Create a new Merkle Tree with storageHash as root
    const storageTrie = new trie.Trie({
      root: util.toBuffer(proof.storageHash),
      useKeyHashing: true,
    });
    // Create nodes from proof
    await storageTrie.fromProof(
      proof.storageProof[0].proof.map((p) => util.toBuffer(p))
    );

    // Index slot
    // TODO: explain why it is 0x2
    const slot = "0x2";
    const paddedAddress = ethers.utils.hexZeroPad(req.query.address, 32);
    const paddedSlot = ethers.utils.hexZeroPad(slot, 32);
    const concatenated = ethers.utils.concat([paddedAddress, paddedSlot]);
    // key/indexof the storage slot
    const hash = ethers.utils.keccak256(concatenated);

    // get the value of 'hash' as key
    const trieVal = await storageTrie.get(util.toBuffer(hash), true);
    const trieValue = ethers.utils.RLP.decode(util.bufferToHex(trieVal));

    // node value from tree should be the same as value from storage Proof
    const storageResult = trieValue === proof.storageProof[0].value;


      // create account Trie
    const accountTrie = new trie.Trie({
      root: util.toBuffer(proof.stateRoot),
      useKeyHashing: true,
    });
    await accountTrie.fromProof(
      proof.accountProof.map((p) => util.toBuffer(p))
    );

    // get account trie value
    const accountVal = await accountTrie.get(util.toBuffer(proof.address));
    const accountValue = ethers.utils.RLP.decode(util.bufferToHex(accountVal));
    const accountResult =
      ethers.utils.hexStripZeros(accountValue[0]) === proof.nonce &&
      ethers.utils.hexStripZeros(accountValue[1]) === proof.balance &&
      ethers.utils.hexStripZeros(accountValue[2]) === proof.storageHash &&
      ethers.utils.hexStripZeros(accountValue[3]) === proof.codeHash;

    return res.json({ result: storageResult && accountResult });
  } catch (error) {
    console.log("error", error);
    return res.json({ result: false });
  }
};

module.exports = {
  ProofAndVerify,
};
