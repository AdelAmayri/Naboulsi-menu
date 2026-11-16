"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Globe2, Menu as MenuIcon, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { MenuCategory, MenuProduct } from "@/lib/menu";

const fallback: MenuCategory[] = [
  ["breakfast","Breakfast","فطور"],["hummus-foul","Hummus & Foul","حمص وفول"],["falafel","Falafel","فلافل"],["shawarma","Shawarma","شاورما"],["sandwiches","Sandwiches","سندويشات"],["snacks","Snacks","سناك"],["meals","Meals","وجبات"],["platters","Platters","سخنات"],["burgers","Burgers","برغر"],["pizza","Pizza","بيتزا"],["drinks","Drinks","مشروبات"],["desserts","Desserts","حلويات"]
].map(([slug,name_en,name_ar],i)=>({id:slug,slug,name_en,name_ar,sort_order:(i+1)*10}));
type CartLine = { product: MenuProduct; quantity: number };
const hero = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=2200&q=90";

export default function HomePage() {
  const [lang,setLang] = useState<"en"|"ar">("en");
  const [categories,setCategories] = useState<MenuCategory[]>(fallback);
  const [products,setProducts] = useState<MenuProduct[]>([]);
  const [active,setActive] = useState("all");
  const [cart,setCart] = useState<CartLine[]>([]);
  const [cartOpen,setCartOpen] = useState(false);
  const [name,setName] = useState("");
  const [notes,setNotes] = useState("");
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(false);
  const [mobileMenu,setMobileMenu] = useState(false);
  const ar = lang === "ar";
  const t = useMemo(()=> ar ? {
    eyebrow:"من قلب الشمال اللبناني", title:"الطعم الذي\nلا يُنسى.", subtitle:"نكهات أصيلة. شغف بالتفاصيل. وتجربة تستحق أن تعود إليها.",
    explore:"اكتشف قائمتنا", story:"حكاية نابلسي", scroll:"اكتشف المزيد", menu:"قائمتنا", menuSub:"كل ما تحبّه، في مكان واحد.",
    empty:"نعمل على تجهيز أصناف هذا القسم.", soon:"ترقّبوا القائمة قريباً.", add:"أضف إلى السلة", ask:"السعر عند الطلب",
    cart:"سلة الطلبات", total:"المجموع", checkout:"أرسل الطلب عبر واتساب", customer:"اسمك", notes:"ملاحظات إضافية",
    nameHint:"أدخل اسمك", notesHint:"أي تفاصيل نحتاج معرفتها؟", noItems:"سلتك فارغة حالياً", order:"طلب جديد من NABOULSI",
    loading:"نحمّل القائمة...", fail:"تعذّر تحميل القائمة حالياً.", all:"كل الأصناف", footer:"الطعم الذي لا يُنسى."
  } : {
    eyebrow:"FROM THE HEART OF NORTH LEBANON", title:"A Taste Worth\nRemembering.", subtitle:"Authentic flavours. A passion for detail. An experience worth coming back to.",
    explore:"Explore the menu", story:"Our story", scroll:"SCROLL TO DISCOVER", menu:"The menu", menuSub:"Everything you love, in one place.",
    empty:"We're preparing this section.", soon:"Our menu is coming soon.", add:"Add to order", ask:"Price on request",
    cart:"Your order", total:"Total", checkout:"Send order on WhatsApp", customer:"Your name", notes:"Additional notes",
    nameHint:"Enter your name", notesHint:"Anything we should know?", noItems:"Your order is empty", order:"New order from NABOULSI",
    loading:"Loading menu...", fail:"The menu could not be loaded right now.", all:"All items", footer:"A taste worth remembering."
  },[ar]);
  useEffect(()=>{
    let live=true;
    async function load(){
      const db=createClient();
      if(!db){setLoading(false);return;}
      const [c,p]=await Promise.all([
        db.from("menu_categories").select("id,slug,name_en,name_ar,sort_order").eq("is_active",true).order("sort_order"),
        db.from("menu_products").select("id,category_id,name_en,name_ar,description_en,description_ar,price,image_url,tags,is_featured,sort_order").eq("is_available",true).order("sort_order")
      ]);
      if(!live)return;
      if(c.error||p.error)setError(true);
      if(c.data?.length)setCategories(c.data as MenuCategory[]);
      if(p.data)setProducts(p.data as MenuProduct[]);
      setLoading(false);
    }
    void load(); return ()=>{live=false;};
  },[]);
  const visible=active==="all"?products:products.filter(p=>p.category_id===active);
  const count=cart.reduce((n,l)=>n+l.quantity,0);
  const total=cart.reduce((n,l)=>n+(l.product.price??0)*l.quantity,0);
  const money=(n:number)=>new Intl.NumberFormat(ar?"ar-LB":"en-US",{style:"currency",currency:"USD"}).format(n);
  function add(p:MenuProduct){
    if(p.price===null)return;
    setCart(old=>{const found=old.find(x=>x.product.id===p.id);return found?old.map(x=>x.product.id===p.id?{...x,quantity:x.quantity+1}:x):[...old,{product:p,quantity:1}];});
    setCartOpen(true);
  }
  function qty(id:string,d:number){setCart(old=>old.map(x=>x.product.id===id?{...x,quantity:x.quantity+d}:x).filter(x=>x.quantity>0));}
  function checkout(){
    const number=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER??"").replace(/\D/g,"");
    if(!number||number.includes("XXXXXXXX")){window.alert(ar?"رقم واتساب المطعم غير مضبوط بعد.":"The restaurant WhatsApp number has not been configured yet.");return;}
    if(!cart.length)return;
    const rows=cart.map(x=>"• "+(ar?x.product.name_ar:x.product.name_en)+" × "+x.quantity+" — "+money((x.product.price??0)*x.quantity));
    const message=[t.order,name?t.customer+": "+name:"",...rows,t.total+": "+money(total),notes?t.notes+": "+notes:""].filter(Boolean).join("\n");
    window.location.href="https://wa.me/"+number+"?text="+encodeURIComponent(message);
  }
  return <main dir={ar?"rtl":"ltr"} className="min-h-screen overflow-hidden bg-[#f4f1eb] text-[#151515]">
    <header className="site-header">
      <a href="#" className="brand"><span className="brand-mark">N</span><span className="brand-name">NABOULSI<span className="brand-dot">.</span><small>RESTO CAFE</small></span></a>
      <nav className="desktop-nav"><a href="#menu">{t.menu}</a><a href="#story">{t.story}</a></nav>
      <div className="header-actions">
        <button className="language-button" onClick={()=>setLang(ar?"en":"ar")}><Globe2 size={16}/>{ar?"EN":"عربي"}</button>
        <button className="cart-trigger" onClick={()=>setCartOpen(true)} aria-label={t.cart}><ShoppingBag size={17}/><span>{count}</span></button>
        <a className="header-order" href="#menu">{t.explore}<ArrowUpRight size={15}/></a>
        <button className="mobile-menu-button" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Menu">{mobileMenu?<X/>:<MenuIcon/>}</button>
      </div>
    </header>
    <AnimatePresence>{mobileMenu&&<motion.div className="mobile-menu" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><a href="#menu" onClick={()=>setMobileMenu(false)}>{t.menu}</a><a href="#story" onClick={()=>setMobileMenu(false)}>{t.story}</a></motion.div>}</AnimatePresence>
    <section className="hero">
      <div className="hero-image" style={{backgroundImage:'linear-gradient(90deg,rgba(0,0,0,.76),rgba(0,0,0,.36) 55%,rgba(0,0,0,.12)),url("'+hero+'")'}}/><div className="hero-grain"/>
      <div className="hero-content"><motion.p className="eyebrow" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>{t.eyebrow}</motion.p>
        <motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.9,delay:.12}}>{t.title.split("\n").map((s,i)=><span key={i}>{s}</span>)}</motion.h1>
        <motion.p className="hero-subtitle" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.35}}>{t.subtitle}</motion.p>
        <motion.div className="hero-links" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.5}}><a href="#menu" className="primary-link">{t.explore}<ArrowRight size={17}/></a><a href="#story" className="text-link">{t.story}<ArrowUpRight size={15}/></a></motion.div>
      </div>
      <div className="hero-bottom"><span>EST. NABOULSI</span><a href="#menu"><ArrowDown size={15}/>{t.scroll}</a><span>MINIEH · NORTH LEBANON</span></div><div className="hero-index">01 <span>/</span> 03</div>
    </section>
    <section className="intro-strip" id="story"><span className="intro-kicker">N / 01</span><p>{ar?"نؤمن أن الوجبة الرائعة تبدأ من المكونات الطازجة، وتكتمل بالاهتمام بكل تفصيل.":"We believe a remarkable meal begins with fresh ingredients and is completed with care in every detail."}</p><span className="intro-signature">NABOULSI®</span></section>
    <section className="menu-section" id="menu">
      <div className="section-heading"><div><span className="section-kicker">02 / {ar?"اكتشف":"DISCOVER"}</span><h2>{t.menu}<span>.</span></h2><p>{t.menuSub}</p></div><span className="section-side-note">MADE WITH PASSION — SERVED WITH PRIDE</span></div>
      <div className="category-grid">{categories.map((c,i)=><button key={c.id} onClick={()=>{setActive(c.id);document.getElementById("menu-items")?.scrollIntoView({behavior:"smooth"});}} className={"category-tile "+(active===c.id?"selected":"")}><span className="category-number">{String(i+1).padStart(2,"0")}</span><span className="category-title">{ar?c.name_ar:c.name_en}</span><ArrowUpRight className="category-arrow" size={18}/></button>)}</div>
      <div id="menu-items" className="products-area"><div className="product-toolbar"><button className={active==="all"?"filter-chip active":"filter-chip"} onClick={()=>setActive("all")}>{t.all}</button>{active!=="all"&&<span>{categories.find(c=>c.id===active)?.[ar?"name_ar":"name_en"]}</span>}</div>
        {loading?<p className="menu-status">{t.loading}</p>:error?<p className="menu-status">{t.fail}</p>:visible.length===0?<div className="menu-empty"><span className="empty-line"/><p>{t.empty}</p><small>{t.soon}</small></div>:<div className="product-grid">{visible.map(p=><motion.article key={p.id} className="product-card" initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.45}}>
          <div className="product-image">{p.image_url?<Image src={p.image_url} alt={ar?p.name_ar:p.name_en} fill sizes="(max-width:760px) 90vw,30vw" className="product-photo"/>:<div className="product-image-placeholder">N</div>}{p.is_featured&&<span className="product-featured">{ar?"مميز":"FEATURED"}</span>}</div>
          <div className="product-details"><div><h3>{ar?p.name_ar:p.name_en}</h3><p>{ar?p.description_ar:p.description_en}</p></div><div className="product-buy-row"><strong>{p.price===null?t.ask:money(p.price)}</strong><button disabled={p.price===null} onClick={()=>add(p)}>{p.price===null?t.ask:<><Plus size={15}/>{t.add}</>}</button></div></div>
        </motion.article>)}</div>}
      </div>
    </section>
    <section className="closing-banner"><div className="closing-image"/><div className="closing-content"><span>THE NABOULSI EXPERIENCE</span><h2>{ar?"نكهة تبقى في الذاكرة.":"Made to be remembered."}</h2><a href="#menu">{t.explore}<ArrowUpRight size={16}/></a></div></section>
    <footer className="footer"><a href="#" className="footer-brand">NABOULSI<span>.</span></a><p>{t.footer}</p><span>© {new Date().getFullYear()} NABOULSI RESTO CAFE</span></footer>
    <AnimatePresence>{cartOpen&&<motion.div className="cart-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setCartOpen(false)}>
      <motion.aside className="cart-panel" dir={ar?"rtl":"ltr"} initial={{x:ar?"-100%":"100%"}} animate={{x:0}} exit={{x:ar?"-100%":"100%"}} transition={{type:"spring",damping:28,stiffness:260}} onClick={e=>e.stopPropagation()}>
        <div className="cart-heading"><div><span className="section-kicker">NABOULSI / ORDER</span><h2>{t.cart}</h2></div><button onClick={()=>setCartOpen(false)}><X/></button></div>
        {cart.length===0?<p className="cart-empty">{t.noItems}</p>:<>
          <div className="cart-lines">{cart.map(x=><div className="cart-line" key={x.product.id}><div><strong>{ar?x.product.name_ar:x.product.name_en}</strong><small>{money(x.product.price??0)} / {ar?"للقطعة":"each"}</small></div><div className="quantity-control"><button onClick={()=>qty(x.product.id,-1)}><Minus size={13}/></button><span>{x.quantity}</span><button onClick={()=>qty(x.product.id,1)}><Plus size={13}/></button></div><b>{money((x.product.price??0)*x.quantity)}</b></div>)}</div>
          <div className="cart-form"><label>{t.customer}<input value={name} onChange={e=>setName(e.target.value)} placeholder={t.nameHint}/></label><label>{t.notes}<textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder={t.notesHint}/></label></div>
          <div className="cart-total"><span>{t.total}</span><strong>{money(total)}</strong></div><button className="checkout-button" onClick={checkout}>{t.checkout}<ArrowUpRight size={17}/></button>
          <small className="cart-footnote">{ar?"سيتم إرسال طلبك مباشرة إلى واتساب المطعم. لا يوجد دفع إلكتروني.":"Your order goes directly to the restaurant on WhatsApp. No online payment."}</small>
        </>}
      </motion.aside>
    </motion.div>}</AnimatePresence>
  </main>;
}