/*
 * @Author: pis piscarefree@gmail.com
 * @Date: 2024-11-27 21:39:01
 * @LastEditors: pis piscarefree@gmail.com
 * @LastEditTime: 2024-11-27 22:36:24
 * @FilePath: /merkle_distributor2/migrations/utils/spl.utils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createMint, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';

export async function createSPLToken(connection: Connection, payer: Keypair, mintAuthority: PublicKey = payer.publicKey, tokenAccount = Keypair.generate()) {
    const mint = await createMint(
        connection,
        payer,
        payer.publicKey,
        null,
        9,
        tokenAccount,
        {},
        TOKEN_PROGRAM_ID
    );

    return mint;
}

export async function getAssociatedTokenAddress(connection: Connection, payer: Keypair, mint: PublicKey, isPDA: boolean = false, owner: PublicKey = payer.publicKey) {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        owner,
        isPDA,
    );

    return tokenAccount;
}