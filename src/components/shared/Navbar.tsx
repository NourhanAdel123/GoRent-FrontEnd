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
// import DarkModeIcon from "@mui/icons-material/DarkMode";
// import LightModeIcon from "@mui/icons-material/LightMode";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../hooks/useAuth";
import NotificationMenu from "./NotificationMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
// import { useColorMode } from "../../lib/ColorModeContext";

const pages = [
  { name: "عن الشركة", path: "/about" },
  { name: "تواصل معنا", path: "/contact" },
];

// Presentation-only icon lookup for the mobile dropdown — purely visual,
// doesn't touch the `pages` data itself.
const pageIcons: Record<string, React.ReactNode> = {
  "عن الشركة": <InfoOutlinedIcon fontSize="small" />,
  "تواصل معنا": <EmailOutlinedIcon fontSize="small" />,
};

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

// function ThemeToggle() {
//   const { mode, toggleColorMode } = useColorMode();
//   return (
//     <Tooltip title={mode === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}>
//       <IconButton
//         onClick={toggleColorMode}
//         color="inherit"
//         aria-label="toggle color mode"
//       >
//         {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
//       </IconButton>
//     </Tooltip>
//   );
// }

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
        <Toolbar disableGutters sx={{ position: "relative", minHeight: { xs: 64, md: 72 } }}>

          {/* Desktop Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 2,
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.04)" },
            }}
          >
            <Image
              src="/GoRent-logo.png"
              alt="GoRent"
              height={32}
              width={96}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Mobile Menu trigger */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                transition: "background-color 0.2s ease",
                "&:hover": { bgcolor: (theme) => `${theme.palette.primary.main}1F` },
              }}
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
              slotProps={{
                paper: {
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 3,
                    boxShadow: (theme) =>
                      theme.palette.mode === "light"
                        ? "0 12px 32px rgba(15, 23, 42, 0.18)"
                        : "0 12px 32px rgba(0, 0, 0, 0.6)",
                    p: 0.75,
                  },
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  href={page.path}
                  sx={{
                    borderRadius: 2,
                    gap: 1.25,
                    py: 1.1,
                    color: "text.primary",
                    "&:hover": { bgcolor: (theme) => `${theme.palette.primary.main}14` },
                  }}
                >
                  <Box sx={{ display: "flex", color: "primary.main" }}>{pageIcons[page.name]}</Box>
                  <Typography sx={{ fontWeight: 600 }}>{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo — absolutely centered across the full toolbar width,
              regardless of how wide the menu icon / right-side actions are. */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: { xs: "flex", md: "none" },
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Image
              src="/GoRent-logo.png"
              alt="GoRent"
              height={28}
              width={84}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Desktop Links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4, gap: 1 }}>
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
                  fontWeight: 700,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 6,
                    insetInlineStart: "50%",
                    width: 0,
                    height: 2,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                    transform: "translateX(-50%)",
                    transition: "width 0.2s ease",
                  },
                  "&:hover::after": { width: "60%" },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Right side: theme toggle + auth section */}
          <Box sx={{ flexGrow: { xs: 1, md: 0 }, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
            {/* <ThemeToggle /> */}

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
                        transition: "transform 0.15s ease",
                        boxShadow: (theme) =>
                          theme.palette.mode === "light"
                            ? "0px 2px 8px rgba(15, 23, 42, 0.15)"
                            : "0px 2px 8px rgba(0, 0, 0, 0.4)",
                        "&:hover": { transform: "scale(1.06)" },
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
                sx={{ borderRadius: 50, px: 3, fontWeight: 700 }}
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