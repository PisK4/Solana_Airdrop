
import * as anchor from "@coral-xyz/anchor";
import { BalanceTree } from "../src/utils";
import fs from "fs";

const gUserList = [
    'pisxReuiFWqib2JZno8MUtM6FyNe46er3s4YTHTzJLP',
    'sosJ8CLsG9tadAeVUH4ZcidgKNL9qubZWGTRprgbCVH',
    'sosMrprj6yvZ5tGgWWZsKK2xnxNPFQSYAiHdkFQU1b2',
    'sosyUAvBZEdyzJbcEmZT55ywKzSBzUoQiEG1ojTMBLw',
    'sosvDxJuvfoT124VwwYr3wKdKriEFhFqvoYQ1nJtCrB',
    'sosbMPm9JgCnPrgrAPLfg1yZqfeiqxmkM4GiZtuGLEx',
    '6qrp8Pv3YM9uuP4Bi17rjEsS9E8crLpfMwVLGvNRQPPr',
    'TFyK9UNKLHLUhpeALWv3L6fizWBbKh5vzh2HEagpqt4',
    'CNhMVyL1fZu6VEW9Bu16mzzuupZ3FXmgYRnKirwShAAR',
    '9uLCpteXSBQafbPvikjSz3tUMNSdsaWDWhb3deAx5qqw',
    '7dMwTsEgytWosGWJG7JbhufVFpi3v7GsTiFP2ZCtysXy',
    '53fpGh2EWreks74Ry8nboZzFDkg7sUEPBQKdbtRd9Vg6',
    'AaaURoQ45WWA8YcYETPvhhNSMorEHWrcb4xiGuGdmYXU',
    '31rHrgZUk7WEntL5z6hf3hMfvbcBzJL3J3NLGwiorWKF',
    '7hSuPxdSBHrCvtQ9idBFCMzHhHxrx4gQK4xgStRXHhVR',
    'CtV8Dbkfa2cAuuccqBcYPjSvDJ9E1DENirA5GV7L3yb8',
    'GjkSmrHVUhXMYvy1yFMvUGqxuBdbxBxiZgiiegJdi4CY',
    'GbGw8QeB7RXuRfvoM34v5qRmXqSd5VpLjNMgdW7UAAYF',
    'GYA9udFbjFFmg4pFtR5KQZJRPK9HS4FsAxHT5sdzHBSf',
    '5hdSg4GJAQGDqywzKG5eDQSDWZWTThqd3MduWVhxuLRE',
    'FA1qnqZWMptKtmyQ4DQvufH5tiYentEyvStPehsJfCTk',
    'A6btmrJsQhxQ6axk4Z4TqAtZ97oZq9urT6CZamVfc6bH'
];

interface UserProofInfo {
    user: anchor.web3.PublicKey;
    index: number;
    amount: number;
    proof: string[];
}

export function buildTree() {
    let userList = gUserList.map((user) => new anchor.web3.PublicKey(user));
    // console.log(userList);
    let amountArray = Array(userList.length).fill(0);
    amountArray.forEach((amount, index) => {
        amountArray[index] = (100 + index);
    });
    // console.log(amountArray);
    const tree = new BalanceTree(userList.map((user, index) => ({ account: user, amount: (amountArray[index]) })));
    const root = tree.getRoot();
    // console.log(root);
    const user = new anchor.web3.PublicKey(gUserList[0]);
    const amount = new anchor.BN(100);
    const index = new anchor.BN(0);
    // const proof = tree.getProof(Number(index), user, amount);
    const proofs = [];
    for (let i = 0; i < userList.length; i++) {
        proofs.push(tree.getProof(Number(i), userList[i], amountArray[i]));
    }
    const node = BalanceTree.toNode(Number(0), new anchor.web3.PublicKey(gUserList[0]), new anchor.BN(100));
    const result = BalanceTree.verifyProof(Number(0), new anchor.web3.PublicKey(gUserList[0]), new anchor.BN(100), proofs[0], root);
    if (result != true) {
        throw new Error("verify proof failed");
    } else {
        console.log("verify proof success");
    }

    const userProofInfo: UserProofInfo[] = [];
    for (let i = 0; i < userList.length; i++) {
        userProofInfo.push({ user: userList[i], index: i, amount: amountArray[i], proof: proofs[i].map((p) => '0x' + p.toString('hex')) });
    }
    // fs.writeFileSync("./migrations/userProofInfo.json", JSON.stringify(userProofInfo, null, 2));

    return root;
}

// buildTree();