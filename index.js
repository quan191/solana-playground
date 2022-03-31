require('dotenv').config();
const { createMint, getOrCreateAssociatedAccountInfo, mintTo, transfer , getAccount, Token, TOKEN_PROGRAM_ID} = require('@solana/spl-token');

const { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, sendAndConfirmTransaction} =  require('@solana/web3.js');
const bs58 = require('bs58');
const USDT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';
const sendToken = async () =>{

    rpcUrl = "https://api.mainnet-beta.solana.com/";
    connection = new Connection(rpcUrl, 'confirmed');
    console.log("Connection to cluster established", rpcUrl);
    let secretKey = bs58.decode(process.env.PRIVATE_KEY);
    const fromWallet = Keypair.fromSecretKey(secretKey);
    console.log(fromWallet.publicKey.toBase58());
    
    let secretKey2 = bs58.decode(process.env.PRIVATE_KEY2);
    const toWallet = Keypair.fromSecretKey(secretKey2);
    console.log(toWallet.publicKey.toBase58());

    const USDT_PublicKey = new PublicKey(USDT);
    const USDT_Token = new Token(
      connection,
      USDT_PublicKey,
      TOKEN_PROGRAM_ID,
      fromWallet
    );
    console.log(USDT_Token);


    const fromTokenAccount = await USDT_Token.getOrCreateAssociatedAccountInfo(
        fromWallet.publicKey
    );
    console.log(`from token account : ${fromTokenAccount.address.toBase58()}`);

    const toTokenAccount = await USDT_Token.getOrCreateAssociatedAccountInfo(
        toWallet.publicKey
    );
    console.log(`to Token account: ${toTokenAccount.address.toBase58()}`);

    var transaction = new Transaction()
    .add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        1
      )
    );
  // Sign transaction, broadcast, and confirm
  var signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  );
  console.log("SIGNATURE", signature);
  console.log("SUCCESS");

  };

sendToken();