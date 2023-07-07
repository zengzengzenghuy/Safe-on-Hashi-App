

const UserGuide = () =>{

    return(<>
    
        <h2>Prerequisite</h2>
     
            <li>1. Create Safe on Destination Chain</li>
            <li>2. Deploy Hashi Module for Safe on Destination Chain</li>
       
        <h2>Create Transaction</h2>

            <li>1. Turn on Init Mode</li>
            <li>2. Select chain to bridge to</li>
            <li>3. Input Safe on Destination Chain, hashi module with respect to the Safe</li>
            <li>4. Select Bridge Solution to use</li>
            <li>5. Input Contract address on destination chain</li>
            <li>6. Input ABI of the cotnract</li>
            <li>7. Click Filter ABI and Select the function you want to call</li>
            <li>8. Input function parameters with format [..,..,] separated by ','</li>
            <li>9. Click Create Transaction, a message will pop-up</li>
            <li>10. Click to Copy Message, it will be used to claim message in next step </li>
            <li>11. Click Confirm Transaction</li>
        <h2>Claim Transaction</h2>
            <li>1. Get messageId from MessageDispatched event after Transaction is created</li>
            <li>2. Switch the Safe network to destination chain </li>
            <li>3. Enter Safe from source chain</li>
            <li>4. Select Bridge Solution</li>
            <li>5. Enter messsage that is copied from step 10 above</li>
            <li>6. Enter messageId from step 1</li>
            <li>7. Click Claim Transaction</li>
    </>)
}

export default UserGuide;