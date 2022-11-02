import './App.css';

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/PolygonDomains.json";

function App() {
  const [ currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum) {
        console.log("make sure you connected metamask");
        return
      } else {
        console.log("Metamask detected");
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0){
        const account = accounts[0];
        console.log("we found account", account);
        setCurrentAccount(account);
      } else {
        console.log("no authorized account")
      }
    } catch(error){
      console.log(error);
    }
  }

  return (
    <div className="App">

    </div>
  );
}

export default App;
