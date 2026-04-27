import { useState, useEffect, useCallback } from "react";

// ── GLOBAL STYLES ──────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --yellow: #FFD23F;
    --orange: #FF5A1F;
    --green: #5A8F2B;
    --cream: #FFFBEF;
    --dark: #1A1500;
    --text: #2D2400;
    --muted: #7A6A2A;
  }

  /* ensure page truly edge-to-edge */
  html, body, #root { height: 100%; width: 100%; }
  body { font-family: 'Baloo 2', cursive; background: var(--cream); color: var(--text); overflow-x: hidden; margin: 0; }

  /* layout: sections are full-bleed, inner .container centers content without leaving page-level gaps */
  section { padding: 60px 0; width: 100%; box-sizing: border-box; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; width: 100%; box-sizing: border-box; }

  .section-title { font-size: 38px; font-weight: 800; text-align: center; color: var(--dark); margin-bottom: 12px; }
  .section-title span { color: var(--orange); }
  .divider { width: 60px; height: 4px; background: var(--yellow); border-radius: 2px; margin: 0 auto 48px; }

  /* remove default extra spacing for header/footer so they sit flush */
  nav, footer { width: 100%; left: 0; right: 0; box-sizing: border-box; }

  /* keep a small inner padding only via .container; remove any large outer paddings */
  .btn-primary {
    background: var(--orange);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 50px;
    font-family: 'Baloo 2', cursive;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover { background: #e04800; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255,90,31,0.4); }
  .btn-yellow {
    background: var(--yellow);
    color: var(--dark);
    border: none;
    padding: 12px 28px;
    border-radius: 50px;
    font-family: 'Baloo 2', cursive;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-yellow:hover { background: #f5c200; transform: translateY(-2px); }

  /* grid adjustments remain same but constrained inside container */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(240px, 1fr));
    gap: 24px;
  }
  @media (max-width: 760px) {
    .products-grid { grid-template-columns: 1fr; }
  }
ght: 0 !important; }
  /* product image box (responsive) */
  .product-img {
    width: 100%;
    overflow: hidden;
    border-radius: 20px 20px 0 0; /* match card radius so image touches edges */
    display: block;
    background: transparent; /* remove inner bg so image is edge-to-edge */
  }
  .product-img img {
    width: 100%;
    height: auto;            /* keep natural aspect ratio, no cropping */
    display: block;
    object-fit: contain;     /* safe fallback if browser applies object-fit */
  }
  @media (max-width: 760px) {
    .product-img { /* no forced height on small screens either */ }
  }

  /* small utility to remove gaps for full-bleed sections that should not have inner background spacing */
  .no-gutter { padding-left: 0 !important; padding-ri
`;

// ── DATA ──────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Original Sweet Corn",
    price: 15000,
    emoji: "🌽",
    color: "#FFD23F",
    desc: "Rasa jagung manis alami tanpa tambahan rasa. Fresh & sehat!",
    badge: "Best Seller",
    // sample srcs: bisa pakai path relatif ke /public atau url CDN
    img: "/product/original.png"
  },
  {
    id: 2,
    name: "Chocolate Corn",
    price: 17000,
    emoji: "🍫",
    color: "#8B5E3C",
    desc: "Perpaduan susu jagung dengan cokelat premium. Creamy & rich!",
    img: "/product/coco.png"
  },
  // tambahkan produk lain dengan field img: "/images/nama-file.jpg"
];

const FAQS = [
  { q: "Apakah produk mengandung pengawet?", a: "Tidak sama sekali! CRAVELY dibuat fresh by order setiap hari dari jagung segar pilihan tanpa bahan pengawet." },
  { q: "Berapa lama produk bisa bertahan?", a: "Karena fresh by order, kami rekomendasikan untuk dikonsumsi dalam 24 jam setelah pembuatan." },
  { q: "Apakah ada pilihan less sugar?", a: "Tentu! Saat order via WhatsApp, kamu bisa request less sugar atau sugar-free untuk semua varian." },
  { q: "Bagaimana cara order?", a: "Tambahkan produk ke keranjang, lalu klik 'Beli via WhatsApp'. Tim kami akan langsung membalas!" },
];

const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID");

/* Cart context removed: now using CartDrawer component directly in App */

// ── NAVBAR ────────────────────────────────────────────────────
function Navbar({ cartCount, onCartClick }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Tentang", href: "#about" },
    { label: "Produk", href: "#produk" },
    { label: "Manfaat", href: "#manfaat" },
    { label: "Hubungi Kami", href: "#hubungi" }, // konsisten: arahkan ke section id="#hubungi"
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,251,239,0.97)" : "transparent",
     
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
     
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/product/logo.png"
              alt="CRAVELY logo"
              style={{ width: 50, height: 67, objectFit: "contain", display: "block" }}

            />
            <span style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 20, color: "var(--orange)" }}>
              CRAVELY
            </span>
          </a>

          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 24 }} className="nav-links-desktop">
              {links.map(l => (
                <a key={l.href} href={l.href} style={{
                  textDecoration: "none", color: "var(--text)",
                  fontWeight: 700, fontSize: 15, transition: "color 0.2s"
                }}
                  onMouseEnter={e => e.target.style.color = "var(--orange)"}
                  onMouseLeave={e => e.target.style.color = "var(--text)"}
                >{l.label}</a>
              ))}
            </div>
            <button onClick={onCartClick} style={{
              position: "relative",
              background: "var(--yellow)",
              border: "none",
              width: 44,
              height: 44,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
              transition: "all 0.2s"
            }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  background: "var(--orange)",
                  color: "white",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  fontSize: 11,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Baloo 2', cursive"
                }}>{cartCount}</span>
              )}
            </button>
            <button onClick={() => setOpen(!open)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 24, display: "none", color: "var(--dark)"
            }} className="hamburger">☰</button>
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 700px) {
          .nav-links-desktop { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>

      {open && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "var(--cream)", padding: 24,
          borderBottom: "2px solid var(--yellow)"
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: "block", padding: "12px 0",
              textDecoration: "none", color: "var(--text)",
              fontWeight: 700, fontSize: 18,
              borderBottom: "1px solid rgba(0,0,0,0.06)"
            }}>{l.label}</a>
          ))}
        </div>
      )}
    </>
  );
}

// ── HERO ──────────────────────────────────────────────────────
function Hero({ onShopClick }) {
  return (
    <section id="hero" style={{
      minHeight: "150vh", display: "flex", alignItems: "center",
      background: "linear-gradient(135deg, #FFFBEF 0%, #FFF3C4 50%, #FFE8A0 100%)",
      padding: "100px 24px 60px", position: "relative", overflow: "hidden", flexWrap: "wrap", marginTop: -60 /* compensate for fixed navbar height */

    }}>


      <div style={{ maxWidth: 1100, margin: "auto auto", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
        <div style={{ 
          flex: "1 1 380px", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", /* Bikin elemen ke tengah secara horizontal */
          textAlign: "center"   /* Bikin teks jadi rata tengah */
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--green)", color: "white",
            padding: "6px 16px", borderRadius: 50,
            fontSize: 13, fontWeight: 700, marginBottom: 20,
            letterSpacing: 1
          }}>  % 100 Natural & Fresh</div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: "var(--orange)" }}>
            Cravely<br />
            <span style={{ color: "var(--dark)" }}>Susu Jagung</span>
          </h1>

          {/* small subtitle under hero title */}
          <div style={{
            fontSize: 14,
            color: "var(--muted)",
            marginBottom: 16,
            maxWidth: 460,
            letterSpacing: "0.01em"
          }}>
            Fresh, Sweet, and Natural Corn Milk.
          </div>

          <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
            Nikmati kesegaran susu jagung alami yang dibuat dari jagung pilihan berkualitas tinggi. Setiap tegukan memberikan rasa manis alami, kaya nutrisi, dan tanpa bahan pengawet.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}> {/* justifyContent: "center" biar tombol ke tengah */}
            <button className="btn-primary" onClick={onShopClick} style={{ fontSize: 17, padding: "14px 32px" }}>
              🛒 Order Sekarang
            </button>
            <a href="#about" className="btn-yellow" style={{ fontSize: 17, padding: "14px 28px", textDecoration: "none" }}>
              Tentang Cravely →
            </a>
          </div>

          <div style={{ display: "flex", gap: 32, marginTop: 40, justifyContent: "center", flexWrap: "wrap" }}> {/* justifyContent: "center" biar stat bawah ke tengah */}
            {[["Premium Quality", "Proses higienis & standar tinggi"], ["100%", "Bahan Alami"], ["0%", "Pengawet"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--orange)" }}>{n}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* hero visual */}
<div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
          <img 
            src="/product/original.png" 
            alt="Cravely Corn"
            style={{
              width: "100%", 
              maxWidth: "500px", /* Gua batesin dikit biar ga raksasa banget */
              height: "auto", 
              borderRadius: "24px", /* KUNCI RAPI: Ujungnya dilengkungin */
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)", /* Kasih bayangan biar ngambang dikit */
              objectFit: "cover",
              display: "block"
            }} 
          />
         </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────
function About() {
  const vals = [
    { icon: "🌿", title: "Premium Quality", desc: "Terbuat dari jagung pilihan berkualitas terbaik" },
    { icon: "⚡", title: "100 % Natural", desc: "Tanpa pengawet, pewarna, dan pemanis buatan." },
    { icon: "✨", title: "Always Fresh", desc: "Dibuat fresh setiap hari untuk kesegaran maksimal" },
  ];

  return (
    <section id="about" style={{ background: "white" }}>
      <div className="container">
        <h2 className="section-title">Tentang <span>CRAVELY</span></h2>
        <div className="divider" />

        {/* Flow: gambar → deskripsi → 3 fitur (emoji di atas, title, desc); shadow lebih ringan + animasi halus */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, alignItems: "center" }}>

          {/* image */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "linear-gradient(135deg, #FFD23F, #FF5A1F)",
              borderRadius: 24, padding: 8, display: "flex", alignItems: "center", justifyContent: "center",
              maxWidth: 760, width: "100%"
            }}>
              <img
                src="/images/about-corn.jpg"
                alt="CRAVELY Susu Jagung"
                style={{
                  width: "100%",
                  maxWidth: 720,
                  height: "auto",
                  borderRadius: 20,
                  display: "block",
                  objectFit: "cover"
                }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>
          </div>

          {/* centered description */}
          <div style={{ maxWidth: 820, textAlign: "center", color: "var(--muted)" }}>
            <p style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 12 }}>
              <strong style={{ color: "var(--dark)" }}>CRAVELY</strong> adalah brand minuman susu jagung yang menghadirkan kesegaran dan kelezatan dari jagung alami pilihan. kami berkomitmen untuk menyajikan produk sehat, berkualitas dan penuh nutrisi untuk gaya hidup modern Anda
            </p>

          </div>

          {/* features: emoji above, then title, then desc; lighter shadow and subtle pop animation */}
          <div style={{
            width: "100%",
            maxWidth: 880,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginTop: 4
          }}>
            {vals.map(v => (
              <div key={v.title} className="feature-card" style={{
                background: "white",
                borderRadius: 16,
                padding: 22,
                boxShadow: "0 10px 24px rgba(17,15,11,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                border: "1px solid rgba(0,0,0,0.03)",
                transition: "transform 0.28s ease, box-shadow 0.28s ease"
              }}>
                {/* icon: no inner shadow/box, emoji sits plain above title */}
                <div className="feature-icon" style={{
                  fontSize: 40,
                  marginBottom: 12,
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  boxShadow: "none",
                  width: "auto",
                  height: "auto"
                }}>
                  {v.icon}
                </div>
                <div style={{ fontWeight: 800, color: "var(--dark)", marginBottom: 8 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{v.desc}</div>
              </div>
            ))}
          </div>

          {/* highlight box (unchanged) */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div role="note" aria-label="Informasi produk" style={{
              maxWidth: 820,
              width: "100%",
              background: "linear-gradient(90deg, rgba(255,210,63,0.12), rgba(255,210,63,0.04))",
              border: "1px solid rgba(255,210,63,0.35)",
              padding: "18px 22px",
              borderRadius: 14,
              boxShadow: "0 8px 30px rgba(255,170,0,0.06)"
            }}>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.8, color: "var(--dark)", textAlign: "center" }}>
                <strong style={{ color: "var(--orange)" }}>Setiap botol CRAVELY</strong> diproduksi dengan standar kebersihan tinggi dan penuh cinta — memberikan manfaat nutrisi dari jagung yang kaya akan serat, vitamin, dan mineral untuk kesehatan Anda dan keluarga.
              </p>
            </div>
          </div>

        </div>

        {/* small CSS for hover/animation */}
        <style>{`
          .feature-card:hover {
            transform: translateY(-6px) scale(1.01);
            box-shadow: 0 12px 30px rgba(17,15,11,0.08);
          }
          .feature-icon {
            transition: transform 280ms ease;
          }
          .feature-card:hover .feature-icon {
            transform: translateY(-4px) scale(1.03);
          }
          @media (max-width: 880px) {
            .feature-card { padding: 18px; }
            .feature-icon { width: 60px; height: 60px; font-size: 26px; }
            .container { padding-left: 16px; padding-right: 16px; }
            .feature-card { margin-bottom: 8px; }
            .feature-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

      </div>
    </section>
  );
}

// ── PRODUCTS ──────────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation(); // mencegah bubble kalau parent clickable
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div style={{
      background: "white", borderRadius: 20, overflow: "hidden",
      border: "2px solid #f0f0f0", transition: "all 0.25s",
      cursor: "pointer", position: "relative"
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = "var(--yellow)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#f0f0f0"; }}
    >
      {product.badge && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "var(--orange)", color: "white",
          padding: "3px 10px", borderRadius: 50,
          fontSize: 11, fontWeight: 700
        }}>{product.badge}</div>
      )}

      <div className="product-img" aria-hidden={product.img ? "false" : "true"}>
        {product.img ? (
          <img src={product.img} alt={product.name} />
        ) : (
          <div style={{ fontSize: 80 }}>{product.emoji}</div>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 800, fontSize: 17, color: "var(--dark)", marginBottom: 6 }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 16, minHeight: 40 }}>{product.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: "var(--orange)" }}>{formatRupiah(product.price)}</span>
          <button onClick={handleAdd} style={{
            background: added ? "var(--green)" : "var(--yellow)",
            border: "none", borderRadius: 50, padding: "8px 16px",
            fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 13,
            cursor: "pointer", transition: "all 0.3s",
            color: added ? "white" : "var(--dark)"
          }}>
            {added ? "✓ Ditambah!" : "+ Keranjang"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Products({ onAddToCart }) {
  return (
    <section id="produk" style={{ background: "var(--cream)" }}>
      <div className="container">
        <h2 className="section-title">Pilihan <span>Varian Rasa</span></h2>
        <p style={{ textAlign: "center", color: "var(--muted)", marginBottom: 8, fontSize: 17 }}>
          Semua rasa dibuat dari jagung segar lokal, tanpa pengawet 
        </p>
        <div className="divider" />

        <div className="products-grid">
          {PRODUCTS.map(p => (
            <ProductCard key={p.id} product={p} onAdd={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── BENEFITS ──────────────────────────────────────────────────
function Benefits() {
  const items = [
    { icon: "💪", title: "Kaya Serat", desc: "Jagung mengandung serat tinggi yang baik untuk pencernaan dan menjaga kenyang lebih lama." },
    { icon: "⚡", title: "Sumber Energi", desc: "Karbohidrat kompleks dalam jagung memberikan energi tahan lama tanpa lonjakan gula darah." },
    { icon: "🧠", title: "Vitamin B Kompleks", desc: "Mendukung fungsi otak dan sistem saraf untuk produktivitas harian yang optimal." },
    { icon: "🛡️", title: "Antioksidan", desc: "Lutein dan zeaxanthin dalam jagung melindungi sel dari kerusakan akibat radikal bebas." },
    { icon: "🦷", title: "Rendah Lemak", desc: "Pilihan minuman sehat yang tidak memberatkan tubuh, cocok untuk diet sehat." },
    { icon: "💧", title: "Hidrasi Alami", desc: "Kandungan air tinggi dari jagung segar membantu menjaga hidrasi tubuh sepanjang hari." },
  ];

  return (
    <section id="manfaat" style={{ background: "white" }}>
      <div className="container">
        <h2 className="section-title">Manfaat <span>Susu Jagung</span></h2>
        <div className="divider" />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {items.map(item => (
            <div key={item.title} style={{
              background: "linear-gradient(135deg, #FFFBEF, #FFF3C4)",
              borderRadius: 20, padding: 28,
              border: "1.5px solid var(--yellow)",
              transition: "transform 0.2s"
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: "var(--dark)", marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────
function FAQ() {
  // Hubungi Kami (menggantikan FAQ)
  const waMessage = encodeURIComponent("Halo CRAVELY, saya ingin pesan susu jagung. Mohon info ketersediaan & pengiriman. Terima kasih!");
  const waLink = `https://wa.me/6287849764103?text=${waMessage}`;
  const igLink = "https://instagram.com/cravely.official";
  const mailLink = "mailto:hello@cravely.id";
  const mapsLink = "https://www.google.com/maps/place/Primakara+University/@-8.6923198,115.2413429,15.75z/data=!4m6!3m5!1s0x2dd241aab844be9f:0x7bfef0260053104e!8m2!3d-8.6896993!4d115.2377738!16s%2Fg%2F1q62f9z3f?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D";

  const boxBase = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    cursor: "pointer",
    textDecoration: "none",
    color: "inherit",
  };

  return (
    <section id="hubungi" style={{ background: "var(--cream)" }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <h2 className="section-title">Hubungi <span>Kami</span></h2>
        <div className="divider" />
        <p style={{ textAlign: "center", color: "var(--muted)", marginBottom: 20, fontSize: 16 }}>
          Pesan mudah melalui WhatsApp dan nikmati susu jagung segar hari ini juga.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
          alignItems: "stretch" // stretch supaya kolom kanan ikut tinggi kolom kiri
        }}>
          {/* Kolom A - daftar kontak seragam: ikon di kiri, text left-aligned, whole box clickable */}
          <div>
            <div style={{ display: "grid", gap: 12 }}>
              {/* Order Via WhatsApp - hijau (entire box clickable) */}
              <a href={waLink} target="_blank" rel="noreferrer" style={{ ...boxBase, background: "linear-gradient(90deg, rgba(90,143,43,0.12), rgba(90,143,43,0.04))", border: "1px solid rgba(90,143,43,0.18)" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--green)", color: "white", fontSize: 22, flexShrink: 0
                }}>💬</div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontWeight: 800, color: "var(--dark)" }}>Order Via WhatsApp</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>+ 62 878-4976-4103</div>
                </div>
              
              </a>

              {/* Follow Instagram - pink */}
              <a href={igLink} target="_blank" rel="noreferrer" style={{ ...boxBase, background: "linear-gradient(90deg, rgba(225,48,108,0.10), rgba(225,48,108,0.03))", border: "1px solid rgba(225,48,108,0.14)" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#E1306C", color: "white", fontSize: 22, flexShrink: 0
                }}>📸</div>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontWeight: 800, color: "var(--dark)" }}>Follow Instagram</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>@cravely.official</div>
                </div>

              </a>

              {/* Email - putih */}
              <a href={mailLink} style={{ ...boxBase, background: "white", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#f6f6f6", color: "var(--dark)", fontSize: 20, flexShrink: 0
                }}>✉️</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 800, color: "var(--dark)" }}>Email</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>hello@cravely.id</div>
                </div>
              </a>

              {/* Location - putih */}
              <a href={mapsLink} target="_blank" rel="noreferrer" style={{ ...boxBase, background: "white", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#f6f6f6", color: "var(--dark)", fontSize: 20, flexShrink: 0
                }}>📍</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 800, color: "var(--dark)" }}>Location</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>Bali, Indonesia </div>
                </div>
              </a>
            </div>
          </div>

          {/* Kolom B (centered content, nicer shadow) */}
          <div>
            <div style={{
              background: "linear-gradient(135deg, rgba(255,210,63,0.06), rgba(255,210,63,0.02))",
              borderRadius: 12,
              padding: 22,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
              boxShadow: "0 12px 40px rgba(17,15,11,0.10), inset 0 -6px 18px rgba(255,210,63,0.04)",
              transition: "transform 180ms ease, box-shadow 180ms ease"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(17,15,11,0.14), inset 0 -6px 18px rgba(255,210,63,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(17,15,11,0.10), inset 0 -6px 18px rgba(255,210,63,0.04)"; }}
            >
              <div style={{ display: "grid", alignItems: "center", justifyContent: "center" }}>
                <h1 style={{ fontSize: 50 }}>🌽</h1>
                <h3 style={{ margin: 0, fontSize: 20, color: "var(--dark)", fontWeight: 800 }}>Pesan Sekarang</h3>
              </div>

              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6, maxWidth: 420, fontSize: 12, padding: "0 30px" }}>
                Dapatkan kesegaran susu jagung CRAVELY yang dibuat fresh setiap hari. Pesan sekarang dan rasakan kelezatan alami yang menyehatkan!
              </p>

              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <a href={waLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none", width: "100%", maxWidth: 360 }}>
                  <div className="btn-primary" style={{ width: "100%", padding: "12px 16px", fontSize: 16, display: "inline-flex", justifyContent: "center" }}>
                    💬 Chat WhatsApp
                  </div>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#1A1500", color: "#f5e6a3", padding: "60px 24px 30px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 24, color: "var(--yellow)", marginBottom: 12 }}>CRAVELY 🌽</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#a89a5a" }}>
            Susu jagung sehat & kekinian. Dibuat fresh by order dari jagung lokal pilihan tanpa pengawet.
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--yellow)", marginBottom: 12 }}>Menu</div>
          {["#about|Tentang", "#produk|Produk", "#manfaat|Manfaat", "#hubungi|Hubungi Kami"].map(s => {
              const [href, label] = s.split("|");
              return <a key={href} href={href} style={{ display: "block", color: "#a89a5a", textDecoration: "none", marginBottom: 8, fontSize: 14, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "var(--yellow)"}
                onMouseLeave={e => e.target.style.color = "#a89a5a"}
              >{label}</a>;
            })}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--yellow)", marginBottom: 12 }}>Kontak</div>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" style={{ display: "block", color: "#a89a5a", textDecoration: "none", marginBottom: 8, fontSize: 14 }}
            onMouseEnter={e => e.target.style.color = "var(--yellow)"}
            onMouseLeave={e => e.target.style.color = "#a89a5a"}
          >💬 + 62 878-4976-4103</a>
          <a href="mailto:hello@cravely.id" style={{ display: "block", color: "#a89a5a", textDecoration: "none", marginBottom: 8, fontSize: 14 }}
            onMouseEnter={e => e.target.style.color = "var(--yellow)"}
            onMouseLeave={e => e.target.style.color = "#a89a5a"}
          >✉️ hello@cravely.id</a>
          <a href="https://www.google.com/maps/search/?api=1&query=Bali+Indonesia" target="_blank" rel="noreferrer" style={{ display: "block", color: "#a89a5a", textDecoration: "none", marginBottom: 8, fontSize: 14 }}
            onMouseEnter={e => e.target.style.color = "var(--yellow)"}
            onMouseLeave={e => e.target.style.color = "#a89a5a"}
          >📍 Bali , Indonesia</a>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #3a2e00", paddingTop: 24, textAlign: "center", color: "#6b5a1a", fontSize: 13 }}>
        © {new Date().getFullYear()} CRAVELY Corn Milk. Susu Jagung. All rights reserved.
      </div>
    </footer>
  );
}

// ── CART DRAWER ───────────────────────────────────────────────
function CartDrawer({ cart, onClose, onRemove, onQtyChange }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleWhatsApp = () => {
    const lines = cart.map(i => `- ${i.name} (x${i.qty}): ${formatRupiah(i.price * i.qty)}`).join("\n");
    const msg = encodeURIComponent(
      `Halo CRAVELY! Saya ingin order:\n\n${lines}\n\nTotal: ${formatRupiah(total)}\n\nMohon konfirmasi ketersediaan & pengiriman. Terima kasih! 🌽`
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, "_blank");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", justifyContent: "flex-end"
    }}>
      {/* overlay */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />

      {/* drawer */}
      <div style={{
        position: "relative", width: "min(420px, 100vw)", height: "100%",
        background: "var(--cream)", display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.2)"
      }}>
        {/* header */}
        <div style={{
          padding: "20px 24px", background: "var(--yellow)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: "var(--dark)" }}>🛒 Keranjangmu</span>
          <button onClick={onClose} style={{
            background: "rgba(0,0,0,0.15)", border: "none", borderRadius: "50%",
            width: 36, height: 36, cursor: "pointer", fontSize: 18, fontWeight: 700,
            color: "var(--dark)", display: "flex", alignItems: "center", justifyContent: "center"
          }}>×</button>
        </div>

        {/* items */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>
              <div style={{ fontSize: 60 }}>🛒</div>
              <p style={{ marginTop: 12, fontWeight: 700 }}>Keranjang masih kosong!</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Tambahkan produk favoritmu dulu yuk~</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{
              background: "white", borderRadius: 16, padding: 16, marginBottom: 12,
              display: "flex", alignItems: "center", gap: 14,
              border: "1.5px solid var(--yellow)"
            }}>
              <div style={{ fontSize: 40, width: 54, height: 54, borderRadius: 12, background: "#fff8d6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--dark)", marginBottom: 2 }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "var(--orange)", fontWeight: 700 }}>{formatRupiah(item.price)}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <button onClick={() => onQtyChange(item.id, item.qty - 1)} style={{
                    width: 28, height: 28, borderRadius: "50%", background: "#f0f0f0",
                    border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => onQtyChange(item.id, item.qty + 1)} style={{
                    width: 28, height: 28, borderRadius: "50%", background: "var(--yellow)",
                    border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>+</button>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 800, color: "var(--orange)", fontSize: 15 }}>{formatRupiah(item.price * item.qty)}</div>
                <button onClick={() => onRemove(item.id)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#ccc", fontSize: 20, marginTop: 8, transition: "color 0.2s"
                }}
                  onMouseEnter={e => e.target.style.color = "#ff4444"}
                  onMouseLeave={e => e.target.style.color = "#ccc"}
                >🗑</button>
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        {cart.length > 0 && (
          <div style={{ padding: 20, borderTop: "2px solid var(--yellow)", background: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Total Pesanan</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: "var(--orange)" }}>{formatRupiah(total)}</span>
            </div>
            <button onClick={handleWhatsApp} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 16 }}>
              💬 Beli via WhatsApp
            </button>
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
              Tim kami akan konfirmasi pesananmu via WhatsApp
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const changeQty = useCallback((id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, [removeFromCart]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <style>{STYLES}</style>
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      <Hero onShopClick={() => document.getElementById("produk")?.scrollIntoView({ behavior: "smooth" })} />
      <About />
      <Products onAddToCart={addToCart} />
      <Benefits />
      <FAQ />
      <Footer />
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onQtyChange={changeQty}
        />
      )}
    </>
  );
}