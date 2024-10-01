"use client";
import React from "react";
import Header from "@components/Header";
import { useSearchParams } from "next/navigation";
import Footer from "@components/Footer";

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
      
      <Footer />
    </div>
  );
};

export default registerlayout;
