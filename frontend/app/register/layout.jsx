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
    </div>
  );
};

export default registerlayout;
