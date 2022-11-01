//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/hardhat/console.sol";

contract PolygonDomains {
    // mappingでString型の各KeyとAddressを結びつける
    mapping(string => address) public domainsToAddress;

    // stringとStringを紐づけるMapping
    mapping(string => string) public records;

    constructor() {
        console.log("Construct Success");
    }

    // msg.senderのアドレスに指定の名前のDomainで登録する
    function register(string calldata name) public {
        require(domainsToAddress[name] == address(0));
        domainsToAddress[name] = msg.sender;
        console.log("%s has regiered a domain", msg.sender);
    }

    // Nameに紐づいたDomainのアドレスを返す
    function getAddress(string calldata name) public view returns (address){
        return domainsToAddress[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        require(domainsToAddress[name] == msg.sender);
        records[name] = record;
    }

    function getRecord(string calldata name) public view returns(string memory) {
        return records[name];
    }
}

