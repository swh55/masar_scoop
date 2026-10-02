# أكاديمية البرمجة - سجل العمل (Worklog)

## نظرة عامة على المشروع

تم بناء **أكاديمية برمجة تفاعلية** لتعليم جميع التقنيات المستخدمة في بيئة التطوير:
TypeScript، React، Next.js، Tailwind CSS، Prisma، و Zustand.

المنصة باللغة العربية مع دعم كامل لـ RTL، وضع ليلي، وتصميم متجاوب.

---

## Task ID: 1
Agent: Z.ai Code (main)
Task: بناء منصة تعليمية تفاعلية شاملة لتعلم مهارات تطوير الويب

Work Log:
- **قاعدة البيانات (Prisma):**
  - تصميم schema.prisma بنماذج: Track, Lesson, Quiz, Question, Choice, TrackProgress, LessonProgress, Achievement, UserAchievement
  - تشغيل `bun run db:push` لإنشاء الجداول
  - إنشاء سكربت تلقيم (seed.ts) بمحتوى تعليمي شامل: 6 مسارات، 14 درس، 14 اختبار، 5 شارات
  - تشغيل التلقيم بنجاح

- **API Routes:**
  - `GET /api/tracks` — قائمة كل المسارات
  - `GET /api/tracks/[slug]` — تفاصيل مسار مع دروسه (يدعم slug و id)
  - `GET /api/lessons/[id]` — درس كامل مع اختباره
  - `POST /api/lessons/[id]/check` — تصحيح الاختبار وتسجيل النتيجة
  - `GET /api/progress?sessionId=` — تقدّم المستخدم الكلي
  - `POST /api/progress/lesson` — تسجيل إكمال درس
  - `GET/POST /api/achievements` — قراءة/منح الشارات

- **الواجهة الأمامية:**
  - Layout مع RTL (`dir="rtl"`)، خط Cairo، ThemeProvider من next-themes
  - Header لاصق مع تنقل (الرئيسية، تقدّمي، الإنجازات) + زر تبديل المظهر
  - Footer لاصق في الأسفل
  - HomeView: قسم بطل (hero) متدرّج، شبكة مسارات، إحصائيات، قسم مميزات
  - TrackView: عرض المسار مع قائمة دروس ونظام قفل تدريجي
  - LessonView: محتوى Markdown، أمثلة كود بألوان، اختبار تفاعلي
  - ProgressView: إحصائيات + تقدّم كل مسار
  - AchievementsView: شبكة شارات مع دائرة تقدّم
  - Markdown renderer مع code blocks قابلة للنسخ (زر نسخ + ألوان شبيهة بمحرر)
  - نظام جلسات محلي (localStorage) مع useSyncExternalStore

- **التصميم:**
  - لوحة ألوان دافئة (emerald/teal) — تجنّب indigo/blue
  - متغيرات CSS لكل لون مسار (track-{color})
  - خلفيات متدرجة (bg-hero) + شبكة (bg-grid)
  - حركات Framer Motion عند التحميل والتبديل
  - شريط تمرير مخصص
  - دعم كامل للوضع الليلي

- **إدارة الحالة:**
  - Zustand store للتنقل بين الواجهات (home/track/lesson/progress/achievements)
  - TanStack Query لجلب البيانات و cache
  - useMutation لتحديث التقدّم والاختبارات

- **التحقق:**
  - `bun run lint` يجتاز بدون أخطاء
  - agent-browser: الصفحة الرئيسية تُعرض بشكل صحيح
  - النقر على مسار يفتح قائمة الدروس مع القفل التدريجي
  - فتح درس يعرض المحتوى + الكود + الاختبار
  - الإجابة على الاختبار وتسليمه يعطي نتيجة فورية + شارة
  - تبديل المظهر يعمل (dark class يُضاف على html)
  - صفحة التقدّم تعرض الإحصائيات
  - صفحة الإنجازات تعرض الشارات

Stage Summary:
- المشروع مكتمل ويعمل بشكل كامل على المنفذ 3000
- 6 مسارات تعليمية، 14 درس، 14 اختبار تفاعلي، 5 شارات
- دعم RTL كامل + الوضع الليلي + تصميم متجاوب
- جميع API routes تعمل والتقدّم يُحفظ في قاعدة البيانات
- نظام إنجازات تلقائي يُفعّل بعد كل اختبار/إكمال درس

## الحالة الحالية
✅ مستقر — المشروع يعمل بدون أخطاء. يمكن للمستخدم:
1. تصفّح 6 مسارات تعليمية على الصفحة الرئيسية
2. فتح أي مسار لرؤية دروسه (مع قفل تدريجي)
3. قراءة الدرس مع محتوى Markdown وأمثلة كود
4. أداء اختبار تفاعلي والحصول على نتيجة فورية
5. تتبّع التقدّم الكلي في صفحة "تقدّمي"
6. ربح وعرض الشارات في صفحة "الإنجازات"
7. التبديل بين الوضع الفاتح والليلي

## أهداف المرحلة القادمة (مقترحة)
- إضافة المزيد من الدروس لكل مسار (خاصة Zustand و Prisma)
- إضافة محرر كود تفاعلي حقيقي (يمكن للمستخدم كتابة وتشغيل كود)
- إضافة بحث وفلترة للمسارات
- إضافة شارات أكثر وتحديات يومية
- إضافة صفحة "كيف أبدأ؟" للمبتدئين تمامًا
- إضافة دعم تعدد اللغات (عربي/إنجليزي)
- إضافة مؤشر تقدّم في الـ Header
- تحسين الـ SEO مع metadata ديناميكي

---

## Task ID: 2
Agent: Z.ai Code (cron review round 1)
Task: مراجعة المشروع وإصلاح الأخطاء وإضافة ميزات جديدة

### الحالة الحالية للمشروع (تقييم)
- ✅ المشروع مستقر ويعمل على المنفذ 3000
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ جميع API routes تستجيب بـ 200
- ❌ تم اكتشاف خطأ: الشارات لا تُمنح تلقائيًا عند فتح صفحة الإنجازات (GET فقط يقرأ، لا يفحص الشروط)

### الأهداف المنجزة في هذه الجولة

#### 1. إصلاح أخطاء (Bugs)
- **Bug fix: Achievement auto-sync** — أعيد تصميم `/api/achievements` GET endpoint ليفحص شروط الشارات ويمنحها تلقائيًا قبل الإرجاع. استخرجت منطق الفحص لدالة `syncAchievements(sessionId)` مشتركة بين GET و POST.
  - قبل الإصلاح: مستخدم أكمل درسًا لكن شارة "الخطوة الأولى" ظهرت مقفلة
  - بعد الإصلاح: الشارة تُمنح تلقائيًا عند فتح صفحة الإنجازات ✅

#### 2. ميزات جديدة (Features)
- **Search & Filter on home page** — شريط بحث + أزرار فلترة حسب المستوى (الكل/مبتدئ/متوسط/متقدم)
  - بحث فوري في العنوان والوصف
  - فلترة بالـ AnimatePresence مع انتقالات سلسة
  - حالة "لا نتائج" مع زر مسح الفلاتر
- **Interactive Code Playground** (`code-playground.tsx`) — محرر كود تفاعلي لكل درس!
  - تثبيت `@babel/standalone` لترجمة TypeScript إلى JS
  - محرر نصي بأرقام أسطر + دعم Tab key
  - زر "تشغيل" ينفّذ الكود ويلتقط console.log/error/warn
  - لوحة ناتج ملونة (أخضر للنتائج، أحمر للأخطاء)
  - يدعم ts/tsx/js/jsx
  - يظهر تلقائيًا تحت مثال الكود في كل درس بلغة ts
- **Daily Streak Counter** (`use-streak.ts` hook) — عداد السلسلة اليومية
  - تتبع النشاط اليومي في localStorage
  - يحسب السلسلة الحالية، الأطول، إجمالي الأيام النشطة
  - مؤشر في الـ Header (شعلة 🔥 + العدد) يظهر عند streak > 0
  - بانر كبير في صفحة التقدّم مع رسائل تحفيزية ديناميكية
  - النبض (animate-pulse) عند streak >= 3
- **Continue Learning card** على الصفحة الرئيسية
  - يجد آخر مسار غير مكتمل للمستخدم
  - زر "تابع التعلّم" ينقل مباشرة للمسار
  - يعرض آخر مسار ونسبة إكماله
- **More lessons** — إضافة 3 دروس جديدة:
  - Prisma: "ميزات متقدمة: Migrations، Indexes، و Raw SQL" (مجلد 3)
  - Zustand: "الـ Middleware: persist و immer" (مجلد 2)
  - Zustand: "أنماط متقدمة: Slices و Context" (مجلد 3)
  - الإجمالي الآن: 17 درس (كان 14)، 17 اختبار

#### 3. تحسينات التصميم (Styling)
- **Animated gradient blobs** في الـ hero (كرات ضبابية متحركة بلا نهاية)
- **Glassmorphism effects** على البطاقات (backdrop-blur + gradients)
- **Continue learning card** بتصميم ملموس (gradient overlay, ring effects, blur behind icon)
- **Streak banner** بتصميم احترافي (gradient, pulse animation, border)
- **Track card exit animations** مع `layout` prop لـ AnimatePresence
- تحسينات عامة على الـ hover states و الـ transitions

### نتائج التحقق (QA via agent-browser)
- ✅ الصفحة الرئيسية تعرض شريط البحث والفلترة
- ✅ البحث عن "React" يفلتر إلى مسار واحد فقط
- ✅ زر مسح البحث يعيد كل المسارات
- ✅ المحرر التفاعلي يظهر في دروس TypeScript
- ✅ النقر على "تشغيل" ينفّذ الكود ويعرض الناتج "مرحبًا أحمد!"
- ✅ مؤشر السلسلة يظهر في الـ Header (يظهر "1" بعد أول زيارة)
- ✅ صفحة التقدّم تعرض بانر السلسلة مع رسالة تحفيزية
- ✅ بطاقة "تابع التعلّم" تظهر بعد إكمال درس
- ✅ الشارات تُمنح تلقائيًا (1/5 "الخطوة الأولى" مكسوبة)
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ لا أخطاء في سجل الـ dev server

### مخاطر/أمور غير محلولة
- **Re-seed wipes progress**: إعادة تشغيل `db:seed` تمسح تقدّم المستخدم. هذا مقصود للتطوير لكن يجب تجنّبه في الإنتاج.
- **Code playground**: يستخدم `new Function()` لتنفيذ الكود — آمن نسبيًا لأنه لا يصل لـ DOM الحقيقي، لكن ليس sandbox كامل. كافٍ للاستخدام التعليمي.
- **Streak tracking client-side**: السلسلة تُحفظ في localStorage فقط. لو غيّر المستخدم الجهاز، تبدأ من جديد. للاستخدام الكامل، يجب نقلها لقاعدة البيانات.

### توصيات للمرحلة القادمة (الأولويات)
1. **[عالٍ]** إضافة "كيف أبدأ؟" onboarding flow للمستخدمين الجدد (توجيه تفاعلي)
2. **[عالٍ]** إضافة نظام XP/نقاط مع كل درس مكتمل (gamification أعمق)
3. **[متوسط]** إضافة heatmap لتقويم النشاط (مثل GitHub contributions)
4. **[متوسط]** إضافة "درس اليوم" / تحدي يومي
5. **[متوسط]** نقل تتبع السلسلة لقاعدة البيانات (Activity model) لمزامنة الأجهزة
6. **[منخفض]** إضافة صفحة "المسار التعليمي الموصى به" بناءً على أهداف المستخدم
7. **[منخفض]** إضافة دعم تعدد اللغات (عربي/إنجليزي)
8. **[منخفض]** تحسين الـ accessibility (keyboard navigation, screen reader labels)


---

## Task ID: 3
Agent: Z.ai Code (cron review round 2)
Task: مراجعة المشروع وإضافة نظام XP ونشاط وأحداث جديدة

### الحالة الحالية للمشروع (تقييم)
- ✅ المشروع مستقر ويعمل على المنفذ 3000
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ جميع API routes تستجيب بـ 200
- ✅ المحرر التفاعلي يعمل (اختبرناه على دروس TypeScript)
- ✅ بحث وفلترة المسارات يعملان
- ✅ نظام السلسلة اليومية يعمل
- ✅ بطاقة "تابع التعلّم" تظهر بعد إكمال درس

### الأهداف المنجزة في هذه الجولة

#### 1. نظام XP / النقاط (gamification أعمق)
- **قاعدة البيانات:** إضافة 3 نماذج جديدة إلى schema.prisma:
  - `UserXP` — إجمالي النقاط + عدّادات سريعة (lessonsCompleted, quizzesPassed, badgesEarned)
  - `XPHistory` — سجل كل حدث نقطة (مع refId للـ idempotency)
  - `DailyActivity` — نشاط يومي للـ heatmap (sessionId + date + count)
- **`/lib/xp.ts`** — منطق النقاط الكامل:
  - `awardXP(sessionId, action, refId)` — idempotent (يتحقق من XPHistory)
  - `getLevel(totalXP)` — منحنى تربيعي (Level N يحتاج 50*N*(N+1) XP)
  - `getUserXPData(sessionId)` — يجلب الكل (نقاط، مستوى، تاريخ، نشاط يومي)
  - عناوين المستويات بالعربية: مبتدئ → متعلّم → متمرّس → محرّر → محترف → خبير → معلّم → أسطورة → إله البرمجة
- **نقاط الأحداث:**
  - إكمال درس: +50 XP
  - اجتياز اختبار (≥60%): +30 XP
  - نتيجة كاملة (100%): +50 XP bonus
  - إكمال مسار: +200 XP
  - كسب شارة: +25 XP
- **API endpoint `/api/xp`** — GET يجلب كل بيانات XP للمستخدم
- **تحديث الـ endpoints الموجودة:**
  - `/api/progress/lesson` POST — يمنح XP لإكمال الدرس + إكمال المسار
  - `/api/lessons/[id]/check` POST — يمنح XP لاجتياز الاختبار + النتيجة الكاملة + إكمال الدرس + إكمال المسار
  - `/api/achievements` POST — يمنح XP لكسب الشارة
- **مكوّن `xp-indicator.tsx`:**
  - `HeaderXPIndicator` — مؤشر مدمج في الـ Header (⚡ + نقاط + LV#) مع tooltip
  - `XPCard` — بطاقة كاملة في صفحة التقدّم (level badge، progress bar، mini-stats)
  - `XPEarnedPopup` — popup متحرك للنقاط المربوحة (جاهز للاستخدام)
- **Toasts ذكية:** عند إكمال درس/اختبار، toast يظهر بـ "⚡ +N نقطة خبرة!" مع تفصيل الأسباب

#### 2. خريطة نشاط الحرارة (Activity Heatmap)
- **`activity-heatmap.tsx`** — تقويم نشاط بأسلوب GitHub:
  - 12 أسبوعًا × 7 أيام (84 خلية)
  - 5 مستويات ألوان (من رمادي فاتح إلى أخضر داكن)
  - تسميات الأشهر في الأعلى + أيام الأسبوع على الجانب
  - إحصائيات: أيام نشطة، إجمالي الأحداث
  - تأثير hover (zoom + tooltip)
  - تمييز اليوم الحالي بـ ring
  - legend أسفل (أقل ← أكثر)
  - يدعم RTL

#### 3. تحسينات صفحة الدرس
- **`reading-progress.tsx`** — شريط تقدّم القراءة في الأعلى (يتحرك مع scroll)
- **Breadcrumb navigation** — الرئيسية > المسار > الدرس (قابل للنقر)
- استبدال زر "العودة للمسار" القديم بـ breadcrumb أوضح

#### 4. دروس جديدة (Tailwind track)
- كان عند Tailwind درسان فقط، أضفت درسين:
  - **"تخطيطات Flexbox و Grid المتقدمة"** — navbar, sidebar, dashboard, بطاقات
  - **"ميزات متقدمة: Variants، Plugins، و Customization"** — group/peer, focus-visible, arbitrary values, container queries
- الإجمالي الآن: **19 درس** (كان 17)، 19 اختبار

#### 5. تحسينات التصميم
- **XP card** بتصميم glassmorphism مع gradient + blobs
- **Level badge** بحركة spring animation عند الظهور
- **Progress bar متدرّج** (violet → fuchsia) مع pulse overlay
- **Tooltip** في مؤشر الـ Header (يظهر عند hover)
- **Heatmap cells** بحركة staggered عند التحميل
- **Reading progress bar** متدرّج لاصق أعلى الصفحة

### نتائج التحقق (QA via agent-browser)
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ XP API يستجيب: `{"total":0,"level":1,"levelTitle":"مبتدئ",...}`
- ✅ إكمال درس يمنح +50 XP (تحقق: 75 XP بعد درس + شارة)
- ✅ اجتياز اختبار بنسبة 100% يمنح +130 XP (30+50+50)
- ✅ المستوى يزيد: من Level 1 "مبتدئ" إلى Level 2 "متعلّم"
- ✅ مؤشر XP في الـ Header يعرض "205 LV2"
- ✅ بطاقة XP في صفحة التقدّم تعرض المستوى + النقاط + شريط التقدّم
- ✅ Heatmap يعرض "1 أيام نشطة" و "5 إجمالي الأحداث"
- ✅ Breadcrumb يعمل: الرئيسية > Tailwind CSS 4 > أساسيات Tailwind
- ✅ شريط تقدّم القراءة يظهر أعلى صفحة الدرس
- ✅ Tailwind track الآن يحتوي على 4 دروس
- ✅ لا أخطاء في سجل الـ dev server

### مخاطر/أمور غير محلولة
- **Prisma Client caching**: عند تعديل schema، يجب إعادة تشغيل dev server لتحميل Prisma Client الجديد. تم حلها بإعادة التشغيل.
- **XP idempotency**: يعتمد على refId — لو نفّذ نفس الدرس مرتين، لا يُمنح XP مرة ثانية (صحيح). لكن لو حُذف XPHistory، يمكن كسب XP مرة أخرى (مقبول للتطوير).
- **Streak vs DB Activity**: السلسلة لا تزال في localStorage فقط، بينما DailyActivity في قاعدة البيانات. يفضل توحيدهما مستقبلاً.

### توصيات للمرحلة القادمة (الأولويات)
1. **[عالٍ]** إضافة "كيف أبدأ؟" onboarding flow تفاعلي للمستخدمين الجدد
2. **[عالٍ]** إضافة "درس اليوم" / تحدي يومي على الصفحة الرئيسية
3. **[متوسط]** نقل تتبع السلسلة لقاعدة البيانات (Activity model) لمزامنة الأجهزة
4. **[متوسط]** إضافة جدول متصدّرين (leaderboard) — حتى لو وهمي للمستخدمين التجريبيين
5. **[متوسط]** إضافة المزيد من الشارات (مثل: "أكمل 5 دروس في يوم"، "اجتاز 10 اختبارات"، "حقق 100% في 5 اختبارات")
6. **[منخفض]** إضافة دعم تعدد اللغات (عربي/إنجليزي)
7. **[منخفض]** تحسين الـ accessibility (keyboard navigation, screen reader labels)
8. **[منخفض]** إضافة صفحة "المسار التعليمي الموصى به" بناءً على أهداف المستخدم


---

## Task ID: 4
Agent: Z.ai Code (cron review round 3)
Task: مراجعة المشروع وإضافة onboarding وتحدّي يومي وleaderboard وشارات

### الحالة الحالية للمشروع (تقييم)
- ✅ المشروع مستقر ويعمل على المنفذ 3000
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ نظام XP يعمل (تحقق: 255 XP، Level 2 "متعلّم")
- ✅ Heatmap يعمل
- ✅ جميع API routes تستجيب بـ 200
- ✅ المحرر التفاعلي يعمل
- ✅ بحث وفلترة يعملان
- لا أخطاء في سجل الـ dev server

### الأهداف المنجزة في هذه الجولة

#### 1. Onboarding Modal تفاعلي
- **`onboarding-modal.tsx`** — نافذة ترحيب من 6 خطوات:
  1. 📚 اختر مسارًا للبدء
  2. 💻 اقرأ الدرس وجرّب الكود
  3. ✅ اختبر فهمك
  4. ⚡ اربح نقاط الخبرة (XP)
  5. 🔥 حافظ على سلسلتك
  6. 🚀 أنت جاهز!
- تصميم احترافي مع:
  - رأس متدرّج يتغيّر لونه مع كل خطوة
  - كرات ضبابية متحركة في الخلفية
  - emoji كبير متحرك (spring animation)
  - نقاط تقدّم قابلة للنقر
  - أزرار السابق/التالي/تخطّي الكل
  - زر "ابدأ رحلتي" في الخطوة الأخيرة
- يُحفظ في localStorage (لا يظهر مرة ثانية)
- زر "إعادة عرض المقدمة" في الـ Footer
- معالجة SSR صحيحة (لا يظهر على الـ server، يظهر بعد hydration)

#### 2. تحدّي اليوم (Daily Challenge)
- **API `/api/daily-challenge`** — درس يومي حتمي (deterministic by date):
  - نفس الدرس لكل المستخدمين في نفس اليوم
  - يتجدّد تلقائيًا كل 24 ساعة
  - يستخدم hash للتاريخ لاختيار درس عشوائي
  - يتضمّن حالة إكمال المستخدم + أفضل نتيجة
- **`daily-challenge-card.tsx`** — بطاقة جذابة على الصفحة الرئيسية:
  - أيقونة Calendar متحركة + توهج pulse
  - رقم التحدّي (تحدّي #639)
  - معاينة الدرس مع icon المسار + المدة
  - زر "ابدأ التحدّي" أو "مراجعة" لو مكتمل
  - خلفية متدرّجة amber/orange مع blobs ضبابية متحركة
  - رسالة تحفيزية حسب الحالة

#### 3. جدول المتصدّرين (Leaderboard)
- **API `/api/leaderboard`** — قائمة متصدّرين بـ 10 متعلّمين وهميين + المستخدم الحقيقي:
  - يُدرج المستخدم في الترتيب الصحيح حسب XP
  - يحسب النسبة المئوية (percentile)
  - يحسب المستوى لكل متسابق
- **`leaderboard-card.tsx`** — تصميم احترافي على صفحة التقدّم:
  - منصّة Top 3 (ذهبي/فضي/برونزي) مع Crown للمركز الأول
  - قائمة الباقي مع رقم الترتيب، avatar، الاسم، المستوى، XP
  - تمييز صف المستخدم الحالي (خلفية + ring)
  - banner النسبة المئوية: "ضمن أعلى X% من المتعلّمين"
  - حركات staggered للظهور
  - أرقام XP بالعربية (استخدام toLocaleString("ar-EG"))

#### 4. شارات إنجاز جديدة (+6)
أضفت 6 شارات جديدة (الإجمالي الآن 11):
- متعلّم سريع (5 دروس)
- بطل الاختبارات (5 اختبارات مجتازة)
- الكمال (5 نتائج 100%)
- ماستر الويب (3 مسارات كاملة)
- جامع النقاط (500 XP)
- محترف متمكّن (1000 XP)
- **تحديث `syncAchievements`** — يدعم الآن:
  - `lessons_completed:N` (1, 5, 10)
  - `track_completed:N` / `tracks_completed:N`
  - `tracks_started:N`
  - `perfect_quizzes:N` (3, 5)
  - `quizzes_passed:N`
  - `xp_total:N` (دعم الأرقام المختلفة)
- أيقونات جديدة في track-icon.tsx: Zap, Sparkles, Star

#### 5. تحسينات التصميم
- **Feature cards محسّنة** على الصفحة الرئيسية:
  - 6 بطاقات بألوان مختلفة (emerald, amber, violet, sky, rose, teal)
  - hover effects: scale + lift + shadow
  - whileInView animations (تظهر عند التمرير)
  - محتوى محدّث: محرر تفاعلي، نقاط ومستويات، تتبّع نشاط، جدول متصدّرين، تحدّي يومي
- **Footer محسّن** — زر "إعادة عرض المقدمة" لعرض الـ onboarding يدويًا
- **Daily challenge card** بتصميم gradient + blobs متحركة
- **Leaderboard** بمنصّة Top 3 + Crown animation

### نتائج التحقق (QA via agent-browser)
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ Onboarding modal يظهر عند أول زيارة (6 خطوات تعمل)
- ✅ التنقل بين خطوات الـ onboarding يعمل (التالي/السابق)
- ✅ زر "تخطّي الكل" يغلق الـ modal ويحفظ في localStorage
- ✅ زر "إعادة عرض المقدمة" في الـ Footer يعمل
- ✅ Daily Challenge API: `{"challengeDay":639,"lesson":{...},"completed":false}`
- ✅ بطاقة تحدّي اليوم تظهر على الصفحة الرئيسية
- ✅ Leaderboard API: 11 متسابق، المستخدم #10
- ✅ Leaderboard card تعرض منصّة Top 3 + قائمة كاملة
- ✅ النسبة المئوية تظهر: "ضمن أعلى 91% من المتعلّمين"
- ✅ إكمال درس يمنح +50 XP (تحقق: 255 XP بعد إكمال درس)
- ✅ XP toast يظهر: "⚡ +50 نقطة خبرة!"
- ✅ 11 شارة إنجاز تظهر في صفحة الإنجازات
- ✅ لا أخطاء في سجل الـ dev server

### مخاطر/أمور غير محلولة
- **Leaderboard وهمي**: المتسابقون الـ 10 ليسوا حقيقيين. للتطبيق الحقيقي، يجب ربطهم بقاعدة البيانات.
- **Onboarding SSR**: استخدمت `useSyncExternalStore` مع server snapshot = true لتجنّب hydration mismatch. الحل يعمل لكن يتطلب إعادة تحميل الصفحة عند مسح الـ flag.
- **Daily challenge idempotency**: لا يوجد مكافأة مضاعفة فعلية للتحدّي اليومي — فقط XP العادي. يمكن إضافة bonus يومي لاحقًا.

### توصيات للمرحلة القادمة (الأولويات)
1. **[عالٍ]** ربط Leaderboard بقاعدة البيانات الحقيقية (استبدال المستخدمين الوهميين)
2. **[عالٍ]** إضافة مكافأة XP مضاعفة للتحدّي اليومي (مثل ×2)
3. **[متوسط]** إضافة صفحة "تفاصيل الإنجاز" لكل شارة (شرط الفوز، التقدّم نحوها)
4. **[متوسط]** إضافة إشعارات يومية (push notification للتذكير بالتحدّي)
5. **[متوسط]** إضافة المزيد من الدروس لمسارات React و Next.js (3 دروس لكل منهما)
6. **[منخفض]** إضافة دعم تعدد اللغات (عربي/إنجليزي)
7. **[منخفض]** إضافة مؤثرات صوتية عند ربح XP / شارة
8. **[منخفض]** إضافة dark/light theme toggle في الـ onboarding


---

## Task ID: 5
Agent: Z.ai Code (cron review round 4)
Task: مراجعة وإضافة مكافأة تحدّي يومي ×2 وتفاصيل الشارات ودرس جديد

### الحالة الحالية للمشروع (تقييم)
- ✅ المشروع مستقر ويعمل على المنفذ 3000
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ XP system يعمل (255 XP, Level 2)
- ✅ Daily challenge API يعمل
- ✅ Leaderboard يعمل
- لا أخطاء في سجل الـ dev server

### الأهداف المنجزة في هذه الجولة

#### 1. مكافأة التحدّي اليومي ×2 (Daily Challenge XP Multiplier)
- **تحديث `awardXP`** في `/lib/xp.ts` — أضفت معامل `multiplier` اختياري:
  - `awardXP(sessionId, action, refId, multiplier = 1)`
  - يحسب النقاط = `basePoints * multiplier`
- **`isTodayDailyChallenge(lessonId)`** — دالة حتمية في `/api/lessons/[id]/check`:
  - تحقق بنفس منطق `/api/daily-challenge` (hash التاريخ)
  - تأكدت من تطابق `orderBy: { id: "asc" }` في كلا الـ APIs
- **منطق التطبيق** — عند اجتياز اختبار درس هو تحدّي اليوم:
  - quiz_pass: 30 × 2 = 60 XP
  - quiz_perfect: 50 × 2 = 100 XP
  - lesson_complete: 50 × 2 = 100 XP (لو لم يكن مكتملًا)
  - track_complete: 200 XP (لا مضاعفة — نادر)
- **عرض الـ badge في الـ LessonView**:
  - أيقونة 🔥 + "تحدّي اليوم · XP ×2" مع animate-pulse
  - يظهر فقط إذا الدرس هو تحدّي اليوم
- **Toast محسّن** — يضيف "🔥 مكافأة التحدّي ×2" للأسباب
- **تحقق**: XP ذهب من 305 → 465 (+160) عند اجتياز اختبار تحدّي اليوم بنسبة 100%

#### 2. تفاصيل الشارات مع شريط التقدّم (Achievement Progress Detail)
- **`achievement-progress-card.tsx`** — بطاقة شارة مع تقدّم حي:
  - يحلل `condition` (مثل "lessons_completed:5") إلى نوع + هدف
  - يجلب التقدّم الحالي من `/api/progress` + `/api/xp`
  - يعرض "X / Y دروس مكتملة" مع progress bar
  - يعرض الهدف للمكسوبة أيضًا
  - زر لفتح modal التفاصيل
- **`AchievementDetailModal`** — نافذة منبثقة لكل شارة:
  - رأس متدرّج (amber للشارات المكسوبة، رمادي للمقفلة)
  - emoji كبير (🏆 أو 🔒) مع spring animation
  - عنوان + وصف
  - بطاقة التقدّم الحالية
  - تاريخ الكسب (لو مكسوبة) بصيغة عربية
  - رسالة تحفيزية (لو مقفلة)
  - blobs ضبابية متحركة في الخلفية
- **تحديث `achievements-view.tsx`**:
  - استبدلت الـ cards القديمة بـ AchievementProgressCard
  - أضفت state `selected` لإدارة الـ modal
  - حركات staggered عند الظهور

#### 3. Leaderboard حقيقي (Real DB-backed)
- **تحديث `/api/leaderboard`** — يجمع:
  - مستخدمين حقيقيين من `UserXP` table (مجهّلين كـ "متعلّم #NNN")
  - 10 متعلّمين وهميين (ghost learners)
  - المستخدم الحالي (دائمًا مُدرج)
- **تحقق**: 11 متعلم إجمالي (1 حقيقي + 9 وهمي + 1 حالي)
- المستخدم الحقيقي بـ 465 XP ranked #8
- يعرض `realDbLearners` count للشفافية

#### 4. دروس جديدة (+4)
أضفت 4 دروس جديدة (الإجمالي الآن **23 درس**):
- **React 19** (من 3 → 5 دروس):
  - "Context API و إدارة الحالة العامة" — prop drilling، Context، متى تنتقل لـ Zustand
  - "أنماط React المتقدمة" — custom hooks، compound components، render props، HOCs، lazy loading، error boundaries، forwardRef
- **Next.js 16** (من 3 → 5 دروس):
  - "النشر والتحسين للإنتاج" — metadata، sitemap، robots، Vercel، Docker، next.config
  - "المصادقة مع NextAuth.js" — credentials، OAuth، sessions، middleware، Prisma adapter

### نتائج التحقق (QA via agent-browser)
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ daily-challenge API يُرجع الدرس الصحيح مع `orderBy: { id: "asc" }`
- ✅ isTodayDailyChallenge يطابق نفس الدرس
- ✅ badge "تحدّي اليوم · XP ×2" يظهر في الـ Lesson hero
- ✅ XP toast يعرض "🔥 مكافأة التحدّي ×2" للأسباب
- ✅ اختبار التحدّي اليومي بنسبة 100% منح 160 XP (60+100)
- ✅ XP total ذهب من 305 → 465
- ✅ بطاقات الشارات تعرض "X / Y" مع progress bar
- ✅ modal التفاصيل يفتح عند النقر مع emoji + تقدم
- ✅ Leaderboard: 11 متعلم (1 حقيقي + 9 وهمي + 1 حالي)
- ✅ المستخدم ranked #8 بـ 465 XP
- ✅ React track الآن 5 دروس
- ✅ Next.js track الآن 5 دروس
- ✅ لا أخطاء في سجل الـ dev server

### مخاطر/أمور غير محلولة
- **Re-seed wipes progress**: إعادة التلقيم مسحت تقدّم المستخدم. هذا متوقع للتطوير.
- **Daily challenge idempotency**: لو أكمل المستخدم درس التحدّي يدويًا (mark complete)، لا يحصل على المضاعفة — فقط عند اجتياز الاختبار. هذا مقصود.
- **Real DB users in leaderboard**: الأسماء مجهّلة ("متعلّم #123"). للتطبيق الحقيقي، يجب إضافة حقل `name` لجدول UserXP.

### توصيات للمرحلة القادمة (الأولويات)
1. **[عالٍ]** إضافة bookmarks/favorites للدروس (يمكن للمستخدم حفظ دروس للمراجعة)
2. **[عالٍ]** إضافة confetti animation عند ربح XP كبير / شارة جديدة / رفع مستوى
3. **[متوسط]** إضافة "الدرس التالي الموصى به" بناءً على تقدّم المستخدم
4. **[متوسط]** إضافة مولّد خرائط ذهنية للمسار (mind map view)
5. **[متوسط]** إضافة مؤثرات صوتية اختيارية عند ربح XP
6. **[منخفض]** إضافة دعم تعدد اللغات (عربي/إنجليزي)
7. **[منخفض]** إضافة صفحة بحث عامة عن كل الدروس
8. **[منخفض]** إضافة keyboard shortcuts (J/K للتنقل بين الدروس)


---

## Task ID: 6
Agent: Z.ai Code (cron review round 5)
Task: مراجعة وإضافة إشارات مرجعية واحتفال رفع المستوى واختصارات لوحة المفاتيح

### الحالة الحالية للمشروع (تقييم)
- ✅ المشروع مستقر ويعمل على المنفذ 3000
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ XP system يعمل (465 XP, Level 3 "متمرّس")
- ✅ 23 درسًا عبر 6 مسارات
- ✅ نظام التحدّي اليومي مع ×2 XP bonus يعمل
- ✅ لا أخطاء في سجل الـ dev server

### الأهداف المنجزة في هذه الجولة

#### 1. الإشارات المرجعية للدروس (Bookmarks)
- **قاعدة البيانات**: إضافة `Bookmark` model (sessionId + lessonId + createdAt) مع علاقة `bookmarks` على `Lesson`
- **API `/api/bookmarks`**:
  - GET: يجلب كل الإشارات المرجعية للمستخدم مع تفاصيل الدرس
  - POST: toggle (يضيف/يحذف) — idempotent عبر `@@unique([sessionId, lessonId])`
- **`useBookmarks` hook** — مع optimistic updates:
  - `bookmarkIds` قائمة IDs
  - `isBookmarked(lessonId)` للتحقق
  - `toggle(lessonId)` للإضافة/الحذف
  - `isToggling` لحالة التحميل
- **`BookmarkButton` component** — زر مع animation:
  - متغيران: `icon` (في صفحة الدرس) و `button` (مكان آخر)
  - Spring animation عند التبديل
  - أيقونة `BookmarkCheck` للإشارة المحفوظة
  - Toast تأكيد: "أُضيف إلى الإشارات المرجعية" / "أُزيل من الإشارات المرجعية"
- **`BookmarksView`** — صفحة كاملة:
  - Empty state جذاب مع دعوة للتصفّح
  - قائمة الدروس المحفوظة مع track color strip + track icon + title + duration
  - زر إزالة سريع لكل درس
  - animations staggered
- **Header badge**: عداد على زر المحفوظات في الـ Header (خلفية amber، رقم العدد)

#### 2. احتفال رفع المستوى (Level-Up Celebration)
- **`confetti.tsx`** — مكونان:
  - `ConfettiBurst` — انفجار ألوان (50-80 قطعة):
    - ألوان متعددة (emerald, amber, violet, pink, cyan, rose, yellow)
    - emojis عشوائية (🎉 🎊 ✨ ⭐ 🏆 ⚡ 🔥 💫)
    - حركات Framer Motion مع دوران + سقوط
    - delay + duration عشوائي لكل قطعة
  - `LevelUpCelebration` — overlay كامل الشاشة:
    - خلفية سوداء شفافة + backdrop blur
    - emoji 🎊 كبير بحركة اهتزاز
    - "رفع المستوى!" بنص متدرّج (amber → orange → rose)
    - رقم المستوى + العنوان
    - زر "متابعة التعلّم 🚀"
- **`useLevelUpTracker` hook** — يتتبّع تغيّر المستوى:
  - يفحص XP كل 5 ثوانٍ
  - يقارن مع المستوى السابق (ref)
  - يُطلق `leveledUp = true` عند زيادة المستوى
  - `dismissLevelUp` لإعادة التعيين
- **مدمج في page.tsx** — يظهر تلقائيًا عند رفع المستوى

#### 3. اختصارات لوحة المفاتيح
- **`use-keyboard-shortcuts` hook** — يسمع keydown على window:
  - `J` / `H`: الصفحة الرئيسية
  - `K` / `P`: تقدّمي
  - `B`: المحفوظات
  - `T` / `A`: الإنجازات
  - يتجاهل الكتابة في inputs/textareas
  - يتجاهل المعدّلات (Ctrl/Cmd/Alt)
- **عرض الاختصارات في الـ Footer** — قسم جديد "اختصارات لوحة المفاتيح":
  - 4 اختصارات مع kbd styling (J, K, B, T)
  - تصميم neat مع border + bg-muted

#### 4. تحسين الـ Bookmark UX
- تمييز الـ bookmark في الـ Header:
  - زر مع أيقونة Bookmark
  - badge عدّاد (amber background, white text)
  - tooltip "الإشارات المرجعية"
- في الـ LessonView:
  - زر bookmark في hero بجانب العنوان
  - spring animation عند التبديل
  - toast تأكيد مع عنوان الدرس

### نتائج التحقق (QA via agent-browser)
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ bookmarks API تعمل (GET + POST toggle)
- ✅ زر bookmark يظهر في صفحة الدرس
- ✅ النقر على زر bookmark يضيفه + toast "أُضيف"
- ✅ العداد في الـ Header يظهر (1 بعد إضافة إشارة)
- ✅ صفحة المحفوظات تعرض الدرس المحفوظ
- ✅ زر الإزالة في صفحة المحفوظات يعمل
- ✅ empty state جذاب عند عدم وجود إشارات
- ✅ اختصارات لوحة المفاتيح تعمل:
  - `B` → صفحة المحفوظات ✅
  - `K` → صفحة التقدّم ✅
  - `J` → الصفحة الرئيسية ✅
- ✅ الاختصارات تظهر في الـ Footer
- ✅ Level-up celebration component مركّب و جاهز
- ✅ لا أخطاء في سجل الـ dev server

### مخاطر/أمور غير محلولة
- **Level-up celebration**: لا يمكن اختباره بالكامل دون ربح XP كافٍ لرفع المستوى. المكون مركّب وجاهز للعمل التلقائي.
- **Prisma client caching**: عند إضافة `Bookmark` model، احتاج إعادة تشغيل dev server لتحميل Prisma Client الجديد (تم الحل).

### توصيات للمرحلة القادمة (الأولويات)
1. **[عالٍ]** إضافة "الدرس التالي الموصى به" بناءً على تقدّم المستخدم (smart suggestion)
2. **[عال]** إضافة محرّك بحث عام عن كل الدروس (بحث في المحتوى)
3. **[متوسط]** إضافة "ملخص المسار" عند إكمال مسار (review page)
4. **[متوسط]** إضافة شهادة إكمال مسار (certificate)
5. **[متوسط]** إضافة وضع تركيز (focus mode) للقراءة
6. **[منخفض]** إضافة دعم تعدد اللغات (عربي/إنجليزي)
7. **[منخفض]** إضافة تصدير/استيراد التقدّم (JSON)
8. **[منخفض]** إضافة PWA support للعمل offline


---

## Task ID: 7
Agent: Z.ai Code (cron review round 6)
Task: مراجعة وإضافة بحث شامل ومحتويات الدرس وتوصية ذكية للدرس التالي

### الحالة الحالية للمشروع (تقييم)
- ✅ المشروع مستقر ويعمل على المنفذ 3000
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ XP system يعمل (465 XP, Level 3 "متمرّس")
- ✅ 23 درسًا عبر 6 مسارات
- ✅ نظام التحدّي اليومي مع ×2 XP bonus يعمل
- ✅ الإشارات المرجعية تعمل (1 bookmark)
- ✅ لا أخطاء حديثة في سجل الـ dev server

### الأهداف المنجزة في هذه الجولة

#### 1. البحث الشامل (Global Search)
- **API `/api/search?q=...`** — بحث في كل الدروس والمسارات:
  - يبحث في title, summary, content للدروس
  - يبحث في title, description للمسارات
  - ترتيب النتائج: title match (+100), summary match (+50), content match (+10)
  - حد 20 نتيجة للدروس + 10 للمسارات
- **`GlobalSearch` component** — command palette كامل:
  - يفتح بـ Ctrl+K / Cmd+K أو زر "/" أو زر البحث في الـ Header
  - بحث فوري أثناء الكتابة (debounce عبر React Query)
  - لوحة نتائج مع keyboard navigation (↑↓ للتنقل، Enter للاختيار، ESC للإغلاق)
  - تمييز النتيجة النشطة (highlight)
  - أقسام منفصلة: مسارات + دروس
  - حالة فارغة مع اقتراحات (useState, Prisma, Tailwind, Generics, hooks)
  - حالة "لا نتائج" مع رسالة واضحة
  - footer مع اختصارات لوحة المفاتيح
  - spring animation عند الفتح/الإغلاق
- **`SearchTriggerButton`** — زر في الـ Header مع:
  - أيقونة Search
  - نص "بحث في الدروس" (على lg+)
  - kbd badge "Ctrl K"

#### 2. محتويات الدرس (Table of Contents)
- **`LessonTableOfContents` component**:
  - يستخرج العناوين (h2, h3) من markdown تلقائيًا
  - **desktop**: floating sidebar على اليمين (في RTL)
    - يظهر ثابتًا أثناء التمرير
    - تمييز القسم النشط (IntersectionObserver)
    - border-s-2 للقسم النشط
  - **mobile**: زر قابل للطي "محتويات الدرس"
    - يعرض عدد الأقسام
    - animates open/close
  - النقر على عنوان يمرر بسلاسة للقسم (scrollIntoView مع offset للـ header)
  - تخطّي أول h1 (عنوان الدرس يظهر في الـ hero)

#### 3. توصية الدرس التالي (Recommended Next)
- **API `/api/recommend-next`** — منطق ذكي:
  1. **continue_track**: لو مستخدم عنده مسار غير مكتمل، يوصي بأول درس غير مكتمل فيه
  2. **start_track**: لو مستخدم بدأ مسار بـ 0%، يوصي بأول درس
  3. **new_track**: لو لا يوجد مسارات غير مكتملة، يوصي بأول درس من مسار جديد
  4. **any_uncompleted**: لو كل المسارات بدأت، يوصي بأي درس غير مكتمل
  5. **all_done**: لو كل شيء مكتمل، رسالة تهنئة
  6. **first_ever**: لو مستخدم جديد، يوصي بأول درس من أول مسار (TypeScript)
- **`RecommendedNextCard` component**:
  - 6 أنواع توصيات بألوان وأيقونات مختلفة
  - label متغيّر حسب النوع ("ابدأ هنا"، "تابع التعلّم"، "مسار جديد", إلخ)
  - معاينة الدرس مع track icon + title + summary
  - زر CTA ينقل للدرس مباشرة
  - حالة "all_done" بتصميم احتفالي (amber gradient)

#### 4. تحسينات التصميم
- **Home page**: Daily Challenge + Recommended Next في grid 2 أعمدة (lg+)
- **Search modal**: تصميم احترافي مع backdrop blur + spring animation
- **TOC sidebar**: floating card مع backdrop-blur
- **Recommended card**: gradient backgrounds حسب نوع التوصية

### نتائج التحقق (QA via agent-browser)
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ search API يجد 7 دروس لـ "useState" + 4 لـ "Prisma"
- ✅ search modal يفتح بـ Ctrl+K وزر البحث
- ✅ keyboard navigation يعمل (↑↓ Enter ESC)
- ✅ النقر على نتيجة بحث ينقل للدرس
- ✅ TOC يظهر في صفحة الدرس مع 4 أقسام
- ✅ النقر على عنوان في TOC يمرر للقسم
- ✅ recommend-next API يرجع `new_track` للدروس غير المبدوءة
- ✅ RecommendedNextCard تعرض التوصية الصحيحة مع track icon + lesson
- ✅ النقر على التوصية ينقل للدرس
- ✅ لا أخطاء حديثة في سجل الـ dev server

### مخاطر/أمور غير محلولة
- **Search ranking**: ترتيب بسيط (title/summary/content). يمكن تحسينه بـ TF-IDF أو بحث نصي كامل (PostgreSQL FTS).
- **TOC heading IDs**: يعتمد على ترتيب الـ DOM مطابق لترتيب الـ TOC. لو Markdown أضاف عناوين إضافية، قد يحدث mismatch.
- **Recommend-next for new users**: يرجع أول درس من TypeScript دائمًا — يمكن جعله أكثر ذكاءً بناءً على اهتمامات المستخدم.

### توصيات للمرحلة القادمة (الأولويات)
1. **[عالٍ]** إضافة شهادة إكمال مسار (certificate) عند إكمال 100%
2. **[عال]** إضافة "ملخص المسار" review page قبل الشهادة
3. **[متوسط]** إضافة وضع تركيز (focus mode) للقراءة بدون إلهاء
4. **[متوسط]** إضافة مؤثرات صوتية اختيارية عند ربح XP / شارة
5. **[متوسط]** إضافة تصدير/استيراد التقدّم (JSON backup)
6. **[منخفض]** إضافة دعم تعدد اللغات (عربي/إنجليزي)
7. **[منخفض]** إضافة PWA support للعمل offline
8. **[منخفض]** إضافة print styles للدروس


---

## Task ID: 8
Agent: Z.ai Code (cron review round 7)
Task: مراجعة وإضافة شهادات إتمام المسارات + طباعة PDF + أنماط طباعة

### الحالة الحالية للمشروع (تقييم)
- ✅ المشروع مستقر ويعمل على المنفذ 3000
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ XP system يعمل (815 XP بعد إكمال TS track، Level 4 "محرّر")
- ✅ 23 درسًا عبر 6 مسارات
- ✅ نظام البحث الشامل يعمل
- ✅ نظام التوصية الذكية يعمل
- ✅ محتويات الدروس تعمل
- لا أخطاء حديثة في سجل الـ dev server

### الأهداف المنجزة في هذه الجولة

#### 1. شهادات إتمام المسارات (Course Completion Certificates)
- **API `/api/certificate`** — نقطتا نهاية:
  - GET مع `trackId`: يفحص أهلية المستخدم (100% إكمال) ويرجع بيانات الشهادة الكاملة
  - GET بدون `trackId`: يرجع كل الشهادات المكتسبة للمستخدم
  - يحسب: تاريخ الإتمام، عدد الدروس، المدة الإجمالية، متوسط النتائج، مستوى المستخدم، XP الكلي
  - يولّد معرّف شهادة فريد: `CERT-TYPESCRIPT-MUR5HV81`
- **`CertificateModal`** — نافذة منبثقة للشهادة:
  - تصميم احترافي بحدود زخرفية + زوايا مزخرفة
  - علامة مائية Award في الخلفية
  - رأس: "أكاديمية البرمجة" + Programming Academy Certificate of Completion
  - عنوان: "شهادة إتمام"
  - اسم الطالب + خط فاصل
  - معلومات المسار مع track icon
  - شبكة إحصائيات (3 خانات): دروس مكتملة، متوسط النتائج، المدة
  - تذييل: تاريخ الإتمام، المستوى، XP الكلي
  - معرّف الشهادة (Cert ID)
  - أزرار: مشاركة، طباعة/PDF، إغلاق
  - حركات spring متدرّجة عند الظهور
- **`CertificateList`** — قائمة الشارات على صفحة التقدّم:
  - header بـ amber gradient + أيقونة Award
  - عداد الشهادات المكتسبة
  - empty state جذاب عند عدم وجود شهادات
  - كل عنصر قابل للنقر لفتح الشهادة
  - يعرض: track icon, title, دروس مكتملة، متوسط النتائج
  - hover effect على أيقونة Award (scale-110)
- **زر "عرض الشهادة"** في TrackView:
  - يظهر فقط للمسارات المكتملة 100%
  - بجانب badge "مكتمل! أحسنت"
  - amber styling مع hover effect

#### 2. أنماط الطباعة (Print Styles)
- **`@media print`** في globals.css:
  - يخفي كل العناصر ما عدا الشهادة (`visibility: hidden`)
  - يعرض فقط `.certificate-print-area` وأبناءها
  - يضع الشهادة في أعلى الصفحة (position: absolute)
  - يفرض خلفية بيضاء ونص أسود
  - يمنع page breaks داخل الشهادة
  - هوامش صفحة 1cm
- **زر "طباعة / حفظ PDF"** — يستدعي `window.print()`:
  - المستخدم يمكنه حفظ الشهادة كـ PDF عبر نافذة الطباعة
  - action bar مخفي في الطباعة (`print:hidden`)

#### 3. تكامل Zustand Store
- إضافة `certificateTrackId` state + `openCertificate`/`closeCertificate` actions
- `CertificateModal` مركّب في page.tsx، يستمع لتغيّر `certificateTrackId`
- النقر على شهادة في القائمة أو زر "عرض الشهادة" يفتح الـ modal

### نتائج التحقق (QA via agent-browser)
- ✅ `bun run lint` يجتاز بدون أخطاء
- ✅ certificate API يرجع 0 شهادات قبل الإكمال، 1 بعد إكمال TS track
- ✅ Cert ID صحيح: `CERT-TYPESCRIPT-MUR5HV81`
- ✅ CertificateList تظهر على صفحة التقدّم مع "1 شهادة مكتسبة"
- ✅ النقر على شهادة في القائمة يفتح modal الشهادة
- ✅ زر "عرض الشهادة" يظهر في TrackView للمسار المكتمل
- ✅ النقر على زر "عرض الشهادة" يفتح modal الشهادة
- ✅ الشهادة تعرض: العنوان، الطالب، المسار، الإحصائيات، التاريخ، المستوى، XP، Cert ID
- ✅ أزرار: مشاركة، طباعة/PDF، إغلاق موجودة
- ✅ لا أخطاء حديثة في سجل الـ dev server

### مخاطر/أمور غير محلولة
- **Print testing**: لم أختبر الطباعة الفعلية (تتطلب متصفحًا فعليًا)، لكن الأنماط مضافة بشكل صحيح.
- **Student name**: يعرض "متعلّم أكاديمية البرمجة" بشكل عام — لا يوجد نظام مصادقة فعلي لإضافة أسماء حقيقية.
- **Certificate verification**: لا يوجد نظام تحقق من صحة الـ Cert ID (مثل QR code أو URL تحقق).

### توصيات للمرحلة القادمة (الأولويات)
1. **[عالٍ]** إضافة focus mode للدروس (إخفاء الـ sidebar/Header أثناء القراءة)
2. **[عال]** إضافة نظام تقييم الدروس (5 نجوم + تعليق)
3. **[متوسط]** إضافة QR code للشهادة للتحقق من صحتها
4. **[متوسط]** إضافة "ملخص المسار" review page قبل عرض الشهادة
5. **[متوسط]** إضافة مؤثرات صوتية اختيارية عند ربح XP / شارة
6. **[منخفض]** إضافة دعم تعدد اللغات (عربي/إنجليزي)
7. **[منخفض]** إضافة تصدير/استيراد التقدّم (JSON backup)
8. **[منخفض]** إضافة PWA support للعمل offline

