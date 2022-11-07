import './App.css';

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "./utils/PolygonDomains.json";

import polygonLogo from "./assets/polygonlogo.png";
import ethLogo from "./assets/ethlogo.png"
import { networks } from "./utils/networks";

const tld = ".plg";
const CONTRACT_ADDRESS = "0x576Ab2Cb1b5E5DF3dcdA2A31B7C1fe30830f183b";

function App() {
  const [mints, setMints] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useStete(false);
  const [network, setNetwork] = useState("");
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

      const chainId = await ethereum.requret({ method: 'eth_chainId' });
      setNetwork(networks[chainId]);

      ethereum.on('chainChainged', handleChainChanged);

      function handleChainChanged(_chainId) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const mintDomain = async () => {
    if (!domain) {
      return;
    }
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
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
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          console.log(
            "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log("Record set! https://mumbai.polygonscan.com/tx/" + tx.hash);

          setTimeout(() => {
            fetchMints();
          }, 2000);

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

  const updateDomain = async () => {
    if (!record || !domain) { return }
    setLoading(true);
    console.log("Updating domain", domain, "with record", record);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        let tx = await contract.setRecord(domain, record);
        await tx.wait();
        console.log("Record set https://mumbai.polygonscan.com/tx/" + tx.hash);

        fetchMints();
        setRecord(' ');
        setDomain(' ');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  const fetchMints = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        const names = await contract.getAllNames();

        const mintRecords = await Promise.all(names.map(async (name) => {
          const mintRecord = await contract.records(name);
          const owner = await contract.domains(name);
          return {
            id: names.indexOf(name),
            name: name,
            record: mintRecord,
            owner: owner,
          };
        }));

        console.log("MINTS FETCHED", mintRecords);
        setMints(mintRecords);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

useEffect(() => {
  if (network === 'Polygon Mumbai Testnet') {
    fetchMints();
  }
}, [currentAccount, network]);

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
  if (network !== 'Polygon Mumbai Testnet') {
    return (
      <div className="connect-wallet-container">
        <p>Please connect to the Polygon Mumbai Testnet</p>
      </div>
    )
  }
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
      {editing ? (
        <div className="button-container">
          <button className='cta-button mint-button' disabled={loading} onClick={updateDomain}>
            Set record
          </button>
          <button className='cta-button mint-button' onClick={() => { setEditing(false) }}>
            Cancel
          </button>
        </div>
      ) : (
        <button className='cta-button mint-button' disabled={loading} onClick={mintDomain}>
          Mint
        </button>
      )}
    </div>
  );
};

const renderMints = () => {
  if (currentAccount && mints.length > 0) {
    return (
      <div className='mint-container'>
        <p className='subtitile'>Recently minted domains</p>
        <div className='mint-list'>
          {mints.map((mint, index) => {
            return (
              <div className='mint-item' key={index}>
                <div className='mint-row'>
                  <a className='ling' href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${mint.id}`} target="_blank" rel="noopener noreferrer">
                    <p className='underlined'>{' '}{mint.name}{tld}{' '}</p>
                  </a>
                  {mint.owner.toLowerCase() === currentAccount.toLowerCase() ?
                    <button className='edit-button' onClick={() => editRecord(mint.name)}>
                      <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                    </button>
                    :
                    null
                  }
                </div>
                <p> {mint.record}</p>
              </div>)
          })}
        </div>
      </div>
    );
  }
}

const editRecord = (name) => {
  console.log("Editing record for", name);
  setEditing(true);
  setDomain(name);
}

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
          <div className='right'>
            <img alt="Network logo" className='logo' src={network.includes("Polygon") ? polygonLogo : ethLogo} />
            {currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not Connected</p>}
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