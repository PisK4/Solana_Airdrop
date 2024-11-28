/*
 * @Author: pis piscarefree@gmail.com
 * @Date: 2024-11-28 04:12:16
 * @LastEditors: pis piscarefree@gmail.com
 * @LastEditTime: 2024-11-28 10:12:18
 * @FilePath: /merkle_distributor2/migrations/spl.mint.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { mintTo } from "@solana/spl-token";
import * as util from "./utils/distributor.utils";
import * as splUtils from "./utils/spl.utils";
import * as anchor from "@coral-xyz/anchor";


// token mint: Cp5SEwr4qmpYeTfZpJzib6AZrm3y6niFcFUiudUD3h9K
// distributor pda: 8DWw7Tey8VyxeZLKPUJhZaeU9iAhycnLnaAmGmc6pWcw
export async function main() {
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"));
    const tokenAccountKey = anchor.web3.Keypair.generate();
    console.log(`tokenAccountKey: ${tokenAccountKey.publicKey.toBase58()}`);
    const tokenOwner = util.ownerKeypair;
    const mint = new anchor.web3.PublicKey("Cp5SEwr4qmpYeTfZpJzib6AZrm3y6niFcFUiudUD3h9K");
    const distributor = new anchor.web3.PublicKey("8DWw7Tey8VyxeZLKPUJhZaeU9iAhycnLnaAmGmc6pWcw");
    // const mint = await splUtils.createSPLToken(connection, tokenOwner, tokenOwner.publicKey, tokenAccountKey);
    console.log(`mint: ${mint.toBase58()}`);

    {
        const mintAmount = 456 * anchor.web3.LAMPORTS_PER_SOL;
        let distributorAssociatedTokenAccount = await splUtils.getAssociatedTokenAddress(connection, tokenOwner, mint, true, distributor);
        // console.log(distributorAssociatedTokenAccount);
        console.log(`distributorATAAddress: ${distributorAssociatedTokenAccount.address.toBase58()}`);
        // mint token
        await mintTo(
            connection,
            tokenOwner,
            mint,
            distributorAssociatedTokenAccount.address,
            tokenOwner,
            mintAmount,
        )

        // check balance
        const distributorBalance = await connection.getTokenAccountBalance(distributorAssociatedTokenAccount.address);
        console.log(`distributor balance: ${Number(distributorBalance.value.amount) / anchor.web3.LAMPORTS_PER_SOL}`);

    }
}

main();