'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Volume2, Mic, Activity, ShieldAlert, Languages, Sparkles, Award, 
  UserCheck, Building2, FolderLock, Plus, Send, Download, Upload, 
  Settings, LogOut, Trash2, Calendar, FileText, ChevronRight, Play, CheckCircle
} from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL Params with default fallbacks
  const roleQuery = searchParams.get('role') || 'PATIENT';
  const appName = searchParams.get('appName') || 'HearBridge AI';
  const primaryColor = searchParams.get('primaryColor') || '#8B5CF6';
  const secondaryColor = searchParams.get('secondaryColor') || '#EC4899';

  const [activeRole, setActiveRole] = useState<string>(roleQuery);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Progression system states
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [progressionAlert, setProgressionAlert] = useState<string | null>(null);

  const handleSelectTab = (tabId: string) => {
    if (activeRole !== 'PATIENT') {
      setActiveTab(tabId);
      return;
    }

    if (tabId === 'sound-training' || tabId === 'timeline') {
      setActiveTab(tabId);
      setProgressionAlert(null);
      return;
    }

    if (tabId === 'speech-coach') {
      if (soundScore >= 3 || completedStages.includes('sound-training')) {
        setActiveTab(tabId);
        setProgressionAlert(null);
      } else {
        setProgressionAlert('🔒 Stage 2 Locked: Complete Stage 1 (Sound Recognition) by getting at least 3 correct answers first.');
      }
      return;
    }

    if (tabId === 'sound-detector') {
      const speechComplete = speechLog.length >= 1 || completedStages.includes('speech-coach');
      if (speechComplete) {
        setActiveTab(tabId);
        setProgressionAlert(null);
      } else {
        setProgressionAlert('🔒 Stage 3 Locked: Complete Stage 2 (AI Speech Coach) by speaking and analyzing at least 1 word first.');
      }
      return;
    }

    if (tabId === 'conversation') {
      const detectorComplete = detectionLogs.length >= 3 || completedStages.includes('sound-detector');
      if (detectorComplete) {
        setActiveTab(tabId);
        setProgressionAlert(null);
      } else {
        setProgressionAlert('🔒 Stage 4 Locked: Complete Stage 3 (Ambient Detector) by trigger-monitoring at least 1 sound first.');
      }
      return;
    }

    if (tabId === 'ai-tutor') {
      const conversationComplete = captionsList.length >= 3 || completedStages.includes('conversation');
      if (conversationComplete) {
        setActiveTab(tabId);
        setProgressionAlert(null);
      } else {
        setProgressionAlert('🔒 Stage 5 Locked: Complete Stage 4 (Captions Stream) by transcribing at least 1 conversation line first.');
      }
      return;
    }

    setActiveTab(tabId);
    setProgressionAlert(null);
  };

  // Sync state if URL changes
  useEffect(() => {
    setActiveRole(roleQuery);
    // Set appropriate initial tabs based on role
    if (roleQuery === 'PATIENT') setActiveTab('sound-training');
    else if (roleQuery === 'THERAPIST') setActiveTab('patients');
    else if (roleQuery === 'ORG_ADMIN') setActiveTab('clinic-branding');
    else if (roleQuery === 'SUPER_ADMIN') setActiveTab('buyer-transfer');
  }, [roleQuery]);

  // Set CSS Variables dynamically on body
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--primary-glow', `${primaryColor}26`);
    document.documentElement.style.setProperty('--secondary-glow', `${secondaryColor}26`);
  }, [primaryColor, secondaryColor]);

  // ----------------------------------------------------
  // PATIENT STATES & LOGIC
  // ----------------------------------------------------
  
  // Module 1: Sound Training Game
  const [soundScore, setSoundScore] = useState(0);
  const [soundAttempts, setSoundAttempts] = useState(0);
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(1);
  const [soundDifficulty, setSoundDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);
  const [soundAnswerFeedback, setSoundAnswerFeedback] = useState<string | null>(null);

  const soundsData = [
    { id: 'doorbell', title: 'Doorbell Ring', category: 'Home', audioDesc: 'Ding-dong! High-pitch electronic tone.', options: ['Doorbell', 'Car Horn', 'Dog Barking'], correct: 'Doorbell', explain: 'Typical two-tone doorbell sound. Focus on the high-frequency initial strike.' },
    { id: 'siren', title: 'Emergency Siren', category: 'Emergency', audioDesc: 'Wailing alarm fading up and down.', options: ['Rain', 'Siren', 'Baby Crying'], correct: 'Siren', explain: 'Continuous oscillating pitch. Crucial for pedestrian safety.' },
    { id: 'dog', title: 'Dog Bark', category: 'Animal', audioDesc: 'Short, sharp barking acoustic tone.', options: ['Doorbell', 'Dog Bark', 'Water Running'], correct: 'Dog Bark', explain: 'Rapid explosive sound waves. Listen for the abrupt decay.' }
  ];

  const handleGuessSound = (guess: string) => {
    const current = soundsData[currentSoundIndex];
    setSoundAttempts(prev => prev + 1);
    if (guess === current.correct) {
      const nextScore = soundScore + 1;
      setSoundScore(nextScore);
      setXp(prev => prev + 25);
      if (nextScore >= 3) {
        setCompletedStages(prev => [...prev, 'sound-training']);
        setSoundAnswerFeedback('CORRECT! +25 XP. 🎉 STAGE 1 COMPLETE! You have unlocked Stage 2: AI Speech Coach!');
      } else {
        setSoundAnswerFeedback('CORRECT! +25 XP');
      }
      if (xp + 25 >= level * 200) {
        setLevel(prev => prev + 1);
      }
    } else {
      setSoundAnswerFeedback(`INCORRECT. The sound was: ${current.correct}`);
    }
  };

  const nextSound = () => {
    setSoundAnswerFeedback(null);
    setCurrentSoundIndex((currentSoundIndex + 1) % soundsData.length);
  };

  // Module 2: AI Speech Coach Mouth Canvas & Waveform
  const mouthCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speechActive, setSpeechActive] = useState(false);
  const [targetWord, setTargetWord] = useState('HELLO');
  const [speechScores, setSpeechScores] = useState({ clarity: 0, pronunciation: 0, volume: 0, confidence: 0 });
  const [speechLog, setSpeechLog] = useState<any[]>([]);

  // Draw simulated mouth guides (Tongue & Lip shapes)
  const drawMouth = (sound: string) => {
    const canvas = mouthCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 4;
    ctx.fillStyle = '#1E293B';

    // Face boundary outline
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, Math.PI * 2);
    ctx.stroke();

    // Lip Outlines based on vowel shape
    ctx.strokeStyle = secondaryColor;
    ctx.fillStyle = '#EF444433';
    ctx.beginPath();
    if (sound === 'HELLO' || sound === 'AH') {
      // Wide open circle
      ctx.arc(100, 105, 30, 0, Math.PI * 2);
    } else if (sound === 'EE') {
      // Flat oval
      ctx.ellipse(100, 105, 45, 15, 0, 0, Math.PI * 2);
    } else {
      // Small rounded shape for 'OO'
      ctx.arc(100, 105, 12, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();

    // Tongue placement guide (Yellow curve)
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 5;
    ctx.beginPath();
    if (sound === 'HELLO' || sound === 'AH') {
      // Tongue flat
      ctx.moveTo(75, 120);
      ctx.quadraticCurveTo(100, 125, 125, 120);
    } else if (sound === 'EE') {
      // Tongue high close to teeth
      ctx.moveTo(70, 108);
      ctx.quadraticCurveTo(100, 95, 130, 108);
    } else {
      // Tongue back
      ctx.moveTo(75, 115);
      ctx.quadraticCurveTo(90, 120, 115, 110);
    }
    ctx.stroke();
  };

  useEffect(() => {
    if (activeTab === 'speech-coach') {
      drawMouth(targetWord);
    }
  }, [activeTab, targetWord]);

  const toggleSpeechRecording = () => {
    if (speechActive) {
      // Stop and evaluate
      setSpeechActive(false);
      const clarity = Math.floor(Math.random() * 25) + 75; // 75-100
      const pronunciation = Math.floor(Math.random() * 20) + 80;
      const volume = Math.floor(Math.random() * 15) + 85;
      const confidence = Math.floor(Math.random() * 20) + 80;
      
      setSpeechScores({ clarity, pronunciation, volume, confidence });
      setXp(prev => prev + 30);
      
      const newLogs = [
        { word: targetWord, clarity, pronunciation, volume, date: new Date().toLocaleTimeString() },
        ...speechLog
      ];
      setSpeechLog(newLogs);
      
      if (newLogs.length === 1) {
        setCompletedStages(prev => [...prev, 'speech-coach']);
        alert('🎉 STAGE 2 COMPLETE! You have unlocked Stage 3: Ambient Detector!');
      }
    } else {
      setSpeechActive(true);
      // Simulate speech recording audio wave pulse
      let frame = 0;
      const pulseInterval = setInterval(() => {
        if (!speechActive && frame > 4) {
          clearInterval(pulseInterval);
          return;
        }
        frame++;
      }, 200);
    }
  };

  // Module 4: Real-World Sound Detector
  const [detecting, setDetecting] = useState(false);
  const [detectionLogs, setDetectionLogs] = useState<any[]>([
    { id: 1, type: 'Doorbell', time: '11:12 AM', importance: 'Medium', safety: 'Safe', color: '#10B981' },
    { id: 2, type: 'Emergency Siren', time: '10:45 AM', importance: 'High', safety: 'Danger', color: '#EF4444' }
  ]);

  const toggleSoundDetector = () => {
    if (detecting) {
      setDetecting(false);
    } else {
      setDetecting(true);
      // Mock sound trigger after 3s
      setTimeout(() => {
        setDetectionLogs(prev => {
          const updated = [
            {
              id: Date.now(),
              type: 'Baby Crying',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              importance: 'High',
              safety: 'Watchful',
              color: '#F59E0B'
            },
            ...prev
          ];
          setCompletedStages(c => [...c, 'sound-detector']);
          alert('🎉 STAGE 3 COMPLETE! You have unlocked Stage 4: Live Captions Stream!');
          return updated;
        });
        setXp(prev => prev + 15);
      }, 3000);
    }
  };

  // Module 5: Live Conversation Assistant
  const [transcribing, setTranscribing] = useState(false);
  const [captionsList, setCaptionsList] = useState<any[]>([
    { speaker: 'Therapist Jane', text: 'Welcome back to HearBridge. Today we will review high frequency tones.', time: '11:15 AM' },
    { speaker: 'Patient (You)', text: 'Thank you. I practiced the doorbell sounds yesterday.', time: '11:16 AM' }
  ]);
  const [currentCaptionDraft, setCurrentCaptionDraft] = useState('');
  const [slowPlayback, setSlowPlayback] = useState(false);

  const toggleTranscriber = () => {
    if (transcribing) {
      setTranscribing(false);
    } else {
      setTranscribing(true);
      // Simulate real-time captions stream
      setTimeout(() => {
        setCaptionsList(prev => {
          const updated = [
            ...prev,
            { speaker: 'Therapist Jane', text: 'Excellent! Your timeline shows a 90% accuracy score.', time: '11:17 AM' }
          ];
          setCompletedStages(c => [...c, 'conversation']);
          alert('🎉 STAGE 4 COMPLETE! You have unlocked Stage 5: AI Tutor Avatar!');
          return updated;
        });
      }, 2500);
    }
  };

  // Module 6: AI Tutor Avatar
  const [tutorSpeech, setTutorSpeech] = useState("Hello! I am your AI Coach. Click below to begin today's speech warm-up.");
  const avatarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawAvatar = (mouthOpen: boolean) => {
    const canvas = avatarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dynamic color bindings
    ctx.fillStyle = primaryColor;
    
    // Head shape
    ctx.beginPath();
    ctx.arc(75, 75, 45, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(60, 65, 6, 0, Math.PI * 2);
    ctx.arc(90, 65, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(60, 65, 3, 0, Math.PI * 2);
    ctx.arc(90, 65, 3, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (mouthOpen) {
      ctx.arc(75, 95, 12, 0, Math.PI);
    } else {
      ctx.moveTo(60, 95);
      ctx.lineTo(90, 95);
    }
    ctx.stroke();

    // Glasses frame overlay for premium tech style
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(60, 65, 10, 0, Math.PI * 2);
    ctx.arc(90, 65, 10, 0, Math.PI * 2);
    ctx.moveTo(70, 65);
    ctx.lineTo(80, 65);
    ctx.stroke();
  };

  useEffect(() => {
    if (activeTab === 'ai-tutor') {
      drawAvatar(false);
    }
  }, [activeTab]);

  const playTutorLesson = () => {
    setTutorSpeech("Pronounce the word 'LIGHT' after me. Lift your tongue to the ridge behind your front teeth.");
    let open = false;
    let ticks = 0;
    const animate = setInterval(() => {
      drawAvatar(open);
      open = !open;
      ticks++;
      if (ticks > 8) {
        clearInterval(animate);
        drawAvatar(false);
      }
    }, 200);
  };

  // ----------------------------------------------------
  // THERAPIST STATES & LOGIC
  // ----------------------------------------------------
  const [patients, setPatients] = useState([
    { id: 'p1', name: 'Alexander Cole', age: 24, device: 'Cochlear Implant', progress: 78, assignedExercises: 4 },
    { id: 'p2', name: 'Sofia Rodriguez', age: 41, device: 'Hearing Aid', progress: 92, assignedExercises: 6 }
  ]);
  const [exercisesLibrary, setExercisesLibrary] = useState([
    { id: 'e1', title: 'High Frequency Consonants', category: 'Speech', difficulty: 'Beginner' },
    { id: 'e2', title: 'Kitchen Appliance Sounds', category: 'Listening', difficulty: 'Intermediate' }
  ]);
  const [newExerciseTitle, setNewExerciseTitle] = useState('');
  const [newExerciseCategory, setNewExerciseCategory] = useState('Speech');
  const [newExerciseDiff, setNewExerciseDiff] = useState('Beginner');

  const addExercise = () => {
    if (!newExerciseTitle) return;
    setExercisesLibrary(prev => [
      ...prev,
      {
        id: `e-${Date.now()}`,
        title: newExerciseTitle,
        category: newExerciseCategory,
        difficulty: newExerciseDiff
      }
    ]);
    setNewExerciseTitle('');
  };

  // ----------------------------------------------------
  // ORG ADMIN STATES & LOGIC
  // ----------------------------------------------------
  const [therapistCount, setTherapistCount] = useState(4);
  const [patientCount, setPatientCount] = useState(18);
  const [orgBillingPlan, setOrgBillingPlan] = useState('BASIC CLINIC');
  const [orgThemeName, setOrgThemeName] = useState('HearBridge West Clinic');

  // ----------------------------------------------------
  // SUPER ADMIN STATES & LOGIC
  // ----------------------------------------------------
  // Localization Multi-language support table
  const [translationsList, setTranslationsList] = useState([
    { id: 't1', key: 'welcome_message', en: 'Welcome back', fr: 'Bienvenue', es: 'Bienvenido', ar: 'مرحباً', yo: 'Kuabo' },
    { id: 't2', key: 'start_button', en: 'Start Rehabilitation', fr: 'Démarrer la réhabilitation', es: 'Iniciar rehabilitación', ar: 'ابدأ التأهيل', yo: 'Bẹ̀rẹ̀ ìtọ́jú' }
  ]);
  const [newTranslationKey, setNewTranslationKey] = useState('');
  const [newTranslationEn, setNewTranslationEn] = useState('');
  const [newTranslationEs, setNewTranslationEs] = useState('');

  const addNewTranslation = () => {
    if (!newTranslationKey || !newTranslationEn) return;
    setTranslationsList(prev => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        key: newTranslationKey,
        en: newTranslationEn,
        es: newTranslationEs,
        fr: '',
        ar: '',
        yo: ''
      }
    ]);
    setNewTranslationKey('');
    setNewTranslationEn('');
    setNewTranslationEs('');
  };

  // Buyer Transfer Form values
  const [buyerEmail, setBuyerEmail] = useState('buyer@rehabchains.com');
  const [buyerPassword, setBuyerPassword] = useState('buyer_password_2026');
  const [buyerStripeKey, setBuyerStripeKey] = useState('sk_live_51P8B...');
  const [buyerSmtpHost, setBuyerSmtpHost] = useState('smtp.mailgun.org');
  const [buyerDomain, setBuyerDomain] = useState('rehab.hearbridge-ai.com');
  const [transferLog, setTransferLog] = useState<string | null>(null);

  const executeOwnershipTransfer = () => {
    // Simulate API ownership change trigger
    setTransferLog('INITIATING TRANSFER: Exchanging administrator credentials... Rotated Stripe Billing Credentials... Domain mappings point to: ' + buyerDomain + '... Complete! Ownership Handed Over.');
  };

  const downloadSystemBackup = () => {
    // Generate simulated backup package download
    const backupObj = {
      timestamp: new Date().toISOString(),
      license: 'HB-ACTIVE-KEY-9982',
      organizations: [{ id: 'org-1', name: orgThemeName }],
      translations: translationsList,
      soundLibrary: soundsData
    };
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hearbridge_system_state_backup.json';
    link.click();
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', borderRight: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: '#0A0F1D', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        {/* App Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '6px', 
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Volume2 size={16} color="white" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Outfit' }}>{appName}</span>
        </div>

        {/* User Role Switcher inside Sidebar */}
        <div style={{ marginBottom: '24px', padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <label style={{ fontSize: '10px', color: '#94A3B8', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Working Portal</label>
          <select 
            value={activeRole} 
            onChange={(e) => {
              const newRole = e.target.value;
              setActiveRole(newRole);
              // Set appropriate initial tabs based on role
              if (newRole === 'PATIENT') setActiveTab('sound-training');
              else if (newRole === 'THERAPIST') setActiveTab('patients');
              else if (newRole === 'ORG_ADMIN') setActiveTab('clinic-branding');
              else if (newRole === 'SUPER_ADMIN') setActiveTab('buyer-transfer');
            }} 
            style={{ 
              width: '100%', 
              backgroundColor: '#0F172A', 
              color: '#F8FAFC', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '4px', 
              padding: '6px',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value="PATIENT">Patient Profile</option>
            <option value="THERAPIST">Therapist Profile</option>
            <option value="ORG_ADMIN">Clinic Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        {/* Sidebar Menu Items depending on current activeRole */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {activeRole === 'PATIENT' && (
            <>
              <div 
                onClick={() => handleSelectTab('sound-training')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'sound-training' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'sound-training' ? primaryColor : '#94A3B8' }}
              >
                <Volume2 size={16} /> Sound Recognition
              </div>
              <div 
                onClick={() => handleSelectTab('speech-coach')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'speech-coach' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'speech-coach' ? primaryColor : '#94A3B8', opacity: (soundScore >= 3 || completedStages.includes('sound-training')) ? 1 : 0.5 }}
              >
                <Mic size={16} /> AI Speech Coach {(soundScore >= 3 || completedStages.includes('sound-training')) ? '' : '🔒'}
              </div>
              <div 
                onClick={() => handleSelectTab('sound-detector')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'sound-detector' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'sound-detector' ? primaryColor : '#94A3B8', opacity: (speechLog.length >= 1 || completedStages.includes('speech-coach')) ? 1 : 0.5 }}
              >
                <ShieldAlert size={16} /> Ambient Detector {(speechLog.length >= 1 || completedStages.includes('speech-coach')) ? '' : '🔒'}
              </div>
              <div 
                onClick={() => handleSelectTab('conversation')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'conversation' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'conversation' ? primaryColor : '#94A3B8', opacity: (detectionLogs.length >= 3 || completedStages.includes('sound-detector')) ? 1 : 0.5 }}
              >
                <Languages size={16} /> Captions Stream {(detectionLogs.length >= 3 || completedStages.includes('sound-detector')) ? '' : '🔒'}
              </div>
              <div 
                onClick={() => handleSelectTab('ai-tutor')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'ai-tutor' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'ai-tutor' ? primaryColor : '#94A3B8', opacity: (captionsList.length >= 3 || completedStages.includes('conversation')) ? 1 : 0.5 }}
              >
                <Sparkles size={16} /> AI Tutor Avatar {(captionsList.length >= 3 || completedStages.includes('conversation')) ? '' : '🔒'}
              </div>
              <div 
                onClick={() => handleSelectTab('timeline')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'timeline' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'timeline' ? primaryColor : '#94A3B8' }}
              >
                <Activity size={16} /> Journey Timeline
              </div>
            </>
          )}

          {activeRole === 'THERAPIST' && (
            <>
              <div 
                onClick={() => setActiveTab('patients')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'patients' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'patients' ? primaryColor : '#94A3B8' }}
              >
                <UserCheck size={16} /> Patients List
              </div>
              <div 
                onClick={() => setActiveTab('exercises-builder')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'exercises-builder' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'exercises-builder' ? primaryColor : '#94A3B8' }}
              >
                <Plus size={16} /> Plan Creator
              </div>
            </>
          )}

          {activeRole === 'ORG_ADMIN' && (
            <>
              <div 
                onClick={() => setActiveTab('clinic-branding')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'clinic-branding' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'clinic-branding' ? primaryColor : '#94A3B8' }}
              >
                <Building2 size={16} /> Branding Themes
              </div>
              <div 
                onClick={() => setActiveTab('clinic-staff')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'clinic-staff' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'clinic-staff' ? primaryColor : '#94A3B8' }}
              >
                <UserCheck size={16} /> Staff Rosters
              </div>
            </>
          )}

          {activeRole === 'SUPER_ADMIN' && (
            <>
              <div 
                onClick={() => setActiveTab('buyer-transfer')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'buyer-transfer' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'buyer-transfer' ? primaryColor : '#94A3B8' }}
              >
                <FolderLock size={16} /> Buyer Transfer Panel
              </div>
              <div 
                onClick={() => setActiveTab('global-languages')} 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeTab === 'global-languages' ? 'rgba(255, 255, 255, 0.05)' : 'transparent', color: activeTab === 'global-languages' ? primaryColor : '#94A3B8' }}
              >
                <Languages size={16} /> Languages Grid
              </div>
            </>
          )}

        </nav>

        {/* Bottom Exit */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px' }}>
          <button 
            onClick={() => router.push('/')}
            className="btn-secondary" 
            style={{ width: '100%', fontSize: '12px', justifyContent: 'center', gap: '6px' }}
          >
            <LogOut size={14} /> Exit to Sandbox
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Portal Dashboard / {activeRole.replace('_', ' ')}
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Welcome back, Operator</h1>
          </div>

          {/* User Score Stats if Patient is active */}
          {activeRole === 'PATIENT' && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>XP Points</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: secondaryColor }}>{xp}</span>
              </div>
              <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Level</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: primaryColor }}>{level}</span>
              </div>
            </div>
          )}
        </div>

        {/* Progression Lock Alert Banner */}
        {activeRole === 'PATIENT' && progressionAlert && (
          <div className="glass-panel" style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderLeft: '4px solid #EF4444',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '13px',
            color: '#FCA5A5'
          }}>
            <Info size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
            <span>{progressionAlert}</span>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB RENDERERS
        ---------------------------------------------------- */}

        {/* PATIENT - Sound Training Game */}
        {activeRole === 'PATIENT' && activeTab === 'sound-training' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
              <h2 style={{ fontSize: '20px' }}>Sound Recognition Sandbox</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '999px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  Diff: {soundDifficulty}
                </span>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>
                  Accuracy: {soundAttempts > 0 ? Math.round((soundScore / soundAttempts) * 100) : 100}%
                </span>
              </div>
            </div>

            <div style={{ padding: '40px 20px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.2)', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', marginBottom: '24px' }}>
              <Volume2 size={48} color={primaryColor} style={{ margin: '0 auto 16px auto', display: 'block' }} />
              <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px' }}>Sound Clip category: <strong style={{ color: '#E2E8F0' }}>{soundsData[currentSoundIndex].category}</strong></p>
              <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748B' }}>[ {soundsData[currentSoundIndex].audioDesc} ]</p>
            </div>

            <p style={{ fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>Identify the audio clip output:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {soundsData[currentSoundIndex].options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleGuessSound(opt)} 
                  className="btn-secondary" 
                  style={{ justifyContent: 'center', padding: '16px' }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {soundAnswerFeedback && (
              <div className="glass-panel" style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.02)', marginBottom: '24px', borderLeft: `4px solid ${primaryColor}` }}>
                <span style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>{soundAnswerFeedback}</span>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>{soundsData[currentSoundIndex].explain}</p>
                <button onClick={nextSound} className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px', marginTop: '12px' }}>
                  Next Sound Game
                </button>
              </div>
            )}
          </div>
        )}

        {/* PATIENT - AI Speech Coach */}
        {activeRole === 'PATIENT' && activeTab === 'speech-coach' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Interactive AI Speech Coach</h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Target Vocabulary Sound</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setTargetWord('HELLO')} className="btn-secondary" style={{ border: targetWord === 'HELLO' ? `1px solid ${primaryColor}` : '' }}>"HELLO" (AH)</button>
                  <button onClick={() => setTargetWord('KEY')} className="btn-secondary" style={{ border: targetWord === 'KEY' ? `1px solid ${primaryColor}` : '' }}>"KEY" (EE)</button>
                  <button onClick={() => setTargetWord('BLUE')} className="btn-secondary" style={{ border: targetWord === 'BLUE' ? `1px solid ${primaryColor}` : '' }}>"BLUE" (OO)</button>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '30px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: '#FFFFFF', display: 'block', marginBottom: '16px', fontFamily: 'Outfit' }}>{targetWord}</span>
                
                <button 
                  onClick={toggleSpeechRecording} 
                  className={speechActive ? 'btn-primary' : 'btn-secondary'} 
                  style={{ gap: '8px', padding: '12px 30px', background: speechActive ? 'red' : '' }}
                >
                  <Mic size={18} /> {speechActive ? 'Recording... click to evaluate' : 'Tap to Speak'}
                </button>

                {speechActive && (
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '16px' }}>
                    <div style={{ width: '4px', height: '18px', backgroundColor: primaryColor, animation: 'pulseGlow 0.5s infinite alternate' }}></div>
                    <div style={{ width: '4px', height: '28px', backgroundColor: secondaryColor, animation: 'pulseGlow 0.4s infinite alternate' }}></div>
                    <div style={{ width: '4px', height: '14px', backgroundColor: primaryColor, animation: 'pulseGlow 0.6s infinite alternate' }}></div>
                    <div style={{ width: '4px', height: '22px', backgroundColor: secondaryColor, animation: 'pulseGlow 0.3s infinite alternate' }}></div>
                  </div>
                )}
              </div>

              {/* Display Scores */}
              {speechScores.clarity > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Clarity Score</span>
                    <strong style={{ fontSize: '20px', color: '#10B981' }}>{speechScores.clarity}%</strong>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Pronunciation</span>
                    <strong style={{ fontSize: '20px', color: primaryColor }}>{speechScores.pronunciation}%</strong>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Volume Match</span>
                    <strong style={{ fontSize: '20px', color: '#F59E0B' }}>{speechScores.volume}%</strong>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Fluency Match</span>
                    <strong style={{ fontSize: '20px', color: secondaryColor }}>{speechScores.confidence}%</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Mouth Guides Panel */}
            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', textAlign: 'center' }}>Mouth & Tongue Posture Guide</h3>
              <canvas 
                ref={mouthCanvasRef} 
                width={200} 
                height={200} 
                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '12px', marginBottom: '16px' }}
              />
              <div style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', lineHeight: 1.5 }}>
                <span style={{ color: secondaryColor, fontWeight: 700 }}>■ Lips Outer boundary</span> | <span style={{ color: '#F59E0B', fontWeight: 700 }}>■ Tongue Placement</span>
                <p style={{ marginTop: '8px' }}>For vowel sounds, check the width of your mouth outline and place the tongue flat in the floor of your mouth.</p>
              </div>
            </div>
          </div>
        )}

        {/* PATIENT - Ambient Detector */}
        {activeRole === 'PATIENT' && activeTab === 'sound-detector' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '750px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px' }}>Real-World Sound Detector</h2>
              <button 
                onClick={toggleSoundDetector} 
                className={detecting ? 'btn-primary' : 'btn-secondary'}
                style={{ background: detecting ? 'red' : '' }}
              >
                {detecting ? 'Active Listening...' : 'Turn On Detector'}
              </button>
            </div>
            
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>
              Keep this view active to listen to ambient environmental sounds. Critical alarms and sirens will push urgent visual cues.
            </p>

            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Detection Log History</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {detectionLogs.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: log.color }}></div>
                    <div>
                      <strong style={{ fontSize: '14px' }}>{log.type}</strong>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Safety Priority: {log.safety}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>{log.time}</span>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: log.color, fontWeight: 700 }}>{log.importance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PATIENT - Conversation Stream */}
        {activeRole === 'PATIENT' && activeTab === 'conversation' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px' }}>Live Conversation Caption Assistant</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setSlowPlayback(!slowPlayback)} 
                  className="btn-secondary" 
                  style={{ fontSize: '11px', padding: '6px 12px', border: slowPlayback ? `1px solid ${primaryColor}` : '' }}
                >
                  Slow Playback: {slowPlayback ? 'ON' : 'OFF'}
                </button>
                <button 
                  onClick={toggleTranscriber} 
                  className="btn-primary"
                  style={{ fontSize: '12px', background: transcribing ? 'red' : '' }}
                >
                  {transcribing ? 'Transcribing...' : 'Start Captions'}
                </button>
              </div>
            </div>

            <div style={{ height: '250px', overflowY: 'auto', padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {captionsList.map((cap, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: primaryColor }}>{cap.speaker}</span>
                    <span style={{ fontSize: '9px', color: '#64748B' }}>{cap.time}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#E2E8F0', lineHeight: 1.4 }}>{cap.text}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" style={{ gap: '8px', fontSize: '12px' }}>
                <Languages size={14} /> Translate Stream
              </button>
              <button className="btn-secondary" style={{ gap: '8px', fontSize: '12px' }}>
                <Download size={14} /> Save Conversation History
              </button>
            </div>
          </div>
        )}

        {/* PATIENT - AI Tutor */}
        {activeRole === 'PATIENT' && activeTab === 'ai-tutor' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px', alignSelf: 'flex-start' }}>AI Tutor Avatar</h2>
            
            <canvas 
              ref={avatarCanvasRef} 
              width={150} 
              height={150} 
              style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '50%', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' }}
            />

            <div style={{ width: '100%', padding: '20px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: 1.5 }}>"{tutorSpeech}"</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={playTutorLesson} className="btn-primary" style={{ gap: '6px' }}>
                <Play size={14} /> Play Tutor Instructions
              </button>
              <button className="btn-secondary">
                Select Another Avatar
              </button>
            </div>
          </div>
        )}

        {/* PATIENT - Journey Timeline */}
        {activeRole === 'PATIENT' && activeTab === 'timeline' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px' }}>Rehabilitation Journey Map</h2>
              <button className="btn-secondary" style={{ fontSize: '11px', padding: '6px 12px' }}>
                <Download size={12} /> Export Patient Summary PDF
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
              {/* Vertical timeline line */}
              <div style={{ position: 'absolute', left: '20px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: primaryColor, display: 'flex', alignItems: 'center', justifySelf: 'center', zIndex: 10, justifyContent: 'center' }}>
                  <CheckCircle size={18} color="white" />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>DAY 1</span>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px' }}>Doorbell Sound Identification Completed</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Successfully passed beginner home sound category test with 95% accuracy score.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: primaryColor, display: 'flex', alignItems: 'center', justifySelf: 'center', zIndex: 10, justifyContent: 'center' }}>
                  <CheckCircle size={18} color="white" />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>DAY 10</span>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px' }}>Ambient Bird Sounds Recognized</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Recognized outdoor high frequency sounds. Cumulative accuracy hit 85%.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifySelf: 'center', zIndex: 10, justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <ChevronRight size={18} color="#94A3B8" />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>DAY 20</span>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px', color: '#94A3B8' }}>Live Speech Vowels Review (Upcoming)</h4>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Assigned exercises focus on mouth guides for EE and OO vowels.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* THERAPIST - Patients list */}
        {activeRole === 'THERAPIST' && activeTab === 'patients' && (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Assigned Patients Roster</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {patients.map((pat) => (
                <div key={pat.id} style={{ padding: '20px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(139,92,246,0.1)', color: primaryColor, position: 'absolute', top: '16px', right: '16px' }}>
                    {pat.device}
                  </span>
                  <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{pat.name}</h3>
                  <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px' }}>Age: {pat.age} | Active plans: {pat.assignedExercises} exercises</p>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: '#94A3B8' }}>Rehab Accuracy Progress</span>
                      <span>{pat.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pat.progress}%`, height: '100%', background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }}>Assign Workout</button>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>View History Logs</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THERAPIST - Exercises / Plan Creator */}
        {activeRole === 'THERAPIST' && activeTab === 'exercises-builder' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '750px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Rehabilitation Exercise Plan Creator</h2>

            <div className="glass-panel" style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Create New Workout Template</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Workout Exercise Title (e.g. Household Whistles)" 
                  value={newExerciseTitle} 
                  onChange={(e) => setNewExerciseTitle(e.target.value)}
                  className="form-input"
                />
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select value={newExerciseCategory} onChange={(e) => setNewExerciseCategory(e.target.value)} className="form-input" style={{ flex: 1 }}>
                    <option value="Speech">Speech clarity</option>
                    <option value="Listening">Listening comprehension</option>
                    <option value="Tone">Tone recognition</option>
                  </select>
                  <select value={newExerciseDiff} onChange={(e) => setNewExerciseDiff(e.target.value)} className="form-input" style={{ flex: 1 }}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <button onClick={addExercise} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Save Workout Template
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Workout Library</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {exercisesLibrary.map((ex) => (
                <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>{ex.title}</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>{ex.category} | Diff: {ex.difficulty}</span>
                  </div>
                  <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '10px' }}>Assign</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORG ADMIN - Custom Clinic themes */}
        {activeRole === 'ORG_ADMIN' && activeTab === 'clinic-branding' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Clinic White-Label Customizer</h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>
              Rebrand the application workspace matching your hospital, school, or private clinic visual standards.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Clinic Name</label>
                <input 
                  type="text" 
                  value={orgThemeName} 
                  onChange={(e) => setOrgThemeName(e.target.value)} 
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>Tenant Subscription Status</label>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(139,92,246,0.05)', border: `1px solid ${primaryColor}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>{orgBillingPlan} Plan</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>Auto-renews: July 28, 2026</span>
                  </div>
                  <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '11px' }}>Update Plan</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORG ADMIN - Staff rosters */}
        {activeRole === 'ORG_ADMIN' && activeTab === 'clinic-staff' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '700px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Staff & Patient Rosters</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Active Therapists</span>
                <h3 style={{ fontSize: '28px', marginTop: '6px', color: primaryColor }}>{therapistCount}</h3>
              </div>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Enrolled Patients</span>
                <h3 style={{ fontSize: '28px', marginTop: '6px', color: secondaryColor }}>{patientCount}</h3>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setTherapistCount(prev => prev + 1)} className="btn-secondary" style={{ fontSize: '12px' }}>+ Onboard Therapist</button>
              <button onClick={() => setPatientCount(prev => prev + 1)} className="btn-secondary" style={{ fontSize: '12px' }}>+ Register Patient</button>
            </div>
          </div>
        )}

        {/* SUPER ADMIN - Global multi-language translations editor */}
        {activeRole === 'SUPER_ADMIN' && activeTab === 'global-languages' && (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Dynamic Multi-language Localization Grid</h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px' }}>
              Modify translations stored in the database. Updates render across mobile and web interfaces dynamically.
            </p>

            <div className="glass-panel" style={{ padding: '16px', backgroundColor: 'rgba(0,0,0,0.1)', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '13px', marginBottom: '10px' }}>Add Translation Key</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Key (e.g. label_yes)" value={newTranslationKey} onChange={(e) => setNewTranslationKey(e.target.value)} className="form-input" style={{ flex: 1 }} />
                <input type="text" placeholder="English Value" value={newTranslationEn} onChange={(e) => setNewTranslationEn(e.target.value)} className="form-input" style={{ flex: 1 }} />
                <input type="text" placeholder="Spanish Value" value={newTranslationEs} onChange={(e) => setNewTranslationEs(e.target.value)} className="form-input" style={{ flex: 1 }} />
                <button onClick={addNewTranslation} className="btn-primary" style={{ padding: '10px 16px' }}>Add Key</button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94A3B8' }}>
                  <th style={{ padding: '8px' }}>Translation Key</th>
                  <th style={{ padding: '8px' }}>English (en)</th>
                  <th style={{ padding: '8px' }}>Spanish (es)</th>
                  <th style={{ padding: '8px' }}>French (fr)</th>
                  <th style={{ padding: '8px' }}>Yoruba (yo)</th>
                </tr>
              </thead>
              <tbody>
                {translationsList.map((tr) => (
                  <tr key={tr.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: primaryColor }}>{tr.key}</td>
                    <td style={{ padding: '10px 8px' }}>{tr.en}</td>
                    <td style={{ padding: '10px 8px' }}>{tr.es || '-'}</td>
                    <td style={{ padding: '10px 8px' }}>{tr.fr || '-'}</td>
                    <td style={{ padding: '10px 8px' }}>{tr.yo || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUPER ADMIN - Buyer Transfer Panel (EXIT STRATEGY) */}
        {activeRole === 'SUPER_ADMIN' && activeTab === 'buyer-transfer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
            
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderLock size={22} style={{ color: primaryColor }} />
                Buyer Transfer Panel
              </h2>
              <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.5 }}>
                Enter the buyer's payment gateway details, primary domain, and administrator credentials to hand over the turnkey SaaS business instantly.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Buyer Admin Email</label>
                    <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Buyer Temp Password</label>
                    <input type="text" value={buyerPassword} onChange={(e) => setBuyerPassword(e.target.value)} className="form-input" />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Buyer Stripe Live Key</label>
                  <input type="text" value={buyerStripeKey} onChange={(e) => setBuyerStripeKey(e.target.value)} className="form-input" style={{ fontFamily: 'monospace' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Custom Domain</label>
                    <input type="text" value={buyerDomain} onChange={(e) => setBuyerDomain(e.target.value)} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>SMTP Relay Host</label>
                    <input type="text" value={buyerSmtpHost} onChange={(e) => setBuyerSmtpHost(e.target.value)} className="form-input" />
                  </div>
                </div>

                <button 
                  onClick={executeOwnershipTransfer}
                  className="btn-primary" 
                  style={{ 
                    marginTop: '8px', 
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                    boxShadow: `0 4px 14px ${primaryColor}40`
                  }}
                >
                  Execute Corporate Ownership Handover
                </button>

                {transferLog && (
                  <div className="glass-panel" style={{ padding: '16px', backgroundColor: 'rgba(16,185,129,0.05)', borderLeft: '4px solid #10B981', fontSize: '12px', fontFamily: 'monospace', color: '#10B981' }}>
                    {transferLog}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>1-Click Database Dump</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px', lineHeight: 1.4 }}>
                  Export all active organizations, therapist records, patient timelines, and translations into a single encrypted JSON backup.
                </p>
                <button onClick={downloadSystemBackup} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '8px', fontSize: '12px' }}>
                  <Download size={14} /> Download JSON Backup
                </button>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>1-Click System Restore</h3>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px', lineHeight: 1.4 }}>
                  Restore database tables, assets, and licensing variables by importing an existing JSON backup state.
                </p>
                <label className="btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  <Upload size={14} /> Upload Backup JSON
                  <input type="file" style={{ display: 'none' }} onChange={() => alert('Simulated Restore Complete! Database tables injected successfully.')} />
                </label>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default function DashboardRouter() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F8FAFC' }}>
        <p>Loading Dashboard...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
