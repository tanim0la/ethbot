import { ethers } from "ethers";

(async() => {
    const connection = await new ethers.providers.JsonRpcProvider('ETH NETWORK')
    const wallet = ethers.Wallet.fromMnemonic('YOUR MNEMONIC')
    const signer = wallet.connect(connection)
    let gas_limit = "0xc350"
    
    // Listen Ether balance changes
    let lastBalance = ethers.constants.Zero
    // listen to every block
    connection.on('block', () => {
        const gasPrice = connection.getGasPrice()
        connection.getBalance(wallet.address).then( async (balance) => {
            const balanc = ethers.utils.formatEther(balance)
        if (!balance.eq(lastBalance) || balanc > 0.0016) {
            lastBalance = balance
            const gp = await gasPrice
            const a = ethers.utils.formatEther(gp.mul(gas_limit)) 
            const maxBal = balanc-a     
            if(maxBal>0){
                const newMaxBal = maxBal.toFixed(5)
                const strBal = newMaxBal.toString();
                const recipient = "RECIPIENT ADDRESS"
                const tx = {
                        from: wallet.address,
                        to: recipient,
                        value: ethers.utils.parseUnits(strBal,"ether"),
                        nonce: connection.getTransactionCount(wallet.address, 'latest')
                    };
                const transaction = await signer.sendTransaction(tx)
                const a = await transaction.wait()
                console.log(transaction)

                console.log('Sent '+strBal+'ETH successfully.')
                console.log('\nListening for new balance...')
            }
            
        }
    }).catch((errors) => {
        console.log(errors)
    })})    
})();
