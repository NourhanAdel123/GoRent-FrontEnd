"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NotificationMenu from "./NotificationMenu";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Maps a user role to its dashboard route.
function getDashboardPath(role?: string): string {
  switch (role) {
    case "owner":
      return "/dashboard/owner";
    case "admin":
    case "superadmin":
      return "/dashboard/admin";
    default:
      return "/Profile";
  }
}

// Maps a user role to its messages route.
function getMessagesPath(isAuthenticated: boolean, role?: string): string {
  if (!isAuthenticated) return "/auth/login";
  switch (role) {
    case "owner":
      return "/dashboard/owner/messages";
    case "tenant":
    default:
      return "/Profile?tab=messages";
  }
}

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Dynamically generate pages based on authentication state
  const pages = [
    { name: "الرئيسية", path: "/", icon: <HomeOutlinedIcon fontSize="small" /> },
    { name: "عن الشركة", path: "/about", icon: <InfoOutlinedIcon fontSize="small" /> },
    { name: "تواصل معنا", path: "/contact", icon: <EmailOutlinedIcon fontSize="small" /> },
    { name: "الرسائل", path: getMessagesPath(isAuthenticated, user?.role), icon: <MessageOutlinedIcon fontSize="small" /> },
  ].filter(page => {

    if (page.name === "الرئيسية" || page.name === "عن الشركة" || page.name === "تواصل معنا") return true;

    const isAdminOrSuperAdmin = user?.role === "admin" || user?.role === "superadmin";
    return !isAdminOrSuperAdmin;
  });

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
              priority={true}
              alt="GoRent"
              height={32}
              width={96}
              style={{ objectFit: "contain", width: "auto",height:"auto" }}
            />
          </Box>

          {/* Mobile Menu trigger */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
              sx={{
                transition: "background-color 0.2s ease",
                "&:hover": { bgcolor: (theme) => `${theme.palette.primary.main}1F` },
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              sx={{ '& .MuiDrawer-paper': { width: 280, borderRadius: "16px 0 0 16px" } }}
            >
              <Box
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
                sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                  <Image
                    src="/GoRent-logo.png"
                    priority={true}
                    alt="GoRent"
                    height={32}
                    width={96}
                    style={{ objectFit: "contain", width: "auto",height:"auto" }}
                  />
                </Box>
                <Divider />
                <List sx={{ px: 2, py: 2 }}>
                  {pages.map((page) => {
                    // Quick check if the path is active (handling Profile?tab=messages specially is tricky in pathname, but we'll exact match or handle simple paths)
                    const isActive = page.path !== '/auth/login' && (pathname === page.path || (page.path.includes('?') && pathname === page.path.split('?')[0] && typeof window !== 'undefined' && window.location.search === '?' + page.path.split('?')[1]));
                    
                    return (
                      <ListItem key={page.name} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                          component={Link}
                          href={page.path}
                          sx={{
                            borderRadius: 2,
                            bgcolor: isActive ? (theme) => `${theme.palette.primary.main}14` : 'transparent',
                            color: isActive ? 'primary.main' : 'text.primary',
                            "&:hover": { bgcolor: (theme) => `${theme.palette.primary.main}14` },
                          }}
                        >
                          <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                            {page.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography sx={{ fontWeight: isActive ? 700 : 500 }}>
                                {page.name}
                              </Typography>
                            } 
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </Drawer>
          </Box>

          {/* Mobile Logo — absolutely centered across the full toolbar width */}
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
              priority={true}
              alt="GoRent"
              height={28}
              width={84}
              style={{ objectFit: "contain", width: "auto",height:"auto" }}
            />
          </Box>

          {/* Desktop Links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4, gap: 1 }}>
            {pages.map((page) => {
              const isActive = page.path !== '/auth/login' && (pathname === page.path || (page.path.includes('?') && pathname === page.path.split('?')[0] && typeof window !== 'undefined' && window.location.search === '?' + page.path.split('?')[1]));
              
              return (
                <Button
                  key={page.name}
                  component={Link}
                  href={page.path}
                  sx={{
                    my: 2,
                    color: isActive ? "primary.main" : "text.primary",
                    display: "block",
                    fontWeight: 700,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 6,
                      insetInlineStart: "50%",
                      width: isActive ? "60%" : 0,
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
              );
            })}
          </Box>

          {/* Right side: auth section */}
          <Box sx={{ flexGrow: { xs: 1, md: 0 }, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
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