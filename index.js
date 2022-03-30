const { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer , getAccount} = require('@solana/spl-token');

const { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL} =  require('@solana/web3.js');


const sendToken = async () =>{
    rpcUrl = "https://api.devnet.solana.com";
    connection = new Connection(rpcUrl, 'confirmed');
    console.log("Connection to cluster established", rpcUrl);

    const fromWallet = Keypair.generate();
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(fromAirdropSignature);

    const toWallet = Keypair.generate();

    const mint = await createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        9
    );
    console.log(mint.toBase58());

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    );
    console.log(`from token account : ${fromTokenAccount.address.toBase58()}`);

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet.publicKey
    );
    console.log(`to Token account: ${toTokenAccount.address.toBase58()}`);

    let mintTransaction = await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        100
      );
    console.log(`mint transaction :${mintTransaction}`);

    let transferTransaction = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        50
    )
     console.log(`transfer transaction :${transferTransaction}`);

    let tokenInfoAccount = await getAccount(
        connection,
        fromTokenAccount.address
    )
    console.log(`balance account ${fromTokenAccount.address}: ${tokenInfoAccount.amount}`);

    tokenInfoAccount = await getAccount(
        connection,
        toTokenAccount.address
    );
    console.log(`balance account ${toTokenAccount.address}: ${tokenInfoAccount.amount}`);

  };

sendToken();