import { Product, StoreSettings } from "./types";

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "real-madrid-home",
    name: "قميص ريال مدريد الأساسي 2024/25",
    price: 89.99,
    description: "القميص الأبيض الأيقوني للملكي. صُنع بدقة متناهية ليمثل الملوكية والتاريخ والتميز الذي لا يُضاهى. يتميز بتقنية طرد الرطوبة للحصول على أقصى درجات الراحة.",
    category: "الدوري الإسباني",
    image: "https://placehold.co/600x800/3D5166/FFFFFF?text=REAL+MADRID+HOME",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أبيض", "فضي"],
    featured: true,
    active: true
  },
  {
    id: "barcelona-away",
    name: "قميص برشلونة الاحتياطي 2024/25",
    price: 94.99,
    description: "تصميم غامض ومذهل لقميص نادي برشلونة الاحتياطي. يدمج اللون الأزرق الداكن بلمسات حمراء كلاسيكية. مصمم للأداء العالي والأناقة العصرية في الشارع.",
    category: "الدوري الإسباني",
    image: "https://placehold.co/600x800/3D5166/FFFFFF?text=BARCELONA+AWAY",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أزرق داكن", "أحمر"],
    featured: true,
    active: true
  },
  {
    id: "mancity-home",
    name: "قميص مانشستر سيتي الأساسي 2024/25",
    price: 89.99,
    description: "اللون السماوي الكلاسيكي لمانشستر سيتي. يحتفي بالدقة الهيكلية والتطور التكتيكي للنادي. مثالي للملعب والشارع على حد سواء.",
    category: "الدوري الإنجليزي",
    image: "https://placehold.co/600x800/3D5166/FFFFFF?text=MAN+CITY+HOME",
    sizes: ["S", "M", "L"],
    colors: ["سماوي", "كحلي"],
    featured: true,
    active: true
  },
  {
    id: "chelsea-away",
    name: "قميص تشيلسي الاحتياطي 2024/25",
    price: 84.99,
    description: "ألوان احتياطية أنيقة وتكتيكية. فخر لندن في مظهر داكن أنيق مفعم بلمسات جليدية بارزة.",
    category: "الدوري الإنجليزي",
    image: "https://placehold.co/600x800/3D5166/FFFFFF?text=CHELSEA+AWAY",
    sizes: ["M", "L", "XL"],
    colors: ["أزرق داكن", "أزرق ثلجي"],
    featured: false,
    active: true
  },
  {
    id: "psg-third",
    name: "قميص باريس سان جيرمان الثالث 2024/25",
    price: 99.99,
    description: "مظهر رائع باللونين الأسود والذهبي مستوحى من ملابس الشارع الباريسية. يجمع بين الفخامة وتصميم منصات العرض في عالم كرة القدم.",
    category: "الدوري الفرنسي",
    image: "https://placehold.co/600x800/3D5166/FFFFFF?text=PSG+THIRD",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "ذهبي"],
    featured: true,
    active: true
  },
  {
    id: "liverpool-home",
    name: "قميص ليفربول الأساسي 2024/25",
    price: 89.99,
    description: "اللون الأحمر الأسطوري لملعب الأنفيلد. مصمم بنمط كلاسيكي عتيق وتقنيات نسيج متطورة للاحتفاء بإرث النادي العريق.",
    category: "الدوري الإنجليزي",
    image: "https://placehold.co/600x800/3D5166/FFFFFF?text=LIVERPOOL+HOME",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أحمر", "ذهبي"],
    featured: false,
    active: true
  },
  {
    id: "arsenal-home",
    name: "قميص أرسنال الأساسي 2024/25",
    price: 84.99,
    description: "الأحمر والأبيض الكلاسيكي للمدفعجية. مصمم للمرونة العالية والأناقة المطلقة، ليعبر عن تاريخ لندن الغني في كرة القدم.",
    category: "الدوري الإنجليزي",
    image: "https://placehold.co/600x800/3D5166/FFFFFF?text=ARSENAL+HOME",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أحمر", "أبيض"],
    featured: false,
    active: true
  },
  {
    id: "alahly-kit",
    name: "قميص الأهلي المصري الأساسي 2024/25",
    price: 74.99,
    description: "القميص الممتاز للشياطين الحمر. نادي القرن في أفريقيا يقدم تصميماً هندسياً قوياً باللونين الأحمر والأسود يجسد الانتصارات والهيبة.",
    category: "الدوريات الأفريقية",
    image: "https://placehold.co/600x800/3D5166/FFFFFF?text=AL-AHLY+KIT",
    sizes: ["M", "L", "XL"],
    colors: ["أحمر", "أسود"],
    featured: false,
    active: true
  }
];

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "JERSEY ZONE",
  heroHeadline: "عندما تبدأ اللعبة، يصمت كل شيء آخر",
  heroSubheadline: "أنت لا ترتديه فقط. أنت تمثله.",
  maintenanceMode: false
};
