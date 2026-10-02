/**
 * Seed script for Programming Academy
 * Populates tracks, lessons, and quizzes with rich educational content.
 *
 * Run with: `bun run db:seed`
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type ChoiceInput = { text: string };
type QuestionInput = {
  text: string;
  correctIndex: number;
  explanation?: string;
  choices: ChoiceInput[];
};
type LessonInput = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  codeExample?: string;
  codeLanguage?: string;
  order: number;
  duration: number;
  quiz?: {
    title: string;
    questions: QuestionInput[];
  };
};
type TrackInput = {
  slug: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  level: string;
  order: number;
  duration: number;
  lessons: LessonInput[];
};

const tracks: TrackInput[] = [
  // 1. TypeScript
  {
    slug: "typescript",
    title: "TypeScript الأساسي",
    description:
      "تعلّم كتابة كود JavaScript بأمان تام باستخدام الأنواع الثابتة. الأساس الذي يبني عليه كل شيء.",
    color: "sky",
    icon: "FileCode2",
    level: "beginner",
    order: 1,
    duration: 90,
    lessons: [
      {
        slug: "ts-intro",
        title: "ما هو TypeScript؟ ولماذا نستخدمه؟",
        summary:
          "مقدمة عن TypeScript ومزاياه على JavaScript التقليدية.",
        content: `# ما هو TypeScript؟

**TypeScript** هو إضافة فوق JavaScript تضيف نظام أنواع ثابت (static type system). صُمّم بواسطة Microsoft وهو اليوم اللغة الأساسية لتطوير تطبيقات الويب الحديثة.

## لماذا نستخدمه؟

1. **اكتشاف الأخطاء مبكرًا** — الأخطاء تُكتشف وقت الكتابة، لا وقت التشغيل.
2. **توثيق ذاتي** — الأنواع تعمل كوثيقة واضحة للدوال والمكونات.
3. **إكمال ذكي للكود** — محرر الكود يفهم بنية بياناتك بالكامل.
4. **إعادة هيكلة آمنة** — تغيير اسم متغيّر لا يكسر الكود في مكان خفي.

## مثال: JavaScript مقابل TypeScript

في JavaScript قد يحدث خطأ صامت:

\`\`\`js
function addUser(user) {
  console.log(user.namme); // خطأ إملائي! يطبع undefined
}
\`\`\`

أما في TypeScript:

\`\`\`ts
type User = { name: string; age: number };

function addUser(user: User) {
  console.log(user.namme);
  // ❌ Error: Property 'namme' does not exist on type 'User'.
}
\`\`\`

## كيف يعمل؟

TypeScript لا يعمل في المتصفح. بل يُترجَم (compile) إلى JavaScript قبل التشغيل. تسمى هذه العملية **transpilation**.

\`\`\`bash
tsc file.ts   # ينتج file.js
\`\`\`

## في مشروع Next.js

Next.js يدعم TypeScript افتراضيًا. كل ملف \`.ts\` أو \`.tsx\` يُفحص تلقائيًا. كل ما عليك هو الكتابة!`,
        codeExample: `// متغيّر بنوع صريح
const username: string = "أحمد";
const age: number = 25;
const isActive: boolean = true;

// مصفوفة
const scores: number[] = [90, 85, 77];

// دالة مع أنواع للمدخلات والمخرجات
function greet(name: string): string {
  return \`مرحبًا \${name}!\`;
}

console.log(greet(username));`,
        codeLanguage: "ts",
        order: 1,
        duration: 12,
        quiz: {
          title: "اختبار: مقدمة TypeScript",
          questions: [
            {
              text: "ما الفائدة الرئيسية لـ TypeScript؟",
              correctIndex: 1,
              explanation:
                "الأكبر فائدة هي اكتشاف الأخطاء وقت الكتابة قبل التشغيل.",
              choices: [
                { text: "يجعل الكود أسرع في المتصفح" },
                { text: "يكتشف الأخطاء وقت الكتابة قبل التشغيل" },
                { text: "يضيف ميزات CSS جديدة" },
                { text: "يستبدل HTML" },
              ],
            },
            {
              text: "هل يعمل TypeScript مباشرة في المتصفح؟",
              correctIndex: 1,
              explanation:
                "TypeScript يُترجَم إلى JavaScript قبل التشغيل في المتصفح.",
              choices: [
                { text: "نعم، المتصفح يدعمه افتراضيًا" },
                { text: "لا، يُترجَم إلى JavaScript أولًا" },
                { text: "نعم، لكن فقط في Chrome" },
                { text: "نعم، لكن يحتاج إضافة" },
              ],
            },
          ],
        },
      },
      {
        slug: "ts-types",
        title: "الأنواع الأساسية والواجهات (Interfaces)",
        summary: "string, number, boolean, arrays, type aliases, interfaces.",
        content: `# الأنواع والواجهات في TypeScript

الأنواع (Types) هي قلب TypeScript. تخبر المترجم عن شكل البيانات.

## الأنواع الأساسية

\`\`\`ts
let name: string = "ليلى";
let count: number = 42;
let isOnline: boolean = true;
let nothing: null = null;
let maybe: undefined = undefined;
\`\`\`

## المصفوفات والـ Tuples

\`\`\`ts
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ["a", "b"];

// Tuple: مصفوفة بطول وأنواع ثابتة
const pair: [string, number] = ["age", 30];
\`\`\`

## type aliases

تعريف نوع مخصص:

\`\`\`ts
type UserID = string;
type Point = { x: number; y: number };

const id: UserID = "abc-123";
const origin: Point = { x: 0, y: 0 };
\`\`\`

## Interfaces

شائعة لوصف شكل كائن:

\`\`\`ts
interface User {
  id: string;
  name: string;
  age?: number; // اختياري
  readonly createdAt: Date; // للقراءة فقط
}

const u: User = {
  id: "1",
  name: "سارة",
  createdAt: new Date(),
};
\`\`\`

## type مقابل interface

- \`type\` أكثر مرونة (Union, Intersection, Conditional).
- \`interface\` أفضل للدمج (Declaration Merging) والكائنات.

قاعدة بسيطة: استخدم \`interface\` للكائنات، و\`type\` للأنواع المركبة.`,
        codeExample: `interface Product {
  id: string;
  name: string;
  price: number;
  tags?: string[];
}

function printProduct(p: Product) {
  console.log(\`\${p.name}: $\${p.price}\`);
}

printProduct({
  id: "p1",
  name: "حاسوب محمول",
  price: 1200,
  tags: ["إلكترونيات"],
});`,
        codeLanguage: "ts",
        order: 2,
        duration: 15,
        quiz: {
          title: "اختبار: الأنواع والواجهات",
          questions: [
            {
              text: "كيف نُعرّف خاصية اختيارية في interface؟",
              correctIndex: 2,
              explanation: "علامة الاستفهام ? تجعل الخاصية اختيارية.",
              choices: [
                { text: "age: optional number" },
                { text: "age: number!" },
                { text: "age?: number" },
                { text: "age: number | optional" },
              ],
            },
            {
              text: "ما الفرق بين type و interface؟",
              correctIndex: 3,
              explanation:
                "type يدعم Union/Intersection، وinterface يدعم Declaration Merging.",
              choices: [
                { text: "لا يوجد فرق إطلاقًا" },
                { text: "interface أسرع" },
                { text: "type أحدث" },
                {
                  text: "type أكثر مرونة، interface أفضل للدمج للكائنات",
                },
              ],
            },
          ],
        },
      },
      {
        slug: "ts-generics",
        title: "الأنواع العامة (Generics)",
        summary: "اكتب دوال ومكونات قابلة لإعادة الاستخدام بأمان الأنواع.",
        content: `# Generics في TypeScript

الـ Generics تتيح كتابة كود قابل لإعادة الاستخدام يحافظ على أمان الأنواع.

## المشكلة

بدون generics:

\`\`\`ts
function firstNumber(arr: number[]): number | undefined {
  return arr[0];
}
function firstString(arr: string[]): string | undefined {
  return arr[0];
}
// تكرار مزعج!
\`\`\`

## الحل: Generics

\`\`\`ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const n = first<number>([1, 2, 3]); // number | undefined
const s = first(["a", "b"]); // TS يستنتج string تلقائيًا
\`\`\`

\`T\` هو متغيّر نوع (type variable). يمكن أن يكون أي اسم.

## Generics متعددة

\`\`\`ts
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const p = pair("id", 42); // [string, number]
\`\`\`

## مع قيود (Constraints)

استخدم \`extends\` لتقييد النوع:

\`\`\`ts
function getLength<T extends { length: number }>(x: T): number {
  return x.length;
}

getLength("hello"); // ✅
getLength([1, 2]); // ✅
getLength(123); // ❌ Error
\`\`\`

## مثال شائع: useState في React

\`\`\`ts
function useState<T>(initial: T): [T, (v: T) => void] {
  // ...
  return [initial, () => {}];
}

const [count, setCount] = useState(0); // T = number
const [name, setName] = useState("أحمد"); // T = string
\`\`\`

الـ Generics أساس React hooks وكل المكتبات الحديثة.`,
        codeExample: `interface Box<T> {
  value: T;
}

function wrap<T>(value: T): Box<T> {
  return { value };
}

const numberBox = wrap(42);    // Box<number>
const stringBox = wrap("hi");  // Box<string>

console.log(numberBox.value.toFixed(2)); // 42.00
console.log(stringBox.value.toUpperCase()); // HI`,
        codeLanguage: "ts",
        order: 3,
        duration: 18,
        quiz: {
          title: "اختبار: Generics",
          questions: [
            {
              text: "ما فائدة Generics؟",
              correctIndex: 0,
              explanation:
                "Generics تتيح كودًا قابلاً لإعادة الاستخدام مع الحفاظ على أمان الأنواع.",
              choices: [
                {
                  text: "كود قابل لإعادة الاستخدام مع أمان الأنواع",
                },
                { text: "تجعل الكود أسرع في التنفيذ" },
                { text: "تقلل حجم الملف الناتج" },
                { text: "تضيف CSS تلقائيًا" },
              ],
            },
            {
              text: "ما الذي يفعله `extends` في `<T extends ...>`؟",
              correctIndex: 2,
              explanation: "extends يضع قيدًا على نوع T المسموح.",
              choices: [
                { text: "يجعل T فئة (class)" },
                { text: "يمنع T من التكرار" },
                { text: "يقيّد T بامتلاك خصائص معينة" },
                { text: "لا شيء، مجرد زينة" },
              ],
            },
          ],
        },
      },
    ],
  },

  // 2. React
  {
    slug: "react",
    title: "React 19 الأساسي",
    description:
      "تعلّم بناء واجهات المستخدم بمكونات قابلة لإعادة الاستخدام وhooks حديثة.",
    color: "rose",
    icon: "Atom",
    level: "beginner",
    order: 2,
    duration: 120,
    lessons: [
      {
        slug: "react-components",
        title: "المكوّنات (Components) و JSX",
        summary: "لبنة React الأساسية: كيف نكتب مكوّنًا ونمرّر props.",
        content: `# المكوّنات في React

المكوّن (Component) هو دالة JavaScript تُرجع JSX — شبيه HTML لكن داخل JS.

## أبسط مكوّن

\`\`\`tsx
function Welcome() {
  return <h1>مرحبًا بك!</h1>;
}
\`\`\`

## مع Props

الـ props هي مدخلات المكوّن:

\`\`\`tsx
type WelcomeProps = {
  name: string;
};

function Welcome({ name }: WelcomeProps) {
  return <h1>مرحبًا {name}!</h1>;
}

// الاستخدام:
<Welcome name="سارة" />
\`\`\`

## JSX قواعد مهمة

1. **إرجاع عنصر جذر واحد** — أو استخدم \`<>\` (Fragment).
2. **className بدل class**.
3. **التعبيرات بين {}**.
4. **أغلق كل الوسوم**: \`<img />\`, \`<br />\`.

\`\`\`tsx
function Card({ title, count }: { title: string; count: number }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>العدد: {count}</p>
    </div>
  );
}
\`\`\`

## تصدير واستيراد

\`\`\`tsx
// Button.tsx
export function Button({ label }: { label: string }) {
  return <button>{label}</button>;
}

// App.tsx
import { Button } from "./Button";
\`\`\`

## في Next.js

في Next.js App Router، الملف \`page.tsx\` هو مكوّن. كل مجلد داخل \`app/\` يصبح مسارًا:

\`\`\`
app/
  page.tsx        ← /
  about/page.tsx  ← /about
\`\`\``,
        codeExample: `"use client";

type UserCardProps = {
  name: string;
  role: string;
  avatar?: string;
};

export function UserCard({ name, role, avatar }: UserCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted" />
        )}
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}`,
        codeLanguage: "tsx",
        order: 1,
        duration: 18,
        quiz: {
          title: "اختبار: المكوّنات",
          questions: [
            {
              text: "ما هي الـ props؟",
              correctIndex: 1,
              explanation: "props هي مدخلات المكوّن من الخارج.",
              choices: [
                { text: "حالة داخلية للمكوّن" },
                { text: "مدخلات المكوّن من الخارج" },
                { text: "أنماط CSS" },
                { text: "أسماء الملفات" },
              ],
            },
            {
              text: "لماذا نستخدم className بدل class في JSX؟",
              correctIndex: 2,
              explanation: "class كلمة محجوزة في JS، لذا نستخدم className.",
              choices: [
                { text: "class لا يعمل في React" },
                { text: "className أسرع" },
                {
                  text: "لأن class كلمة محجوزة في JavaScript",
                },
                { text: "لا فرق بينهما" },
              ],
            },
          ],
        },
      },
      {
        slug: "react-hooks",
        title: "Hooks: useState و useEffect",
        summary: "إدارة الحالة المحلية والآثار الجانبية في React.",
        content: `# React Hooks

الـ Hooks دوال خاصة تضيف ميزات React للمكوّنات الدالية.

## useState — حالة محلية

\`\`\`tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      النقرات: {count}
    </button>
  );
}
\`\`\`

- \`count\` القيمة الحالية.
- \`setCount\` دالة تحدّثها.
- \`0\` القيمة الابتدائية.

### تحديث يعتمد على القيمة السابقة

\`\`\`tsx
setCount(prev => prev + 1); // ✅ آمن
\`\`\`

## useEffect — الآثار الجانبية

استدعاء API، اشتراكات، تعديل DOM:

\`\`\`tsx
import { useEffect, useState } from "react";

function Profile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]); // ← يعاد تنفيذه عند تغيّر userId فقط

  return <div>{user ? user.name : "جارٍ التحميل..."}</div>;
}
\`\`\`

## قواعد Hooks

1. **استدعِها في المستوى الأعلى** فقط (لا داخل شروط أو حلقات).
2. **استدعِها من مكوّنات React** أو hooks مخصصة فقط.

## Cleanup

\`\`\`tsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id); // تنظيف عند الإزالة
}, []);
\`\`\`

## hooks أخرى شائعة

- \`useMemo\` — حفظ قيمة محسوبة.
- \`useCallback\` — حفظ دالة.
- \`useRef\` — مرجع لقيمة لا تسبب إعادة تصيير.
- \`useContext\` — قراءة context.`,
        codeExample: `"use client";
import { useState, useEffect } from "react";

export function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="flex gap-2 items-center">
      <span>الثواني: {seconds}</span>
      <button onClick={() => setRunning(r => !r)}>
        {running ? "إيقاف" : "تشغيل"}
      </button>
      <button onClick={() => setSeconds(0)}>تصفير</button>
    </div>
  );
}`,
        codeLanguage: "tsx",
        order: 2,
        duration: 22,
        quiz: {
          title: "اختبار: Hooks",
          questions: [
            {
              text: "ما الذي يفعله useState؟",
              correctIndex: 0,
              explanation:
                "useState يضيف حالة محلية للمكوّن ويعيد [قيمة، دالة تحديث].",
              choices: [
                { text: "يضيف حالة محلية للمكوّن" },
                { text: "يجلب بيانات من API" },
                { text: "يضيف CSS" },
                { text: "ينشئ مسارًا" },
              ],
            },
            {
              text: "ماذا يحدث إذا نسيت مصفوفة الـ deps في useEffect؟",
              correctIndex: 2,
              explanation:
                "بدون deps، الـ effect يعمل بعد كل تصيير — قد يسبب حلقات لا نهائية.",
              choices: [
                { text: "لا شيء، يعمل بشكل طبيعي" },
                { text: "يُلغى الـ effect" },
                {
                  text: "قد يعمل بعد كل تصيير ويسبب مشاكل",
                },
                { text: "يمنع التجميع" },
              ],
            },
          ],
        },
      },
      {
        slug: "react-events",
        title: "الأحداث ومعالجة النماذج (Forms)",
        summary: "onClick, onChange, onSubmit، والتحقق من المدخلات.",
        content: `# الأحداث والنماذج في React

## معالجة الأحداث

\`\`\`tsx
function Button() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("نُقر!", e.currentTarget);
  };
  return <button onClick={handleClick}>انقر</button>;
}
\`\`\`

## المدخلات (Inputs)

\`\`\`tsx
function NameInput() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="اكتب اسمك"
    />
  );
}
\`\`\`

هذا يسمى **controlled input** — البيانات مصدرها React state.

## النماذج (Forms)

\`\`\`tsx
function ContactForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    console.log({ email, msg });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button type="submit">إرسال</button>
    </form>
  );
}
\`\`\`

## استخدام react-hook-form

للنماذج المعقدة، استخدم \`react-hook-form\` (متوفرة في مشروعنا):

\`\`\`tsx
import { useForm } from "react-hook-form";

type FormData = { email: string; password: string };

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: true })} />
      {errors.email && <span>البريد مطلوب</span>}
      <input type="password" {...register("password", { required: true, minLength: 6 })} />
      <button type="submit">دخول</button>
    </form>
  );
}
\`\`\`

أفضل بكثير: أداء أعلى، تحقق أسهل، أخطاء أوضح.`,
        codeExample: `"use client";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // محاكاة بحث
    setResults(
      ["تفاح", "موز", "برتقال"]
        .filter(f => f.includes(query))
    );
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث عن فاكهة..."
        className="border rounded px-3 py-1"
      />
      <button type="submit" className="bg-primary text-primary-foreground px-3 rounded">
        بحث
      </button>
      {results.length > 0 && (
        <ul>{results.map(r => <li key={r}>{r}</li>)}</ul>
      )}
    </form>
  );
}`,
        codeLanguage: "tsx",
        order: 3,
        duration: 18,
        quiz: {
          title: "اختبار: الأحداث والنماذج",
          questions: [
            {
              text: "ما هو الـ controlled input؟",
              correctIndex: 1,
              explanation:
                "controlled input مصدره React state وقيمته محكومة بالحالة.",
              choices: [
                { text: "input لا يقبل إدخالًا" },
                { text: "input قيمته محكومة بـ React state" },
                { text: "input مخصص للأرقام فقط" },
                { text: "input بدون onChange" },
              ],
            },
            {
              text: "لماذا نستدعي e.preventDefault() في onSubmit؟",
              correctIndex: 1,
              explanation:
                "منع إعادة تحميل الصفحة (السلوك الافتراضي للنموذج).",
              choices: [
                { text: "لإيقاف الحدث نهائيًا" },
                { text: "لمنع إعادة تحميل الصفحة" },
                { text: "لتنظيف الحقول" },
                { text: "لإرسال البيانات تلقائيًا" },
              ],
            },
          ],
        },
      },
    ],
  },

  // 3. Next.js
  {
    slug: "nextjs",
    title: "Next.js 16 (App Router)",
    description:
      "إطار العمل الكامل: التوجيه، Server Components، API Routes، والصور.",
    color: "emerald",
    icon: "Globe",
    level: "intermediate",
    order: 3,
    duration: 150,
    lessons: [
      {
        slug: "nextjs-app-router",
        title: "App Router والملفات كمسارات",
        summary: "كيف تحوّل بنية المجلدات إلى مسارات URL.",
        content: `# Next.js App Router

في Next.js 16، **App Router** هو النظام الحديث للتوجيه. كل مجلد داخل \`app/\` يصبح مسارًا.

## بنية المجلدات = المسارات

\`\`\`
app/
  page.tsx          → /
  about/page.tsx    → /about
  blog/page.tsx     → /blog
  blog/[slug]/page.tsx → /blog/:slug
\`\`\`

## الملفات الخاصة

| الملف | الدور |
|------|------|
| \`page.tsx\` | محتوى المسار |
| \`layout.tsx\` | تخطيط يلتف حول المسارات الفرعية |
| \`loading.tsx\` | يظهر أثناء التحميل |
| \`error.tsx\` | يظهر عند الخطأ |
| \`not-found.tsx\` | 404 |

## Server Components افتراضيًا

كل مكوّن في \`app/\` هو **Server Component** افتراضيًا. يعمل على الخادم فقط.

ميزة: أداء أعلى، حزم أصغر، وصول مباشر للبيانات.

\`\`\`tsx
// app/page.tsx — Server Component
import { db } from "@/lib/db";

export default async function Page() {
  const users = await db.user.findMany(); // ✅ مباشرة!
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
\`\`\`

## Client Components

للوصول إلى \`useState\`, \`useEffect\`, أو معالجات الأحداث، أضف:

\`\`\`tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [c, setC] = useState(0);
  return <button onClick={() => setC(c + 1)}>{c}</button>;
}
\`\`\`

## Layouts

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <nav>شريط التنقل</nav>
        {children}
        <footer>التذييل</footer>
      </body>
    </html>
  );
}
\`\`\`

## Dynamic Routes

\`\`\`tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>مقال: {params.slug}</h1>;
}
\`\`\``,
        codeExample: `// app/page.tsx (Server Component — افتراضي)
import { db } from "@/lib/db";

export default async function HomePage() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1>أحدث المقالات</h1>
      {posts.map(p => (
        <article key={p.id}>
          <h2>{p.title}</h2>
          <p>{p.content}</p>
        </article>
      ))}
    </main>
  );
}`,
        codeLanguage: "tsx",
        order: 1,
        duration: 20,
        quiz: {
          title: "اختبار: App Router",
          questions: [
            {
              text: "ماذا يصبح مجلد `app/about/`؟",
              correctIndex: 1,
              explanation: "كل مجلد في app/ يصبح مسار URL.",
              choices: [
                { text: "ملف about.tsx" },
                { text: "مسار /about" },
                { text: "API endpoint" },
                { text: "لا شيء" },
              ],
            },
            {
              text: "متى تحتاج توجيه 'use client'؟",
              correctIndex: 2,
              explanation:
                "عند استخدام useState, useEffect, أو معالجات أحداث.",
              choices: [
                { text: "دائمًا في كل ملف" },
                { text: "فقط في layout.tsx" },
                {
                  text: "عند استخدام hooks أو معالجات أحداث",
                },
                { text: "لا حاجة له أبدًا" },
              ],
            },
          ],
        },
      },
      {
        slug: "nextjs-api",
        title: "API Routes و Route Handlers",
        summary: "بناء نقاط نهاية API داخل Next.js.",
        content: `# API Routes في Next.js

في App Router، النقطة \`app/api/<name>/route.ts\` تعرّف API.

## أبسط API

\`\`\`ts
// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "مرحبًا!" });
}
\`\`\`

الزيارة: \`/api/hello\` → \`{ "message": "مرحبًا!" }\`

## معاملات الاستعلام (Query Params)

\`\`\`ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? "ضيف";

  return NextResponse.json({ hello: name });
}
\`\`\`

## POST مع جسم JSON

\`\`\`ts
export async function POST(request: Request) {
  const body = await request.json();
  // body.name, body.email, ...

  // حفظ في DB
  const user = await db.user.create({
    data: { email: body.email, name: body.name },
  });

  return NextResponse.json(user, { status: 201 });
}
\`\`\`

## معاملات المسار الديناميكي

\`\`\`ts
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(user);
}
\`\`\`

## مثال كامل: قائمة مهام

\`\`\`ts
// app/api/todos/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const todos = await db.todo.findMany();
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const { text } = await request.json();
  const todo = await db.todo.create({ data: { text } });
  return NextResponse.json(todo, { status: 201 });
}
\`\`\`

## استدعاء API من الواجهة

\`\`\`tsx
"use client";
async function addTodo(text: string) {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
\`\`\`

> **ملاحظة:** في مشروعنا، الطلبات بين منافذ مختلفة تحتاج \`?XTransformPort=PORT\`. لكن داخل نفس التطبيق لا حاجة لذلك.`,
        codeExample: `// app/api/counter/route.ts
import { NextResponse } from "next/server";

let count = 0; // في الذاكرة (للتجربة فقط)

export async function GET() {
  return NextResponse.json({ count });
}

export async function POST() {
  count += 1;
  return NextResponse.json({ count });
}

export async function DELETE() {
  count = 0;
  return NextResponse.json({ count });
}`,
        codeLanguage: "ts",
        order: 2,
        duration: 22,
        quiz: {
          title: "اختبار: API Routes",
          questions: [
            {
              text: "أين نضع تعريف API في App Router؟",
              correctIndex: 1,
              explanation: "في ملف route.ts داخل مجلد app/api/<name>/.",
              choices: [
                { text: "في app/api.ts" },
                { text: "في app/api/<name>/route.ts" },
                { text: "في pages/api/" },
                { text: "في lib/api.ts" },
              ],
            },
            {
              text: "كيف نقرأ JSON من جسم الطلب؟",
              correctIndex: 2,
              explanation: "نستخدم await request.json().",
              choices: [
                { text: "request.body.json()" },
                { text: "JSON.parse(request)" },
                { text: "await request.json()" },
                { text: "request.headers.json()" },
              ],
            },
          ],
        },
      },
      {
        slug: "nextjs-data",
        title: "جلب البيانات وتحسين الأداء",
        summary: "Server Components، caching، والصور المحسّنة.",
        content: `# جلب البيانات في Next.js

## الطريقة المباشرة: Server Components

أبسط وأسرع طريقة — استدعِ قاعدة البيانات مباشرة في Server Component:

\`\`\`tsx
// app/users/page.tsx
import { db } from "@/lib/db";

export default async function UsersPage() {
  const users = await db.user.findMany();
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
\`\`\`

لا \`useEffect\`، لا \`useState\`، لا كود عميل. الأداء مثالي.

## مع TanStack Query (Client-side)

للبيانات الديناميكية التي تتغير كثيرًا (لوحات تحكم، إشعارات):

\`\`\`tsx
"use client";
import { useQuery } from "@tanstack/react-query";

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then(r => r.json()),
  });

  if (isLoading) return <p>جارٍ التحميل...</p>;
  if (error) return <p>خطأ!</p>;

  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
\`\`\`

مزايا TanStack Query:
- **Cache ذكي** — لا إعادة جلب غير ضرورية.
- **تحديث تلقائي** عند التركيز على النافذة.
- **تحديثات متفائلة** (optimistic updates).
- **تحميل/خطأ** جاهزة.

## التحديث: Mutations

\`\`\`tsx
const mutation = useMutation({
  mutationFn: (newUser) =>
    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(newUser),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});

mutation.mutate({ name: "سارة", email: "sara@example.com" });
\`\`\`

## الصور المحسّنة: next/image

\`\`\`tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="صورة البطل"
  width={800}
  height={600}
  priority  // تحميل فوري للصور فوق الطية
/>
\`\`\`

مزايا: تحويل صيغ تلقائي (WebP/AVIF)، أحجام متعددة، كسل (lazy) افتراضي.

## Caching مع unstable_cache

\`\`\`tsx
import { unstable_cache } from "next/cache";

const getUsers = unstable_cache(
  async () => await db.user.findMany(),
  ["users"],
  { revalidate: 60 } // كل 60 ثانية
);
\`\`\``,
        codeExample: `"use client";
import { useQuery } from "@tanstack/react-query";

type Todo = { id: string; text: string; done: boolean };

export function TodoList() {
  const { data, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then(r => r.json()),
  });

  if (isLoading) return <p>جارٍ التحميل...</p>;

  return (
    <ul>
      {data?.map(t => (
        <li key={t.id} style={{ opacity: t.done ? 0.5 : 1 }}>
          {t.text}
        </li>
      ))}
    </ul>
  );
}`,
        codeLanguage: "tsx",
        order: 3,
        duration: 20,
        quiz: {
          title: "اختبار: جلب البيانات",
          questions: [
            {
              text: "ما الطريقة الأبسط لجلب البيانات في Next.js 16؟",
              correctIndex: 0,
              explanation:
                "جلب البيانات مباشرة في Server Component — بدون hooks.",
              choices: [
                { text: "جلب مباشر في Server Component" },
                { text: "useEffect دائمًا" },
                { text: "fetch في script منفصل" },
                { text: "localStorage فقط" },
              ],
            },
            {
              text: "ما فائدة TanStack Query؟",
              correctIndex: 1,
              explanation: "Cache ذكي، إعادة محاولة، تحديثات متفائلة.",
              choices: [
                { text: "بديل لـ Prisma" },
                { text: "Cache ذكي وإدارة حالة الخادم" },
                { text: "مكتبة CSS" },
                { text: "أداة نشر" },
              ],
            },
          ],
        },
      },
    ],
  },

  // 4. Tailwind CSS
  {
    slug: "tailwind",
    title: "Tailwind CSS 4",
    description:
      "نظام تصميم سريع قائم على الأدوات المساعدة (utility-first).",
    color: "amber",
    icon: "Palette",
    level: "beginner",
    order: 4,
    duration: 80,
    lessons: [
      {
        slug: "tailwind-basics",
        title: "أساسيات Tailwind: الأدوات المساعدة",
        summary: "كيف تنسّق عناصرك بدون كتابة CSS.",
        content: `# أساسيات Tailwind CSS

Tailwind إطار CSS قائم على **utility classes** — أصغر أدوات تنسيق تُجمع لتبني واجهات.

## لماذا Tailwind؟

- **سرعة** — لا تبقى ملفات CSS ضخمة.
- **اتساق** — نظام تصميم موحد (ألوان، مسافات، خطوط).
- ** responsive** — بسهولة بلا breakpoints يدوية.
- **حجم نهائي أصغر** — فقط الكلاسات المستخدمة.

## أدوات أساسية

\`\`\`html
<div class="p-4 bg-white rounded-lg shadow-md border border-gray-200">
  <h1 class="text-2xl font-bold text-gray-900">عنوان</h1>
  <p class="text-sm text-gray-600 mt-2">نص فرعي</p>
</div>
\`\`\`

### التفسير

| الكلاس | المعنى |
|-------|------|
| \`p-4\` | padding: 1rem |
| \`bg-white\` | خلفية بيضاء |
| \`rounded-lg\` | حواف مدورة |
| \`shadow-md\` | ظل متوسط |
| \`text-2xl\` | حجم خط 1.5rem |
| \`font-bold\` | خط عريض |
| \`mt-2\` | margin-top: 0.5rem |

## نظام الألوان

Tailwind يأتي بنظام ألوان غني:

\`\`\`
gray, slate, red, orange, amber, yellow, lime, green,
emerald, teal, cyan, sky, blue, indigo, violet,
purple, fuchsia, pink, rose
\`\`\`

كل لون بدرجات من 50 إلى 950:

\`\`\`
bg-emerald-50   ← أخضر فاتح جدًا
bg-emerald-500  ← أخضر متوسط
bg-emerald-900  ← أخضر داكن جدًا
\`\`\`

## تدرجات

\`\`\`html
<div class="bg-gradient-to-r from-emerald-400 to-teal-500">
  تدرّج جميل
</div>
\`\`\`

## Flexbox و Grid

\`\`\`html
<div class="flex items-center justify-between gap-4">
  <div>عنصر 1</div>
  <div>عنصر 2</div>
</div>

<div class="grid grid-cols-3 gap-4">
  <div>1</div><div>2</div><div>3</div>
</div>
\`\`\`

## responsive

\`\`\`html
<!-- جوال: عمود واحد، سطح مكتب: 3 أعمدة -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  ...
</div>
\`\`\`

البادئات: \`sm:\` (640px), \`md:\` (768px), \`lg:\` (1024px), \`xl:\` (1280px).`,
        codeExample: `<div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
  <div className="md:flex">
    <div className="md:shrink-0">
      <img className="h-48 w-full object-cover md:h-full md:w-48"
           src="/photo.jpg" alt="صورة" />
    </div>
    <div className="p-8">
      <div className="uppercase tracking-wide text-sm text-emerald-600 font-semibold">
        فئة
      </div>
      <a href="#" className="block mt-1 text-lg font-medium text-gray-900">
        عنوان البطاقة
      </a>
      <p className="mt-2 text-gray-500">
        وصف قصير للبطاقة يشرح محتواها.
      </p>
    </div>
  </div>
</div>`,
        codeLanguage: "tsx",
        order: 1,
        duration: 18,
        quiz: {
          title: "اختبار: أساسيات Tailwind",
          questions: [
            {
              text: "ما معنى الكلاس `p-4`؟",
              correctIndex: 1,
              explanation: "p-4 = padding 1rem.",
              choices: [
                { text: "padding 4px" },
                { text: "padding 1rem" },
                { text: "position 4" },
                { text: "padding 4%" },
              ],
            },
            {
              text: "كيف تجعل تخطيطًا 3 أعمدة على سطح المكتب فقط؟",
              correctIndex: 2,
              explanation: "grid-cols-1 md:grid-cols-3.",
              choices: [
                { text: "grid-3" },
                { text: "grid-cols-3-desktop" },
                { text: "grid-cols-1 md:grid-cols-3" },
                { text: "desktop:grid-3" },
              ],
            },
          ],
        },
      },
      {
        slug: "tailwind-theme",
        title: "الثيم، الوضع الليلي، و RTL",
        summary: "dark mode، CSS variables، ودعم اللغة العربية.",
        content: `# الثيم والوضع الليلي و RTL

## الوضع الليلي (Dark Mode)

في Tailwind 4 + shadcn/ui، استخدم \`next-themes\`:

\`\`\`tsx
// components/ThemeProvider.tsx
"use client";
import { ThemeProvider } from "next-themes";

export function ThemeProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
\`\`\`

ثم في التخطيط:

\`\`\`tsx
<html suppressHydrationWarning>
  <body>
    <ThemeProvider>{children}</ThemeProvider>
  </body>
</html>
\`\`\`

ثم استخدم الكلاس \`dark:\`:

\`\`\`tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  محتوى
</div>
\`\`\`

## CSS Variables (مع shadcn/ui)

shadcn/ui يستخدم متغيّرات CSS لألوانه. تجدها في \`globals.css\`:

\`\`\`css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
\`\`\`

استخدمها عبر كلاسات shadcn: \`bg-background\`, \`text-foreground\`, \`bg-primary\`.

## دعم RTL (العربية)

أضف \`dir="rtl"\` على \`<html>\`:

\`\`\`tsx
<html lang="ar" dir="rtl">
\`\`\`

Tailwind يدعم RTL تلقائيًا عبر الكلاسات المنطقية:

| LTR | RTL (ينقلب تلقائيًا) |
|-----|-----|
| \`ml-4\` (margin-left) | \`ms-4\` (margin-inline-start) |
| \`mr-4\` (margin-right) | \`me-4\` (margin-inline-end) |
| \`pl-4\` (padding-left) | \`ps-4\` (padding-inline-start) |
| \`text-left\` | \`text-start\` |
| \`text-right\` | \`text-end\` |

\`\`\`tsx
<div className="ps-4 pe-8 text-start">
  <!-- يعمل في RTL و LTR -->
</div>
\`\`\`

## خط عربي جميل

\`\`\`tsx
import { Cairo } from "next/font/google";
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

<html lang="ar" dir="rtl" className={cairo.variable}>
\`\`\`

## تحريك (Animation)

Tailwind 4 + \`tw-animate-css\` توفر حركات جاهزة:

\`\`\`tsx
<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
  يظهر بنعومة
</div>
\`\`\`

أو مع Framer Motion لحركات معقدة:

\`\`\`tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  محتوى متحرك
</motion.div>
\`\`\``,
        codeExample: `"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
    </Button>
  );
}`,
        codeLanguage: "tsx",
        order: 2,
        duration: 18,
        quiz: {
          title: "اختبار: الثيم و RTL",
          questions: [
            {
              text: "كيف نفعل الوضع الليلي في shadcn/ui؟",
              correctIndex: 2,
              explanation: "next-themes مع attribute='class' + كلاس dark:.",
              choices: [
                { text: "إضافة class='dark' يدويًا" },
                { text: "تعطيل CSS" },
                {
                  text: "next-themes + attribute='class' + dark: classes",
                },
                { text: "إعادة تثبيت Tailwind" },
              ],
            },
            {
              text: "أي كلاس يضمن عمل الاتجاه في RTL و LTR؟",
              correctIndex: 1,
              explanation: "ms-/me- (margin-inline-start/end) منطقية.",
              choices: [
                { text: "ml-/mr-" },
                { text: "ms-/me-" },
                { text: "left-/right-" },
                { text: "side-start-" },
              ],
            },
          ],
        },
      },
      {
        slug: "tailwind-flexbox-grid",
        title: "تخطيطات Flexbox و Grid المتقدمة",
        summary: "بناء تخطيطات معقدة: navbar، sidebar، dashboard، cards.",
        content: `# تخطيطات Flexbox و Grid

Tailwind يجعل بناء التخطيطات المعقدة سهلًا جدًا.

## Flexbox — للتوزيع في بعد واحد

\`\`\`html
<!-- شريط تنقل -->
<nav class="flex items-center justify-between p-4">
  <div class="flex items-center gap-2">
    <Logo />
    <span class="font-bold">تطبيقي</span>
  </div>
  <div class="flex items-center gap-4">
    <a href="/">الرئيسية</a>
    <a href="/about">حول</a>
    <button class="bg-primary text-white px-4 py-2 rounded-lg">دخول</button>
  </div>
</nav>
\`\`\`

### خصائص مهمة

| الكلاس | الوظيفة |
|-------|------|
| \`flex\` | تفعيل flex container |
| \`flex-col\` | اتجاه عمودي |
| \`items-center\` | محاذاة عمودي |
| \`justify-between\` | توزيع مع فراغ بين |
| \`justify-center\` | توسيط |
| \`gap-4\` | مسافة بين العناصر |
| \`flex-1\` | يأخذ المساحة المتبقية |
| \`flex-wrap\` | يلتف للسطر التالي |

### بطاقات بأطوال متساوية

\`\`\`html
<div class="flex flex-wrap gap-4">
  <div class="flex-1 min-w-[250px]">بطاقة 1</div>
  <div class="flex-1 min-w-[250px]">بطاقة 2</div>
  <div class="flex-1 min-w-[250px]">بطاقة 3</div>
</div>
\`\`\`

\`min-w-[250px]\` يضمن ألا تصغر البطاقات عن 250px ثم تنتقل للسطر التالي.

## CSS Grid — للتخطيطات ثنائية الأبعاد

\`\`\`html
<!-- شبكة 3 أعمدة -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div>
</div>

<!-- responsive -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  ...
</div>
\`\`\`

### لوحة تحكم (Dashboard layout)

\`\`\`html
<div class="grid grid-cols-12 gap-4 min-h-screen">
  <!-- Sidebar: 3 أعمدة على الكبير، يختفي على الصغير -->
  <aside class="col-span-12 lg:col-span-3 hidden lg:block">
    <Sidebar />
  </aside>

  <!-- Main: 9 أعمدة على الكبير، 12 على الصغير -->
  <main class="col-span-12 lg:col-span-9">
    <Header />
    <Content />
  </main>
</div>
\`\`\`

### spanning أعمدة/صفوف

\`\`\`html
<div class="grid grid-cols-4 gap-4">
  <div class="col-span-2">يأخذ عمودين</div>
  <div>عمود</div>
  <div>عمود</div>

  <div class="col-span-4">يأخذ كل الأعمدة</div>
  <div class="row-span-2">يأخذ صفين</div>
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
</div>
\`\`\`

## أنماط شائعة

### بطاقة منتج

\`\`\`html
<div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
  <div class="aspect-video overflow-hidden bg-gray-100">
    <img src="/product.jpg" class="group-hover:scale-105 transition-transform duration-300" />
  </div>
  <div class="p-4">
    <h3 class="font-bold text-lg">اسم المنتج</h3>
    <p class="text-sm text-gray-500 line-clamp-2">وصف قصير...</p>
    <div class="flex items-center justify-between mt-3">
      <span class="text-xl font-bold">$99</span>
      <button class="bg-primary text-white px-3 py-1.5 rounded-lg text-sm">أضف للسلة</button>
    </div>
  </div>
</div>
\`\`\`

### قائمة تعليقات

\`\`\`html
<div class="space-y-4">
  <div class="flex gap-3">
    <img class="h-10 w-10 rounded-full" src="/avatar.jpg" />
    <div class="flex-1">
      <div class="bg-muted rounded-2xl p-3">
        <div class="font-medium text-sm">أحمد</div>
        <p class="text-sm mt-1">تعليق رائع!</p>
      </div>
      <div class="text-xs text-muted-foreground mt-1 ps-3">منذ ساعتين</div>
    </div>
  </div>
</div>
\`\`\`

## نصائح

1. **استخدم gap بدل margin** بين عناصر flex/grid.
2. **min-w-** يمنع الانضغاط المفرط.
3. **line-clamp-N** لقص النص بعد N أسطر.
4. **aspect-video / aspect-square** للنسب الثابتة.
5. **container mx-auto** لتوسيط المحتوى.`,
        codeExample: `// مكوّن بطاقة منتج بـ Tailwind
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-extrabold text-primary">
            $\${product.price}
          </span>
          <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm hover:bg-primary/90">
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  );
}`,
        codeLanguage: "tsx",
        order: 3,
        duration: 22,
        quiz: {
          title: "اختبار: Flexbox و Grid",
          questions: [
            {
              text: "أي كلاس يجعل العنصر يأخذ عمودين في Grid؟",
              correctIndex: 2,
              explanation: "col-span-2 يجعله يأخذ عمودين.",
              choices: [
                { text: "cols-2" },
                { text: "col-2" },
                { text: "col-span-2" },
                { text: "span-2" },
              ],
            },
            {
              text: "كيف تمنع البطاقات من الانضغاط أكثر من اللازم؟",
              correctIndex: 1,
              explanation: "min-w-[Npx] يحدد عرضًا أدنى للعنصر.",
              choices: [
                { text: "width-fixed" },
                { text: "min-w-[250px]" },
                { text: "no-shrink" },
                { text: "w-min-250" },
              ],
            },
          ],
        },
      },
      {
        slug: "tailwind-advanced",
        title: "ميزات متقدمة: Variants، Plugins، و Customization",
        summary: "group/peer، focus-visible، arbitrary values، و custom utilities.",
        content: `# ميزات Tailwind المتقدمة

## Variants المخصصة

### group و peer — تخصيص بناءً على العنصر الأب/الأخ

\`\`\`html
<!-- group: التحكم بالعنصر الأب -->
<div class="group">
  <img class="group-hover:scale-110 transition-transform" />
  <h3 class="group-hover:text-primary">عنوان</h3>
</div>

<!-- peer: التحكم بالأخ السابق -->
<input type="checkbox" id="toggle" class="peer" />
<div class="peer-checked:bg-primary peer-checked:text-white">
  يظهر مختلفًا عند التحديد
</div>
\`\`\`

### named groups

\`\`\`html
<div class="group/card hover:bg-muted">
  <div class="group-hover/card:opacity-100 opacity-0">
    يظهر عند hover على البطاقة فقط
  </div>
</div>
\`\`\`

## focus-visible — يظهر فقط عند التنقل بالكيبورد

\`\`\`html
<button class="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
  زر
</button>
<!-- focus: يظهر دائمًا (حتى بالنقر)
     focus-visible: فقط بالكيبورد -->
\`\`\`

## arbitrary values — قيم مخصصة

\`\`\`html
<!-- قيمة دقيقة -->
<div class="w-[350px] h-[420px] bg-[#1e1e2e]">
<div class="grid-cols-[200px_1fr_100px]"> <!-- 3 أعمدة بأحجام مخصصة -->
<div class="top-[117px]"> <!-- position بدقة -->

<!-- media queries مخصصة -->
<div class="min-[1080px]:flex hidden">

<!-- متغيّرات CSS -->
<div style="--my-color: oklch(0.5 0.2 30)" class="bg-[var(--my-color)]">
\`\`\`

## Custom colors (في tailwind.config.ts)

\`\`\`ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          500: "#10b981",
          900: "#064e3b",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
};
\`\`\`

الاستخدام: \`bg-brand-500\`, \`font-arabic\`, \`animate-fade-in\`.

## Plugins

\`\`\`bash
bun add -D @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio
\`\`\`

\`\`\`ts
// tailwind.config.ts
export default {
  plugins: [
    require("@tailwindcss/typography"), // prose classes
    require("@tailwindcss/forms"),      // شكل افتراضي للـ inputs
    require("@tailwindcss/aspect-ratio"),
  ],
};
\`\`\`

بعد ذلك:

\`\`\`html
<div class="prose prose-lg dark:prose-invert max-w-none">
  <!-- محتوى Markdown -->
</div>
\`\`\`

## Custom utilities (في Tailwind 4)

في \`globals.css\`:

\`\`\`css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
\`\`\`

## Container queries (ميزة حديثة)

\`\`\`html
<div class="@container">
  <div class="@sm:flex hidden">
    يظهر فقط عندما يكون الأب بعرض >= 24rem
  </div>
  <div class="@lg:grid-cols-2 grid">
    شبكة من عمود واحد، تعمّد لعمودين عندما الأب >= 32rem
  </div>
</div>
\`\`\`

مفيدة لمكوّنات قابلة لإعادة الاستخدام — تتجاوب مع حجم الأب لا المتصفح.

## نصائح للأداء

1. **استخدم JIT** (افتراضي في Tailwind 4) — يُولّد فقط الكلاسات المستخدمة.
2. **تجنب \`@apply\` المفرط** — يصعّب الصيانة.
3. **استخدم PurgeCSS** إن لزم — يزيل الكلاسات غير المستخدمة.
4. **cache-busting** — أضف hash لملف CSS في الإنتاج.`,
        codeExample: `// مكوّن Input قابل لإعادة الاستخدام بـ Tailwind
export function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        {...props}
        className={\`w-full rounded-lg border bg-background px-3 py-2 text-sm
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary/20
          focus:border-primary
          \${error ? "border-rose-500" : "border-border"}
          disabled:opacity-50 disabled:cursor-not-allowed\`}
      />
      {error && (
        <p className="text-xs text-rose-500">{error}</p>
      )}
    </div>
  );
}`,
        codeLanguage: "tsx",
        order: 4,
        duration: 25,
        quiz: {
          title: "اختبار: Tailwind المتقدمة",
          questions: [
            {
              text: "ما الفرق بين focus و focus-visible؟",
              correctIndex: 2,
              explanation:
                "focus يظهر دائمًا، focus-visible فقط عند التنقل بالكيبورد.",
              choices: [
                { text: "لا فرق" },
                { text: "focus أحدث" },
                {
                  text: "focus-visible يظهر فقط بالكيبورد",
                },
                { text: "focus أسرع" },
              ],
            },
            {
              text: "ماذا يفعل peer-checked:bg-primary؟",
              correctIndex: 1,
              explanation:
                "يطبّق bg-primary عندما العنصر الأخ السابق (peer) يكون checked.",
              choices: [
                { text: "يطبّق على كل العناصر" },
                {
                  text: "يطبّق عندما الأخ السابق يكون checked",
                },
                { text: "يطبّق على العنصر الأب" },
                { text: "لا شيء" },
              ],
            },
          ],
        },
      },
    ],
  },

  // 5. Prisma
  {
    slug: "prisma",
    title: "Prisma ORM",
    description: "الوصول لقاعدة البيانات بأمان الأنواع من TypeScript.",
    color: "violet",
    icon: "Database",
    level: "intermediate",
    order: 5,
    duration: 90,
    lessons: [
      {
        slug: "prisma-schema",
        title: "مخطط Prisma والنماذج",
        summary: "كيف تصف جداول قاعدة البيانات في schema.prisma.",
        content: `# مخطط Prisma

Prisma ORM يتيح الوصول لقاعدة البيانات بأمان تام للأنواع من TypeScript.

## ملف schema.prisma

\`\`\`prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // أو postgresql, mysql
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}
\`\`\`

## الأنواع الأساسية

| النوع | الاستخدام |
|-----|------|
| \`String\` | نصوص |
| \`Int\` | أعداد صحيحة |
| \`Float\` | أعداد عشرية |
| \`Boolean\` | صحيح/خطأ |
| \`DateTime\` | تاريخ ووقت |
| \`Json\` | JSON |
| \`Bytes\` | بيانات ثنائية |

## المعدّلات (Modifiers)

- \`?\` — اختياري (\`name String?\`)
- \`[]\` — مصفوفة (\`tags String[]\`) — *لا يدعمها SQLite*
- \`@id\` — مفتاح أساسي
- \`@unique\` — قيمة فريدة
- \`@default()\` — قيمة افتراضية
- \`@relation\` — علاقة بين نماذج

## العلاقات (Relations)

### واحد-للعديد (One-to-Many)

\`\`\`prisma
model User {
  id    String @id
  posts Post[]  // مستخدم له عدة منشورات
}

model Post {
  id       String @id
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
\`\`\`

### واحد-لواحد

\`\`\`prisma
model User {
  id      String  @id
  profile Profile?
}

model Profile {
  id     String @id
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}
\`\`\`

### العديد-للعديد

\`\`\`prisma
model Post {
  id    String @id
  tags  Tag[]  @relation("PostTags")
}

model Tag {
  id    String @id
  posts Post[] @relation("PostTags")
}
\`\`\`

## بعد التعديل

كل تغيير في schema:

\`\`\`bash
bun run db:push     # يطبّق التغييرات
bun run db:generate # يُحدّث Prisma Client
\`\`\`

## استخدام Prisma Client

\`\`\`ts
import { db } from "@/lib/db";

const user = await db.user.create({
  data: { email: "a@b.com", name: "سارة" },
});

const all = await db.user.findMany();
\`\`\``,
        codeExample: `// prisma/schema.prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  completed   Boolean  @default(false)
  priority    String   @default("medium") // low | medium | high
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  assigneeId  String
  assignee    User     @relation(fields: [assigneeId], references: [id])
}

// في الكود:
import { db } from "@/lib/db";

const task = await db.task.create({
  data: {
    title: "إنهاء التقرير",
    priority: "high",
    assigneeId: "user-1",
  },
});`,
        codeLanguage: "prisma",
        order: 1,
        duration: 22,
        quiz: {
          title: "اختبار: مخطط Prisma",
          questions: [
            {
              text: "ماذا يعني `?` بعد نوع الحقل؟",
              correctIndex: 2,
              explanation: "? تجعل الحقل اختياريًا (يمكن أن يكون null).",
              choices: [
                { text: "حقل مشفّر" },
                { text: "حقل مفهرس" },
                { text: "حقل اختياري (null)" },
                { text: "حقل للقراءة فقط" },
              ],
            },
            {
              text: "كيف نطبّق تغييرات في schema؟",
              correctIndex: 1,
              explanation: "bun run db:push.",
              choices: [
                { text: "إعادة تشغيل Next.js" },
                { text: "bun run db:push" },
                { text: "git commit" },
                { text: "حذف قاعدة البيانات" },
              ],
            },
          ],
        },
      },
      {
        slug: "prisma-queries",
        title: "الاستعلامات: CRUD متقدّم",
        summary: "findMany, findUnique, create, update, delete, relations.",
        content: `# استعلامات Prisma

## Create

\`\`\`ts
// واحد
const user = await db.user.create({
  data: { email: "a@b.com", name: "سارة" },
});

// عدة
const users = await db.user.createMany({
  data: [
    { email: "a@b.com" },
    { email: "c@d.com" },
  ],
});

// مع علاقة (cascade)
const post = await db.post.create({
  data: {
    title: "مرحبًا",
    author: { connect: { id: "user-1" } },
  },
});
\`\`\`

## Read

\`\`\`ts
// الكل
const all = await db.user.findMany();

// بشرط
const active = await db.user.findMany({
  where: { isActive: true },
});

// واحد بمعرّف
const u = await db.user.findUnique({ where: { id: "1" } });

// واحد بشرط
const jane = await db.user.findFirst({
  where: { name: { contains: "سارة" } },
});

// مع العلاقات (eager loading)
const userWithPosts = await db.user.findUnique({
  where: { id: "1" },
  include: { posts: true },
});

// حقول محددة (select)
const minimal = await db.user.findMany({
  select: { id: true, name: true },
});
\`\`\`

## شروط متقدمة

\`\`\`ts
const results = await db.post.findMany({
  where: {
    AND: [
      { published: true },
      { OR: [
        { title: { contains: "React" } },
        { title: { contains: "Next" } },
      ] },
    ],
    createdAt: { gte: new Date("2024-01-01") },
  },
  orderBy: { createdAt: "desc" },
  take: 10,           // حد
  skip: 0,            // لتقسيم الصفحات
});
\`\`\`

## Update

\`\`\`ts
const updated = await db.user.update({
  where: { id: "1" },
  data: { name: "اسم جديد" },
});

// عدة صفوف
await db.user.updateMany({
  where: { isActive: false },
  data: { isActive: true },
});
\`\`\`

## Delete

\`\`\`ts
await db.user.delete({ where: { id: "1" } });
await db.user.deleteMany({ where: { isActive: false } });
\`\`\`

## Transactions

\`\`\`ts
const [user, profile] = await db.$transaction([
  db.user.create({ data: { email: "a@b.com" } }),
  db.profile.create({ data: { userId: "x", bio: "..." } }),
]);
\`\`\`

## Pagination

\`\`\`ts
// صفحة 2، 10 عناصر
const page = 2;
const pageSize = 10;

const items = await db.post.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

const total = await db.post.count();
const hasMore = page * pageSize < total;
\`\`\``,
        codeExample: `import { db } from "@/lib/db";

export async function getDashboardStats() {
  const [totalUsers, activeUsers, recentPosts] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { isActive: true } }),
    db.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: { select: { name: true } } },
    }),
  ]);

  return { totalUsers, activeUsers, recentPosts };
}`,
        codeLanguage: "ts",
        order: 2,
        duration: 22,
        quiz: {
          title: "اختبار: استعلامات Prisma",
          questions: [
            {
              text: "أي دالة تجلب كل الصفوف؟",
              correctIndex: 1,
              explanation: "findMany تجلب مصفوفة بكل المطابقات.",
              choices: [
                { text: "findAll" },
                { text: "findMany" },
                { text: "getAll" },
                { text: "list" },
              ],
            },
            {
              text: "كذا نجلب العلاقات مع النموذج؟",
              correctIndex: 1,
              explanation: "include: { relation: true } أو select.",
              choices: [
                { text: "with: { relation: true }" },
                { text: "include: { relation: true }" },
                { text: "join: { relation: true }" },
                { text: "populate: { relation: true }" },
              ],
            },
          ],
        },
      },
      {
        slug: "prisma-advanced",
        title: "ميزات متقدمة: Migrations، Indexes، و Raw SQL",
        summary: "إدارة تطور المخطط، تحسين الأداء، و SQL الخام عند الحاجة.",
        content: `# ميزات Prisma المتقدمة

## Migrations (الترحيلات)

بدل \`db:push\` (الذي يطبّق التغييرات مباشرة)، استخدم migrations لبيئات الإنتاج:

\`\`\`bash
# 1. أنشئ migration من تغيير في schema
bun run db:migrate -- --name add_user_profile

# 2. يُنشئ ملف SQL في prisma/migrations/<timestamp>_add_user_profile/
#    migration.sql يحتوي ALTER TABLE ...

# 3. يطبّق على قاعدة البيانات
bun run db:migrate
\`\`\`

مزايا:
- **إنتاج آمن** — يُراجع SQL قبل التطبيق.
- **تراجع** — migrations قابلة للتراجع.
- **مشاركة** — أعضاء الفريق يحصلون على نفس مخطط قاعدة البيانات.

## Indexes (الفهارس)

لتسريع الاستعلامات على أعمدة معينة:

\`\`\`prisma
model User {
  id       String  @id
  email    String  @unique  // ← فهرس فريد تلقائيًا
  username String  @unique
  country  String
  age      Int

  @@index([country])        // فهرس على country لتسريع البحث
  @@index([country, age])   // فهرس مركّب
}
\`\`\`

القاعدة: أضف فهارس للأعمدة المستخدمة كثيرًا في \`where\` أو \`orderBy\`.

## Raw SQL (SQL الخام)

عندما لا تكفي Prisma، استخدم SQL مباشرة:

\`\`\`ts
// queryRaw — للاستعلامات التي تُرجع صفوف
const users = await db.$queryRaw\`
  SELECT * FROM User WHERE age > \${18} ORDER BY name
\`\`;

// executeRaw — للاستعلامات التي تعدّل (UPDATE/DELETE/INSERT)
const result = await db.$executeRaw\`
  UPDATE User SET lastSeen = NOW() WHERE id = \${userId}
\`\`;
\`\`\`

> ⚠️ استخدم المعاملات المسمّاة (\`\${var}\`) دائمًا — Prisma يحمي من SQL injection.

## Transactions

\`\`\`ts
// 1. متتالية (تُنفّذ كل شيء أو لا شيء)
const [user, profile] = await db.$transaction([
  db.user.create({ data: { email: "a@b.com" } }),
  db.profile.create({ data: { userId: "x", bio: "..." } }),
]);

// 2. تفاعلية (مع منطق في الوسط)
const result = await db.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { email: "a@b.com" } });
  await tx.profile.create({ data: { userId: user.id } });
  await tx.auditLog.create({ data: { action: "signup", userId: user.id } });
  return user;
});

// 3. timeout طويل للمهام الثقيلة
await db.$transaction(async (tx) => {
  // ... عمليات كثيرة
}, { timeout: 30000, maxWait: 10000 });
\`\`\`

## Middleware / Extensions

لتعديل السلوك قبل/بعد العمليات:

\`\`\`ts
const prisma = new PrismaClient().$extends({
  query: {
    user: {
      // قبل كل find على User
      async findMany({ model, operation, args, query }) {
        // أضف فلترًا افتراضيًا
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
    },
  },
});
\`\`\`

## أدوات مساعدة

\`\`\`ts
// $connect / $disconnect
await db.$connect();
await db.$disconnect();

// $on — استمع لأحداث
db.$on("query", (e) => {
  console.log("Query:", e.query);
  console.log("Duration:", e.duration + "ms");
});

// $use — middleware قديم (مُهمَل في v6)
\`\`\`

## $accelerate (اختياري)

خدمة caching من Prisma للتطبيقات serverless:

\`\`\`ts
const prisma = new PrismaClient({
  // مفتاح accelerate من prisma.io/accelerate
});
\`\`\`

## نصائح للأداء

1. **استخدم select** بدل include عندما لا تحتاج كل الحقول.
2. **تجنب الاستعلامات N+1** — استخدم include بدل حلقة من findUnique.
3. **فهرس الأعمدة** المستخدمة في where/orderBy.
4. **paginate** بدل جلب كل شيء.

\`\`\`ts
// ❌ N+1
for (const u of users) {
  const posts = await db.post.findMany({ where: { authorId: u.id } });
}

// ✅ استعلام واحد
const users = await db.user.findMany({
  include: { posts: true },
});
\`\`\``,
        codeExample: `import { db } from "@/lib/db";

// مثال: نقل أموال بين حسابين في معاملة
export async function transfer(fromId: string, toId: string, amount: number) {
  return db.$transaction(async (tx) => {
    const from = await tx.account.findUniqueOrThrow({ where: { id: fromId } });
    if (from.balance < amount) {
      throw new Error("الرصيد غير كافٍ");
    }

    await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    });
    await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } },
    });

    await tx.transaction.create({
      data: { fromId, toId, amount },
    });

    return { success: true };
  });
}`,
        codeLanguage: "ts",
        order: 3,
        duration: 25,
        quiz: {
          title: "اختبار: Prisma المتقدمة",
          questions: [
            {
              text: "متى تستخدم migrations بدل db:push؟",
              correctIndex: 2,
              explanation:
                "migrations أنسب لبيئات الإنتاج لأنها قابلة للمراجعة والتراجع.",
              choices: [
                { text: "دائمًا" },
                { text: "في بيئة التطوير فقط" },
                {
                  text: "في بيئة الإنتاج ومشاريع الفريق",
                },
                { text: "لا فرق بينهما" },
              ],
            },
            {
              text: "كيف تتجنب مشكلة N+1؟",
              correctIndex: 1,
              explanation: "استخدم include لجلب العلاقات في استعلام واحد.",
              choices: [
                { text: "حلقة من findUnique" },
                {
                  text: "استخدم include بدل حلقة من الاستعلامات",
                },
                { text: "raw SQL" },
                { text: "db:push" },
              ],
            },
          ],
        },
      },
    ],
  },

  // 6. Zustand
  {
    slug: "zustand",
    title: "Zustand لإدارة الحالة",
    description:
      "إدارة حالة العميل ببساطة بالغة — بديل خفيف لـ Redux.",
    color: "teal",
    icon: "Boxes",
    level: "intermediate",
    order: 6,
    duration: 70,
    lessons: [
      {
        slug: "zustand-basics",
        title: "متجر Zustand الأساسي",
        summary: "create، state، actions، selectors.",
        content: `# Zustand: إدارة الحالة ببساطة

Zustand مكتبة صغيرة جدًا لإدارة الحالة في React. أسهل بكثير من Redux.

## لماذا Zustand؟

- **بسيط** — لا boilerplate، لا reducers.
- **خفيف** — ~1KB.
- **مرن** — يعمل في أي مكان.
- **TypeScript-friendly** — أنواع ممتازة.

## إنشاء متجر (Store)

\`\`\`ts
// lib/store.ts
import { create } from "zustand";

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

export const useCounter = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset: () => set({ count: 0 }),
}));
\`\`\`

## الاستخدام في مكوّن

\`\`\`tsx
import { useCounter } from "@/lib/store";

function Counter() {
  const count = useCounter((s) => s.count);     // selector
  const increment = useCounter((s) => s.increment);

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
\`\`\`

## لماذا selectors؟

Selectors تمنع إعادة التصيير غير الضرورية:

\`\`\`tsx
// ❌ سيء: يعيد التصيير عند أي تغيير
const store = useCounter();

// ✅ جيد: يعيد التصيير فقط عند تغيير count
const count = useCounter((s) => s.count);
\`\`\`

## حالة معقدة

\`\`\`ts
type CartItem = { id: string; name: string; price: number; qty: number };

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
          ),
        };
      }
      return { items: [...s.items, item] };
    }),
  remove: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));
\`\`\`

## الاستمرار (Persistence)

حفظ الحالة في localStorage:

\`\`\`ts
import { persist } from "zustand/middleware";

export const useSettings = create(
  persist<SettingsState>(
    (set) => ({
      theme: "light",
      lang: "ar",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "settings-storage" }
  )
);
\`\`\`

## مع next-themes (مثال واقعي)

\`\`\`ts
type UIState = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentView: "home" | "lessons" | "progress";
  setView: (v: UIState["currentView"]) => void;
};

export const useUI = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  currentView: "home",
  setView: (currentView) => set({ currentView }),
}));
\`\`\``,
        codeExample: `import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoritesState = {
  ids: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id)
            ? s.ids.filter((x) => x !== id)
            : [...s.ids, id],
        })),
      isFavorite: (id) => get().ids.includes(id),
    }),
    { name: "favorites" }
  )
);

// الاستخدام:
function FavButton({ id }: { id: string }) {
  const toggle = useFavorites((s) => s.toggle);
  const isFav = useFavorites((s) => s.ids.includes(id));
  return (
    <button onClick={() => toggle(id)}>
      {isFav ? "★" : "☆"}
    </button>
  );
}`,
        codeLanguage: "ts",
        order: 1,
        duration: 22,
        quiz: {
          title: "اختبار: Zustand",
          questions: [
            {
              text: "ما فائدة selectors في Zustand؟",
              correctIndex: 1,
              explanation: "selectors تمنع إعادة التصيير غير الضرورية.",
              choices: [
                { text: "تسريع الشبكة" },
                { text: "منع إعادة التصيير غير الضرورية" },
                { text: "تشفير الحالة" },
                { text: "حفظ الحالة تلقائيًا" },
              ],
            },
            {
              text: "كيف نحفظ الحالة في localStorage؟",
              correctIndex: 1,
              explanation: "persist middleware مع name.",
              choices: [
                { text: "localStorage.save()" },
                { text: "persist() middleware" },
                { text: "save: true option" },
                { text: "لا يدعم Zustand ذلك" },
              ],
            },
          ],
        },
      },
      {
        slug: "zustand-middleware",
        title: "الـ Middleware: persist و immer",
        summary: "حفظ الحالة، تعديل غير قابل للتغيير، والـ devtools.",
        content: `# Middleware في Zustand

الـ Middleware دوال تُلتف حول الـ store لإضافة سلوكيات. Zustand يأتي بثلاثة مهمة:

## 1. persist — الحفظ التلقائي

يحفظ الحالة في localStorage (أو أي storage):

\`\`\`ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  theme: "light" | "dark";
  lang: "ar" | "en";
  setTheme: (t: SettingsState["theme"]) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      lang: "ar",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "academy-settings", // مفتاح localStorage
      // partialize: حفظ جزء فقط من الحالة
      partialize: (state) => ({ theme: state.theme, lang: state.lang }),
    }
  )
);
\`\`\`

### تخزين مخصّص (مثلاً sessionStorage)

\`\`\`ts
persist(
  (set) => ({ ... }),
  {
    name: "x",
    storage: createJSONStorage(() => sessionStorage),
  }
)
\`\`\`

## 2. immer — تحديث غير قابل للتغيير

بدون immer، يجب الحذر عند تحديث كائنات متداخلة:

\`\`\`ts
// بدون immer — متعب
set((s) => ({
  user: { ...s.user, profile: { ...s.user.profile, name: "جديد" } },
}));

// مع immer — مباشر
set((s) => {
  s.user.profile.name = "جديد"; // ✅ تعديل مباشر
});
\`\`\`

الاستخدام:

\`\`\`ts
import { immer } from "zustand/middleware/immer";

export const useStore = create<State>()(
  immer((set) => ({
    user: { profile: { name: "" } },
    setName: (name) => set((s) => { s.user.profile.name = name; }),
  }))
);
\`\`\`

## 3. devtools — لتصحيح الأخطاء

\`\`\`ts
import { devtools } from "zustand/middleware";

export const useStore = create<State>()(
  devtools(
    (set) => ({ ... }),
    { name: "AcademyStore" } // يظهر في Redux DevTools
  )
);
\`\`\`

يدمج مع إضافة Redux DevTools لمتصفحك — تاريخ كل تحديث، تشغيل عكسي، إلخ.

## ترتيب الـ Middleware

ترتيب التفاف الـ middleware مهم (من الخارج للداخل):

\`\`\`ts
create<State>()(
  devtools(           // الأبعد
    persist(           // الأوسط
      immer((set) => ({ ... })),  // الأقرب
      { name: "x" }
    ),
    { name: "X" }
  )
);
\`\`\`

## middleware مخصّص

\`\`\`ts
const logger = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log("قبل:", get());
      set(...args);
      console.log("بعد:", get());
    },
    get,
    api
  );

export const useStore = create<State>()(logger((set) => ({ ... })));
\`\`\`

مفيد جدًا للتصحيح في بيئة التطوير.`,
        codeExample: `import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartState = {
  items: { id: string; qty: number }[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (id) =>
        set((s) => {
          const exists = s.items.find((i) => i.id === id);
          if (exists) {
            return {
              items: s.items.map((i) =>
                i.id === id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...s.items, { id, qty: 1 }] };
        }),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "academy-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);`,
        codeLanguage: "ts",
        order: 2,
        duration: 20,
        quiz: {
          title: "اختبار: Zustand Middleware",
          questions: [
            {
              text: "ماذا يفعل middleware persist؟",
              correctIndex: 1,
              explanation: "يحفظ الحالة في localStorage تلقائيًا.",
              choices: [
                { text: "يؤجل التحديثات" },
                { text: "يحفظ الحالة في localStorage" },
                { text: "يسرّع الأداء" },
                { text: "يشفّر الحالة" },
              ],
            },
            {
              text: "ما فائدة immer middleware؟",
              correctIndex: 2,
              explanation: "يتيح تعديل الحالة بشكل مباشر (mutable) بكود أنظف.",
              choices: [
                { text: "يضيف أنواعًا" },
                { text: "يحفظ الحالة" },
                {
                  text: "يتيح تحديث الحالة بكود أبسط (mutable)",
                },
                { text: "ينشئ logs" },
              ],
            },
          ],
        },
      },
      {
        slug: "zustand-patterns",
        title: "أنماط متقدمة: Slices و Context",
        summary: "تنظيم المتاجر الكبيرة ودمجها مع React Context.",
        content: `# أنماط متقدمة في Zustand

## تقسيم المتجر (Store Slices)

للمتاجر الكبيرة، قسّمها إلى slices وأدمجها:

\`\`\`ts
// stores/userSlice.ts
export const createUserSlice: StateCreator<RootState, [], [], UserSlice> = (set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
});

// stores/cartSlice.ts
export const createCartSlice: StateCreator<RootState, [], [], CartSlice> = (set) => ({
  cart: [],
  addToCart: (item) => set((s) => ({ cart: [...s.cart, item] })),
});

// stores/index.ts — ادمج الكل
import { create } from "zustand";
import { createUserSlice } from "./userSlice";
import { createCartSlice } from "./cartSlice";

export const useStore = create<RootState>()((...a) => ({
  ...createUserSlice(...a),
  ...createCartSlice(...a),
}));
\`\`\`

هذا يجعل الكود قابل للصيانة في المشاريع الكبيرة.

## قراءة عبر Context (مشاركة متجر بين اختبارات)

\`\`\`tsx
// StoreContext.tsx
import { createContext, useContext, useRef, type ReactNode } from "zustand";
import { useStore as useDefaultStore } from "./index";

type StoreApi = ReturnType<typeof useDefaultStore>;

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({
  store,
  children,
}: {
  store?: StoreApi;
  children: ReactNode;
}) {
  const ref = useRef(store ?? useDefaultStore);
  return (
    <StoreContext.Provider value={ref.current}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const api = useContext(StoreContext);
  return api ?? useDefaultStore;
}
\`\`\`

فائدة هذا النمط: تمرير نسخة مختلفة من المتجر في الاختبارات (testing).

## محددات متقدمة (Advanced Selectors)

\`\`\`tsx
// محدد بإرجاع كائن جديد — يسبب إعادة تصيير دائمًا!
const { user, cart } = useStore((s) => ({ user: s.user, cart: s.cart }));
// ❌ مشكلة: كل render يُرجع مرجع جديد

// الحل: useShallow
import { useShallow } from "zustand/react/shallow";

const { user, cart } = useStore(
  useShallow((s) => ({ user: s.user, cart: s.cart }))
);
// ✅ يعيد التصيير فقط عند تغيّر فعلي
\`\`\`

## محدد مشتق (Derived State)

\`\`\`ts
// احسب عند القراءة
const totalPrice = useStore((s) =>
  s.cart.reduce((sum, i) => sum + i.price * i.qty, 0)
);

// أو احفظ النتيجة في المتجر
const useStore = create((set, get) => ({
  cart: [],
  addToCart: (item) => {
    set((s) => ({ cart: [...s.cart, item] }));
    // احفظ الإجمالي
    set({ total: get().cart.reduce((sum, i) => sum + i.price * i.qty, 0) });
  },
  total: 0,
}));
\`\`\`

## تحديثات متفائلة (Optimistic)

\`\`\`tsx
function LikeButton({ postId }: { postId: string }) {
  const updatePost = useStore((s) => s.updatePost);

  const handleLike = async () => {
    // 1. تحديث متفائل فورًا
    updatePost(postId, { likes: currentLikes + 1 });
    try {
      // 2. إرسال للخادم
      await fetch("/api/like", { method: "POST", body: JSON.stringify({ postId }) });
    } catch {
      // 3. تراجع عند الفشل
      updatePost(postId, { likes: currentLikes });
      toast.error("فشل، حاول مرة أخرى");
    }
  };
}
\`\`\`

## تنظيف المتجر عند تسجيل الخروج

\`\`\`ts
export const useStore = create<State>()((set) => ({
  user: null,
  // ...
  reset: () =>
    set({
      user: null,
      cart: [],
      // أعد كل شيء للحالة الابتدائية
    }),
}));

// عند تسجيل الخروج
useStore.getState().reset();
\`\`\``,
        codeExample: `// مثال: متجر بسلايس متعددة
import { create } from "zustand";

type UserSlice = {
  user: { id: string; name: string } | null;
  login: (u: UserSlice["user"]) => void;
};

type UISlice = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

type Store = UserSlice & UISlice;

const createUserSlice = (set: any) => ({
  user: null,
  login: (user: UserSlice["user"]) => set({ user }),
});

const createUISlice = (set: any) => ({
  sidebarOpen: false,
  toggleSidebar: () =>
    set((s: Store) => ({ sidebarOpen: !s.sidebarOpen })),
});

export const useStore = create<Store>()((...a) => ({
  ...createUserSlice(...a),
  ...createUISlice(...a),
}));

// الاستخدام
function Profile() {
  const user = useStore((s) => s.user);
  if (!user) return <p>غير مسجّل</p>;
  return <p>مرحبًا {user.name}</p>;
}`,
        codeLanguage: "ts",
        order: 3,
        duration: 25,
        quiz: {
          title: "اختبار: أنماط Zustand",
          questions: [
            {
              text: "ما فائدة تقسيم المتجر إلى slices؟",
              correctIndex: 1,
              explanation:
                "تنظيم المتاجر الكبيرة إلى وحدات قابلة للصيانة.",
              choices: [
                { text: "يزيد الأداء" },
                {
                  text: "تنظيم الكود إلى وحدات قابلة للصيانة",
                },
                { text: "يقلل حجم الحزمة" },
                { text: "يضيف أنواعًا" },
              ],
            },
            {
              text: "ماذا تفعل useShallow؟",
              correctIndex: 2,
              explanation:
                "تمنع إعادة التصيير عند إرجاع كائن جديد لم يتغير فعليًا.",
              choices: [
                { text: "تنسخ المتجر" },
                { text: "تنشئ slice" },
                {
                  text: "تمنع إعادة التصيير غير الضرورية للكائنات",
                },
                { text: "تحفظ في localStorage" },
              ],
            },
          ],
        },
      },
    ],
  },
];

const achievements = [
  {
    slug: "first-lesson",
    title: "الخطوة الأولى",
    description: "أكملت أول درس لك",
    icon: "Footprints",
    condition: "lessons_completed:1",
  },
  {
    slug: "track-master",
    title: "سيّد المسار",
    description: "أكملت مسارًا تعليميًا كاملًا",
    icon: "Trophy",
    condition: "track_completed:1",
  },
  {
    slug: "quiz-master",
    title: "بطل الاختبارات",
    description: "حصلت على درجة كاملة في 3 اختبارات",
    icon: "Award",
    condition: "perfect_quizzes:3",
  },
  {
    slug: "scholar",
    title: "العالم المثابر",
    description: "أكملت 10 دروس",
    icon: "GraduationCap",
    condition: "lessons_completed:10",
  },
  {
    slug: "polyglot",
    title: "متعدد المعارف",
    description: "بدأت 3 مسارات مختلفة",
    icon: "Languages",
    condition: "tracks_started:3",
  },
  {
    slug: "quick-learner",
    title: "متعلّم سريع",
    description: "أكملت 5 دروس",
    icon: "Zap",
    condition: "lessons_completed:5",
  },
  {
    slug: "quiz-champion",
    title: "بطل الاختبارات",
    description: "اجتزت 5 اختبارات",
    icon: "Award",
    condition: "quizzes_passed:5",
  },
  {
    slug: "perfectionist",
    title: "الكمال",
    description: "حققت 100% في 5 اختبارات",
    icon: "Sparkles",
    condition: "perfect_quizzes:5",
  },
  {
    slug: "master-3-tracks",
    title: "ماستر الويب",
    description: "أكملت 3 مسارات كاملة",
    icon: "Trophy",
    condition: "tracks_completed:3",
  },
  {
    slug: "xp-500",
    title: "جامع النقاط",
    description: "وصلت إلى 500 نقطة خبرة",
    icon: "Star",
    condition: "xp_total:500",
  },
  {
    slug: "xp-1000",
    title: "محترف متمكّن",
    description: "وصلت إلى 1000 نقطة خبرة",
    icon: "Star",
    condition: "xp_total:1000",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing
  await db.userAchievement.deleteMany();
  await db.lessonProgress.deleteMany();
  await db.trackProgress.deleteMany();
  await db.choice.deleteMany();
  await db.question.deleteMany();
  await db.quiz.deleteMany();
  await db.lesson.deleteMany();
  await db.track.deleteMany();
  await db.achievement.deleteMany();

  // Seed achievements
  for (const a of achievements) {
    await db.achievement.create({ data: a });
  }
  console.log(`✅ ${achievements.length} achievements`);

  // Seed tracks + lessons + quizzes
  for (const t of tracks) {
    const track = await db.track.create({
      data: {
        slug: t.slug,
        title: t.title,
        description: t.description,
        color: t.color,
        icon: t.icon,
        level: t.level,
        order: t.order,
        duration: t.duration,
      },
    });

    for (const l of t.lessons) {
      const lesson = await db.lesson.create({
        data: {
          trackId: track.id,
          slug: l.slug,
          title: l.title,
          summary: l.summary,
          content: l.content,
          codeExample: l.codeExample ?? null,
          codeLanguage: l.codeLanguage ?? null,
          order: l.order,
          duration: l.duration,
        },
      });

      if (l.quiz) {
        const quiz = await db.quiz.create({
          data: { lessonId: lesson.id, title: l.quiz.title },
        });

        for (const q of l.quiz.questions) {
          const question = await db.question.create({
            data: {
              quizId: quiz.id,
              text: q.text,
              correctIndex: q.correctIndex,
              explanation: q.explanation ?? null,
              order: q.order ?? 0,
            },
          });
          for (const [i, c] of q.choices.entries()) {
            await db.choice.create({
              data: {
                questionId: question.id,
                text: c.text,
                order: i,
              },
            });
          }
        }
      }
    }

    console.log(`  ✅ Track "${t.title}" with ${t.lessons.length} lessons`);
  }

  console.log("🎉 Seeding complete!");
  const trackCount = await db.track.count();
  const lessonCount = await db.lesson.count();
  const quizCount = await db.quiz.count();
  console.log(`   Tracks: ${trackCount}, Lessons: ${lessonCount}, Quizzes: ${quizCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
