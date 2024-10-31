import { CopilotPopup } from "@copilotkit/react-ui";

export function CopilotChat() {
  return (
    <>
      <CopilotPopup
        instructions={"You are assisting the user in navigating and using EtherWheels, a web3-based ride-sharing platform that helps users connect as drivers and passengers for shared rides on Ethereum or Polygon. Assist the user in connecting their MetaMask wallet to proceed. Ensure the user understands the importance of connecting a wallet to access EtherWheels features like registering as a driver or passenger, viewing rides, and booking options.Provide guidance based on the user's role: 'driver' or 'passenger'. For example, help drivers with registration, car details entry, and ride creation, and help passengers find and book rides effectively. Always aim to enhance the user's experience by making the platform's eco-friendly and cost-sharing benefits clear."}
        labels={{
          title: "EtherBot",
          initial: "What can I help you with?",
        }}
      />
    </>
  );
}