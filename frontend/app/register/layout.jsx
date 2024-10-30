"use client";
import React from "react";
import Header from "@components/Header";
import { useSearchParams } from "next/navigation";

const registerlayout = ({ children }) => {
  const searchParams = useSearchParams();
  const connectedAccount = searchParams.get("connectedAccount");
  const balance = searchParams.get("balance");
  const role = searchParams.get("role");
  return (
    <div>
      <Header
        connectedAccount={connectedAccount}
        balance={balance}
        role={role}
      />
      {children}
      <CopilotPopup
        instructions={"You are assisting the user in navigating and using EtherWheels, a web3-based ride-sharing platform that helps users connect as drivers and passengers for shared rides on Ethereum or Polygon. Provide guidance based on the user's role: 'driver' or 'passenger'. For example, help drivers with registration, car details entry, and ride creation, and help passengers find and book rides effectively. Always aim to enhance the user's experience by making the platform's eco-friendly and cost-sharing benefits clear."}
        labels={{
          title: "EtherBot",
          initial: "What can I help you with?",
        }}
      />
    </div>
  );
};

export default registerlayout;
