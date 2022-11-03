import './App.css';

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/PolygonDomains.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");

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

        {renderNotConnectedContainer()}

        <div className="footer-container">
        </div>
      </div>
    </div>
  );
}

export default App;
