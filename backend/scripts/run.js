const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const domainContractFactory = await hre.ethers.getContractFactory("PolygonDomains");
    const domainContract = await domainContractFactory.deploy();
    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address);
    console.log("Contract deployed by:", owner.address);

    const txn = await domainContract.register("doomo");
    await txn .wait();

    const domainOwner = await domainContract.getAddress("doomo");
    console.log("Owner of Domain:", domainOwner);
}

const runMain = async() => {
    try {
        await main();
        process.exit(0);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

runMain();