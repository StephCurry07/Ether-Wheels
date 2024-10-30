"use client";
import { useSearchParams } from "next/navigation";
import Header from "@components/Header";

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
        instructions={"You are on the Create Ride page. Guide the user through creating a new ride by entering details such as starting location, destination, departure time and available seats, The cost will be calculated and displayed according to the fuel price of youre region. User has to sign transaction to list your ride. Inform the user that this ride will be visible to passengers on the Book Rides page and that the fuel cost will be shared among all passengers, making it cost-efficient and eco-friendly."}
        labels={{
          title: "EtherBot",
          initial: "What can I help you with?",
        }}
      />
      
    </div>
  );
};

export default registerlayout;
