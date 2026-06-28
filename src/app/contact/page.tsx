"use client";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export default function ContactPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        pb: 8,
      }}
    >
      {/* Hero Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #42a5f5 100%)",
          color: "white",
          py: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 800, mb: 2 }}
          >
            تواصل معنا
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ opacity: 0.9, fontWeight: 400, lineHeight: 1.8 }}
          >
            لديك سؤال أو استفسار؟ فريقنا جاهز لمساعدتك في أي وقت
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="lg" sx={{ mt: -4 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Grid container>
            {/* Contact Info Side */}
            <Grid
              size={{ xs: 12, md: 5 }}
            >
              <Box
                sx={{
                  p: { xs: 3, md: 5 },
                  height: "100%",
                  backgroundColor: "background.paper",
                  borderRight: { md: "1px solid" },
                  borderColor: { md: "divider" },
                }}
              >
                <ContactInfo />
              </Box>
            </Grid>

            {/* Contact Form Side */}
            <Grid
              size={{ xs: 12, md: 7 }}
            >
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <ContactForm />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
