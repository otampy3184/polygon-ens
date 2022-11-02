const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory("PolygonDomains");
  const domainContract = await domainContractFactory.deploy("plg");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  let txn = await domainContract.register("banana", {
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await txn.wait();
  console.log("Minted domain banana.plg");

  txn = await domainContract.setRecord("banana", "Am I a banana or a ninja??");
  await txn.wait();
  console.log("Set record for banana.plg");

  const address = await domainContract.getAddress("banana");
  console.log("Owner of domain banana:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();