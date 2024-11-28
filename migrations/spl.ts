import * as util from "../migrations/utils/distributor.utils";
import * as splUtils from "../migrations/utils/spl.utils";
import * as anchor from "@coral-xyz/anchor";

// Cp5SEwr4qmpYeTfZpJzib6AZrm3y6niFcFUiudUD3h9K
export async function main() {
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"));
    const tokenAccountKey = anchor.web3.Keypair.generate();
    console.log(`tokenAccountKey: ${tokenAccountKey.publicKey.toBase58()}`);
    const tokenOwner = util.ownerKeypair;
    const mint = await splUtils.createSPLToken(connection, tokenOwner, tokenOwner.publicKey, tokenAccountKey);
    console.log(`mint: ${mint.toBase58()}`);
}

main();