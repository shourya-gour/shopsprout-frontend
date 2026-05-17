import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitContact } from '../services/api';

const ShopSprout = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let W, H, blobs = [], animId;
    function resize() {
      W = c.width = c.parentElement.offsetWidth;
      H = c.height = c.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    const cols = ['#0d4a28', '#1a7a4a', '#0a3d1f', '#4CAF7D', '#063320', '#2D7A4F'];
    for (let i = 0; i < 6; i++) {
      blobs.push({ x: Math.random() * (W || 800), y: Math.random() * (H || 400), r: 180 + Math.random() * 220, dx: (Math.random() - .5) * .4, dy: (Math.random() - .5) * .4, col: cols[i], op: 0.55 + Math.random() * 0.3 });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050f09';
      ctx.fillRect(0, 0, W, H);
      blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.col); g.addColorStop(1, 'transparent');
        ctx.globalAlpha = b.op;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill(); ctx.globalAlpha = 1;
        b.x += b.dx; b.y += b.dy;
        if (b.x < -b.r || b.x > W + b.r) b.dx *= -1;
        if (b.y < -b.r || b.y > H + b.r) b.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const handleContact = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact({
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message,
        company: '',
      });
      setFormSent(true);
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      alert('Error sending message. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const marqueeItems = ['Gym & Fitness', 'Bakeries', 'Clothing Stores', 'Hardware Shops', 'Restaurants', 'Salons & Spas', 'Tutoring Centers', 'Medical Clinics', 'Jewellery Stores', 'Photography Studios', 'Grocery Stores', 'Car Service Centers'];

  const bizCards = [
    { emoji: '🏋️', title: 'Gyms & Fitness', desc: 'Membership plans, class schedules, trial bookings & trainer profiles.' },
    { emoji: '🧁', title: 'Bakeries & Cafes', desc: 'Menu showcase, online pre-orders, custom cake requests & delivery info.' },
    { emoji: '👗', title: 'Clothing Stores', desc: 'Product gallery, size charts, WhatsApp ordering & new arrivals section.' },
    { emoji: '🔧', title: 'Hardware Shops', desc: 'Product catalogue, bulk inquiry form, brand listings & contact map.' },
    { emoji: '💆', title: 'Salons & Spas', desc: 'Service menu, appointment booking, stylist portfolio & offer banners.' },
    { emoji: '🍽️', title: 'Restaurants', desc: 'Digital menu, table reservations, Zomato/Swiggy links & location map.' },
    { emoji: '📚', title: 'Tutoring Centers', desc: 'Course listings, fee structure, demo class booking & student testimonials.' },
    { emoji: '💍', title: 'Jewellery Stores', desc: 'Collection gallery, gold rate display, custom order form & trust badges.' },
  ];

  const plans = [
    { tier: 'Seedling', amount: '₹4,999', period: 'one-time setup + ₹499/mo', features: ['5-page website', 'Mobile responsive design', 'Contact form', 'Google Maps integration', 'WhatsApp chat button', 'Basic SEO setup'], featured: false },
    { tier: 'Sprout', amount: '₹9,999', period: 'one-time setup + ₹799/mo', features: ['10-page website', 'Custom design & branding', 'Product/service gallery', 'Online inquiry form', 'Instagram feed integration', 'Google Business setup', '2 revision rounds'], featured: true, badge: '⭐ Most Popular' },
    { tier: 'Bloom', amount: '₹17,999', period: 'one-time setup + ₹1,299/mo', features: ['Unlimited pages', 'Online booking system', 'Payment gateway (Razorpay)', 'Customer login area', 'WhatsApp automation', 'Monthly analytics report', 'Priority 24/7 support'], featured: false },
  ];

  const testimonials = [
    { stars: '★★★★★', text: '"I was scared about going online but the ShopSprout team made it so easy. My bakery now gets 15-20 custom cake orders every week through the website. Best investment I ever made!"', name: 'Priya Sharma', role: "Owner, Priya's Bake House · Hyderabad", initial: 'P', color: '#1a7a4a' },
    { stars: '★★★★★', text: '"My gym memberships doubled in 2 months after the website launched. People can now see our equipment, trainers and packages before they visit. The online trial booking feature is amazing!"', name: 'Ravi Kumar', role: 'Owner, PowerFit Gym · Bangalore', initial: 'R', color: '#b34a1f' },
    { stars: '★★★★★', text: '"We were losing customers to bigger shops with fancy websites. ShopSprout gave us a website that looks premium at a price we could afford. Our hardware store is now visible on Google!"', name: 'Mohammed Irfan', role: 'Owner, Al-Amin Hardware · Chennai', initial: 'M', color: '#4a3a8a' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#fff', background: '#0a0a0a', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
        .nav-link:hover{color:white!important;}
        .nav-cta:hover{background:#2D7A4F!important;transform:translateY(-1px);}
        .btn-p:hover{background:#d4edd9!important;transform:translateY(-2px);}
        .btn-s:hover{border-color:rgba(255,255,255,0.65)!important;}
        .step-c:hover,.biz-c:hover,.price-c:hover,.testi-c:hover{background:#131813!important;}
        .price-btn:hover{background:#4CAF7D!important;color:white!important;border-color:#4CAF7D!important;}
        .feat-btn:hover{background:#d4edd9!important;}
        .fl:hover{color:#4CAF7D!important;}
        .form-input:focus{border-color:#4CAF7D!important;outline:none;}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .h1a{animation:fadeUp .8s .1s ease both;}
        .da{animation:fadeUp .8s .25s ease both;}
        .aa{animation:fadeUp .8s .4s ease both;}
        .sa{animation:fadeUp .8s .55s ease both;}
        .mtrack{display:flex;gap:60px;animation:marquee 20s linear infinite;width:max-content;}
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.28)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: '#4CAF7D' }}><path d="M12 2C8 2 5 6 5 10c0 2.5 1.2 4.7 3 6.1V20h8v-3.9C17.8 14.7 19 12.5 19 10c0-4-3-8-7-8zm-1 15v-2.3c-.4-.1-.7-.3-1-.5l-1.4 1.4-1.4-1.4 1.4-1.4c-.3-.4-.5-.8-.6-1.3H6v-2h2c.1-.5.3-.9.6-1.3L7.2 6.8l1.4-1.4 1.4 1.4c.4-.3.8-.5 1.3-.6V4h2v2.2c.5.1.9.3 1.3.6l1.4-1.4 1.4 1.4-1.4 1.4c.3.4.5.8.6 1.3H18v2h-2c-.1.5-.3.9-.6 1.3l1.4 1.4-1.4 1.4-1.4-1.4c-.4.3-.8.5-1.3.6V17h-2z" /></svg>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: 'white' }}>Shop<span style={{ color: '#4CAF7D' }}>Sprout</span></span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {[['#how', 'How It Works'], ['#businesses', 'Businesses'], ['#pricing', 'Pricing'], ['#testimonials', 'Reviews'], ['#contact', 'Contact']].map(([href, label]) => (
              <a key={label} href={href} className="nav-link" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 500, transition: 'color .2s' }}>{label}</a>
            ))}
          </div>
          <button className="nav-cta" onClick={() => navigate('/agreement')} style={{ background: '#4CAF7D', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s' }}>Get Started Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: '#0a0a0a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '62%', zIndex: 0 }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%', background: 'linear-gradient(to bottom,rgba(10,10,10,0.1) 0%,rgba(10,10,10,0.65) 65%,#0a0a0a 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '52vh 5% 0', maxWidth: 960, margin: '0 auto', width: '100%' }}>
          <h1 className="h1a" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 76, lineHeight: 1.06, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: -3 }}>
            Your Shop <span style={{ color: '#4CAF7D' }}>Deserves</span><br />an Online Home.
          </h1>
          <p className="da" style={{ fontSize: 19, lineHeight: 1.65, color: 'rgba(255,255,255,0.42)', margin: '0 auto 40px', maxWidth: 620, fontWeight: 300 }}>
            We build beautiful, affordable websites for gyms, bakeries, clothing stores, hardware shops & every small business in India — so you can focus on what you do best.
          </p>
          <div className="aa" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <button className="btn-p" onClick={() => navigate('/agreement')} style={{ background: 'white', color: '#0a0a0a', padding: '16px 36px', borderRadius: 8, border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s' }}>🌱 Sprout My Website</button>
            <a href="#how" className="btn-s" style={{ background: 'transparent', color: 'white', padding: '16px 36px', borderRadius: 8, border: '2px solid rgba(255,255,255,0.25)', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s', textDecoration: 'none' }}>See How It Works →</a>
          </div>
        </div>
        <div className="sa" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 80, background: '#0a0a0a' }}>
          {[{ num: '200+', label: 'Small Businesses\nLaunched' }, { num: '7', label: 'Days Average\nDelivery Time' }, { num: '2x', label: 'Avg. Customer Growth\nin 30 Days' }, { num: '★ 4.6', label: 'Rating from\nBusiness Owners' }].map((s, i) => (
            <div key={i} style={{ padding: '52px 40px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 54, fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: 12, letterSpacing: -2 }}>{s.num}</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.42)', fontWeight: 400, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ padding: '36px 0', background: '#0d150d', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div className="mtrack">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ color: 'rgba(255,255,255,0.68)', fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#4CAF7D' }}>✦</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '100px 5%', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4CAF7D', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>How It Works</div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: 'white', letterSpacing: -1.5 }}>From Zero to Online<br />in 3 Simple Steps</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75, maxWidth: 560, fontWeight: 300 }}>No tech knowledge needed. We handle everything from design to launch — you just tell us about your business.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, marginTop: 64, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { num: 'Step 01', icon: '📝', title: 'Tell Us About Your Shop', desc: 'Fill a simple form about your business — name, services, location, and what makes you special. Takes less than 10 minutes.' },
              { num: 'Step 02', icon: '🎨', title: 'We Design & Build It', desc: "Our team crafts a beautiful, mobile-first website tailored for your type of business. You'll get a preview in 3-5 days." },
              { num: 'Step 03', icon: '🚀', title: 'Go Live & Grow', desc: 'Approve your site, we launch it! Your customers can now find you online 24/7. We also help with Google listing for free.' }
            ].map((step, i) => (
              <div key={i} className="step-c" style={{ padding: '48px 36px', background: '#0f150f', transition: 'background .3s', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#4CAF7D', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>{step.num}</div>
                <div style={{ fontSize: 32, marginBottom: 20 }}>{step.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'white' }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS TYPES */}
      <section id="businesses" style={{ padding: '100px 5%', background: '#0d150d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4CAF7D', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Who We Serve</div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: 'white', letterSpacing: -1.5 }}>Built for Every<br />Kind of Business</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75, maxWidth: 560, fontWeight: 300 }}>Whether you're a local gym or a home bakery, ShopSprout creates the perfect online presence for you.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, marginTop: 64, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            {bizCards.map((biz, i) => (
              <div key={i} className="biz-c" style={{ background: '#0f150f', padding: '36px 28px', textAlign: 'center', cursor: 'pointer', transition: 'background .3s', borderRight: (i + 1) % 4 !== 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', borderTop: i >= 4 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{biz.emoji}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'white' }}>{biz.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>{biz.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40, fontSize: 16, color: 'rgba(255,255,255,0.42)' }}>And many more! <span style={{ color: '#4CAF7D', fontWeight: 600 }}>Any business. Any idea. We can build it. 🌱</span></div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 5%', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4CAF7D', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Simple Pricing</div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: 'white', letterSpacing: -1.5 }}>Affordable for<br />Every Business</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75, maxWidth: 560, fontWeight: 300 }}>No hidden fees. No confusing plans. Just honest pricing built for Indian small businesses.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, marginTop: 64, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            {plans.map((plan, i) => (
              <div key={i} className={plan.featured ? '' : 'price-c'} style={{ background: plan.featured ? '#1A4D30' : '#0f150f', padding: '48px 40px', position: 'relative', transition: 'background .3s', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                {plan.badge && <div style={{ display: 'inline-block', background: '#FF6B35', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 100, marginBottom: 20, letterSpacing: .5 }}>{plan.badge}</div>}
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: plan.featured ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.42)', marginBottom: 16 }}>{plan.tier}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 56, fontWeight: 800, lineHeight: 1, marginBottom: 4, letterSpacing: -2, color: 'white' }}>{plan.amount}</div>
                <div style={{ fontSize: 14, color: plan.featured ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.42)', marginBottom: 36 }}>{plan.period}</div>
                <ul style={{ listStyle: 'none', marginBottom: 40 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ padding: '12px 0', borderBottom: `1px solid ${plan.featured ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)'}`, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, color: plan.featured ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.68)' }}>
                      <span style={{ color: '#4CAF7D', fontWeight: 700 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button className={plan.featured ? 'feat-btn' : 'price-btn'} onClick={() => navigate('/agreement')} style={{ width: '100%', padding: 14, borderRadius: 8, border: plan.featured ? '1px solid white' : '1px solid rgba(76,175,125,0.28)', background: plan.featured ? 'white' : 'transparent', color: plan.featured ? '#1A4D30' : '#4CAF7D', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s' }}>Get Started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ padding: '100px 5%', background: '#0d150d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4CAF7D', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Happy Businesses</div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: 'white', letterSpacing: -1.5 }}>Real Shops,<br />Real Results</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75, maxWidth: 560, fontWeight: 300 }}>Hundreds of small business owners across India trust ShopSprout to grow their online presence.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, marginTop: 64, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testi-c" style={{ background: '#0f150f', padding: '40px 36px', transition: 'background .3s', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ color: '#F59E0B', fontSize: 16, letterSpacing: 3, marginBottom: 24 }}>{t.stars}</div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.68)', lineHeight: 1.75, marginBottom: 28, fontWeight: 300, fontStyle: 'italic' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white', flexShrink: 0 }}>{t.initial}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '100px 5%', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#4CAF7D', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Contact Us</div>
            <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: 'white', letterSpacing: -1.5 }}>Let's Build<br />Something Great</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75, fontWeight: 300, marginBottom: 40 }}>Tell us about your business and we'll get back to you within 24 hours with a free consultation.</p>
            {[{ icon: '📞', label: 'Phone', value: '+91 98765 43210' }, { icon: '✉️', label: 'Email', value: 'hello@shopsprout.in' }, { icon: '📍', label: 'Location', value: 'Hyderabad, India' }].map(info => (
              <div key={info.label} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.28)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{info.icon}</div>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>{info.label}</div>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.68)', marginTop: 2 }}>{info.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#0f150f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 40 }}>
            {formSent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: '#4CAF7D', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 15 }}>We'll get back to you within 24 hours.</p>
                <button onClick={() => setFormSent(false)} style={{ marginTop: 24, background: '#4CAF7D', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleContact}>
                <h3 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 28 }}>Send Us a Message</h3>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Your Name</label>
                  <input className="form-input" style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 15, color: 'white', fontFamily: "'DM Sans',sans-serif", transition: 'border-color .2s' }} placeholder="John Smith" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} required />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Email Address</label>
                  <input className="form-input" style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 15, color: 'white', fontFamily: "'DM Sans',sans-serif", transition: 'border-color .2s' }} type="email" placeholder="john@company.com" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} required />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Your Message</label>
                  <textarea className="form-input" style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 15, color: 'white', fontFamily: "'DM Sans',sans-serif", transition: 'border-color .2s', height: 120, resize: 'none' }} placeholder="Tell us about your business..." value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} required />
                </div>
                <button type="submit" style={{ width: '100%', padding: 14, background: '#4CAF7D', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s' }} disabled={loading}>
                  {loading ? 'Sending...' : '🌱 Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '140px 5%', textAlign: 'center', background: '#0d150d', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4CAF7D', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Ready to Grow?</div>
          <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: 'white', letterSpacing: -1.5 }}>Let Your Business<br />Sprout Online 🌱</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75, maxWidth: 520, fontWeight: 300, margin: '20px auto 52px' }}>Join 200+ small businesses that already have a beautiful online home. Your first consultation is completely free.</p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn-p" onClick={() => navigate('/agreement')} style={{ background: 'white', color: '#0a0a0a', padding: '18px 40px', borderRadius: 8, border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s' }}>🌱 Start for Free Today</button>
            <a href="#contact" className="btn-s" style={{ background: 'transparent', color: 'white', padding: '18px 40px', borderRadius: 8, border: '2px solid rgba(255,255,255,0.25)', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'all .2s', textDecoration: 'none' }}>📞 Contact Us</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#060c06', color: 'rgba(255,255,255,0.42)', padding: '72px 5% 40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60, marginBottom: 56 }}>
            <div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: 'white' }}>Shop<span style={{ color: '#4CAF7D' }}>Sprout</span></span>
              <p style={{ fontSize: 14, lineHeight: 1.75, marginTop: 16, maxWidth: 280, color: 'rgba(255,255,255,0.42)' }}>Helping small businesses across India grow online — one beautiful website at a time. Affordable. Fast. Built for you.</p>
            </div>
            {[
              { title: 'Services', links: ['Website Design', 'Online Store', 'SEO Setup', 'Google Listing', 'Logo Design'] },
              { title: 'Company', links: ['About Us', 'Our Work', 'Pricing', 'Blog', 'Contact'] },
              { title: 'Contact', links: ['📞 +91 98765 43210', '✉️ hello@shopsprout.in', '💬 WhatsApp Us', '📍 Hyderabad, India'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 700, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 2 }}>{col.title}</h4>
                {col.links.map(link => (
                  <a key={link} href="#" className="fl" style={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 14, textDecoration: 'none', marginBottom: 12, transition: 'color .2s' }}>{link}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.25)', flexWrap: 'wrap', gap: 8 }}>
            <span>© 2025 ShopSprout. Made with 🌱 in India.</span>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(link => (
                <a key={link} href="#" className="fl" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none', transition: 'color .2s' }}>{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShopSprout;
