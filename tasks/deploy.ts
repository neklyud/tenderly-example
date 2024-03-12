import {task} from "hardhat/config";
import {vars} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import * as tdly from '@tenderly/hardhat-tenderly';
import axios from "axios";

export const TASK_TENDERLY_DEPLOY_DEFII = "deploy:tenderly";
export const TASK_CREATE_FORK = "createFork";


tdly.setup({automaticVerifications: true})

const TENDERLY_API = 'https://api.tenderly.co/api/v1/account'

task(TASK_CREATE_FORK, "Create tenderly fork").addParam(
    "chain", "Chain ID of network to fork",
).setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const ACCOUNT_SLUG = vars.get("TENDERLY_ACCOUNT_SLUG");
    const PROJECT_SLUG = vars.get("TENDERLY_PROJECT_SLUG");
    const ACCESS_KEY = vars.get("TENDERLY_ACCESS_KEY")

    const result = await axios.post(
        `${TENDERLY_API}/${ACCOUNT_SLUG}/project/${PROJECT_SLUG}/fork`,
        {
            network_id: taskArgs.chain,
        },
        {
            headers: {
                'X-Access-Key': ACCESS_KEY as string,
            }
        }
    )
    if (result.status != 201) {
        throw new Error("Fork creation was not success.");
    }
    return result.data['simulation_fork']['rpc_url']
})

task(TASK_TENDERLY_DEPLOY_DEFII, "Deploy defii into tenderly")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const fork: string = await hre.run(TASK_CREATE_FORK, {"chain": "1"})
        hre.config.networks.tenderly.url = fork;

        const artifact = await hre.artifacts.readArtifact("Lock")
        const [deployer] = await hre.ethers.getSigners()
        console.log(`Deploing from: ${deployer.address}`)

        const logic = await hre.ethers.deployContract(`${artifact.sourceName}:${artifact.contractName}`)
        await logic.waitForDeployment()
        console.log(`${artifact.contractName}: ${await logic.getAddress()}`)
        return await logic.getAddress();
    })