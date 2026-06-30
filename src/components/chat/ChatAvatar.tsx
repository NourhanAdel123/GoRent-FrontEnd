"use client";

import { Avatar } from "@mui/material";

interface ChatAvatarProps {
  name: string;
  profileImage?: string;
  size?: "sm" | "md" | "lg";
}

export default function ChatAvatar({
  name,
  profileImage,
  size = "md",
}: ChatAvatarProps) {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };
  
  const fontSizeMap = {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
  };

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <Avatar
      src={profileImage || undefined}
      alt={name || "User"}
      sx={{
        width: sizeMap[size],
        height: sizeMap[size],
        bgcolor: "primary.main",
        color: "primary.contrastText",
        fontSize: fontSizeMap[size],
        fontWeight: 600,
      }}
    >
      {!profileImage && initial}
    </Avatar>
  );
}
