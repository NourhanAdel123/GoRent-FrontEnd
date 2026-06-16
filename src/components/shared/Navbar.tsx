"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

const pages = [
  { name: "الرئيسية", path: "/" },
  { name: "العقارات", path: "/properties" },
  { name: "عن الشركة", path: "/about" },
  { name: "تواصل معنا", path: "/contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            GoRent
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  href={page.path}
                >
                  <Typography
                    align="center"
                    sx={{ color: "text.primary", textDecoration: "none" }}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            GoRent
          </Typography>

          {/* Desktop Links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                href={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "text.primary",
                  display: "block",
                  fontWeight: 600,
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Auth section */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated && user ? (
              <>
                <Tooltip
                  title={
                    user?.role === "owner" ? "لوحة تحكم المالك" : "الملف الشخصي"
                  }
                >
                  <IconButton
                    component={Link}
                    href={
                      user?.role === "tenant"
                        ? "/Profile"
                        : user.role === "owner"
                          ? "/dashboard/owner"
                          : user.role === "admin"
                            ? "/dashboard/admin"
                            : user.role === "superadmin"
                              ? "/dashboard/superadmin"
                              : ""
                    }
                    sx={{ p: 0 }}
                  >
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/auth/login"
                sx={{ borderRadius: 2 }}
              >
                تسجيل الدخول
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
