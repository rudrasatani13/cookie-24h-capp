import { useMemo, useState } from "react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NightlyWalletAdapter } from "@solana/wallet-adapter-nightly";
import { COOKIE_RPC, EXPLORER_TX } from "./config";
import { sendMemo } from "./memo";
import "@solana/wallet-adapter-react-ui/styles.css";

function Inner() {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [bal, setBal] = useState<string>("-");
  const [sig, setSig] = useState<string>("");
  const [msg, setMsg] = useState<string>("hello cookie");

  async function refresh() {
    if (!publicKey) return;
    const lamports = await connection.getBalance(publicKey);
    setBal((lamports / LAMPORTS_PER_SOL).toFixed(4));
  }
  async function send() {
    if (!publicKey || !signTransaction) return;
    const s = await sendMemo({ walletPubkey: publicKey, signTransaction, text: msg });
    setSig(s);
  }
  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 560 }}>
      <h2>Cookie 24h cApp</h2>
      <WalletMultiButton />
      <p>RPC: {COOKIE_RPC}</p>
      <p>Balance: {bal} <button onClick={refresh}>Refresh</button></p>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} style={{ width: "100%" }} />
      <p><button onClick={send}>Send memo tx</button></p>
      {sig ? <p>Tx: <a href={EXPLORER_TX(sig)} target="_blank" rel="noreferrer">{sig}</a></p> : null}
    </div>
  );
}

export default function App() {
  const endpoint = COOKIE_RPC;
  const wallets = useMemo(() => [new NightlyWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Inner />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
