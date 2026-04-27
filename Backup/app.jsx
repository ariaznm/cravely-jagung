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
  body { font-family: 'Baloo 2', cursive; background: var(--cream); color: var(--text); overflow-x: hidden; }
  html { scroll-behavior: smooth; }
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
  section { padding: 80px 24px; }
  .container { max-width: 1100px; margin: 0 auto; }
  .section-title {
    font-size: 38px;
    font-weight: 800;
    text-align: center;
    margin-bottom: 12px;
    color: var(--dark);
  }
  .section-title span { color: var(--orange); }
  .divider {
    width: 60px;
    height: 4px;
    background: var(--yellow);
    border-radius: 2px;
    margin: 0 auto 48px;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: var(--yellow); border-radius: 3px; }
`;

// ── DATA ──────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Original Sweet Corn", price: 15000, emoji: "🌽", color: "#FFD23F", desc: "Rasa jagung manis alami tanpa tambahan rasa. Fresh & sehat!", badge: "Best Seller" },
  { id: 2, name: "Chocolate Corn", price: 17000, emoji: "🍫", color: "#8B5E3C", desc: "Perpaduan susu jagung dengan cokelat premium. Creamy & rich!", badge: null },
  { id: 3, name: "Matcha Corn", price: 17000, emoji: "🍵", color: "#5A8F2B", desc: "Matcha Jepang bertemu jagung lokal. Unik & menyegarkan!", badge: "New" },
  { id: 4, name: "Taro Corn", price: 17000, emoji: "🟣", color: "#9B59B6", desc: "Talas ungu dengan susu jagung lembut. Aesthetic & enak!", badge: null },
  { id: 5, name: "Vanilla Corn", price: 16000, emoji: "🤍", color: "#F5DEB3", desc: "Vanilla klasik berpadu susu jagung segar. Smooth & creamy!", badge: null },
  { id: 6, name: "Caramel Corn", price: 17000, emoji: "🍮", color: "#C68642", desc: "Karamel manis dengan hint jagung yang khas. Comfort drink!", badge: null },
  { id: 7, name: "Cheese Corn", price: 18000, emoji: "🧀", color: "#F4B400", desc: "Kejutan rasa keju asin-manis di atas susu jagung. Unik banget!", badge: "Favorit" },
];

const FAQS = [
  { q: "Apakah produk mengandung pengawet?", a: "Tidak sama sekali! CRAVELY dibuat fresh by order setiap hari dari jagung segar pilihan tanpa bahan pengawet." },
  { q: "Berapa lama produk bisa bertahan?", a: "Karena fresh by order, kami rekomendasikan untuk dikonsumsi dalam 24 jam setelah pembuatan." },
  { q: "Apakah ada pilihan less sugar?", a: "Tentu! Saat order via WhatsApp, kamu bisa request less sugar atau sugar-free untuk semua varian." },
  { q: "Bagaimana cara order?", a: "Tambahkan produk ke keranjang, lalu klik 'Beli via WhatsApp'. Tim kami akan langsung membalas!" },
];

const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID");

// ── CART CONTEXT via state prop-drilling ──────────────────────
function CartIcon({ count, onClick }) {
  return (
    <button onClick={onClick} style={{
      position: "relative", background: "var(--yellow)", border: "none",
      width: 44, height: 44, borderRadius: "50%", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 20, flexShrink: 0, transition: "all 0.2s"
    }}>
      🛒
      {count > 0 && (
        <span style={{
          position: "absolute", top: -4, right: -4,
          background: "var(--orange)", color: "white",
          width: 20, height: 20, borderRadius: "50%",
          fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Baloo 2', cursive"
        }}>{count}</span>
      )}
    </button>
  );
}

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
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(255,251,239,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.3s",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <a href="#hero" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Baloo 2'", fontWeight: 800, fontSize: 24, color: "var(--orange)" }}>
              CRAVELY<span style={{ color: "var(--green)", fontSize: 13, marginLeft: 6, fontWeight: 600 }}>🌽 Corn Milk</span>
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
            <CartIcon count={cartCount} onClick={onCartClick} />
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
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: "linear-gradient(135deg, #FFFBEF 0%, #FFF3C4 50%, #FFE8A0 100%)",
      padding: "100px 24px 60px", position: "relative", overflow: "hidden"
    }}>
      {/* decorative corn blobs */}
      {["10%,15%", "85%,10%", "5%,70%", "90%,75%"].map((pos, i) => {
        const [left, top] = pos.split(",");
        return (
          <div key={i} style={{
            position: "absolute", left, top,
            fontSize: [80, 60, 50, 70][i],
            opacity: 0.12,
            transform: `rotate(${[15, -20, 10, -15][i]}deg)`,
            pointerEvents: "none"
          }}>🌽</div>
        );
      })}

      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 380px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--green)", color: "white",
            padding: "6px 16px", borderRadius: 50,
            fontSize: 13, fontWeight: 700, marginBottom: 20,
            letterSpacing: 1
          }}>🌿 FRESH BY ORDER · TANPA PENGAWET</div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: "var(--dark)" }}>
            Susu Jagung<br />
            <span style={{ color: "var(--orange)" }}>Sehat</span> &{" "}
            <span style={{ color: "var(--green)" }}>Kekinian</span>
          </h1>

          <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
            CRAVELY hadir untuk kamu yang ingin hidup sehat tanpa mengorbankan rasa.
            7 varian rasa modern dari jagung lokal pilihan. 🌽
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={onShopClick} style={{ fontSize: 17, padding: "14px 32px" }}>
              🛒 Order Sekarang
            </button>
            <a href="#about" className="btn-yellow" style={{ fontSize: 17, padding: "14px 32px", textDecoration: "none" }}>
              Pelajari Lebih →
            </a>
          </div>

          <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
            {[["7+", "Varian Rasa"], ["100%", "Bahan Alami"], ["0%", "Pengawet"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--orange)" }}>{n}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* hero visual */}
        <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, #FFD23F 0%, #FF9500 60%, #FF5A1F 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 140, boxShadow: "0 30px 80px rgba(255,90,31,0.3)",
            animation: "float 3s ease-in-out infinite"
          }}>🌽</div>
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
    { icon: "🌿", title: "Healthy", desc: "Dibuat dari jagung segar pilihan tanpa pengawet dan bahan kimia buatan." },
    { icon: "⚡", title: "Fresh", desc: "Diproduksi fresh by order untuk memastikan kesegaran maksimal." },
    { icon: "✨", title: "Modern", desc: "7 varian rasa kekinian yang cocok untuk selera generasi muda." },
    { icon: "💚", title: "Local", desc: "Mendukung petani jagung lokal Indonesia dengan bahan berkualitas." },
  ];

  return (
    <section id="about" style={{ background: "white" }}>
      <div className="container">
        <h2 className="section-title">Tentang <span>CRAVELY</span></h2>
        <div className="divider" />

        <div style={{ display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 300px" }}>
            <div style={{
              background: "linear-gradient(135deg, #FFD23F, #FF5A1F)",
              borderRadius: 24, padding: 4
            }}>
              <div style={{
                background: "white", borderRadius: 22, padding: 40,
                textAlign: "center", fontSize: 100
              }}>🌽</div>
            </div>
          </div>

          <div style={{ flex: "1 1 400px" }}>
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--muted)", marginBottom: 24 }}>
              <strong style={{ color: "var(--dark)" }}>CRAVELY</strong> hadir dari keresahan banyak anak muda yang ingin hidup sehat, tapi tetap ingin menikmati minuman yang enak. Dengan memanfaatkan jagung lokal yang kaya nutrisi, kami mengolahnya menjadi susu jagung modern dengan berbagai rasa favorit.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--muted)", marginBottom: 32 }}>
              CRAVELY percaya bahwa <strong style={{ color: "var(--orange)" }}>hidup sehat tidak harus membosankan.</strong>
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {vals.map(v => (
                <div key={v.title} style={{
                  background: "#FFFBEF", borderRadius: 16, padding: 16,
                  border: "1.5px solid var(--yellow)"
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{v.icon}</div>
                  <div style={{ fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>{v.title}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PRODUCTS ──────────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
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

      <div style={{
        height: 160, background: `linear-gradient(135deg, ${product.color}22, ${product.color}55)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 80
      }}>{product.emoji}</div>

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
          Semua rasa dibuat dari jagung segar lokal, tanpa pengawet 🌽
        </p>
        <div className="divider" />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
          gap: 24
        }}>
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
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ background: "var(--cream)" }}>
      <div className="container" style={{ maxWidth: 700 }}>
        <h2 className="section-title">FAQ</h2>
        <div className="divider" />
        {FAQS.map((f, i) => (
          <div key={i} style={{
            background: "white", borderRadius: 16, marginBottom: 12,
            border: `2px solid ${open === i ? "var(--yellow)" : "#f0f0f0"}`,
            overflow: "hidden", transition: "border-color 0.2s"
          }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: "100%", padding: "18px 24px", background: "none", border: "none",
              textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
              fontFamily: "'Baloo 2'", fontWeight: 700, fontSize: 16, color: "var(--dark)"
            }}>
              {f.q}
              <span style={{ color: "var(--orange)", fontSize: 20, transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 24px 18px", color: "var(--muted)", fontSize: 15, lineHeight: 1.7 }}>
                {f.a}
              </div>
            )}
          </div>
        ))}
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
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--yellow)", marginBottom: 12 }}>Navigasi</div>
          {["#about|Tentang", "#produk|Produk", "#manfaat|Manfaat", "#faq|FAQ"].map(s => {
            const [href, label] = s.split("|");
            return <a key={href} href={href} style={{ display: "block", color: "#a89a5a", textDecoration: "none", marginBottom: 8, fontSize: 14, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "var(--yellow)"}
              onMouseLeave={e => e.target.style.color = "#a89a5a"}
            >{label}</a>;
          })}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--yellow)", marginBottom: 12 }}>Sosial Media</div>
          {[["📸 Instagram", "https://instagram.com/cravely.official"], ["🎵 TikTok", "#"], ["💬 WhatsApp", "https://wa.me/6281234567890"]].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" style={{ display: "block", color: "#a89a5a", textDecoration: "none", marginBottom: 8, fontSize: 14 }}
              onMouseEnter={e => e.target.style.color = "var(--yellow)"}
              onMouseLeave={e => e.target.style.color = "#a89a5a"}
            >{label}</a>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid #3a2e00", paddingTop: 24, textAlign: "center", color: "#6b5a1a", fontSize: 13 }}>
        © {new Date().getFullYear()} CRAVELY Corn Milk. Semua Hak Cipta Dilindungi.
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