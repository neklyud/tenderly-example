import {ethers} from "hardhat";
import {mine} from "@nomicfoundation/hardhat-network-helpers";
async function main() {
    await mine(101);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});