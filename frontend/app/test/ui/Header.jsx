import React from "react";

const ChatHeader = (props) => {
  const styles = {
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      color: "#333",
    },
    separator: {
      width: "100%",
      height: "2px",
      backgroundColor: "#ccc",
      marginBottom: "10px",
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      fontSize: "14px",
    },
    smallText: {
      fontSize: "12px",
      marginBottom: "2px",
    },
    statusContainer: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    statusDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "#4caf50", // Green dot indicating online status
    },
    assistantName: {
      fontWeight: "500",
      fontSize: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <p style={styles.smallText}>Chat with</p>
        <div style={styles.statusContainer}>
          <div style={styles.statusDot} />
          <p style={styles.assistantName}>{props.name}</p>
        </div>
      </div>
      <div style={styles.separator} />
    </div>
  );
};

export default ChatHeader;
