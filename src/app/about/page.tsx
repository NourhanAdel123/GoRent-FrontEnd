"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";

// Icons for Values
import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

// Icons for Why Choose Us
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import LockIcon from "@mui/icons-material/Lock";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

// Icons for Stats
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import StarRateIcon from "@mui/icons-material/StarRate";

export default function AboutPage() {
  const values = [
    { title: "الثقة", description: "نبني علاقات طويلة الأمد تعتمد على المصداقية والنزاهة في كل تعاملاتنا.", icon: <SecurityIcon fontSize="large" color="primary" /> },
    { title: "الشفافية", description: "نوفر جميع المعلومات اللازمة بوضوح تام لتسهيل اتخاذ القرارات الصحيحة.", icon: <VisibilityIcon fontSize="large" color="primary" /> },
    { title: "البساطة", description: "نجعل عملية البحث والاستئجار سهلة ومباشرة بدون تعقيدات.", icon: <AutoAwesomeIcon fontSize="large" color="primary" /> },
    { title: "الموثوقية", description: "نضمن دقة وموثوقية كافة العقارات المعروضة على منصتنا.", icon: <VerifiedUserIcon fontSize="large" color="primary" /> },
    { title: "الجودة", description: "نلتزم بتقديم أفضل المعايير لضمان رضا عملائنا في كل خطوة.", icon: <WorkspacePremiumIcon fontSize="large" color="primary" /> },
    { title: "العميل أولاً", description: "نضع احتياجات ورضا عملائنا في صميم كل ما نقوم به.", icon: <SupportAgentIcon fontSize="large" color="primary" /> },
  ];

  const features = [
    { title: "عقارات موثقة", description: "يتم التحقق من كافة العقارات لضمان صحة المعلومات.", icon: <VerifiedUserIcon fontSize="large" className="text-zinc-600" /> },
    { title: "بحث سهل", description: "أدوات بحث متقدمة للوصول إلى العقار المناسب بسرعة.", icon: <SearchIcon fontSize="large" className="text-zinc-600" /> },
    { title: "معلومات واضحة", description: "تفاصيل شاملة عن كل عقار مع صور عالية الجودة.", icon: <InfoIcon fontSize="large" className="text-zinc-600" /> },
    { title: "دعم متواصل", description: "فريق خدمة عملاء متاح لمساعدتك في أي وقت.", icon: <SupportAgentIcon fontSize="large" className="text-zinc-600" /> },
    { title: "تواصل آمن", description: "نظام مراسلة داخلي يحمي خصوصيتك وبياناتك.", icon: <LockIcon fontSize="large" className="text-zinc-600" /> },
    { title: "تجربة مستخدم سلسة", description: "واجهة استخدام سهلة تناسب جميع الأجهزة.", icon: <ThumbUpIcon fontSize="large" className="text-zinc-600" /> },
  ];

  const steps = [
    { step: "1", title: "تصفح العقارات", description: "استكشف مجموعة واسعة من العقارات المتاحة للإيجار." },
    { step: "2", title: "قارن الخيارات", description: "استخدم الفلاتر لمقارنة العقارات واختيار الأنسب لك." },
    { step: "3", title: "تواصل مع المالك", description: "تواصل بشكل مباشر وآمن مع مالك العقار." },
    { step: "4", title: "أتمم عملية الإيجار", description: "اتفق على التفاصيل وأتمم الإيجار بكل سهولة." },
  ];

  const stats = [
    { number: "+500", label: "عقار متاح", icon: <HomeWorkIcon fontSize="large" className="text-blue-600 mb-2" /> },
    { number: "+120", label: "مالك عقار", icon: <PersonIcon fontSize="large" className="text-blue-600 mb-2" /> },
    { number: "+1,500", label: "مستخدم مسجل", icon: <GroupsIcon fontSize="large" className="text-blue-600 mb-2" /> },
    { number: "%95", label: "نسبة رضا العملاء", icon: <StarRateIcon fontSize="large" className="text-blue-600 mb-2" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans pb-10">
      {/* 1. Hero Section */}
      <section className="bg-white border-b border-gray-200 pt-20 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
            مرحباً بك في <span className="text-blue-600">GoRent</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            المنصة الرائدة لتأجير العقارات في مصر. نحن هنا لنجعل تجربة البحث عن عقار أو تأجيره أسهل، أسرع، وأكثر أماناً.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* @ts-ignore */}
            <Button variant="contained" color="primary" component={Link} href="/" size="large">
              ابحث عن عقار
            </Button>
            {/* @ts-ignore */}
            <Button variant="outlined" color="primary" component={Link} href="/contact" size="large">
              تواصل معنا
            </Button>
          </div>
        </div>
      </section>

      {/* 2. About GoRent */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 mb-6">من نحن ولماذا GoRent؟</h2>
              <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                GoRent هي منصة عقارية متخصصة تهدف إلى تغيير وتسهيل طريقة استئجار العقارات في المنطقة.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                تم إنشاء المنصة لحل مشكلة صعوبة العثور على سكن موثوق به والتعامل مع وسطاء عقاريين قد يزيدون من تعقيد العملية. نحن نقضي على الخطوات غير الضرورية ونوفر معلومات شفافة وموثوقة للجميع.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                نحن نساعد كل من المستأجرين وملاك العقارات من خلال ربطهم مباشرة في بيئة آمنة تضمن حقوق الطرفين وتوفر تجربة خالية من المتاعب.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8 flex flex-col justify-center h-full">
              {/* 3. Our Mission */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <StarRateIcon /> مهمتنا
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  تمكين الأفراد والعائلات من العثور على منزل أحلامهم بسهولة وشفافية، مع تزويد ملاك العقارات بأدوات متطورة وفعالة لإدارة ممتلكاتهم بأمان.
                </p>
              </div>
              {/* 4. Our Vision */}
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <VisibilityIcon /> رؤيتنا
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  أن نصبح المنصة الأولى والأكثر ثقة لإيجار العقارات، حيث يمكن لأي شخص إيجاد مسكن يلبي كافة احتياجاته بنقرة زر واحدة وفي بيئة موثوقة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Core Values */}
      <section className="py-20 bg-white px-4 border-y border-gray-100">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">قيمنا الأساسية</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">المبادئ التي نلتزم بها لضمان تقديم أفضل خدمة لعملائنا</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((item, index) => (
              <Card key={index} className="p-8 text-center h-full flex flex-col items-center hover:shadow-md transition-shadow">
                <div className="bg-blue-50 p-4 rounded-full mb-6 inline-flex">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose GoRent & 7. How It Works */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Why Choose Us */}
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-10">لماذا تختار GoRent؟</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h4 className="text-lg font-bold text-zinc-900 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-10">كيف تعمل المنصة؟</h2>
            <div className="space-y-8 relative">
              <div className="absolute top-0 bottom-0 right-6 w-0.5 bg-blue-100 hidden sm:block"></div>
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 items-start relative bg-white p-4 rounded-xl border border-gray-50 shadow-sm z-10">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm">
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-xl font-bold text-zinc-900 mb-2">{step.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Statistics Section */}
      <section className="py-20 bg-zinc-900 text-white px-4 rounded-3xl max-w-7xl mx-auto w-full mb-20 shadow-xl overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              {stat.icon}
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Final Call To Action */}
      <section className="py-24 px-4 text-center bg-blue-50 border-t border-blue-100 mt-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">هل أنت مستعد للبدء؟</h2>
          <p className="text-xl text-blue-800 mb-10 leading-relaxed">
            انضم إلى آلاف المستخدمين الذين وجدوا عقارهم المثالي عبر منصتنا اليوم.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* @ts-ignore */}
            <Button variant="contained" color="primary" component={Link} href="/" size="large" sx={{ px: 6, py: 1.5 }}>
              تصفح العقارات المتاحة
            </Button>
            {/* @ts-ignore */}
            <Button variant="outlined" color="primary" component={Link} href="/contact" size="large" sx={{ px: 6, py: 1.5, bgcolor: 'white' }}>
              تواصل مع فريقنا
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
