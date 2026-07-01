'use client';

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = {
  general: [
    {
      question: "ما هي منصة GoRent؟",
      answer: "GoRent هي منصة إلكترونية رائدة تهدف إلى تسهيل عملية تأجير العقارات. نحن نربط بين ملاك العقارات والمستأجرين المحتملين في بيئة آمنة وشفافة تضمن حقوق كلا الطرفين."
    },
    {
      question: "هل التسجيل في المنصة مجاني؟",
      answer: "نعم، التسجيل في منصة GoRent مجاني تماماً سواء كنت تبحث عن عقار للإيجار."
    },
    {
      question: "كيف أضمن أمان بياناتي الشخصية؟",
      answer: "نحن نولي أمان بياناتك أهمية قصوى. نستخدم أحدث تقنيات التشفير لضمان سرية معلوماتك الشخصية، ولا نشاركها مع أي طرف ثالث دون موافقتك الصريحة."
    }
  ],
  tenants: [
    {
      question: "كيف يمكنني البحث عن عقار مناسب؟",
      answer: "يمكنك استخدام شريط البحث في الصفحة الرئيسية لتحديد المدينة أو المنطقة، ثم استخدام الفلاتر المتقدمة لتحديد نطاق السعر، عدد الغرف، ونوع العقار لتصل إلى النتائج التي تلبي احتياجاتك."
    },
    // {
    //   question: "هل هناك رسوم خفية عند استئجار عقار عبر المنصة؟",
    //   answer: "لا توجد أي رسوم خفية. جميع الأسعار المعروضة على المنصة واضحة وشفافة. سيتم إعلامك بأي رسوم إضافية (مثل التأمين أو رسوم الخدمة) قبل تأكيد الحجز."
    // },
    {
      question: "كيف أتواصل مع مالك العقار؟",
      answer: "بمجرد العثور على عقار يعجبك، يمكنك النقر على زر 'تواصل مع المالك' لإرسال رسالة مباشرة من خلال نظام المراسلة الداخلي الآمن الخاص بنا."
    },
    {
      question: "ماذا أفعل إذا واجهت مشكلة في العقار بعد الانتقال؟",
      answer: "يمكنك التواصل مع المالك مباشرة عبر المنصة لحل المشكلة. إذا لم يتم الاستجابة لك، فريق دعم العملاء لدينا متواجد لمساعدتك في أي وقت."
    }
  ],
  landlords: [
    {
      question: "كيف يمكنني عرض عقاري للإيجار؟",
      answer: "بعد تسجيل الدخول كمالك، اذهب إلى لوحة التحكم الخاصة بك وانقر على 'إضافة عقار'. املأ التفاصيل المطلوبة، أضف صوراً عالية الجودة، وحدد السعر وشروط الإيجار."
    },
    {
      question: "كيف يتم التحقق من هوية المستأجرين؟",
      answer: "نحن نشجع جميع المستخدمين على توثيق حساباتهم. يمكنك أيضاً مراجعة التقييمات السابقة للمستأجرين وطلب الوثائق اللازمة عبر نظام المراسلة الخاص بنا قبل الموافقة على طلب الإيجار."
    },
    {
      question: "هل تتدخل المنصة في عقود الإيجار؟",
      answer: "نحن نوفر نماذج عقود استرشادية لضمان حقوقك، ولكننا لا نتدخل في الشروط الخاصة التي تتفق عليها مع المستأجر. أنت المتحكم الكامل في عقارك وشروطه."
    }
  ]
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`faq-tabpanel-${index}`}
      aria-labelledby={`faq-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const renderFaqSection = (faqList: { question: string; answer: string }[]) => {
    return faqList.map((faq, index) => (
      <Accordion key={index} sx={{ mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 1, border: '1px solid', borderColor: 'divider' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'text.primary', p: 2 }}
        >
          {faq.question}
        </AccordionSummary>
        <AccordionDetails sx={{ color: 'text.secondary', lineHeight: 1.8, p: 2, pt: 0 }}>
          {faq.answer}
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', pt: 10, pb: 6, px: 2, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            الأسئلة الشائعة
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}>
            جمعنا لك إجابات لأكثر الأسئلة تكراراً لمساعدتك في فهم كيفية عمل منصة GoRent بكل سهولة وشفافية.
          </Typography>
        </Container>
      </Box>

      {/* FAQ Content */}
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="أسئلة عامة" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }} />
            <Tab label="للمستأجرين" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }} />
            <Tab label="لملاك العقارات" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }} />
          </Tabs>
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          {renderFaqSection(faqs.general)}
        </CustomTabPanel>
        
        <CustomTabPanel value={tabValue} index={1}>
          {renderFaqSection(faqs.tenants)}
        </CustomTabPanel>
        
        <CustomTabPanel value={tabValue} index={2}>
          {renderFaqSection(faqs.landlords)}
        </CustomTabPanel>
        
        {/* Contact Support */}
        <Box sx={{ mt: 8, textAlign: 'center', p: 4, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            لم تجد إجابة لسؤالك؟
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            فريق الدعم الفني لدينا متاح دائماً للإجابة على استفساراتك ومساعدتك في أي وقت.
          </Typography>
          <Typography 
            component="a" 
            href="/contact" 
            variant="button" 
            sx={{ 
              display: 'inline-block',
              bgcolor: 'primary.main', 
              color: 'primary.contrastText', 
              px: 4, 
              py: 1.5, 
              borderRadius: 1, 
              textDecoration: 'none',
              fontWeight: 'bold',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            تواصل معنا الآن
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
