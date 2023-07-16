const trie = require("@ethereumjs/trie");
const util = require("ethereumjs-util");
const ethers = require("ethers");
const ProofAndVerify = async (req, res) => {
  console.log("req body", req.body);
  console.log("param address ", req.query.address);
  const proof = req.body;
try{
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
  const val = await storageTrie.get(util.toBuffer(hash), true);
  const trieValue = ethers.utils.RLP.decode(util.bufferToHex(val));

  // node value from tree should be the same as value from storage Proof 
  const result = trieValue === proof.storageProof[0].value;
  return res.json({ result: result });

}catch(error){
    console.log("error",error)
    return res.json({result:false})
}

 
 }
  


module.exports = {
  ProofAndVerify,
};
