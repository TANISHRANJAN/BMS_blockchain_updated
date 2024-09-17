import React, { useState, useEffect } from "react";
import Web3 from "web3";
import BankContract from "./contracts/Bank.json";

const App = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [bankContract, setBankContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      const web3Instance = new Web3(Web3.givenProvider || "http://localhost:8545");
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = BankContract.networks[networkId];
      const contractInstance = new web3Instance.eth.Contract(
        BankContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
      setWeb3(web3Instance);
      setBankContract(contractInstance);
    };
    init();
  }, []);

  const checkBalance = async () => {
    const balance = await bankContract.methods.checkBalance().call({ from: account });
    setBalance(web3.utils.fromWei(balance, "ether"));
  };

  const deposit = async () => {
    await bankContract.methods.deposit().send({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    checkBalance();
  };

  const withdraw = async () => {
    await bankContract.methods.withdraw(web3.utils.toWei("0.5", "ether")).send({ from: account });
    checkBalance();
  };

  return (
    <div>
      <h1>Banking DApp</h1>
      <p>Account: {account}</p>
      <p>Balance: {balance} ETH</p>
      <button onClick={checkBalance}>Check Balance</button>
      <button onClick={deposit}>Deposit 1 ETH</button>
      <button onClick={withdraw}>Withdraw 0.5 ETH</button>
    </div>
  );
};

export default App;
