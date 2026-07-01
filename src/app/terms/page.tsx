'use client';

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";

export default function TermsPage() {
  const termsSections = [
    {
      title: "1. مقدمة واستخدام المنصة",
      content: "مرحباً بكم في منصة GoRent. باستخدامكم لهذه المنصة، فإنكم توافقون على الالتزام بهذه الشروط والأحكام. تمثل هذه الشروط اتفاقية قانونية ملزمة بينكم (سواء كنتم مستأجرين أو ملاك عقارات) وبين إدارة المنصة. إذا كنتم لا توافقون على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا."
    },
    {
      title: "2. الحساب والتسجيل",
      content: "يتطلب استخدام بعض ميزات المنصة إنشاء حساب. يلتزم المستخدم بتقديم معلومات دقيقة، حديثة، وكاملة أثناء عملية التسجيل. أنتم مسؤولون مسؤولية كاملة عن الحفاظ على سرية كلمة المرور الخاصة بكم وعن كافة الأنشطة التي تحدث تحت حسابكم. في حال الاشتباه بأي اختراق، يجب إبلاغنا فوراً."
    },
    {
      title: "3. التزامات ملاك العقارات",
      content: "يقر المالك بأنه يمتلك الحق القانوني الكامل لتأجير العقار المعروض على المنصة. يجب أن تكون كافة المعلومات، الصور، والأسعار المقدمة دقيقة ولا تحتوي على أي تضليل. يحظر عرض عقارات وهمية أو رفع أسعار غير حقيقية لجذب الانتباه. تحتفظ المنصة بالحق في إزالة أي إعلان يخالف هذه المعايير دون إشعار مسبق."
    },
    {
      title: "4. التزامات المستأجرين",
      content: "يجب على المستأجرين استخدام المنصة بحسن نية للبحث عن سكن حقيقي. يُمنع استخدام المنصة لإرسال رسائل غير مرغوب فيها للملاك أو تقديم طلبات حجز وهمية. يتحمل المستأجر مسؤولية التأكد من ملاءمة العقار لاحتياجاته قبل توقيع العقد الفعلي ودفع المبالغ المستحقة."
    },
    {
      title: "5. الرسوم والمدفوعات",
      content: "التسجيل وعرض العقارات قد يكون مجانياً أو خاضعاً لرسوم محددة يتم توضيحها مسبقاً. بالنسبة لعمليات الدفع عبر المنصة ، فإننا نستخدم بوابات دفع إلكترونية آمنة. GoRent غير مسؤولة عن أي مبالغ يتم دفعها خارج إطار المنصة مباشرة بين المالك والمستأجر، وننصح دائماً بتوثيق كافة المعاملات المالية."
    },
    {
      title: "6. إخلاء المسؤولية",
      content: "تعمل GoRent كوسيط إلكتروني يربط بين الملاك والمستأجرين ولا تعتبر طرفاً في العقود المبرمة بينهم. لا نقدم أي ضمانات صريحة أو ضمنية حول جودة العقارات، خلوها من العيوب، أو التزام الطرفين بالدفع. أي نزاع ينشأ بين المالك والمستأجر يتم حله بينهما وفقاً للقوانين المحلية المعمول بها."
    },
    {
      title: "7. التعديلات على الشروط",
      content: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التغييرات على هذه الصفحة مع تحديث تاريخ 'آخر تعديل'. استمرار استخدامكم للمنصة بعد إجراء التغييرات يُعد موافقة منكم على الشروط المعدلة."
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', pt: 10, pb: 6, px: 2, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
            شروط الاستخدام
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
            آخر تحديث: {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Container>
      </Box>

      {/* Terms Content */}
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Box sx={{ bgcolor: 'background.paper', p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: 1, border: '1px solid', borderColor: 'divider' }}>
          
          <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.9, mb: 4, fontSize: '1.05rem' }}>
            يرجى قراءة شروط الاستخدام بعناية قبل استخدام منصة GoRent. توضح هذه الوثيقة حقوقك والتزاماتك القانونية.
          </Typography>

          {termsSections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.dark', mb: 2 }}>
                {section.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.9, fontSize: '1.05rem', textAlign: 'justify' }}>
                {section.content}
              </Typography>
              {index < termsSections.length - 1 && (
                <Divider sx={{ mt: 4, mb: 1 }} />
              )}
            </Box>
          ))}

          <Box sx={{ mt: 6, p: 3, bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : '#0f172a', borderRadius: 1, borderLeft: '4px solid', borderColor: 'primary.main' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              هل لديك استفسارات قانونية؟
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              إذا كان لديك أي أسئلة حول هذه الشروط، يمكنك التواصل مع فريق الدعم القانوني الخاص بنا عبر صفحة 
              <Typography component="a" href="/contact" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 'bold', mx: 1 }}>
                اتصل بنا
              </Typography>
              وسنقوم بالرد عليك في أقرب وقت ممكن.
            </Typography>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
