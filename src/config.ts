// No env needed: RPC + program IDs as constants (bounty checklist friendly).
export const COOKIE_RPC = "https://rpc.cookiescan.io";
export const COOKIE_CHAIN_ID = "cookiescan";
export const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
export const EXPLORER_TX = (sig: string) => `https://cookiescan.io/tx/${sig}`;
