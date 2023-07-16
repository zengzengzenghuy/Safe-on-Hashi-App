const express = require('express')
const cors = require('cors')
const route = require('./ProofAndVerify/ProofAndVerifyRoute')
const app = express()

app.use(cors())
app.use(express.json())

// Proof and Verify route
app.use('/proof',route)

app.listen(8000,()=>{
    console.log("listen from 8000")
})