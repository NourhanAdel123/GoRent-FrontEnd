"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../hooks/useAuth";
import NotificationMenu from "./NotificationMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useColorMode } from "../../lib/ColorModeContext";

const pages = [
  { name: "عن الشركة", path: "/about" },
  { name: "تواصل معنا", path: "/contact" },
];

// Maps a user role to its dashboard route. Returns "" for roles with no
// dedicated dashboard (tenant goes to the public profile page instead).
function getDashboardPath(role?: string): string {
  switch (role) {
    case "owner":
      return "/dashboard/owner";
    case "admin":
      return "/dashboard/admin";
    // NOTE: no /dashboard/superadmin route exists yet in the app directory.
    // Add it before re-enabling this case, otherwise it will 404.
    // case "superadmin":
    //   return "/dashboard/superadmin";
    default:
      return "/Profile";
  }
}

function ThemeToggle() {
  const { mode, toggleColorMode } = useColorMode();
  return (
    <Tooltip title={mode === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        aria-label="toggle color mode"
      >
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Desktop Logo */}
          <Box component={Link} href="/" sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
            <Image
              src="/GoRent-logo.png"
              alt="GoRent"
              height={32}
              width={96}
              style={{ objectFit: "contain" }}
            />
          </Box>

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
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  href={page.path}
                >
                  <Typography align="center" sx={{ color: "text.primary", textDecoration: "none" }}>
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box component={Link} href="/" sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1, mr: 2 }}>
            <Image
              src="/GoRent-logo.png"
              alt="GoRent"
              height={28}
              width={84}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Desktop Links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                href={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "text.primary", display: "block", fontWeight: 700 }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Right side: theme toggle + auth section */}
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 1 }}>
            <ThemeToggle />

            {isAuthenticated && user ? (
              <>
                <NotificationMenu />
                <Tooltip
                  title={user?.role === "owner" ? "لوحة تحكم المالك" : "الملف الشخصي"}
                >
                  <IconButton
                    component={Link}
                    href={getDashboardPath(user?.role)}
                    sx={{ p: 0 }}
                  >
                    <Avatar
                      src={user.profileImage}
                      sx={{
                        bgcolor: "primary.main",
                        border: "2px solid",
                        borderColor: "primary.main",
                        boxShadow: (theme) =>
                          theme.palette.mode === "light"
                            ? "0px 2px 8px rgba(15, 23, 42, 0.15)"
                            : "0px 2px 8px rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      {!user.profileImage && (user.name ? user.name[0].toUpperCase() : "U")}
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