# SeedLens Agent Guide & Project Handoff (AGENTS.md)

> **وثيقة التوجيه وتسليم المشروع لوكلاء الذكاء الاصطناعي (AI Agents)**
> **تاريخ التحديث:** أكتوبر 2026 | **الإصدار الحالي:** SeedLens v4 (مرحلة التطوير النشط)

---

## 1. نظرة عامة والمسارات الأساسية (Architecture & Paths)

- **المشروع الأساسي ومستودع التطوير:**
  `/home/pc/Desktop/SeedLens`
  *(كل التعديلات البرمجية، الـ CLI، المحرك، الواجهة، والاختبارات يجب أن تتم حصراً داخل هذا المسار).*
- **المكتبة الخارجية (External Dependency):**
  `/home/pc/Downloads/cubiomes`
  *(مكتبة Cubiomes الرسمية بلغة C لمؤلفها Cubitect. **قاعدة إلزامية:** ممنوع تعديل أي ملف داخل هذا المسار؛ يتعامل المحرك معها كمكتبة ثابتة مجمعة `libcubiomes_static.a` عبر الترويسات فقط).*

---

## 2. ما تم إنجازه بالكامل حتى الآن (Completed Milestones)

### أ. التدقيق والتحليل المعماري (Phase 0 Audit)
- توثيق تدفق البيانات الكامل:
  `Input → Validation → Version Resolution → Structure Generation → Viability Checks → Discovery → Cluster Classification → JSON → API → Frontend`
- عزل العيوب الخوارزمية المثبتة والتفريق الدقيق بين:
  - `Candidate Position`: إحداثي رياضي مجرد.
  - `Biome Viable`: صالح بيومياً (2D).
  - `Terrain Validated`: مفحوص التضاريس والعمق (مدعوم فقط في Cubiomes لـ Desert Pyramid، Jungle Temple، Woodland Mansion).
  - `In-Game Reality`: التوليد الحقيقي داخل اللعبة.

### ب. تأسيس خط الأساس والمجموعة المرجعية (Phase 1 Baseline & Benchmark)
- **حفظ لقطة v3.1 المرجعية:**
  في [`tests/data/baseline_v3_1_snapshot.json`](tests/data/baseline_v3_1_snapshot.json) لضمان ثبات نتائج Useful v3.1 القديمة بنسبة 100% حرفياً (Bit-Identical) عبر 5 بذور مرجعية معقدة:
  `123456789`, `-1467692750553100038`, `1844674407370955161`, `739208174635920481`, `202620262026202626`.
- **مخطط الحقيقة الأرضية (Ground Truth Schema):**
  في [`tests/data/benchmark_schema.json`](tests/data/benchmark_schema.json).
- **كتالوج المراجع الحقيقية (Catalog):**
  في [`tests/data/ground_truth_catalog.json`](tests/data/ground_truth_catalog.json) مع الفصل بين التحقق الخوارزمي والتحقق الميداني.
- **جناح اختبارات الخصائص (Property Tests):**
  في [`tests/test_v4_properties.py`](tests/test_v4_properties.py) (7 اختبارات ناجحة بنسبة 100%).

### ج. دعم تعدد الإصدارات الرسمي من 1.18 فصاعداً (Multi-Version Expansion)
تم بناء نظام [`VersionProfile`](engine/src/version.c) لدعم كافة إصدارات ماينكرافت المدعومة في Cubiomes C:
1. **`1.18.2`** (الاسم البديل: `1.18`): Caves & Cliffs II (لا توجد مدينة قديمة ولا آثار مسار ولا غرف محاكمة).
2. **`1.19.4`** (الاسم البديل: `1.19`, `1.19.2`): The Wild Update (إضافة المدينة القديمة Ancient City).
3. **`1.20.6`** (الاسم البديل: `1.20`): Trails & Tales (إضافة آثار المسار Trail Ruins).
4. **`1.21.1`** (الاسم البديل: `1.21`): Tricky Trials (إضافة غرف المحاكمة Trial Chambers).
5. **`1.21.3`**: Bundles of Bravery (تحديث خوارزمية اختيار نقطة الـ Spawn).
6. **`1.21.4`** (الاسم البديل: `winter-drop`, `1.21-wd`): The Garden Awakens (Pale Garden).

### د. اكتشاف الهياكل وغرف المحاكمة (Trial Chambers & Discovery)
- إضافة غرف المحاكمة **`Trial Chambers`** بالكامل (327 غرفة في البذرة 123456789 في إصدارات 1.21+).
- الحفاظ التام على عزل Useful v3.1: هياكل الاكتشاف تظهر حصراً في حقل `"discovery"` في JSON دون أن تغير العناقيد الخمسة الأساسية لـ v3.1.
- دعم غرف المحاكمة في الواجهة:
  - شارة بلون نحاسي مميز وأيقونة سيوف (`Swords`) في [`StructureBadge.tsx`](frontend/src/components/StructureBadge.tsx).
  - دبوس بيكسل مخصص في الخريطة التفاعلية Leaflet مع زر نسخ أمر `/tp X ~ Z` في [`SeedMapInner.tsx`](frontend/src/components/SeedMapInner.tsx).
  - ترجمات كاملة بالعربية والإنجليزية في [`translations.ts`](frontend/src/lib/translations.ts).

### هـ. استكشاف المناظر الطبيعية وأماكن البناء المميزة (Scenic & Building Spots Engine)
- إضافة محرك فحص بيومي وتضاريسي متوازي فائق السرعة في [`engine/src/landmarks.c`](engine/src/landmarks.c) و [`engine/include/landmarks.h`](engine/include/landmarks.h).
- تصنيف واكتشاف المواقع التضاريسية عبر 5 فئات رئيسية:
  1. **فوهات الكرز الجبلية (Cherry Blossom Calderas):** أودية مغلقة محاطة بقمم مثلجة وتكسوها زهور الكرز.
  2. **الفوهات الجبلية المحمية (Mountain Crater Rings):** منخفضات مروج وسهول محاطة بسلاسل جبلية شاهقة تمنح حماية طبيعية.
  3. **الجروف البانورامية (Epic Clifftops / Vistas):** تضاريس شديدة الانحدار وفوارق ارتفاع $>80$ بلوكاً مطلة على محيطات أو سهول.
  4. **أحواض البناء المستوية (Prime Building Basins):** أراضٍ مستوية واسعة محاطة بمصادر مياه وأشجار وموارد للمدن الكبرى.
  5. **جزر النجاة المنعزلة (Isolated Survival Islands):** جزر نقية محاطة بمحيطات عميقة لتحديات النجاة وبناء المنارات.
- حقل معزول تماماً في JSON باسم `"landmarks"` دون التأثير على Useful v3.1 بنسبة 100%.
- تكامل شامل مع الواجهة:
  - شريط تبويب رئيسي للتنقل الفوري بين "العناقيد الهيكلية" و"المواقع الطبيعية وأماكن البناء".
  - مكون [`LandmarkCard.tsx`](frontend/src/components/LandmarkCard.tsx) مع مقاييس تقييم جمالية وبنائية (Scenic & Building Scores) وزر نسخ أمر `/tp X Y Z`.
  - دبابيس مخصصة ونافذة منبثقة تفاعلية على خريطة Leaflet مع دليل رموز مخصص.

---

## 3. العيوب المثبتة المطلوب معالجتها في المراحل القادمة (Pending Defects)

| المعرف | الملف المصدر | وصف العيب البرمجي | الحل المطلوب في v4 |
| :--- | :--- | :--- | :--- |
| **`V4-DEFECT-01`** | `engine/src/cluster.c:138` | `same_cluster` يقوم بدمج وحذف عناقيد مستقلة بمجرد أن مسافة المركز الهندسية $< 250$ م حتى لو كان التداخل صفراً (`intersection == 0`). | اشتراط وجود تداخل فعلي في الهياكل (`intersection > 0`) قبل الحكم بالتكرار. |
| **`V4-DEFECT-02`** | `engine/src/discovery.c:56` | الاقتطاع القسري عند $\pm 5000$ م يسقط هياكل عند 5010 م كانت لتشكل عنقوداً ممتازاً مع هياكل عند 4980 م. | إضافة حزام أمان للبحث (Margin Buffer) حتى 5500 م وقصر المراكز المعروضة على $\le 5000$ م. |
| **`V4-DEFECT-04`** | `engine/src/cluster.c:108` | معادلة الكثافة المعتمدة على القطر الدائري الأقصى $\pi(D/2)^2$ تتأثر تربيعياً بأي هيكل طرفي، مما يسقط عناقيد شديدة القيمة. | استبدال الكثافة الدائرية بمتوسط المسافة البينية (Mean Pairwise Distance - MPD) أو المساحة المحيطة المحدبة (Convex Hull). |
| **`V4-FEATURE-01`** | `engine/src/analysis.c` | الحواف الحادة في Useful v3.1 (Threshold Cliffs) وغياب درجة جودة متصلة. | بناء دالة نقاط مركبة (Composite Quality Score: 0 - 100) مع الإبقاء على تصنيف v3.1 كـ `legacy_useful_v3`. |

---

## 4. كيفية البناء والتشغيل والتحقق (Commands & Verification)

### بناء المحرك وأداة الـ CLI:
```bash
cd /home/pc/Desktop/SeedLens
make -C engine clean && make -C engine && rm -f seedlens && make
```

### تشغيل الاختبارات الشاملة (10 أجنحة اختبار):
```bash
python3 tests/test_regression.py
```

### تشغيل اختبارات الخصائص لـ v4 (7 اختبارات للثوابت والعيوب):
```bash
python3 tests/test_v4_properties.py
```

### فحص التنسيق والمسافات البيضاء في Git:
```bash
git diff --check
```

### فحص أنواع TypeScript وبناء تطبيق Next.js:
```bash
cd /home/pc/Desktop/SeedLens/frontend
npx tsc --noEmit && npm run build
```

---

## 5. قواعد وتعليمات حرجة لأي وكيل يستأنف العمل (Agent Rules)

1. **العمل داخل المستودع الصحيح:** لا تقم بأي تعديل في `/home/pc/Downloads/cubiomes`. كل العمل ينتمي إلى `/home/pc/Desktop/SeedLens`.
2. **حماية التوافقية الرجعية لـ Useful v3.1:** أي تعديل في خوارزميات التجميع أو النقاط يجب ألا يكسر النتائج المعتمدة في `tests/data/baseline_v3_1_snapshot.json` للبذور المرجعية القديمة؛ اجعل الميزات الجديدة إضافات تراكمية أو حقولاً جديدة في كائن JSON.
3. **نظافة التنسيق:** احرص دائماً على عدم ترك مسافات بيضاء زائدة في نهاية الأسطر (Trailing Whitespace) وتأكد من خروج `git diff --check` برمز 0.
4. **عدم اختلاق مراجع وهمية:** أي بيانات تُصنف كـ Ground Truth يجب أن تكون ناتجة عن خادم ماينكرافت فعلي أو فحص خوارزمي مستقل مثبت بالأدلة.
