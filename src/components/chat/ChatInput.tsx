"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";

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

  const handleSubmit = async (event: FormEvent) => {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-gray-200 bg-white px-4 py-3"
    >
      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          onTyping?.(event.target.value.length > 0);
        }}
        onBlur={() => onTyping?.(false)}
        placeholder={placeholder}
        rows={1}
        disabled={disabled || isSubmitting}
        className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-50"
      />

      <button
        type="submit"
        disabled={disabled || isSubmitting || !text.trim()}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="إرسال"
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </button>
    </form>
  );
}
