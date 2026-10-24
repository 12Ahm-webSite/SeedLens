# خطة العمل التنفيذية: المعالم الطبيعية الأسطورية وبطاقات الهوفر المتكيفة حسب الإصدار
> **المشروع:** SeedLens v4  
> **تاريخ الإنشاء:** أكتوبر 2026  
> **حالة الوثيقة:** معتمدة للتنفيذ (Implementation Blueprint)  
> **المسار:** `/home/pc/Desktop/SeedLens/plan/PLAN.md`

---

## 1. الملخص التنفيذي والأهداف (Executive Summary)

تهدف هذه الخطة إلى نقل منصة **SeedLens** إلى مرحلة استكشافية متقدمة تُشبع رغبات مجتمع وصنّاع محتوى ماينكرافت (Reels & Shorts Creators)، وذلك من خلال محورين رئيسيين:

1. **إدراج المشاهد الطبيعية الأسطورية الـ 8 في محرك C:**
   - توسيع قدرات فحص التضاريس والبيومات في [`engine/src/landmarks.c`](file:///home/pc/Desktop/SeedLens/engine/src/landmarks.c) لاقتناص أشهر المشاهد السينمائية النادرة التي يبحث عنها اللاعبون عالمياً.
2. **بناء بطاقات الهوفر البصرية المريحة المتكيفة حسب الإصدار (Version-Contextual Hover Cards):**
   - تصميم نافذة هوفر منبثقة تفاعلية عند تمرير الماوس فوق أي دبوس في الخريطة أو بطاقة في القائمة.
   - **قاعدة حرجة (مطلب المستخدم الأساسي):** البطاقة تعرض **صورة واحدة فقط ملائمة للإصدار المختار حالياً** (1.18 أو 1.20 أو 1.21 إلخ) دون تكديس أو إظهار كافة الإصدارات معاً لتفادي التشتت ("الربشة").
   - **الحجم المريح والمناسب:** تصميم مدمج وأنيق (Compact: عرض ~220px) لا يحجب الخريطة ولا يشوش على تجربة التصفح.
   - **الشمولية:** تطبيق بطاقة الهوفر على كافة المعالم الطبيعية والهياكل الحيوية (Trial Chambers, Ancient City, Woodland Mansion, Villages, Outposts).

---

## 2. كتالوج المعالم الطبيعية الـ 8 ومعادلات كشفها في محرك C

| # | اسم المعلم الطبيعي | كود المعلم (Identifier) | توافق الإصدارات | الخوارزمية الرياضية لكشفه في C ([`landmarks.c`](file:///home/pc/Desktop/SeedLens/engine/src/landmarks.c)) |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **البحيرات الدائرية المحاطة بالجبال** | `mountain_ring_lake` | 1.18 فما فوق | **Radial Peak Ring:** فحص المركز عند منسوب الماء ($Y \le 66$) محاطاً بحلقة دائرية بارتفاع $Y \ge 130$ وبفارق ارتفاع $\Delta H > 65$ بلوكاً لـ 8 اتجاهات شعاعية. |
| **2** | **فوهات الكرز الدائرية الساحرة** | `cherry_grove_crater` | 1.20 فما فوق | **Dual-Elevation Sampling:** المركز وادٍ منبسط محاط على ارتفاع $Y=90..115$ بحلقة مكتملة من بيوم `cherry_grove` وتعلوها قمم مثلجة. |
| **3** | **الثقوب الأرضية المضيئة المكشوفة** | `lush_cave_sinkhole` | 1.18 فما فوق | **3D Vertical Cavity Slice:** فحص عمودي يربط السطح ($Y \ge 70$) بالعمق ($Y=-10..-30$)؛ وجود `lush_caves` عميقة مع فجوة تضاريس مفتوحة نحو السماء. |
| **4** | **الوديان والأخاديد السحيقة (Grand Canyon)** | `grand_canyon_ravine` | 1.18 فما فوق | **Lateral Height Drop ($\Delta H$):** نهر في القاع عند $Y=62$ مع حافتين عموديتين على مسافة 70م ترتفعان لـ $Y \ge 130$ في بيوم `badlands` أو الغابات الجبلية. |
| **5** | **القرى الجبلية المعلقة على المنحدرات** | `cliffside_village` | كافة الإصدارات | **Structure-Slope Collision:** تحديد إحداثي القرية وفحص انحدار أطرافها؛ وجود فارق منسوب $>50$ بلوكاً يطل على محيط أو وادٍ سحيق. |
| **6** | **الجزر الجبلية المعزولة وسط المحيط** | `isolated_mountain_island` | 1.18 فما فوق | **Deep Ocean Ring:** جبل شاهق ($Y \ge 160$) لا يتجاوز قطره 350 بلوكاً، محاط بالكامل بمحيط عميق `deep_ocean` لمسافة لا تقل عن 300م في كل اتجاه. |
| **7** | **فوهات وأودية الجليد المدببة** | `ice_spikes_caldera` | كافة الإصدارات | **Rare Ice Spikes Clustering:** فحص بيوم `ice_spikes` النادر الواقع داخل حوض تحيط به قمم بيضاء أو غابات كرز لتباين لوني بارد ومبهر. |
| **8** | **جزر الفطر النادرة الآمنة** | `mushroom_sanctuary_island` | كافة الإصدارات | **Mushroom Field Ocean Scan:** تحديد جزيرة `mushroom_fields` نقية وسط المحيط خالية تماماً من الوحوش ومسافتها عن الـ Spawn. |

---

## 3. هندسة بطاقة الهوفر المريحة (Compact Hover Card Architecture)

### أ. القياسات والأبعاد (Ergonomics & Layout)
- **العرض الأقصى:** `220px` إلى `240px`.
- **الارتفاع التقريبي:** `180px` إلى `200px`.
- **الهيكل البصري:**
  ```
  ┌──────────────────────────────────────────────┐
  │ [صورة المشهد المصغرة الملائمة للإصدار]       │
  │ ↳ ارتفاع 100px مع شارة الإصدار الصغير        │
  ├──────────────────────────────────────────────┤
  │ اسم المعلم (عربي / إنجليزي) + شارة النوع      │
  │ X: 120  |  Y: 64  |  Z: -240 (مسافة الـ Spawn)│
  │ 🌟 Scenic: 95%      🏰 Build: 88%            │
  │ [زر نسخ سريع لأمر /tp X Y Z]                 │
  └──────────────────────────────────────────────┘
  ```

### ب. منطق مطابقة الصورة مع الإصدار المختار (Version Matcher Logic)
تحدد الدالة المعاينة المناسبة استناداً إلى `minecraft_version` النشط فقط:
```typescript
function getHoverPreviewAsset(
  featureId: string, 
  version: string
): { imageUrl: string; badge: string } {
  // إذا كان 1.18: صور تمثل بيئة وتضاريس 1.18 دون عناصر التحديثات اللاحقة
  // إذا كان 1.20: صور تبرز أزهار الكرز وآثار المسار
  // إذا كان 1.21: صور تبرز غرف المحاكمة وحجر التوف والنحاس
  // إرجاع مسار صورة وحيدة فقط تناسب الإصدار المختار بدقة
}
```

### ج. نطاق التغطية على عناصر الخريطة
- دبابيس المعالم الطبيعية الثمانية الجديدة.
- دبابيس المعالم الخمسة الحالية (Cherry Caldera, Crater Ring, Clifftop Vista, Prime Basin, Survival Island).
- دبابيس الهياكل الكبرى:
  - غرف المحاكمة النحاسية (*Trial Chambers*).
  - المدينة القديمة (*Ancient City*).
  - قصر الغابة (*Woodland Mansion*).
  - معبد المحيط (*Ocean Monument*).
  - مخفر البيلاجر (*Pillager Outpost*).
  - القرى وعواصم التبادل (*Villages / Metropolis*).

---

## 4. مكتبة الأصول البصرية المصغرة (Asset Library)

- حفظ الصور التوضيحية داخل المسار: `frontend/public/previews/`
- تسمية الأصول بشكل منهجي:
  - `previews/landmarks/mountain_ring_lake_1_18.webp`
  - `previews/landmarks/cherry_grove_crater_1_20.webp`
  - `previews/landmarks/lush_cave_sinkhole.webp`
  - `previews/landmarks/grand_canyon.webp`
  - `previews/landmarks/cliffside_village.webp`
  - `previews/landmarks/isolated_mountain_island.webp`
  - `previews/landmarks/ice_spikes_caldera.webp`
  - `previews/landmarks/mushroom_island.webp`
  - `previews/structures/trial_chambers.webp`
  - `previews/structures/ancient_city.webp`
  - `previews/structures/woodland_mansion.webp`
  - `previews/structures/village.webp`
  - `previews/structures/pillager_outpost.webp`
  - `previews/structures/ocean_monument.webp`
- صور متجهة مدمجة وسريعة التحميل لضمان العمل دون أي تأخير شبكي (Zero Latency).

---

## 5. مراحل التنفيذ التفصيلية (Phased Implementation Plan)

### المرحلة 1: تحديث كواشف التضاريس في محرك C
- **الملفات المستهدفة:** [`engine/src/landmarks.c`](file:///home/pc/Desktop/SeedLens/engine/src/landmarks.c) و [`engine/include/seedlens.h`](file:///home/pc/Desktop/SeedLens/engine/include/seedlens.h).
- **المهام:**
  1. إضافة دوال الكشف للمشاهد الجديدة (بحيرة الفوهة الجبلية، الكهف المضيء المكشوف، الجراند كانيون، القرى المعلقة، وجزر الفطر).
  2. ربط الفحص بالإصدار النشط (`profile->mc_enum`).
  3. إعادة البناء والتحقق عبر `make -C engine clean && make`.

### المرحلة 2: تجهيز مكتبة الصور التوضيحية
- **المسار:** `frontend/public/previews/`
- **المهام:**
  1. إنشاء الأصول البصرية ذات الجودة العالية بنمط ماينكرافت لكل معلم وهيكل.
  2. إنشاء وحدة `frontend/src/lib/previews.ts` لتسهيل استدعاء الصورة المناسبة للإصدار ونوع المعلم.

### المرحلة 3: بناء مكوّن بطاقة الهوفر وتحديث الخريطة التفاعلية
- **الملفات المستهدفة:** [`frontend/src/components/SeedMapInner.tsx`](file:///home/pc/Desktop/SeedLens/frontend/src/components/SeedMapInner.tsx) و [`frontend/src/components/LandmarkCard.tsx`](file:///home/pc/Desktop/SeedLens/frontend/src/components/LandmarkCard.tsx).
- **المهام:**
  1. استبدال الـ Tooltips النصية الافتراضية ببطاقات مصغرة جذابة مع صورة المعلم.
  2. ضبط أسلوب الظهور التلقائي عند التمرير (`mouseover / mouseout`) دون إرباك الخريطة.
  3. توفير زر سريع لنسخ `/tp`.

### المرحلة 4: الترجمات وضمان التوافقية
- **الملف المستهدف:** [`frontend/src/lib/translations.ts`](file:///home/pc/Desktop/SeedLens/frontend/src/lib/translations.ts).
- **المهام:**
  1. إضافة التسميات والأوصاف العربية والإنجليزية للمعالم الثمانية الجديدة.
  2. تحديث مرشحات البحث في شريط الخريطة وبطاقات الـ Wishlist.

### المرحلة 5: الاختبارات الشاملة وضمان الجودة (QA Verification)
- **المهام:**
  1. تشغيل جناح اختبارات الانحدار: `python3 tests/test_regression.py` (10/10 أجنحة).
  2. تشغيل اختبارات الخصائص لـ v4: `python3 tests/test_v4_properties.py` (8/8 اختبارات).
  3. فحص التجميع وأنواع TypeScript: `npx tsc --noEmit && npm run build`.
  4. فحص نظافة التنسيق والمسافات البيضاء: `git diff --check`.

---

## 6. قواعد وضوابط الحماية غير القابلة للكسر (Guarantees)

1. **حماية التوافقية الرجعية لـ Useful v3.1:** نتائج البذور المرجعية القديمة الخمس لا تتغير بنسبة 100% (Bit-Identical).
2. **العمل الحصري داخل المستودع:** ممنوع التعديل في `/home/pc/Downloads/cubiomes`.
3. **خلو التنسيق من الأخطاء:** خروج `git diff --check` برمز 0 دوماً.
4. **تجنب التعقيد:** بطاقة الهوفر مصغرة ومريحة وتعرض فقط صورة الإصدار الفعال للاعب.
