import * as anchor from "@coral-xyz/anchor";
import * as distributorUtils from "../migrations/utils/distributor.utils";
import { Connection, Keypair, PublicKey, Transaction, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from '@solana/web3.js';
import * as splUtils from "../migrations/utils/spl.utils";
// import { chaiSolana, expectTX } from "@saberhq/chai-solana";
// import {
//     // getATAAddress,
//     // getTokenAccount,
//     u64,
//     // ZERO,
//     // getOrCreateATA,
//     // TOKEN_PROGRAM_ID,
// } from "@saberhq/token-utils";
import type { SendTransactionError } from "@solana/web3.js";
import chai, { expect } from "chai";
// import { findClaimStatusKey } from "../src/pda";
// import { BalanceTree } from "../src/utils";
// import {
//     createAndSeedDistributor,
//     createKeypairWithSOL,
//     makeSDK,
// } from "./testutils";
// import { SolanaAugmentedProvider } from "@saberhq/solana-contrib";
import {
    mintTo,
    AuthorityType,
    createSetAuthorityInstruction,
    setAuthority,
    getAssociatedTokenAddress,
    Account
} from "@solana/spl-token";
import { BalanceTree } from "../src/utils";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";

// chai.use(chaiSolana);

const MAX_NUM_NODES = new anchor.BN(3);
const MAX_TOTAL_CLAIM = new anchor.BN(1_000_000_000_000);
const ZERO_BYTES32 = Buffer.alloc(32);


describe("Distributor Test", () => {
    const provider = anchor.AnchorProvider.env();
    console.log(`current provider: ${provider.publicKey.toBase58()}`);
    anchor.setProvider(provider);
    const distributorProgram = anchor.workspace.MerkleDistributor;
    console.log(`distributorProgram: ${distributorProgram.programId.toBase58()}`);
    // const luckyKeypair = anchor.web3.Keypair.fromSeed(
    //     Buffer.from(distributorUtils.padStringTo32Bytes("lucky_guy_keypair"))
    // );
    // const vaultKeypair = anchor.web3.Keypair.fromSeed(
    //     Buffer.from(distributorUtils.padStringTo32Bytes("vault_keypair"))
    // );
    const luckyKeypair = Keypair.generate();
    const vaultKeypair = Keypair.generate();
    console.log(`lucky guy: ${luckyKeypair.publicKey.toBase58()}`);
    console.log(`vault guy: ${vaultKeypair.publicKey.toBase58()}`);

    let distributor: anchor.web3.PublicKey;
    let claimStatus: anchor.web3.PublicKey;
    let connection: Connection;
    let tokenOwner: Keypair;
    let payer: Keypair;
    let mint: anchor.web3.PublicKey;
    let tokenAccount: PublicKey;
    let tokenAccountKey: Keypair;
    let baseKeypair: Keypair;
    let root: Buffer;
    let tree: BalanceTree

    let distributorAssociatedTokenAccount: Account;
    let luckyAssociatedTokenAccount: Account;
    let vaultAssociatedTokenAccount: Account;

    before("setting up", async () => {
        console.log("setting up begin");
        connection = new Connection('http://127.0.0.1:8899', 'confirmed');
        console.log(`connection: ${connection.rpcEndpoint}`);
        payer = distributorUtils.ownerKeypair;
        tokenOwner = distributorUtils.ownerKeypair;
        console.log(`payer: ${payer.publicKey.toBase58()}`);
        // get airdrop
        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                payer.publicKey,
                5 * anchor.web3.LAMPORTS_PER_SOL
            )
        );

        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                luckyKeypair.publicKey,
                5 * anchor.web3.LAMPORTS_PER_SOL
            )
        );

        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(
                vaultKeypair.publicKey,
                5 * anchor.web3.LAMPORTS_PER_SOL
            )
        );
        console.log(`airdrop success, balance: ${await provider.connection.getBalance(payer.publicKey)}`);

        baseKeypair = Keypair.generate();
        // baseKeypair = distributorUtils.ownerKeypair;

        const kpOne = Keypair.generate();
        const kpTwo = Keypair.generate();
        const kpThree = luckyKeypair;
        const allKps = [kpOne, kpTwo, kpThree];
        await Promise.all(
            allKps.map(async (kp) => {
                await provider.connection.requestAirdrop(
                    kp.publicKey,
                    LAMPORTS_PER_SOL
                );
            })
        );

        const claimAmountOne = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
        const claimAmountTwo = new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL);
        const claimAmountThree = new anchor.BN(3 * anchor.web3.LAMPORTS_PER_SOL);
        tree = new BalanceTree([
            { account: kpOne.publicKey, amount: claimAmountOne },
            { account: kpTwo.publicKey, amount: claimAmountTwo },
            { account: kpThree.publicKey, amount: claimAmountThree },
        ]);
        root = tree.getRoot();
        console.log(`root: ${root.toString('hex')}`);
    });

    it("should create a new distributor PDA", async () => {
        const [_distributor, _distributorBump] = distributorUtils.generatePdaForDistributor(distributorProgram.programId, baseKeypair.publicKey);
        distributor = _distributor;
        console.log(`distributor: ${distributor.toBase58()}, bump: ${_distributorBump}`);
    });

    it('should deploy SPL token', async () => {
        tokenAccountKey = Keypair.generate();
        console.log(`tokenAccountKey: ${tokenAccountKey.publicKey.toBase58()}`);
        mint = await splUtils.createSPLToken(connection, tokenOwner, tokenOwner.publicKey, tokenAccountKey);
        console.log(`mint: ${mint.toBase58()}`);

        expect(mint.toBase58()).to.equal(tokenAccountKey.publicKey.toBase58());
    });

    it.skip('should create a new distributor', async () => {
        const tx = await distributorUtils.newDistributor(distributorProgram, {
            root: Buffer.from([0]),
            maxTotalClaim: new anchor.BN(100000000),
            maxNumNodes: new anchor.BN(1000),
        }, {
            base: baseKeypair.publicKey,
            distributor,
            mint,
            payer: payer.publicKey,
        }, baseKeypair, payer);
        console.log(`newDistributor tx: ${tx}`);
    });

    it("should set the mint authority to the distributor", async () => {
        {
            console.log(`mint to lucky guy`);
            const mintAmount = 123 * anchor.web3.LAMPORTS_PER_SOL;

            luckyAssociatedTokenAccount = await splUtils.getAssociatedTokenAddress(connection, payer, mint, false, luckyKeypair.publicKey);
            // console.log(luckyAssociatedTokenAccount);
            console.log(`luckyATAAddress: ${luckyAssociatedTokenAccount.address.toBase58()}`);

            // mint token
            await mintTo(
                connection,
                luckyKeypair,
                mint,
                luckyAssociatedTokenAccount.address,
                tokenOwner,
                mintAmount,
            )

            // check balance
            const luckyBalance = await connection.getTokenAccountBalance(luckyAssociatedTokenAccount.address);
            console.log(`lucky balance: ${Number(luckyBalance.value.amount) / anchor.web3.LAMPORTS_PER_SOL}`);
            expect(Number(luckyBalance.value.amount)).to.equal(Number(mintAmount));

            // const tx = await setAuthority(
            //     connection,
            //     payer,
            //     luckyAssociatedTokenAccount.address,
            //     luckyKeypair,
            //     AuthorityType.AccountOwner,
            //     distributor,
            // );
        }
        {
            console.log(`mint to vault guy`);
            const mintAmount = 321 * anchor.web3.LAMPORTS_PER_SOL;

            vaultAssociatedTokenAccount = await splUtils.getAssociatedTokenAddress(connection, payer, mint, true, vaultKeypair.publicKey);
            console.log(`vaultATAAddress: ${vaultAssociatedTokenAccount.address.toBase58()}`);

            // mint token
            await mintTo(
                connection,
                vaultKeypair,
                mint,
                vaultAssociatedTokenAccount.address,
                tokenOwner,
                mintAmount,
            )

            // check balance
            const vaultBalance = await connection.getTokenAccountBalance(vaultAssociatedTokenAccount.address);
            console.log(`vault balance: ${Number(vaultBalance.value.amount) / anchor.web3.LAMPORTS_PER_SOL}`);
            expect(Number(vaultBalance.value.amount)).to.equal(Number(mintAmount));

            const tx = await setAuthority(
                connection,
                payer,
                vaultAssociatedTokenAccount.address,
                vaultKeypair,
                AuthorityType.AccountOwner,
                distributor,
            );
            console.log(`setAuthority tx: ${tx}`);

            // vaultAssociatedTokenAccount = await splUtils.getAssociatedTokenAddress(connection, payer, mint, false, vaultKeypair.publicKey);
            // console.log("new vaultATA");
            // console.log(vaultAssociatedTokenAccount);

        }
        {
            console.log(`mint to distributor`);
            const mintAmount = 456 * anchor.web3.LAMPORTS_PER_SOL;
            distributorAssociatedTokenAccount = await splUtils.getAssociatedTokenAddress(connection, payer, mint, true, distributor);
            console.log(distributorAssociatedTokenAccount);
            console.log(`distributorATAAddress: ${distributorAssociatedTokenAccount.address.toBase58()}`);
            console.log(`ATA owner: ${distributorAssociatedTokenAccount.owner.toBase58()}, mint: ${mint.toBase58()}, distributor: ${distributor.toBase58()}`);
            // mint token
            await mintTo(
                connection,
                payer,
                mint,
                distributorAssociatedTokenAccount.address,
                tokenOwner,
                mintAmount,
            )

            // check balance
            const distributorBalance = await connection.getTokenAccountBalance(distributorAssociatedTokenAccount.address);
            console.log(`distributor balance: ${Number(distributorBalance.value.amount) / anchor.web3.LAMPORTS_PER_SOL}`);
            expect(Number(distributorBalance.value.amount)).to.equal(Number(mintAmount));
        }
    });


    it('new distributor should pass', async () => {
        const tx = await distributorUtils.newDistributor(distributorProgram, {
            root,
            maxTotalClaim: MAX_TOTAL_CLAIM,
            maxNumNodes: MAX_NUM_NODES,
        }, {
            base: baseKeypair.publicKey,
            distributor,
            mint,
            payer: payer.publicKey,
        }, baseKeypair, payer);
        console.log(`newDistributor tx: ${tx}`);
    });

    it.skip("fails for empty proof", async () => {
        const [_claimStatus, _claimStatusBump] = distributorUtils.generatePdaForClaimStatus(new anchor.BN(0), distributor, distributorProgram.programId);
        claimStatus = _claimStatus;
        console.log(`claimStatus: ${claimStatus.toBase58()}, bump: ${_claimStatusBump}`);

        try {
            const tx2 = await distributorProgram.methods.claim(
                new anchor.BN(0),
                new anchor.BN(10_000_000),
                []
            ).accounts({
                distributor,
                claimStatus,
                from: distributorAssociatedTokenAccount.address,
                to: luckyAssociatedTokenAccount.address,
                claimant: luckyKeypair.publicKey,
                payer: payer.publicKey,
            }).
                signers([payer, luckyKeypair])
                .rpc();
            console.log(`claim tx: ${tx2}`);
            throw new Error("should not reach here");
        } catch (e) {
            const err = e as Error;
            expect(err.message).to.include("Invalid Merkle proof");
            console.log("invalid merkle proof");
        }
    });

    it("verify proof success", async () => {
        const amount = new anchor.BN(3 * anchor.web3.LAMPORTS_PER_SOL);
        const index = new anchor.BN(2);
        const proof = tree.getProof(Number(index), luckyKeypair.publicKey, amount);
        // for (const p of proof) {
        //     console.log(`p: ${p.toString('hex')}`);
        //     const arr = Array.from(p);
        //     console.log(arr);
        // }
        // console.log(proof);

        const [_claimStatus, _claimStatusBump] = distributorUtils.generatePdaForClaimStatus(index, distributor, distributorProgram.programId);
        claimStatus = _claimStatus;
        console.log(`claimStatus: ${claimStatus.toBase58()}, bump: ${_claimStatusBump}`);
        // const node = BalanceTree.toNode(Number(index), luckyKeypair.publicKey, amount);
        // console.log(`node: ${node.toString('hex')}`);
        const result = BalanceTree.verifyProof(Number(index), luckyKeypair.publicKey, amount, proof, root);
        // console.log(`result: ${result}`);
        expect(result).to.equal(true);
        {
            const balanceBefore = await connection.getTokenAccountBalance(luckyAssociatedTokenAccount.address);
            console.log(`lucky balance before: ${Number(balanceBefore.value.amount)}`);

            const tx = await distributorProgram.methods.claim(
                index,
                amount,
                proof
            ).accounts({
                distributor,
                claimStatus,
                from: distributorAssociatedTokenAccount.address,
                to: luckyAssociatedTokenAccount.address,
                claimant: luckyKeypair.publicKey,
                payer: payer.publicKey,
            }).
                signers([payer, luckyKeypair])
                .rpc();
            console.log(`claim tx: ${tx}`);

            const balanceAfter = await connection.getTokenAccountBalance(luckyAssociatedTokenAccount.address);
            console.log(`lucky balance after: ${Number(balanceAfter.value.amount)}`);
            // expect(Number(balanceAfter.value.amount)).to.equal(Number(balanceBefore.value.amount) + Number(amount));
        }
    });

    it("check lucky balance", async () => {
        const balance = await connection.getTokenAccountBalance(luckyAssociatedTokenAccount.address);
        console.log(`lucky balance: ${Number(balance.value.amount)}`);
    });
});
