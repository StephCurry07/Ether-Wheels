"use client";
import React from "react";
import Header from "@components/Header";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useSearchParams } from "next/navigation";

const myRidesLayout = ({ children }) => {
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
        instructions={"You are on the My Rides page, where users can see their current and past ride participations. If the user is a driver, display rides they have created. For passengers, show rides they have booked. Provide options to manage or view ride details and assist with any modifications if needed."}
        labels={{
          title: "EtherBot",
          initial: "What can I help you with?",
        }}
      />
      
    </div>
  );
};

export default myRidesLayout;
