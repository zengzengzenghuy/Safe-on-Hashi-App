const {Router} = require('express')

const PAVController = require("./ProofAndVerifyController")

const router = Router();

router.post('/',PAVController.ProofAndVerify);

module.exports = router