//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/hardhat/console.sol";

import {StringUtils} from "./utils/StringUtils.sol";

contract PolygonDomains {
    // TopLevelDomain
    string public tld;

    // mappingでString型の各KeyとAddressを結びつける
    mapping(string => address) public domainsToAddress;
    // stringとStringを紐づけるMapping
    mapping(string => string) public records;

    // 支払い機能追加のため、ContractをPayableで作る
    constructor(string memory _tld) payable {
        tld = _tld;
        console.log("Construct Success");
    }

    // ドメイン長によって支払い額を変える
    function price(string calldata name) public pure returns (uint256) {
        uint256 len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 3) {
            // 3文字のドメインの場合
            return 0.005 * 10**18; // 5 MATIC = 5 000 000 000 000 000 000 (18ケタ).あとでfaucetから少量もらう関係 0.005MATIC。
        } else if (len == 4) {
            //4文字のドメインの場合
            return 0.003 * 10**18; // 0.003MATIC
        } else {
            return 0.001 * 10**18; // 0.001MATIC
        }
    }

    // msg.senderのアドレスに指定の名前のDomainで登録する
    function register(string calldata name) public payable{
        require(domainsToAddress[name] == address(0));
        uint _price = price(name);

        // 所持金が足りているか確認する
        require(msg.value >= _price, "Not enough MATIC");

        domainsToAddress[name] = msg.sender;
        console.log("%s has regiered a domain", msg.sender);
    }

    // Nameに紐づいたDomainのアドレスを返す
    function getAddress(string calldata name) public view returns (address) {
        return domainsToAddress[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        require(domainsToAddress[name] == msg.sender);
        records[name] = record;
    }

    function getRecord(string calldata name)
        public
        view
        returns (string memory)
    {
        return records[name];
    }
}
