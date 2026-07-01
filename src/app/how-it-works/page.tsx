'use client';

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { alpha } from "@mui/material/styles";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HomeIcon from "@mui/icons-material/Home";
import AddHomeIcon from "@mui/icons-material/AddHome";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function HowItWorksPage() {
  const tenantSteps = [
    {
      title: "البحث والاستكشاف",
      description: "استخدم محرك البحث المتقدم الخاص بنا لتصفح آلاف العقارات المتاحة للإيجار. يمكنك تصفية النتائج حسب الموقع، السعر، وعدد الغرف لتجد ما يناسبك تماماً.",
      icon: <SearchIcon fontSize="large" color="primary" />
    },
    {
      title: "التواصل الآمن",
      description: "بمجرد العثور على العقار المناسب، يمكنك التواصل مع المالك مباشرة من خلال نظام المراسلة الداخلي الآمن لدينا لطرح الأسئلة أو تحديد موعد للزيارة.",
      icon: <ChatIcon fontSize="large" color="primary" />
    },
    {
      title: "الحجز والاتفاق",
      description: "بعد الاتفاق مع المالك، يمكنك تقديم طلب حجز رسمي عبر المنصة. تتيح لك goRent مراجعة تفاصيل العقد بشكل شفاف قبل الإقدام على أي خطوة.",
      icon: <AssignmentTurnedInIcon fontSize="large" color="primary" />
    },
    {
      title: "الانتقال للسكن",
      description: "مبروك! بمجرد اكتمال الإجراءات وتوقيع العقد، استلم مفاتيح عقارك الجديد واستمتع بتجربة سكن مريحة بدعم مستمر من فريقنا.",
      icon: <HomeIcon fontSize="large" color="primary" />
    }
  ];

  const landlordSteps = [
    {
      title: "إضافة العقار",
      description: "قم بإنشاء حسابك كمالك وأضف تفاصيل عقارك بكل سهولة. قم برفع صور احترافية، حدد السعر، واكتب وصفاً جذاباً لجذب المستأجرين المحتملين.",
      icon: <AddHomeIcon fontSize="large" color="secondary" />
    },
    {
      title: "استلام الطلبات",
      description: "ستتلقى إشعارات فورية عندما يبدي المستأجرون اهتمامهم بعقارك. يمكنك مراجعة ملفاتهم الشخصية والتواصل معهم لاختيار المستأجر الأنسب.",
      icon: <NotificationsActiveIcon fontSize="large" color="secondary" />
    },
    {
      title: "إتمام عملية الإيجار",
      description: "أتمم الاتفاق بسلاسة وشفافية. توفر المنصة إمكانية توثيق الاتفاقيات إلكترونياً لضمان حقوق كلا الطرفين وتقليل المعاملات الورقية.",
      icon: <HandshakeIcon fontSize="large" color="secondary" />
    },
    {
      title: "إدارة المدفوعات والعقود",
      description: "تابع حالة مدفوعات الإيجار ومواعيد التجديد من خلال لوحة التحكم الخاصة بك. اجعل إدارة أملاكك العقارية عملية رقمية بالكامل.",
      icon: <AccountBalanceWalletIcon fontSize="large" color="secondary" />
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', pt: 12, pb: 8, px: 2, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
            كيف تعمل منصة GoRent؟
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.8 }}>
            سواء كنت تبحث عن منزل أحلامك أو ترغب في تأجير عقارك، صممنا العملية لتكون سهلة، سريعة، وآمنة تماماً.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        {/* Tenants Section */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
              للمستأجرين: طريقك نحو سكن مريح
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              خطوات بسيطة تفصلك عن إيجاد مسكنك القادم. نحن هنا لنوفر لك خيارات متنوعة تناسب ميزانيتك واحتياجاتك.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {tenantSteps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: 2, '&:hover': { boxShadow: 6 }, transition: '0.3s' }}>
                  <Box sx={(theme) => ({ bgcolor: alpha(theme.palette.primary.main, 0.1), p: 2, borderRadius: '50%', display: 'inline-flex', mb: 3 })}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Landlords Section */}
        <Box>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
              لملاك العقارات: أدر عقارك باحترافية
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              نعلم أن تأجير العقار قد يكون مهمة شاقة. مع goRent، نوفر لك الأدوات اللازمة للوصول للمستأجرين الموثوقين بسهولة.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {landlordSteps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: 2, '&:hover': { boxShadow: 6 }, transition: '0.3s', borderTop: '4px solid', borderColor: 'secondary.main' }}>
                  <Box sx={(theme) => ({ bgcolor: alpha(theme.palette.secondary.main, 0.1), p: 2, borderRadius: '50%', display: 'inline-flex', mb: 3 })}>
                    {step.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {step.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
