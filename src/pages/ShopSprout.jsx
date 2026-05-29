import React, { useEffect, useMemo, useState } from 'react';
import { getServices, submitContact } from '../services/api';

const Chip = ({ children }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.72)', fontSize: 13, fontWeight: 800 }}>
    {children}
  </span>
);

const SectionHeading = ({ kicker, title, subtitle }) => (
  <div style={{ maxWidth: 1100, margin: '0 auto' }}>
    {kicker ? <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(34,197,94,0.95)', marginBottom: 14 }}>{kicker}</div> : null}
    <h2 style={{ margin: 0, fontSize: 'clamp(28px, 4.3vw, 48px)', fontWeight: 950, lineHeight: 1.03, color: 'white', letterSpacing: -1.2 }}>{title}</h2>
    {subtitle ? <p style={{ marginTop: 16, marginBottom: 0, fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', fontWeight: 300 }}>{subtitle}</p> : null}
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="hover-elev" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 18, height: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 16, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 1000, color: 'white', fontSize: 16 }}>{title}</div>
        <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.55)', fontWeight: 500, lineHeight: 1.7, fontSize: 14 }}>{desc}</div>
      </div>
    </div>
  </div>
);

const ShopSprout = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const s = await getServices();
        if (!mounted) return;
        setServices(Array.isArray(s?.data) ? s.data : []);
      } catch (e) {
        if (!mounted) return;
        setServices([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const heroBadges = useMemo(() => ['Fast launch', 'Mobile-first UI', 'Affordable packages', 'SEO-ready', 'WhatsApp-ready'], []);

  const categories = useMemo(() => [
    { name: 'Groceries', emoji: '🛒' },
    { name: 'Restaurants', emoji: '🍽️' },
    { name: 'Gyms', emoji: '🏋️' },
    { name: 'Salons', emoji: '💆' },
    { name: 'Clothing', emoji: '👗' },
    { name: 'Electronics', emoji: '📱' },
  ], []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await submitContact({ name: contactForm.name, email: contactForm.email, message: contactForm.message, company: '' });
      setFormSent(true);
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", color: '#fff', background: '#07090d', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800;900&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .hover-elev { transition: transform .15s ease, border-color .15s ease, background .15s ease; }
        .hover-elev:hover { transform: translateY(-3px); border-color: rgba(34,197,94,0.35) !important; }
        input, textarea { outline: none; font-family: inherit; }
        input:focus, textarea:focus { border-color: rgba(34,197,94,0.5) !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(7,9,13,0.72)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌿</div>
            <div>
              <div style={{ fontWeight: 950, letterSpacing: -0.4 }}>Shop<span style={{ color: '#22c55e' }}>Sprout</span></div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 800 }}>Grow your business online</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {[{ href: '#features', label: 'Features' }, { href: '#categories', label: 'Categories' }, { href: '#pricing', label: 'Pricing' }, { href: '#contact', label: 'Contact' }].map((it) => (
              <a key={it.href} href={it.href} style={{ textDecoration: 'none', fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,0.65)' }}>{it.label}</a>
            ))}
            <button onClick={scrollToContact} style={{ background: 'linear-gradient(135deg, rgba(34,197,94,1) 0%, rgba(16,185,129,1) 100%)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 12, fontWeight: 950, cursor: 'pointer', boxShadow: '0 12px 30px rgba(34,197,94,0.22)' }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ paddingTop: 86, paddingBottom: 34 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 28, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                {heroBadges.map((b) => <Chip key={b}>✅ {b}</Chip>)}
              </div>
              <h1 style={{ fontSize: 'clamp(44px, 6vw, 68px)', lineHeight: 0.95, margin: 0, fontWeight: 1000, letterSpacing: -2 }}>
                Your brand's next<span style={{ color: '#22c55e' }}> online store</span>,<br />done right.
              </h1>
              <p style={{ marginTop: 16, fontSize: 18, lineHeight: 1.75, color: 'rgba(255,255,255,0.48)', maxWidth: 650 }}>
                We build beautiful, affordable websites for gyms, bakeries, clothing stores & every small business in India — so you can focus on what you do best.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                <button onClick={scrollToContact} className="hover-elev" style={{ background: '#22c55e', border: 'none', color: 'white', padding: '14px 18px', borderRadius: 14, fontWeight: 950, cursor: 'pointer', minWidth: 190, boxShadow: '0 18px 40px rgba(34,197,94,0.25)' }}>
                  🌱 Get Started Free
                </button>
                <a href="#features" className="hover-elev" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', padding: '14px 18px', borderRadius: 14, fontWeight: 900, color: 'rgba(255,255,255,0.85)', minWidth: 190 }}>
                  See how it works →
                </a>
              </div>
            </div>

            {/* HERO CARD */}
            <div>
              <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 22, padding: 18, overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -120, background: 'radial-gradient(circle at 30% 30%, rgba(34,197,94,0.25) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.18) 0%, transparent 45%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontWeight: 950, letterSpacing: -0.4 }}>Live services preview</div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)', padding: '6px 10px', borderRadius: 999 }}>{loading ? 'Loading' : 'Ready'}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 900 }}>Our Services</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 800 }}>{services.length} items</div>
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {services.slice(0, 6).map((s) => (
                        <span key={s.id ?? s.title} style={{ padding: '8px 10px', borderRadius: 999, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)', fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.88)' }}>
                          {(s.title || 'Service').toString().slice(0, 22)}
                        </span>
                      ))}
                      {loading && <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>Fetching...</span>}
                      {!loading && services.length === 0 && (
                        <>
                          {['Web Design', 'SEO Setup', 'Mobile App', 'E-Commerce'].map(s => (
                            <span key={s} style={{ padding: '8px 10px', borderRadius: 999, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)', fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.88)' }}>{s}</span>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[{ label: '200+', desc: 'Businesses Launched' }, { label: '7 days', desc: 'Avg Delivery Time' }, { label: '2x', desc: 'Customer Growth' }, { label: '★ 4.8', desc: 'Customer Rating' }].map(stat => (
                      <div key={stat.label} style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: 12, textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 1000, color: '#22c55e' }}>{stat.label}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 800, marginTop: 4 }}>{stat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" style={{ padding: '70px 18px 0', position: 'relative' }}>
        <SectionHeading kicker="Built for stores" title={<>A storefront that looks premium—<br />and converts.</>} subtitle="Beautiful designs, fast checkout flows, and performance-first UI built for Indian small businesses." />
        <div style={{ maxWidth: 1200, margin: '28px auto 0', display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 14 }}>
          <div style={{ gridColumn: 'span 4' }}><FeatureCard icon="🧭" title="Curated discovery" desc="Categories, featured lists, and smart sections so customers can find what they want instantly." /></div>
          <div style={{ gridColumn: 'span 4' }}><FeatureCard icon="⚡" title="Fast by default" desc="Lean UI, responsive layouts, and performance-friendly design—built for mobile-first traffic." /></div>
          <div style={{ gridColumn: 'span 4' }}><FeatureCard icon="💬" title="WhatsApp-ready" desc="Turn questions into sales with a frictionless inquiry flow and clear contact CTAs." /></div>
          <div style={{ gridColumn: 'span 6' }}><FeatureCard icon="📦" title="Service catalog" desc="Showcase your offerings beautifully with pricing, descriptions and inquiry buttons." /></div>
          <div style={{ gridColumn: 'span 6' }}><FeatureCard icon="📈" title="Results that matter" desc="Simple dashboards showing project status and progress for your clients." /></div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" style={{ padding: '70px 18px 0' }}>
        <SectionHeading kicker="Who we serve" title={<>Built for every kind of<span style={{ color: '#22c55e' }}> business</span></>} subtitle="Whether you're a local gym or a home bakery, ShopSprout creates the perfect online presence." />
        <div style={{ maxWidth: 1200, margin: '24px auto 0', display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 14 }}>
          {categories.map((c) => (
            <div key={c.name} style={{ gridColumn: 'span 4' }}>
              <div className="hover-elev" style={{ borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: 18, height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 950, color: 'white', fontSize: 16 }}>{c.name}</div>
                  <div style={{ fontSize: 24 }}>{c.emoji}</div>
                </div>
                <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7 }}>Curated picks + fast "contact to order" flow.</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '70px 18px 0' }}>
        <SectionHeading kicker="Simple pricing" title={<>Packages that fit your<span style={{ color: '#22c55e' }}> budget</span></>} subtitle="Transparent tiers. Pick what you need today — upgrade later." />
        <div style={{ maxWidth: 1200, margin: '26px auto 0', display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 14 }}>
          {[
            { name: 'Seedling', price: '₹4,999', period: 'one-time + ₹499/mo', desc: 'Launch a sleek storefront + inquiry flow.', bullets: ['5-page website', 'Mobile responsive', 'Contact/WhatsApp CTA', 'Basic SEO setup', 'Launch in ~7 days'], featured: false },
            { name: 'Sprout', price: '₹9,999', period: 'one-time + ₹799/mo', desc: 'Best for teams that want more conversions.', bullets: ['10-page website', 'Custom design & branding', 'Product/service gallery', 'Google Business setup', '2 revision rounds'], featured: true },
            { name: 'Bloom', price: '₹17,999', period: 'one-time + ₹1,299/mo', desc: 'For brands ready to push growth hard.', bullets: ['Unlimited pages', 'Online booking system', 'Payment gateway', 'Priority support', 'Conversion-focused UX'], featured: false },
          ].map((tier) => (
            <div key={tier.name} style={{ gridColumn: 'span 4' }}>
              <div className="hover-elev" style={{ height: '100%', borderRadius: 20, padding: 20, background: tier.featured ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)', border: tier.featured ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(255,255,255,0.08)' }}>
                {tier.featured && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.35)', fontWeight: 950, color: 'white', fontSize: 12 }}>⭐ Most Popular</div>}
                <div style={{ marginTop: 14, fontWeight: 950, fontSize: 18 }}>{tier.name}</div>
                <div style={{ marginTop: 10, fontSize: 44, fontWeight: 1000, letterSpacing: -1.5 }}>{tier.price}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 700, marginBottom: 8 }}>{tier.period}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>{tier.desc}</div>
                <ul style={{ marginTop: 14, paddingLeft: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.9, fontWeight: 700, fontSize: 14 }}>
                  {tier.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <button onClick={scrollToContact} style={{ width: '100%', marginTop: 18, background: tier.featured ? '#22c55e' : 'rgba(255,255,255,0.04)', border: tier.featured ? '1px solid rgba(34,197,94,0.6)' : '1px solid rgba(255,255,255,0.12)', color: tier.featured ? 'white' : 'rgba(255,255,255,0.85)', padding: '12px 14px', borderRadius: 14, fontWeight: 1000, cursor: 'pointer' }}>
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '70px 18px 90px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>
          <div>
            <SectionHeading kicker="Contact" title={<>Let's build your<span style={{ color: '#22c55e' }}> storefront</span></>} subtitle="Send a quick message. We'll pull the right plan and respond fast." />
            <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
              {[{ emoji: '📞', label: 'Phone', value: '+91 98765 43210' }, { emoji: '✉️', label: 'Email', value: 'hello@shopsprout.in' }, { emoji: '📍', label: 'Location', value: 'Hyderabad, India' }].map((x) => (
                <div key={x.label} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{x.emoji}</div>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase' }}>{x.label}</div>
                    <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.8)', fontWeight: 900 }}>{x.value}</div>
                  </div>
                </div>
              ))}
            </div>
            {formSent && <div style={{ marginTop: 16, color: 'rgba(16,185,129,0.95)', fontWeight: 900 }}>✅ Message sent! We'll get back to you shortly.</div>}
          </div>

          <div>
            <form onSubmit={handleContactSubmit} style={{ marginTop: 18 }}>
              <div style={{ display: 'grid', gap: 12 }}>
                <input value={contactForm.name} onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Your name" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 800 }} required />
                <input type="email" value={contactForm.email} onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 800 }} required />
                <textarea value={contactForm.message} onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="What do you want to build?" rows={5} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 800, resize: 'vertical' }} required />
                {formError && <div style={{ color: 'rgba(244,63,94,0.95)', fontWeight: 900 }}>{formError}</div>}
                <button type="submit" disabled={submitting} style={{ background: '#22c55e', border: 'none', color: 'white', padding: '14px 18px', borderRadius: 14, fontWeight: 950, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 18px 40px rgba(34,197,94,0.25)' }}>
                  {submitting ? 'Sending...' : '🌱 Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#060c06', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '48px 18px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 24 }}>🌿</div>
            <span style={{ fontWeight: 950, fontSize: 18 }}>Shop<span style={{ color: '#22c55e' }}>Sprout</span></span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>© 2026 ShopSprout. Made with 🌱 in India.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms', 'Contact'].map(l => <a key={l} href="#contact" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none' }}>{l}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShopSprout;
