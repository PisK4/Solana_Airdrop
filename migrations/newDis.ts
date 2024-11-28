// import { util } from "chai";
import * as anchor from "@coral-xyz/anchor";
import { buildTree } from "./generateRoot";
import * as util from "./utils/distributor.utils";

const MAX_NUM_NODES = new anchor.BN(3);
const MAX_TOTAL_CLAIM = new anchor.BN(1_000_000_000_000);


export async function main() {
    const root = buildTree();
    // <Buffer 09 19 98 4e d3 28 38 32 40 c2 17 2c 08 66 96 fb 06 db b8 60 de 7f f2 bf c5 04 99 8c be 39 ec 2c>
    // const root = Buffer.from([0x09, 0x19, 0x98, 0x4e, 0xd3, 0x28, 0x38, 0x32, 0x40, 0xc2, 0x17, 0x2c, 0x08, 0x66, 0x96, 0xfb, 0x06, 0xdb, 0xb8, 0x60, 0xde, 0x7f, 0xf2, 0xbf, 0xc5, 0x04, 0x99, 0x8c, 0xbe, 0x39, 0xec, 0x2c]);
    console.log(root);
    console.log("root: ");
    const rootHex = root.toString('hex');
    console.log('0x' + rootHex);

    const program = util.generateMerkleDistributorProgram(
        "devnet"
    ) as any;

    // console.log(`program: ${program.programId}`);
    // console.log(`wallet: ${program.provider.wallet.publicKey.toBase58()}`);

    const baseKeypair = util.ownerKeypair;
    const mint = new anchor.web3.PublicKey("Cp5SEwr4qmpYeTfZpJzib6AZrm3y6niFcFUiudUD3h9K");
    const distributor = new anchor.web3.PublicKey("8DWw7Tey8VyxeZLKPUJhZaeU9iAhycnLnaAmGmc6pWcw");
    console.log("ready to create new distributor");
    const tx = await util.newDistributor(program, {
        root,
        maxTotalClaim: MAX_TOTAL_CLAIM,
        maxNumNodes: MAX_NUM_NODES,
    }, {
        base: baseKeypair.publicKey,
        distributor,
        mint,
        payer: baseKeypair.publicKey,
    }, baseKeypair, baseKeypair);
    console.log(`newDistributor tx: ${tx}`);

}

main();