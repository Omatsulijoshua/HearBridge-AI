'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  ShieldAlert, 
  Volume2, 
  Mic, 
  Languages, 
  Sparkles, 
  Award, 
  UserCheck, 
  Building2, 
  FolderLock,
  ArrowRight,
  MonitorPlay,
  Play,
  RotateCcw
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'SUPER_ADMIN' | 'ORG_ADMIN' | 'THERAPIST' | 'PATIENT'>('PATIENT');
  
  // Dynamic White Label Branding Sandbox State
  const [appName, setAppName] = useState('HearBridge AI');
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6'); // default violet
  const [secondaryColor, setSecondaryColor] = useState('#EC4899'); // default pink

  const handleLaunchDashboard = () => {
    // Navigate to dashboard route passing selected role and whitelabel parameters
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
      overflow: 'hidden'
    }}>
      {/* Decorative Glow Dots */}
      <div className="glow-spot" style={{ top: '10%', left: '5%' }}></div>
      <div className="glow-spot-secondary" style={{ top: '60%', right: '5%' }}></div>

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
          Simulate rebranding without changing code. Colors and logo will apply to the dashboards dynamically.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>App Name</label>
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
              <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Primary</label>
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
              <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Secondary</label>
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

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {/* Navigation */}
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

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#94A3B8', cursor: 'pointer' }}>Features</span>
            <span style={{ fontSize: '13px', color: '#94A3B8', cursor: 'pointer' }}>Pricing</span>
            <span style={{ fontSize: '13px', color: '#94A3B8', cursor: 'pointer' }}>Manuals</span>
            <button 
              onClick={() => {
                setSelectedRole('SUPER_ADMIN');
                const params = new URLSearchParams({ role: 'SUPER_ADMIN', appName, primaryColor, secondaryColor });
                router.push(`/dashboard?${params.toString()}`);
              }}
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              Investor Login
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '80px 0 60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              The World's First Duolingo for Hearing Rehabilitation
            </span>
          </div>

          <h1 style={{ 
            fontSize: '56px', 
            fontWeight: 800, 
            lineHeight: 1.15, 
            maxWidth: '900px', 
            marginBottom: '24px',
            background: `linear-gradient(to right, #FFFFFF 30%, #CBD5E1 60%, ${primaryColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em'
          }}>
            AI-Powered Hearing & Speech Rehabilitation Platform
          </h1>

          <p style={{ 
            fontSize: '18px', 
            color: '#94A3B8', 
            maxWidth: '650px', 
            marginBottom: '40px', 
            lineHeight: 1.6 
          }}>
            A production-ready SaaS suite assisting cochlear implant recipients, speech therapists, and audiology clinics with gamified sound library training and real-time speech coaching.
          </p>

          {/* Core Interactive Demo Console */}
          <div className="glass-panel" style={{ 
            maxWidth: '640px', 
            width: '100%', 
            padding: '30px', 
            position: 'relative',
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '80px'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <MonitorPlay size={20} style={{ color: primaryColor }} />
              Dashboard Demo Console
            </h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>
              Select a user role to explore the customized dashboards, rehabilitation tracking logs, and administrative controls.
            </p>

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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

        {/* Feature Grid */}
        <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '12px' }}>Enterprise-Grade Rehabilitation Modules</h2>
          <p style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '50px', fontSize: '15px' }}>
            Built specifically to solve accessibility barriers with artificial intelligence.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            
            <div className="glass-panel" style={{ padding: '24px' }}>
              <Volume2 size={24} style={{ color: primaryColor, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Sound Recognition Training</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                7 distinct categories (Home, Nature, Animals, Emergency) with adaptive levels, interactive guessing, and achievements.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <Mic size={24} style={{ color: primaryColor, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>AI Speech Coach</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                Real-time pitch, clarity, volume, and pronunciation feedback using Canvas-animated mouth position and tongue placement guides.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <ShieldAlert size={24} style={{ color: primaryColor, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Real-World Sound Detector</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                Microphone listening tool targeting emergency sirens, crying babies, barking dogs, and doorbell triggers with danger rating displays.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <Languages size={24} style={{ color: primaryColor, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Live Conversation Assistant</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                Real-time speech-to-text subtitle stream incorporating speaker identification, multi-language translation, and slow-playback mode.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <Sparkles size={24} style={{ color: primaryColor, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>AI Tutor Avatar</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                An interactive teacher illustrating exact speech posture models, walking patients through therapy plans, and offering motivation.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <Activity size={24} style={{ color: primaryColor, marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Rehabilitation Journey</h3>
              <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
                Generates a visual timeline capturing milestones (e.g. Day 1: alarm detected, Day 15: speech test passed) with exportable progress stories.
              </p>
            </div>

          </div>
        </section>

        {/* Commercial Plan Tiers */}
        <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '12px' }}>Flexible Subscription Plans</h2>
          <p style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '50px', fontSize: '15px' }}>
            Supporting global billing bindings through Stripe, Paystack, and Flutterwave.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h4 style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '8px' }}>Free</h4>
              <span style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>$0</span>
              <ul style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', listStyle: 'none' }}>
                <li>✓ Standard Sound Training</li>
                <li>✓ Limited Speech Coach (3/day)</li>
                <li>✓ Basic Progress History</li>
              </ul>
              <button className="btn-secondary" style={{ marginTop: 'auto', fontSize: '12px', width: '100%', justifyContent: 'center' }}>Get Started</button>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', border: `1px solid ${primaryColor}40` }}>
              <h4 style={{ fontSize: '16px', color: '#E2E8F0', marginBottom: '8px' }}>Basic</h4>
              <span style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>$19<span style={{ fontSize: '14px', fontWeight: 400, color: '#94A3B8' }}>/mo</span></span>
              <ul style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', listStyle: 'none' }}>
                <li>✓ Full Sound Recognition</li>
                <li>✓ Infinite AI Speech Coach</li>
                <li>✓ Real-World Sound Alerting</li>
                <li>✓ Personal Progress Timeline</li>
              </ul>
              <button className="btn-primary" style={{ marginTop: 'auto', fontSize: '12px', width: '100%', justifyContent: 'center', background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>Subscribe</button>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h4 style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '8px' }}>Premium Clinic</h4>
              <span style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>$149<span style={{ fontSize: '14px', fontWeight: 400, color: '#94A3B8' }}>/mo</span></span>
              <ul style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', listStyle: 'none' }}>
                <li>✓ Everything in Basic</li>
                <li>✓ 5 Therapist Accounts</li>
                <li>✓ 50 Patient Accounts</li>
                <li>✓ PDF/Excel Progress Reporting</li>
                <li>✓ Clinic Custom Branding</li>
              </ul>
              <button className="btn-secondary" style={{ marginTop: 'auto', fontSize: '12px', width: '100%', justifyContent: 'center' }}>Choose Premium</button>
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h4 style={{ fontSize: '16px', color: '#94A3B8', marginBottom: '8px' }}>Enterprise</h4>
              <span style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>Custom</span>
              <ul style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', listStyle: 'none' }}>
                <li>✓ Unlimited Accounts</li>
                <li>✓ White-labeling (logo, custom domains, email domains)</li>
                <li>✓ Dedicated Database backup keys</li>
                <li>✓ HIPAA & GDPR Compliant setup</li>
              </ul>
              <button className="btn-secondary" style={{ marginTop: 'auto', fontSize: '12px', width: '100%', justifyContent: 'center' }}>Contact Sales</button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
