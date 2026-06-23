"use client";

import Image from "next/image";
import { getInitials, getParticipantAvatar } from "../../lib/chatUtils";

interface ChatAvatarProps {
  name?: string;
  profileImage?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
};

export default function ChatAvatar({
  name,
  profileImage,
  size = "md",
}: ChatAvatarProps) {
  const avatar = getParticipantAvatar({ profileImage });
  const sizeClass = SIZE_MAP[size];

  if (avatar) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full bg-gray-100 ${sizeClass}`}
      >
        <Image
          src={avatar}
          alt={name || "مستخدم"}
          fill
          className="object-cover"
          unoptimized={avatar.includes("cloudinary.com")}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ${sizeClass}`}
    >
      {getInitials(name)}
    </div>
  );
}
