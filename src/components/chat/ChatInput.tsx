"use client";

import React, { FormEvent, useState } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSend: (text: string) => Promise<void>;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  onTyping,
  disabled,
  placeholder = "اكتب رسالتك...",
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent | React.KeyboardEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSend(trimmed);
      setText("");
      onTyping?.(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    onTyping?.(event.target.value.length > 0);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={text}
        onChange={handleChange}
        onBlur={() => onTyping?.(false)}
        placeholder={placeholder}
        disabled={disabled || isSubmitting}
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "background.default",
          },
        }}
      />
      <IconButton
        type="submit"
        color="primary"
        disabled={!text.trim() || disabled || isSubmitting}
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "&:hover": { bgcolor: "primary.dark" },
          "&.Mui-disabled": {
            bgcolor: "action.disabledBackground",
            color: "action.disabled",
          },
          mb: 0.25,
          transform: "rotate(180deg)",
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" sx={{ transform: "rotate(180deg)" }} />
        ) : (
          <SendIcon />
        )}
      </IconButton>
    </Box>
  );
}
