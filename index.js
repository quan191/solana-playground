const solanaWeb3 = require('@solana/web3.js');

const sendToken = async () =>{
    rpcUrl = "https://api.devnet.solana.com";
    connection = new solanaWeb3.Connection(rpcUrl, 'confirmed');
    console.log("Connection to cluster established", rpcUrl);
    const keyPair = solanaWeb3.Keypair.generate();
    console.log("Public Key:", keyPair.publicKey.toString());
    console.log("Secret Key:",keyPair.secretKey);
    let airdropSignature = await connection.requestAirdrop(
        keyPair.publicKey,
         solanaWeb3.LAMPORTS_PER_SOL,
      );
     await connection.confirmTransaction(airdropSignature);
     let balance = await connection.getBalance(keyPair.publicKey);
      console.log(`balance: ${balance}`);
    const to = solanaWeb3.Keypair.generate();
    let transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
            fromPubkey: keyPair.publicKey,
            toPubkey: to.publicKey,
            lamports: solanaWeb3.LAMPORTS_PER_SOL/100,
        }),
    );
    const signature = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction,
        [keyPair],
    );
    console.log(signature);
    balance = await connection.getBalance(to.publicKey);
    console.log(`balance: ${balance}`);
     
  };

sendToken();