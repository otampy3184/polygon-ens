//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/hardhat/console.sol";

contract PolygonDomains {
    // mappingでString型の各KeyとAddressを結びつける
    mapping(string => address) public domainsToAddress;

    constructor() {
        console.log("Construct Success");
    }

    // msg.senderのアドレスに指定の名前のDomainで登録する
    function register(string calldata name) public {
        domainsToAddress[name] = msg.sender;
        console.log("%s has regiered a domain", msg.sender);
    }

    // Nameに紐づいたDomainのアドレスを返す
    function getAddress(string calldata name) public view returns (address){
        return domainsToAddress[name];
    }
}

