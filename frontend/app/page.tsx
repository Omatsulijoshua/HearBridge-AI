'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Volume2, Mic, Activity, ShieldAlert, Languages, Sparkles, Award, 
  UserCheck, Building2, FolderLock, ArrowRight, RotateCcw, Check, X, Info
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'SUPER_ADMIN' | 'ORG_ADMIN' | 'THERAPIST' | 'PATIENT'>('PATIENT');
  
  // Dynamic White Label Branding Sandbox State
  const [appName, setAppName] = useState('HearBridge AI');
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6'); // default violet
  const [secondaryColor, setSecondaryColor] = useState('#EC4899'); // default pink

  const handleLaunchDashboard = () => {
    const params = new URLSearchParams({
      role: selectedRole,
      appName,
      primaryColor,
      secondaryColor
    });
    router.push(`/dashboard?${params.toString()}`);
  };

  const resetBranding = () => {
    setAppName('HearBridge AI');
    setPrimaryColor('#8B5CF6');
    setSecondaryColor('#EC4899');
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      backgroundImage: 'radial-gradient(ellipse at 50% -20%, rgba(139, 92, 246, 0.15) 0%, transparent 80%)',
      overflowX: 'hidden'
    }}>
      {/* Decorative Glow Dots */}
      <div className="glow-spot" style={{ top: '10%', left: '5%' }}></div>
      <div className="glow-spot-secondary" style={{ top: '50%', right: '5%' }}></div>

      {/* Floating White Label Sandbox Controller */}
      <div className="glass-panel" style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '320px',
        padding: '20px',
        zIndex: 50,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={16} color={primaryColor} />
          <h4 style={{ fontSize: '14px', fontWeight: 600 }}>White-Label Sandbox</h4>
        </div>
        <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '12px', lineHeight: '1.4' }}>
          Rebrand this portal dynamically. Updates propagate immediately into the interactive dashboards.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Platform Name</label>
            <input 
              type="text" 
              value={appName} 
              onChange={(e) => setAppName(e.target.value)} 
              className="form-input"
              style={{ padding: '8px 12px', fontSize: '12px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Primary Theme</label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)} 
                  style={{ border: 'none', padding: 0, width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }}
                />
                <span style={{ fontSize: '10px', fontFamily: 'monospace' }}>{primaryColor}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Accent Color</label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={secondaryColor} 
                  onChange={(e) => setSecondaryColor(e.target.value)} 
                  style={{ border: 'none', padding: 0, width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }}
                />
                <span style={{ fontSize: '10px', fontFamily: 'monospace' }}>{secondaryColor}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={resetBranding} 
            className="btn-secondary" 
            style={{ padding: '8px 12px', fontSize: '11px', justifyContent: 'center', width: '100%', gap: '4px' }}
          >
            <RotateCcw size={12} /> Reset to Default
          </button>
        </div>
      </div>

      {/* Main Layout Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {/* Navbar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <Volume2 size={20} color="white" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit', letterSpacing: '-0.03em' }}>{appName}</span>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="#about" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>What it does</a>
            <a href="#comparison" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>Why we are different</a>
            <a href="#pricing" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>Pricing</a>
            <button 
              onClick={() => {
                setSelectedRole('SUPER_ADMIN');
                const params = new URLSearchParams({ role: 'SUPER_ADMIN', appName, primaryColor, secondaryColor });
                router.push(`/dashboard?${params.toString()}`);
              }}
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              Buyer Handover Login
            </button>
          </div>
        </header>

        {/* Hero Area */}
        <section style={{ textAlign: 'center', padding: '100px 0 60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '6px 14px',
            borderRadius: '999px',
            marginBottom: '24px'
          }}>
            <Sparkles size={14} style={{ color: primaryColor }} />
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#E2E8F0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              The World\'s First AI Rehabilitation Platform
            </span>
          </div>

          <h1 style={{ 
            fontSize: '58px', 
            fontWeight: 800, 
            lineHeight: 1.15, 
            maxWidth: '950px', 
            marginBottom: '24px',
            background: `linear-gradient(to right, #FFFFFF 30%, #CBD5E1 60%, ${primaryColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em'
          }}>
            Re-imagining Auditory & Speech Therapy through AI
          </h1>

          <p style={{ 
            fontSize: '18px', 
            color: '#94A3B8', 
            maxWidth: '700px', 
            marginBottom: '40px', 
            lineHeight: 1.6 
          }}>
            HearBridge AI combines gamified sound identification tests, canvas-guided mouth/tongue guides, ambient siren alarms, and live conversation caption controllers into a secure multi-tenant SaaS.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '80px' }}>
            <a href="#demo" className="btn-primary" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`, textDecoration: 'none' }}>
              Try Demo Portals <ArrowRight size={16} />
            </a>
            <a href="#comparison" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Compare with Competitors
            </a>
          </div>
        </section>

        {/* Section: What it does */}
        <section id="about" style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '12px' }}>Auditory Rehabilitation in the AI Era</h2>
            <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
              HearBridge AI bridges the gap between traditional clinical therapy and modern everyday needs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            
            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Volume2 size={24} color={primaryColor} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Sound Guessing Games</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Train ears to identify household signals, emergency sirens, and nature tones through 3 adaptive levels.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Mic size={24} color={primaryColor} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>AI Speech Coach</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Evaluate vocal pitches and pronunciation alongside canvas-based tongue and lip guides for vowel positioning.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ShieldAlert size={24} color={primaryColor} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Ambient Alerting</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Continuously monitor surrounding emergency alarms, crying infants, or doorbells and push safety indicators.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Languages size={24} color={primaryColor} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Conversation Streams</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Stream real-time subtitles with speaker tags, slow playback speed filters, and log storage downloads.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Sparkles size={24} color={primaryColor} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>AI Avatar Tutor</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Interact with custom avatars illustrating exact speech postures to practice daily lessons.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Activity size={24} color={primaryColor} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Visual Journey Tracks</h3>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>
                Generate vertical milestone records to track accuracy changes and export reports for clinic reviews.
              </p>
            </div>

          </div>
        </section>

        {/* Section: Competitive Comparison */}
        <section id="comparison" style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '12px' }}>What Makes HearBridge AI Unique?</h2>
            <p style={{ color: '#94A3B8', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
              How we compare with traditional clinical rehabilitation and standard hearing aid apps.
            </p>
          </div>

          <div className="glass-panel" style={{ overflow: 'hidden', padding: '0', background: 'rgba(30, 41, 59, 0.3)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '20px 24px', fontWeight: 600 }}>Core Rehabilitation Features</th>
                  <th style={{ padding: '20px 24px', fontWeight: 600, color: primaryColor }}>HearBridge AI</th>
                  <th style={{ padding: '20px 24px', fontWeight: 600, color: '#94A3B8' }}>Traditional Speech Clinics</th>
                  <th style={{ padding: '20px 24px', fontWeight: 600, color: '#94A3B8' }}>Standard Hearing Apps</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 500 }}>Live Speech Mouth & Tongue Guides</td>
                  <td style={{ padding: '18px 24px', color: '#10B981' }}><Check size={18} /> Yes (Canvas Guided)</td>
                  <td style={{ padding: '18px 24px', color: '#64748B' }}>Only during clinic visits</td>
                  <td style={{ padding: '18px 24px', color: '#EF4444' }}><X size={18} /> No (Audio only)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 500 }}>Continuous Environmental Siren Alerts</td>
                  <td style={{ padding: '18px 24px', color: '#10B981' }}><Check size={18} /> Yes (Ambient Listening)</td>
                  <td style={{ padding: '18px 24px', color: '#EF4444' }}><X size={18} /> No</td>
                  <td style={{ padding: '18px 24px', color: '#EF4444' }}><X size={18} /> No</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 500 }}>Captions Stream with Slow Playback</td>
                  <td style={{ padding: '18px 24px', color: '#10B981' }}><Check size={18} /> Yes</td>
                  <td style={{ padding: '18px 24px', color: '#EF4444' }}><X size={18} /> No</td>
                  <td style={{ padding: '18px 24px', color: '#64748B' }}>Captions only, no playback filters</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 500 }}>Gamified Rehabilitation (XP & levels)</td>
                  <td style={{ padding: '18px 24px', color: '#10B981' }}><Check size={18} /> Yes</td>
                  <td style={{ padding: '18px 24px', color: '#EF4444' }}><X size={18} /> No</td>
                  <td style={{ padding: '18px 24px', color: '#64748B' }}>Basic tracking tables</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 500 }}>Turnkey Tenant Custom White-Labeling</td>
                  <td style={{ padding: '18px 24px', color: '#10B981' }}><Check size={18} /> Yes (Zero-code setup)</td>
                  <td style={{ padding: '18px 24px', color: '#EF4444' }}><X size={18} /> No</td>
                  <td style={{ padding: '18px 24px', color: '#EF4444' }}><X size={18} /> No</td>
                </tr>
                <tr>
                  <td style={{ padding: '18px 24px', fontWeight: 500 }}>Corporate Handover Transfer Panel</td>
                  <td style={{ padding: '18px 24px', color: '#10B981' }}><Check size={18} /> Yes (1-Click migration)</td>
                  <td style={{ padding: '18px 24px', color: '#EF4444' }}><X size={18} /> No</td>
                  <td style={{ padding: '18px 24px', color: '#EF4444' }}><X size={18} /> No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section: Interactive Demo Console */}
        <section id="demo" style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '12px' }}>Interactive Sandbox Portals</h2>
          <p style={{ color: '#94A3B8', fontSize: '15px', maxWidth: '600px', marginBottom: '40px' }}>
            Select a target profile role below to explore customized dashboards, logs history, and handover controllers.
          </p>

          <div className="glass-panel" style={{ 
            maxWidth: '640px', 
            width: '100%', 
            padding: '30px', 
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div 
                onClick={() => setSelectedRole('PATIENT')}
                style={{ 
                  padding: '16px', 
                  borderRadius: '10px', 
                  backgroundColor: selectedRole === 'PATIENT' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: `2px solid ${selectedRole === 'PATIENT' ? primaryColor : 'rgba(255, 255, 255, 0.05)'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Patient App</span>
                  <Award size={16} color={selectedRole === 'PATIENT' ? primaryColor : '#94A3B8'} />
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Practice speech, listening games, sound detection, and review journey.</span>
              </div>

              <div 
                onClick={() => setSelectedRole('THERAPIST')}
                style={{ 
                  padding: '16px', 
                  borderRadius: '10px', 
                  backgroundColor: selectedRole === 'THERAPIST' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: `2px solid ${selectedRole === 'THERAPIST' ? primaryColor : 'rgba(255, 255, 255, 0.05)'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Therapist Portal</span>
                  <UserCheck size={16} color={selectedRole === 'THERAPIST' ? primaryColor : '#94A3B8'} />
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Assign training, schedule speech reviews, audit progress charts.</span>
              </div>

              <div 
                onClick={() => setSelectedRole('ORG_ADMIN')}
                style={{ 
                  padding: '16px', 
                  borderRadius: '10px', 
                  backgroundColor: selectedRole === 'ORG_ADMIN' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: `2px solid ${selectedRole === 'ORG_ADMIN' ? primaryColor : 'rgba(255, 255, 255, 0.05)'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Clinic/Org Admin</span>
                  <Building2 size={16} color={selectedRole === 'ORG_ADMIN' ? primaryColor : '#94A3B8'} />
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Manage therapist teams, patient rosters, subscriptions, and custom branding.</span>
              </div>

              <div 
                onClick={() => setSelectedRole('SUPER_ADMIN')}
                style={{ 
                  padding: '16px', 
                  borderRadius: '10px', 
                  backgroundColor: selectedRole === 'SUPER_ADMIN' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: `2px solid ${selectedRole === 'SUPER_ADMIN' ? primaryColor : 'rgba(255, 255, 255, 0.05)'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Super Admin</span>
                  <FolderLock size={16} color={selectedRole === 'SUPER_ADMIN' ? primaryColor : '#94A3B8'} />
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>SaaS global metrics, white-label configurations, and Buyer Handover Panel.</span>
              </div>
            </div>

            <button 
              onClick={handleLaunchDashboard}
              className="btn-primary" 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '14px 28px', 
                fontSize: '15px',
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                boxShadow: `0 4px 20px ${primaryColor}40`
              }}
            >
              Launch Dashboard as {selectedRole.replace('_', ' ')} <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* Section: Pricing */}
        <section id="pricing" style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '36px' }}>Plans Built for Growth</h2>
            <p style={{ color: '#94A3B8', fontSize: '15px', marginTop: '12px' }}>
              Configure billing systems linking Stripe, Paystack, and Flutterwave.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            
            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '8px' }}>Individual Patient</h4>
              <span style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>$19<span style={{ fontSize: '14px', color: '#64748B' }}>/mo</span></span>
              <ul style={{ fontSize: '13px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', listStyle: 'none' }}>
                <li>✓ Full Sound Recognition Games</li>
                <li>✓ Infinite AI Speech Coach</li>
                <li>✓ Ambient Sound Detector Alerts</li>
                <li>✓ Personal Journey Timelines</li>
              </ul>
              <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}>Get Started</button>
            </div>

            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', border: `1px solid ${primaryColor}40` }}>
              <h4 style={{ fontSize: '16px', color: '#E2E8F0', marginBottom: '8px' }}>Clinic Portal</h4>
              <span style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>$149<span style={{ fontSize: '14px', color: '#64748B' }}>/mo</span></span>
              <ul style={{ fontSize: '13px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', listStyle: 'none' }}>
                <li>✓ Everything in Individual plan</li>
                <li>✓ 5 Therapist Accounts</li>
                <li>✓ 50 Patient Accounts</li>
                <li>✓ Workout Plan Creator & Assigner</li>
                <li>✓ Clinic Portal Branding Customizer</li>
              </ul>
              <button className="btn-primary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>Get Started</button>
            </div>

            <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '8px' }}>Enterprise Turnkey</h4>
              <span style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Custom</span>
              <ul style={{ fontSize: '13px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', listStyle: 'none' }}>
                <li>✓ Unlimited Accounts</li>
                <li>✓ White-labeling (subdomains, domains)</li>
                <li>✓ Database JSON backup relays</li>
                <li>✓ 1-Click Buyer Handover Panel</li>
                <li>✓ HIPAA & GDPR Compliant setup</li>
              </ul>
              <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}>Contact Sales</button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
