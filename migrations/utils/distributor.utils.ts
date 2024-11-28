
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
    console.log("here0");
    const [distributor, distributorBump] = pdaFromSeeds([DISTRIBUTOR_SEED, base.toBuffer()], programId);
    console.log("here1");
    return [distributor, distributorBump];
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

export function generateMerkleDistributorProgram(
    network: string = "devnet"
): anchor.Program {
    let programId: string;
    switch (network) {
        case "devnet":
            programId = "BDSchMcYS2porfeisQoVNgtbJeqrgCxTU6bwYaaWY9ci";
            break;
        default:
            throw new Error(`Network not supported: ${network}`);
    }

    const provider = getProvider(network);
    return new anchor.Program(merkleDistributorIDL as anchor.Idl, provider);
}

// export function generateMerkleDistributorProgram(
//     network: string = "devnet"
// ): anchor.Program {
//     let programId: string;
//     switch (network) {
//         case "devnet":
//             programId = "mokB6FzEZx6vPVmasd19CyDDuqZ98auke1Bk59hmzVE";
//             break;
//         default:
//             throw new Error(`Network not supported: ${network}`);
//     }

//     const provider = getProvider(network);
//     return new anchor.Program(merkleDistributorIDL as anchor.Idl, provider);
// }

export function getProvider(network: string = "devnet"): anchor.Provider {
    let url: string;
    switch (network) {
        case "devnet":
            url =
                "https://solana-devnet.g.alchemy.com/v2/-m2gJ2Fiv4w403IMR27nGoHUyonc0azl";
            break;
        case "mainnet":
            url =
                "https://solana-mainnet.g.alchemy.com/v2/-m2gJ2Fiv4w403IMR27nGoHUyonc0azl";
            break;
        case "local":
            url = "http://127.0.0.1:8899";
            break;
        default:
            throw new Error(`Network not supported: ${network}`);
    }

    const connection = new anchor.web3.Connection(url, "confirmed");
    const provider = new anchor.AnchorProvider(
        connection,
        anchor.AnchorProvider.local().wallet,
        {
            commitment: "confirmed",
        }
    );

    return provider;
}

export function generatePublicKeyFromString(
    address: string
): anchor.web3.PublicKey {
    return new anchor.web3.PublicKey(address);
}