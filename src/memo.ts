import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { COOKIE_RPC, MEMO_PROGRAM_ID } from "./config";

export async function sendMemo(params: { walletPubkey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction>; text: string }): Promise<string> {
  const conn = new Connection(COOKIE_RPC, "confirmed");
  const ix = new TransactionInstruction({
    programId: new PublicKey(MEMO_PROGRAM_ID),
    keys: [{ pubkey: params.walletPubkey, isSigner: true, isWritable: false }],
    data: Buffer.from(params.text, "utf8"),
  });
  const tx = new Transaction().add(ix);
  tx.feePayer = params.walletPubkey;
  tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
  const signed = await params.signTransaction(tx);
  return conn.sendRawTransaction(signed.serialize());
}
