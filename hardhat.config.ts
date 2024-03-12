import { HardhatUserConfig } from "hardhat/config";
import {vars} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@tenderly/hardhat-tenderly"
import "./tasks/deploy"

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    tenderly: {
      chainId: 1,
      url: process.env.TENDERLY_RPC_URL || ''
    }
  },
  tenderly: {
    project: vars.get("TENDERLY_PROJECT_SLUG"),
    username: vars.get("TENDERLY_ACCOUNT_SLUG"),
    accessKey: vars.get("TENDERLY_ACCESS_KEY"),
    token: vars.get("TENDERLY_TOKEN"),
    privateVerification: true
  }
};

export default config;
