const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Deploying VeriVoice contract to Sepolia...");

    const VeriVoice = await hre.ethers.getContractFactory("VeriVoice");
    const veriVoice = await VeriVoice.deploy();

    await veriVoice.waitForDeployment();

    const address = await veriVoice.getAddress();
    console.log(`VeriVoice deployed to: ${address}`);

    // Save contract address and ABI to web/lib/contract.json
    const webLibDir = path.join(__dirname, "../..", "web", "lib");
    if (!fs.existsSync(webLibDir)) {
        fs.mkdirSync(webLibDir, { recursive: true });
    }

    const jsonPath = path.join(webLibDir, "contract.json");

    const artifact = await hre.artifacts.readArtifact("VeriVoice");
    const contractData = {
        address: address,
        abi: artifact.abi
    };

    fs.writeFileSync(jsonPath, JSON.stringify(contractData, null, 2));
    console.log(`Contract Address & ABI saved to ${jsonPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
