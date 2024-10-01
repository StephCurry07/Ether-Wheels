import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <AppBar 
      position="static" 
      className="footer"  
      sx={{ 
        backgroundColor: "#222", 
        color: "#f4f4f4", 
        height: "72px",
        boxShadow: "none",
        borderTop: "2px solid #f4f4f4", // Add a top border for separation
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", height: "100%" }}>
        <Typography variant="body2" sx={{ padding: "10px" }}>
          &copy; {new Date().getFullYear()} Ether Wheels. All rights reserved.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              padding: "10px", 
              "&:hover": { textDecoration: "underline", color: "#ffcc00" }, // Hover effect
              cursor: "pointer" 
            }}
            onClick={() => window.location.href='/privacy-policy'} // Navigate on click
          >
            Privacy Policy
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              padding: "10px", 
              "&:hover": { textDecoration: "underline", color: "#ffcc00" }, // Hover effect
              cursor: "pointer" 
            }}
            onClick={() => window.location.href='/terms-of-service'} // Navigate on click
          >
            Terms of Service
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
