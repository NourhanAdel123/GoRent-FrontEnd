"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import { contactService } from "../../services/contact";
import { ContactPayload } from "../../types/contact";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "الاسم مطلوب";
  if (!form.email.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "صيغة البريد الإلكتروني غير صحيحة";
  }
  if (!form.subject.trim()) errors.subject = "الموضوع مطلوب";
  if (!form.message.trim()) errors.message = "الرسالة مطلوبة";
  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload: ContactPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      };
      const response = await contactService.sendMessage(payload);
      setSuccessMessage(response.message);
      setForm(initialForm);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("حدث خطأ غير متوقع. يرجى المحاولة مجدداً.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (successMessage) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          py: 6,
          px: 4,
          textAlign: "center",
        }}
      >
        <CheckCircleOutlined
          sx={{ fontSize: 64, color: "success.main" }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
          تم إرسال رسالتك بنجاح!
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {successMessage}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setSuccessMessage(null)}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          إرسال رسالة أخرى
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}>
        أرسل لنا رسالة
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <TextField
          id="contact-name"
          label="الاسم الكامل"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          fullWidth
          required
          slotProps={{ htmlInput: { "aria-label": "full name" } }}
        />

        <TextField
          id="contact-email"
          label="البريد الإلكتروني"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          fullWidth
          required
          slotProps={{ htmlInput: { "aria-label": "email address" } }}
        />

        <TextField
          id="contact-subject"
          label="الموضوع"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          error={Boolean(errors.subject)}
          helperText={errors.subject}
          fullWidth
          required
          slotProps={{ htmlInput: { "aria-label": "subject" } }}
        />

        <TextField
          id="contact-message"
          label="الرسالة"
          name="message"
          value={form.message}
          onChange={handleChange}
          error={Boolean(errors.message)}
          helperText={errors.message}
          fullWidth
          required
          multiline
          rows={5}
          slotProps={{ htmlInput: { "aria-label": "message" } }}
        />

        <Button
          id="contact-submit"
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
          sx={{
            borderRadius: 2,
            py: 1.5,
            fontWeight: 700,
            fontSize: "1rem",
            alignSelf: "flex-start",
          }}
        >
          {loading ? "جارٍ الإرسال..." : "إرسال الرسالة"}
        </Button>
      </Box>
    </Box>
  );
}
