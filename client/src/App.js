import './App.css';

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/PolygonDomains.json";

const tld = ".plg";
const CONTRACT_ADDRESS = "0x576Ab2Cb1b5E5DF3dcdA2A31B7C1fe30830f183b";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("make sure you connected metamask");
        return
      } else {
        console.log("Metamask detected");
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("we found account", account);
        setCurrentAccount(account);
      } else {
        console.log("no authorized account")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const mintDomain = async () => {
    // ドメインがnullのときrunしません。
    if (!domain) {
      return;
    }
    // ドメインが3文字に満たない、短すぎる場合にアラートを出します。
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
    // ドメインの文字数に応じて価格を計算します。
    // 3 chars = 0.05 MATIC, 4 chars = 0.03 MATIC, 5 or more = 0.01 MATIC
    const price =
      domain.length === 3 ? "0.05" : domain.length === 4 ? "0.03" : "0.01";
    console.log("Minting domain", domain, "with price", price);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let tx = await contract.register(domain, {
          value: ethers.utils.parseEther(price),
        });
        // ミントされるまでトランザクションを待ちます。
        const receipt = await tx.wait();

        // トランザクションが問題なく実行されたか確認します。
        if (receipt.status === 1) {
          console.log(
            "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          // domain,recordをセットします。
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

          setRecord("");
          setDomain("");
        } else {
          alert("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja gif"
      />
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  const renderInputForm = () => {
    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            value={domain}
            placeholder="domain"
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className="tld"> {tld} </p>
        </div>
  
        <input
          type="text"
          value={record}
          placeholder="whats ur ninja power?"
          onChange={(e) => setRecord(e.target.value)}
        />
  
        <div className="button-container">
          <button className="cta-button mint-button" onClick={mintDomain}>
            Mint
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("get metamask");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected:", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <div className="container">

        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">Polygon Name Service</p>
              <p className="subtitle">Your immortal API on the blockchain!</p>
            </div>
          </header>
        </div>

        {!currentAccount && renderNotConnectedContainer()}
        {currentAccount && renderInputForm()}

        <div className="footer-container">
        </div>
      </div>
    </div>
  );
}

export default App;
