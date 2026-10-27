import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';

const siteUrl = getSiteUrl();

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'كيف أنتقل فوراً إلى أي موقع أو مكان بناء داخل اللعبة؟ / How do I teleport to discovered locations in-game?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'في بطاقة أي عنقود أو مكان بناء، اضغط على زر نسخ أمر الانتقال (/tp)، ثم افتح نافذة الدردشة (T) في ماينكرافت واضغط (Ctrl + V) ثم Enter. مثال: /tp @s 1240 135 -480',
      },
    },
    {
      '@type': 'Question',
      name: 'هل بذور ومواقع SeedLens تعمل على ماينكرافت بيدروك (Bedrock)؟ / Do SeedLens seeds and spots work on Bedrock Edition?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'نعم بنسبة 100% للتضاريس والبيومات! منذ تحديث 1.18، تتطابق الجبال وفوهات الكرز والبحيرات والوديان بدقة متناهية بين جافا وبيدروك. يمكنك اختيار وضع [Bedrock Edition] في واجهة البحث للتركيز على المعالم المشتركة.',
      },
    },
    {
      '@type': 'Question',
      name: 'كيف أستخدم ملف نقاط العلام (Waypoints) داخل ماينكرافت؟ / How do I import exported Waypoints into Minecraft?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "بعد تنزيل الملف من زر 'تصدير نقاط العلام'، افتح مجلد .minecraft/waypoints لمود Xaero's أو JourneyMap وضع الملف بداخله. عند دخولك للعالم ستظهر كافة القرى وفوهات الكرز كدبابيس ثلاثية الأبعاد على شاشتك.",
      },
    },
    {
      '@type': 'Question',
      name: 'كيف يتم التحقق من صحة البذور المدخلة (Numeric & Text Seeds)؟ / How are numeric and text seeds validated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'يقبل النظام أرقام البذور المباشرة 64-بت (الموجبة والسالبة)، كما يدعم إدخال الكلمات والنصوص حيث يقوم بتحويلها تلقائياً بدالة التجزئة القياسية لماينكرافت جافا (String.hashCode) لتوليد بذور مطابقة للعبة بدقة.',
      },
    },
    {
      '@type': 'Question',
      name: 'كيف أقارن بين بذرتين في آن واحد لاختيار الأنسب؟ / How do I compare two seeds side-by-side?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'انقر على تبويب [مقارنة بذرتين] في أعلى الصفحة، وأدخل رقم البذرة الأولى وإصدارها ورقم البذرة الثانية وإصدارها ثم اضغط زر "بدء المقارنة الفورية". سيعرض لك النظام جدولاً إحصائياً يقارن العناقيد، تضاريس البناء، غرف المحاكمة، وقرب الـ Spawn مع تتويج البذرة الفائزة وتقديم نصيحة لاختيار البذرة المناسبة لأسلوب لعبك.',
      },
    },
    {
      '@type': 'Question',
      name: 'كيف أحفظ بذوري المفضلة أو أنقلها إلى جهاز آخر؟ / How do I bookmark seeds and transfer them between devices?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'عند فحص أي بذرة، اضغط زر [حفظ في المفضلة] في شريط النتائج. لفتح المفضلة، انقر زر [مستودع البذور] في الشريط العلوي؛ ستجد تبويب "مفضلتي" الذي يحتوي زراً لـ [تصدير JSON] لعمل نسخة احتياطية أو [استيراد JSON] لاسترجاع بذورك على أي حاسوب آخر دون الحاجة لتسجيل أي حساب.',
      },
    },
    {
      '@type': 'Question',
      name: 'هل تستهلك المعاينات المصورة الكثير من بيانات الإنترنت؟ / Do the in-game preview images consume high network bandwidth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'إطلاقاً! تم ضغط كافة الصور بدقة متوازنة وبتقنية WebP الحديثة ليتراوح حجم الصورة بين 10 إلى 45 كيلوبايت فقط، مما يجعلها خفيفة جداً ومتوافقة تماماً مع باقات وبيانات الهاتف المتنقل (3G/4G/5G). كما تتوفر آلية تحويل فوري للرسومات المتجهية SVG إذا انقطع الاتصال.',
      },
    },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const title = isEn
    ? 'Official Documentation & Technical Architecture Reference'
    : 'دليل التوثيق والمعمارية وسجل التحديثات';

  const description = isEn
    ? 'SeedLens technical guide: Side-by-side comparison, community vault, reverse finder, Cubiomes C simulation pipeline, and Bedrock parity.'
    : 'الدليل الشامل لمنصة SeedLens: مقارنة البذور، مستودع المجتمع، البحث العكسي، محاكي Cubiomes C، وتكافؤ البيدروك التضاريسي.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/documentation`,
      languages: {
        ar: '/ar/documentation',
        en: '/en/documentation',
        'x-default': '/documentation',
      },
    },
    openGraph: {
      title: `${title} | SeedLens`,
      description,
      url: `${siteUrl || ''}/${locale}/documentation`,
    },
  };
}

export default function LocalizedDocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
