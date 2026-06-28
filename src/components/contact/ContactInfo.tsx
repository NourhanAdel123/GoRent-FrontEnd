"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface InfoItem {
  icon: React.ReactNode;
  title: string;
  details: string[];
}

const infoItems: InfoItem[] = [
  {
    icon: <EmailIcon sx={{ fontSize: 28 }} />,
    title: "البريد الإلكتروني",
    details: ["support@gorent.com"],
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 28 }} />,
    title: "الهاتف",
    details: ["+20 100 000 0000"],
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 28 }} />,
    title: "العنوان",
    details: ["القاهرة، مصر"],
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 28 }} />,
    title: "ساعات العمل",
    details: ["الأحد - الخميس: 9 ص - 6 م", "الجمعة - السبت: مغلق"],
  },
];

export default function ContactInfo() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
        تواصل معنا
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.8 }}>
        نحن هنا لمساعدتك! لا تتردد في التواصل معنا عبر أي من الطرق التالية أو
        استخدم النموذج لإرسال رسالتك مباشرة.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {infoItems.map((item) => (
          <Box
            key={item.title}
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "flex-start",
              p: 2,
              borderRadius: 2,
              backgroundColor: "action.hover",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 2,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                {item.title}
              </Typography>
              {item.details.map((detail) => (
                <Typography key={detail} variant="body2" sx={{ color: "text.secondary" }}>
                  {detail}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
