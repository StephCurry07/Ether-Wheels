import FileCopyIcon from "@mui/icons-material/FileCopy";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { AppBar, Avatar, Button, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const Header = ({ role, balance, connectedAccount }) => {
  const _connectedAccount =
    connectedAccount.substring(0, 7) + "..." + connectedAccount.substring(37);
  const _balance = balance + " ETH";

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [roleAnchorEl, setRoleAnchorEl] = React.useState(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(connectedAccount);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRoleMenuOpen = (event) => {
    setRoleAnchorEl(event.currentTarget);
  };

  const handleRoleMenuClose = () => {
    setRoleAnchorEl(null);
  };

  return (
    <AppBar
      position="relative"
      sx={{
        background: "#1e1e1e",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",	
        padding: "8px",
      }}
    >
      <Toolbar
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="Logo"
          src="../images/ewLogo.jpeg"
          sx={{
            width: 60,
            height: 60,
            marginRight: 2,
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.1)",
              transition: "transform 0.2s ease-in-out",
            },
          }}
        />
        
        <div
          style={{
            marginRight: "auto",
            display: "inline-block",
            transition: "transform 0.2s ease-in-out",
            cursor: "pointer",
          }}
          onClick={handleRoleMenuOpen}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#f4f4f4",
              display: "inline-block",
              marginRight: 1,
              transition: "color 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#ffc107";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#f4f4f4";
            }}
          >
            Role : {role}
          </Typography>
        </div>
        
        <Menu
          anchorEl={roleAnchorEl}
          open={Boolean(roleAnchorEl)}
          onClose={handleRoleMenuClose}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#333",
              color: "#f4f4f4",
              minWidth: "220px",
            },
          }}
        >
          <MenuItem
            onClick={handleRoleMenuClose}
            sx={{
              padding: "10px 20px",
              transition: "background-color 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#444",
              },
              "& a": { color: "inherit", textDecoration: "none" },
            }}
          >
            <Link
              href={{
                pathname: "/register",
                query: { connectedAccount, balance, role },
              }}
            >
              <Typography variant="inherit">Change Role</Typography>
            </Link>
          </MenuItem>
        </Menu>

        <div
          style={{
            marginRight: "30px",
            display: "inline-block",
            transition: "transform 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Link
            href={{
              pathname: "/my-rides",
              query: { connectedAccount, balance, role },
            }}
            className="link-text"
            style={{
              textDecoration: "none",
              color: "#f4f4f4",
              fontWeight: "500",
              transition: "color 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#ffc107";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#f4f4f4";
            }}
          >
            My Rides
          </Link>
        </div>

        <Typography
          variant="body1"
          sx={{
            marginRight: "30px",
            color: "#f4f4f4",
            fontWeight: "500",
          }}
        >
          Balance : {_balance}
        </Typography>

        <IconButton
          size="large"
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}
          sx={{
            color: "#f4f4f4",
            transition: "transform 0.3s ease-in-out, color 0.3s ease-in-out",
            "&:hover": {
              color: "#ffc107",
              transform: "scale(1.1)",
            },
          }}
        >
          <PersonIcon sx={{ marginRight: 1, fontSize: 28 }} />
          <MenuIcon sx={{ fontSize: 28 }} />
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#333",
              color: "#f4f4f4",
              minWidth: "220px",
            },
          }}
        >
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 20px",
              transition: "background-color 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            <Tooltip title={connectedAccount} placement="right" arrow>
              <Typography sx={{ fontWeight: "500", fontSize: "1rem" }}>
                My Profile : {_connectedAccount}
              </Typography>
            </Tooltip>
            <Tooltip title="Copy Account" placement="left" arrow>
              <Button
                onClick={copyToClipboard}
                sx={{
                  color: "#ffc107",
                  minWidth: "auto",
                  padding: "6px",
                  "&:hover": { color: "#ffeb3b" },
                }}
              >
                <FileCopyIcon />
              </Button>
            </Tooltip>
          </MenuItem>

          <MenuItem
            sx={{
              padding: "10px 20px",
              transition: "background-color 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#444",
              },
              "& a": { color: "inherit", textDecoration: "none" },
            }}
            onClick={handleMenuClose}
          >
            <Link href="https://alchemy.com" passHref>
              <Typography variant="inherit">Add Balance</Typography>
            </Link>
          </MenuItem>

          <MenuItem
            sx={{
              padding: "10px 20px",
              transition: "background-color 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#444",
              },
              "& a": { color: "inherit", textDecoration: "none" },
            }}
            onClick={handleMenuClose}
          >
            <Link href="/" passHref>
              <Typography variant="inherit">Log Out</Typography>
            </Link>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
