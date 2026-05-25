import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Agreement = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    company: '',
    plan: 'Pro',
    revenuePercentage: 10,
    monthlyRetainer: 999,
  });
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const lastPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [step]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setSigned(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  };

  const handleSubmit = async () => {
    if (!signed) return;
    setLoading(true);
    try {
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL();
      await axios.post('/api/agreements', {
        client_name: form.clientName,
        client_email: form.clientEmail,
        company: form.company,
        plan: form.plan,
        revenue_percentage: form.revenuePercentage,
        monthly_retainer: form.monthlyRetainer,
        signature: signatureData,
      });
      alert('🎉 Agreement signed successfully! We will contact you shortly.');
    } catch (err) {
      alert(err.response?.data?.error || 'Error submitting agreement');
    } finally {
      setLoading(false);
    }
  };

  const plans = ['Basic', 'Pro', 'Premium'];
  const planPrices = { Basic: 499, Pro: 999, Premium: 2499 };

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow} />
      <div style={styles.header}>
        <div style={styles.logo}>⚡ YourAgency</div>
        <h1 style={styles.title}>Client Service Agreement</h1>
        <p style={styles.subtitle}>Please review and sign your agreement below</p>
        <div style={styles.steps}>
          {['Your Info', 'Choose Plan', 'Terms', 'Sign'].map((s, i) => (
            <div key={s} style={styles.stepWrapper}>
              <div style={{
                ...styles.stepDot,
                background: step > i + 1 ? '#6ee7b7' : step === i + 1 ? '#818cf8' : 'rgba(255,255,255,0.1)',
                boxShadow: step === i + 1 ? '0 0 20px rgba(129,140,248,0.5)' : 'none'
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ ...styles.stepLabel, color: step === i + 1 ? '#fff' : '#555' }}>{s}</span>
              {i < 3 && <div style={{ ...styles.stepLine, background: step > i + 1 ? '#6ee7b7' : 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        {step === 1 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>👤 Your Information</h2>
            <p style={styles.stepDesc}>Tell us about yourself and your business</p>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input style={styles.input} placeholder="John Smith"
                  value={form.clientName}
                  onChange={e => setForm({ ...form, clientName: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input style={styles.input} placeholder="john@company.com" type="email"
                  value={form.clientEmail}
                  onChange={e => setForm({ ...form, clientEmail: e.target.value })} />
              </div>
              <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Company Name</label>
                <input style={styles.input} placeholder="Your Company Ltd"
                  value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })} />
              </div>
            </div>
            <button
              style={{ ...styles.nextBtn, opacity: form.clientName && form.clientEmail ? 1 : 0.5 }}
              onClick={() => form.clientName && form.clientEmail && setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>📦 Choose Your Plan</h2>
            <p style={styles.stepDesc}>Select the plan that fits your needs</p>
            <div style={styles.planGrid}>
              {plans.map(plan => (
                <div key={plan} style={{
                  ...styles.planCard,
                  border: form.plan === plan ? '2px solid #818cf8' : '2px solid rgba(255,255,255,0.08)',
                  background: form.plan === plan ? 'rgba(129,140,248,0.1)' : 'rgba(255,255,255,0.03)',
                }} onClick={() => setForm({ ...form, plan, monthlyRetainer: planPrices[plan] })}>
                  <div style={styles.planEmoji}>{plan === 'Basic' ? '🌱' : plan === 'Pro' ? '🚀' : '👑'}</div>
                  <div style={styles.planName}>{plan}</div>
                  <div style={styles.planPrice}>${planPrices[plan]}/mo</div>
                  {form.plan === plan && <div style={styles.planCheck}>✓ Selected</div>}
                </div>
              ))}
            </div>
            <div style={styles.incomeSection}>
              <h3 style={styles.incomeTitle}>💰 Revenue Agreement</h3>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Monthly Retainer ($)</label>
                  <input style={styles.input} type="number" value={form.monthlyRetainer}
                    onChange={e => setForm({ ...form, monthlyRetainer: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Revenue Share (%)</label>
                  <input style={styles.input} type="number" min="0" max="100"
                    value={form.revenuePercentage}
                    onChange={e => setForm({ ...form, revenuePercentage: e.target.value })} />
                </div>
              </div>
              <div style={styles.revenueNote}>
                📌 Client agrees to pay <strong style={{ color: '#818cf8' }}>${form.monthlyRetainer}/month</strong> retainer + <strong style={{ color: '#6ee7b7' }}>{form.revenuePercentage}%</strong> of annual website revenue
              </div>
            </div>
            <div style={styles.btnRow}>
              <button style={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button style={styles.nextBtn} onClick={() => setStep(3)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>📋 Terms & Conditions</h2>
            <p style={styles.stepDesc}>Please read the agreement carefully</p>
            <div style={styles.termsBox}>
              <h3 style={styles.termsHeading}>SERVICE AGREEMENT</h3>
              <p style={styles.termsText}>This Agreement is between <strong>{form.clientName}</strong> {form.company ? `of ${form.company}` : ''} ("Client") and YourAgency ("Agency").</p>
              <h4 style={styles.termsSubHeading}>1. SERVICES</h4>
              <p style={styles.termsText}>Agency provides web design, development, SEO, marketing, and digital services under the <strong>{form.plan} Plan</strong>.</p>
              <h4 style={styles.termsSubHeading}>2. PAYMENT TERMS</h4>
              <p style={styles.termsText}>Client pays <strong>${form.monthlyRetainer}/month</strong> retainer on the 1st of each month, plus <strong>{form.revenuePercentage}%</strong> of annual website revenue.</p>
              <h4 style={styles.termsSubHeading}>3. REVENUE REPORTING</h4>
              <p style={styles.termsText}>Client provides monthly revenue reports by the 5th of each month. Agency may audit records with 14 days notice.</p>
              <h4 style={styles.termsSubHeading}>4. OWNERSHIP</h4>
              <p style={styles.termsText}>Upon full payment, Client owns all content and design. Agency retains portfolio rights.</p>
              <h4 style={styles.termsSubHeading}>5. TERMINATION</h4>
              <p style={styles.termsText}>Either party may terminate with 30 days written notice. Outstanding payments remain due.</p>
              <h4 style={styles.termsSubHeading}>6. LIABILITY</h4>
              <p style={styles.termsText}>Agency liability is limited to the total paid in the previous 3 months.</p>
              <h4 style={styles.termsSubHeading}>7. GOVERNING LAW</h4>
              <p style={styles.termsText}>This agreement is governed by applicable local laws. Disputes resolved through mediation first.</p>
            </div>
            <label style={styles.checkLabel}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ marginRight: '10px', width: '18px', height: '18px' }} />
              <span style={{ color: '#ccc' }}>I have read and agree to the Terms & Conditions</span>
            </label>
            <div style={styles.btnRow}>
              <button style={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
              <button style={{ ...styles.nextBtn, opacity: agreed ? 1 : 0.5 }}
                onClick={() => agreed && setStep(4)}>Continue →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>✍️ Sign the Agreement</h2>
            <p style={styles.stepDesc}>Draw your signature below to complete</p>
            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}><span style={styles.summaryLabel}>Client</span><span style={styles.summaryValue}>{form.clientName}</span></div>
              <div style={styles.summaryRow}><span style={styles.summaryLabel}>Email</span><span style={styles.summaryValue}>{form.clientEmail}</span></div>
              <div style={styles.summaryRow}><span style={styles.summaryLabel}>Plan</span><span style={styles.summaryValue}>{form.plan}</span></div>
              <div style={styles.summaryRow}><span style={styles.summaryLabel}>Monthly Retainer</span><span style={styles.summaryValue}>${form.monthlyRetainer}</span></div>
              <div style={styles.summaryRow}><span style={styles.summaryLabel}>Revenue Share</span><span style={styles.summaryValue}>{form.revenuePercentage}%</span></div>
            </div>
            <div style={styles.signatureArea}>
              <p style={styles.signatureLabel}>Draw your signature here:</p>
              <canvas ref={canvasRef} width={500} height={150} style={styles.canvas}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
              <button style={styles.clearBtn} onClick={clearSignature}>Clear Signature</button>
            </div>
            <div style={styles.btnRow}>
              <button style={styles.backBtn} onClick={() => setStep(3)}>← Back</button>
              <button style={{ ...styles.submitBtn, opacity: signed ? 1 : 0.5 }}
                onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : '✅ Sign & Submit Agreement'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input:focus { outline: none; border-color: #818cf8 !important; }
      `}</style>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif", padding: '40px 20px 80px', position: 'relative', overflow: 'hidden' },
  bgGlow: { position: 'fixed', top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse, rgba(129,140,248,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  header: { textAlign: 'center', marginBottom: '40px' },
  logo: { fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 800, color: '#818cf8', marginBottom: '24px', letterSpacing: '0.05em' },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#fff', margin: '0 0 12px' },
  subtitle: { color: '#666', fontSize: '16px', marginBottom: '32px' },
  steps: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'wrap' },
  stepWrapper: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepDot: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 700, transition: 'all 0.3s' },
  stepLabel: { fontSize: '13px', fontWeight: 500, transition: 'color 0.3s' },
  stepLine: { width: '40px', height: '2px', margin: '0 8px', transition: 'background 0.3s' },
  card: { maxWidth: '700px', margin: '0 auto', background: '#13131a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden' },
  stepContent: { padding: '40px' },
  stepTitle: { fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 8px' },
  stepDesc: { color: '#666', fontSize: '15px', marginBottom: '32px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#888', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', width: '100%' },
  planGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' },
  planCard: { padding: '20px 16px', borderRadius: '14px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' },
  planEmoji: { fontSize: '28px', marginBottom: '8px' },
  planName: { color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '4px' },
  planPrice: { color: '#888', fontSize: '13px' },
  planCheck: { color: '#818cf8', fontSize: '12px', fontWeight: 700, marginTop: '8px' },
  incomeSection: { background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: '14px', padding: '20px', marginBottom: '28px' },
  incomeTitle: { color: '#fff', fontWeight: 700, fontSize: '16px', margin: '0 0 16px' },
  revenueNote: { background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 16px', color: '#888', fontSize: '14px', lineHeight: 1.5, marginTop: '16px' },
  termsBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px', maxHeight: '320px', overflowY: 'auto', marginBottom: '24px' },
  termsHeading: { color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 800, textAlign: 'center', marginBottom: '16px' },
  termsSubHeading: { color: '#818cf8', fontSize: '14px', fontWeight: 700, marginTop: '16px' },
  termsText: { color: '#888', fontSize: '14px', lineHeight: 1.7 },
  checkLabel: { display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '28px' },
  summaryBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', marginBottom: '24px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  summaryLabel: { color: '#666', fontSize: '14px' },
  summaryValue: { color: '#fff', fontSize: '14px', fontWeight: 600 },
  signatureArea: { marginBottom: '28px' },
  signatureLabel: { color: '#888', fontSize: '14px', marginBottom: '12px' },
  canvas: { width: '100%', height: '150px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'crosshair', display: 'block' },
  clearBtn: { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '13px', marginTop: '8px', padding: 0 },
  btnRow: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  backBtn: { padding: '12px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#888', fontSize: '15px', cursor: 'pointer' },
  nextBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #818cf8, #4f46e5)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer' },
  submitBtn: { padding: '12px 28px', background: 'linear-gradient(135deg, #6ee7b7, #059669)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer' },
};

export default Agreement;