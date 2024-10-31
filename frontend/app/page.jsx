"use client";

import { useEffect, useState } from "react";
import PrimaryButton from "@components/PrimaryButton";
import Link from "next/link";
import Image from "next/image";
import styles from './styles/user-registration.module.css';
import { toast, ToastContainer } from 'react-toastify';
import ToastService from '@utils/toastService'; // Import the toast service

const HomePage = () => {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [isGuest, setIsGuest] = useState(false);
  

  const handleAccounts = async (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log("We have an authorized account: ", account);
      const balanceHex = await ethereum.request({
        method: "eth_getBalance",
        params: [account, "latest"], // 'latest' for latest block
      });

      // Display balance
      const balanceDec = parseInt(balanceHex, 16) / Math.pow(10, 18);
      setBalance(balanceDec.toFixed(4));
      setConnectedAccount(account);
    } else {
      console.log("No authorized accounts yet");
    }
  };

  const getConnectedAccount = async () => {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }

    if (ethereum) {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      await handleAccounts(accounts);
    }
  };
  useEffect(() => {
    getConnectedAccount();
  }, []);

  const InstallMetaMask = () => {
    const handleInstallClick = () => {
      window.open('https://metamask.io/download.html', '_blank');
    };
  
    return (
      <div className="metaChecker">
      <p className="metaInstallText">Please install MetaMask to connect to this site</p>
      <button className="btn-install"
        onClick={handleInstallClick}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'blue'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
        Install MetaMask
      </button>
    </div>
    );
  };

  const connectAccount = async () => {
    if (!ethereum) {
      ToastService.error("MetaMask is required to connect an account");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    await handleAccounts(accounts);
    ToastService.success("Connected to MetaMask");
  };

  const loginAsGuest = () => {
    setIsGuest(true);
  };

  if (!ethereum && !isGuest) {
    return (
      <>
        <InstallMetaMask />
        <button onClick={loginAsGuest}>Continue as Guest</button>
      </>
    );
  }

  return (
    <div className="imageContainer">
      <ToastContainer />
      <Image
        src="/images/carpooling.svg"
        alt="Carpooling home page image"
        width={200}
        height={200}
        className="image"
      />
      {!connectedAccount && !isGuest ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft:"30px",
          }}
        >
          <h1>Welcome to EtherWheels - A Ride Sharing Platform</h1>
          <p>
            Want to do something nice for the environment and also save some
            money ? <br />
            Don't worry we got you !! But before we begin we need to connect
            your <br />
            metamask wallet so go ahead and do that and we'll see you on the
            other side.
          </p>
          <div className="login-buttons"  style={{ display: "flex"}}>
            <PrimaryButton onClick={connectAccount}  style={{marginRight:"10px"}}>
              Connect MetaMask Wallet
            </PrimaryButton>
            <PrimaryButton onClick={loginAsGuest}  style={{marginLeft:"10px"}}>
              Continue as Guest <br />
              (<span style={{ fontSize: "small", color: "red" }}>backend won't work</span>)
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <h1>Welcome to EtherWheels</h1>
          <p>
            Great! Now you can click on the link below to Register yourselves{" "}
            <br />
            as either a Driver or a Passenger for the current session and get
            started.
          </p>
          <p>Connected Account: {connectedAccount || "Guest User"}</p>
          <Link
            href={{
              pathname: "/register",
              query: {
                connectedAccount: connectedAccount || "guest",
                balance: balance,
                role: "not chosen",
              },
            }}
          >
            Register yourselves for the session
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
