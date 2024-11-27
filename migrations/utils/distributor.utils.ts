
import * as anchor from "@coral-xyz/anchor";
import fs from "fs";
import merkleDistributorIDL from "../../target/idl/merkle_distributor.json";


export const DISTRIBUTOR_SEED = Buffer.from("MerkleDistributor");
export const CLAIM_STATUS_SEED = Buffer.from("ClaimStatus");

export function generatePdaForDistributor(
    programId: anchor.web3.PublicKey,
    base: anchor.web3.PublicKey
): [anchor.web3.PublicKey, number] {
    console.log(`base: ${base.toBase58()}`);
    console.log(`programId: ${programId.toBase58()}`);
    return pdaFromSeeds([DISTRIBUTOR_SEED, base.toBuffer()], programId);
}

// /// Status of the claim.
// #[account(
//     init,
//     seeds = [
//         b"ClaimStatus".as_ref(),
//         index.to_le_bytes().as_ref(),
//         distributor.key().to_bytes().as_ref(),
//     ],
//     bump,
//     space = 8 + ClaimStatus::LEN,
//     payer = payer
// )]
// pub claim_status: Account<'info, ClaimStatus>,

export function generatePdaForClaimStatus(
    index: anchor.BN,
    distributor: anchor.web3.PublicKey,
    programId: anchor.web3.PublicKey
): [anchor.web3.PublicKey, number] {
    return pdaFromSeeds([CLAIM_STATUS_SEED, index.toArrayLike(Buffer, "le", 8), distributor.toBuffer()], programId);
}

export function pdaFromSeeds(
    seeds: Buffer[],
    programId: anchor.web3.PublicKey
): [anchor.web3.PublicKey, number] {
    const [pubkey, bump] = anchor.web3.PublicKey.findProgramAddressSync(
        seeds,
        programId
    );
    return [pubkey, bump];
}

export function padStringTo32Bytes(str: string): Buffer {
    const buffer = Buffer.alloc(32);
    buffer.write(str.replace("0x", ""), "hex");
    return buffer;
}


interface newDistributorParams {
    root: Buffer,
    maxTotalClaim: anchor.BN,
    maxNumNodes: anchor.BN
}

interface newDistributorAccounts {
    base: anchor.web3.PublicKey,
    distributor: anchor.web3.PublicKey,
    mint: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
}

export function newDistributor(
    program: anchor.Program,
    params: newDistributorParams,
    accounts: newDistributorAccounts,
    baseSigner: anchor.web3.Keypair,
    payerSigner: anchor.web3.Keypair

): Promise<anchor.web3.TransactionSignature> {
    // console.log(`params: ${JSON.stringify(params)}`);
    // console.log(`accounts: ${JSON.stringify(accounts)}`);
    return program.methods
        .newDistributor(
            params.root,
            params.maxTotalClaim,
            params.maxNumNodes,
        )
        .accounts({
            base: accounts.base,
            distributor: accounts.distributor,
            mint: accounts.mint,
            payer: accounts.payer,
        })
        .signers([baseSigner, payerSigner])
        .rpc();
}
const ownerKeypairPath = `governance/owner_keypair.json`;
export const ownerKeypair = loadKeypairFromFile(ownerKeypairPath);

export function loadKeypairFromFile(filename: string): anchor.web3.Keypair {
    const secret = JSON.parse(fs.readFileSync(filename).toString()) as number[];
    const secretKey = Uint8Array.from(secret);
    return anchor.web3.Keypair.fromSecretKey(secretKey);
}