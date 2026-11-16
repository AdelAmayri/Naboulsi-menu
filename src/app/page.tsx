"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Globe2, Menu as MenuIcon, ShoppingBag, X } from "lucide-react";

const categories = [
  { en: "Breakfast", ar: "فطور" },
  { en: "Hummus & Foul", ar: "حمص وفول" },
  { en: "Falafel", ar: "فلافل" },
  { en: "Shawarma", ar: "شاورما" },
  { en: "Sandwiches", ar: "سندويشات" },
  { en: "Snacks", ar: "سناك" },
  { en: "Meals", ar: "وجبات" },
  { en: "Platters", ar: "سخنات" },
  { en: "Burgers", ar: "برغر" },
  { en: "Pizza", ar: "بيتزا" },
  { en: "Drinks", ar: "مشروبات" },
  { en: "Desserts", ar: "حلويات" }
];

const heroImage = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=2200&q=90";

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [mobileMenu, setMobileMenu] = useState(false);
  const isArabic = language === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const copy = useMemo(() => isArabic ? {
    eyebrow: "من قلب الشمال اللبناني",
    title: "الطعم الذي\nلا يُنسى.",
    subtitle: "نكهات أصيلة. شغف بالتفاصيل. وتجربة تستحق أن تعود إليها.",
    explore: "اكتشف قائمتنا",
    story: "حكاية نابلسي",
    scroll: "اكتشف المزيد",
    menu: "قائمتنا",
    menuSub: "كل ما تحبّه، في مكان واحد.",
    empty: "نعمل على تجهيز أصناف هذا القسم.",
    emptySub: "ترقّبوا القائمة قريباً.",
    order: "اطلب عبر واتساب",
    footer: "الطعم الذي لا يُنسى."
  } : {
    eyebrow: "FROM THE HEART OF NORTH LEBANON",
    title: "A Taste Worth\nRemembering.",
    subtitle: "Authentic flavours. A passion for detail. An experience worth coming back to.",
    explore: "Explore the menu",
    story: "Our story",
    scroll: "SCROLL TO DISCOVER",
    menu: "The menu",
    menuSub: "Everything you love, in one place.",
    empty: "We're preparing this section.",
    emptySub: "Our menu is coming soon.",
    order: "Order on WhatsApp",
    footer: "A taste worth remembering."
  }, [isArabic]);

  return (
    <main dir={direction} className="min-h-screen overflow-hidden bg-[#f4f1eb] text-[#151515]">
      <header className="site-header">
        <a href="#" className="brand" aria-label="NABOULSI home">
          <span className="brand-mark">N</span>
          <span className="brand-name">NABOULSI<span className="brand-dot">.</span><small>RESTO CAFE</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#menu">{copy.menu}</a>
          <a href="#story">{copy.story}</a>
        </nav>
        <div className="header-actions">
          <button className="language-button" onClick={() => setLanguage(isArabic ? "en" : "ar")} aria-label="Switch language">
            <Globe2 size={16} /> {isArabic ? "EN" : "عربي"}
          </button>
          <a className="header-order" href="#menu">{copy.explore}<ArrowUpRight size={15} /></a>
          <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
            {mobileMenu ? <X /> : <MenuIcon />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenu && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
          <a href="#menu" onClick={() => setMobileMenu(false)}>{copy.menu}</a>
          <a href="#story" onClick={() => setMobileMenu(false)}>{copy.story}</a>
        </motion.div>}
      </AnimatePresence>

      <section className="hero">
        <div className="hero-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.76) 0%, rgba(0,0,0,.36) 55%, rgba(0,0,0,.12) 100%), url("${heroImage}")` }} />
        <div className="hero-grain" />
        <div className="hero-content">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>{copy.eyebrow}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .12 }}>{copy.title.split("\\n").map((line, index) => <span key={index}>{line}</span>)}</motion.h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8, delay: .35 }}>{copy.subtitle}</motion.p>
          <motion.div className="hero-links" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .5 }}>
            <a href="#menu" className="primary-link">{copy.explore}<ArrowRight size={17} /></a>
            <a href="#story" className="text-link">{copy.story}<ArrowUpRight size={15} /></a>
          </motion.div>
        </div>
        <div className="hero-bottom">
          <span>EST. NABOULSI</span>
          <a href="#menu"><ArrowDown size={15} /> {copy.scroll}</a>
          <span>MINIEH · NORTH LEBANON</span>
        </div>
        <div className="hero-index">01 <span>/</span> 03</div>
      </section>

      <section className="intro-strip" id="story">
        <span className="intro-kicker">N / 01</span>
        <p>{isArabic ? "نؤمن أن الوجبة الرائعة تبدأ من المكونات الطازجة، وتكتمل بالاهتمام بكل تفصيل." : "We believe a remarkable meal begins with fresh ingredients and is completed with care in every detail."}</p>
        <span className="intro-signature">NABOULSI®</span>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading">
          <div>
            <span className="section-kicker">02 / {isArabic ? "اكتشف" : "DISCOVER"}</span>
            <h2>{copy.menu}<span>.</span></h2>
            <p>{copy.menuSub}</p>
          </div>
          <span className="section-side-note">MADE WITH PASSION — SERVED WITH PRIDE</span>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <motion.a key={category.en} href="#menu-items" className="category-tile" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .5, delay: index * .035 }}>
              <span className="category-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="category-title">{isArabic ? category.ar : category.en}</span>
              <ArrowUpRight className="category-arrow" size={18} />
            </motion.a>
          ))}
        </div>
        <div id="menu-items" className="menu-empty">
          <span className="empty-line" />
          <p>{copy.empty}</p>
          <small>{copy.emptySub}</small>
        </div>
      </section>

      <section className="closing-banner">
        <div className="closing-image" />
        <div className="closing-content">
          <span>THE NABOULSI EXPERIENCE</span>
          <h2>{isArabic ? "نكهة تبقى في الذاكرة." : "Made to be remembered."}</h2>
          <a href="#menu">{copy.explore}<ArrowUpRight size={16} /></a>
        </div>
      </section>

      <footer className="footer">
        <a href="#" className="footer-brand">NABOULSI<span>.</span></a>
        <p>{copy.footer}</p>
        <span>© {new Date().getFullYear()} NABOULSI RESTO CAFE</span>
      </footer>
    </main>
  );
}
