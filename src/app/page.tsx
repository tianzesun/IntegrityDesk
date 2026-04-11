'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const storedTheme = window.localStorage.getItem('integritydesk-theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setTheme(storedTheme);
        return;
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('integritydesk-theme', theme);
  }, [theme]);

  // Smooth scroll offset for fixed header
  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: prefersReducedMotionRef.current ? 'auto' : 'smooth' });
          }
        }, 0);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll Progress & Back To Top
  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 500);
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotionRef.current ? 'auto' : 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    
    const particles: Array<{x: number, y: number, r: number, vx: number, vy: number, a: number}> = [];
    const area = window.innerWidth * window.innerHeight;
    const count = reducedMotion ? 0 : Math.min(140, Math.floor(area / 18000));
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * (theme === 'dark' ? 0.45 : 0.2) + 0.05,
      });
    }

    let animFrame: number;

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const gold = theme === 'dark' ? '232,197,71' : '184,144,10';
      
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight;
        if (p.y > window.innerHeight) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${gold},${p.a})`;
        ctx.fill();
      });
      
      animFrame = requestAnimationFrame(loop);
    };

    if (!reducedMotion) {
      loop();
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', resizeCanvas);
    return () => {
      if (animFrame) {
        cancelAnimationFrame(animFrame);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]);

  return (
    <main className="min-h-screen bg-[var(--bg0)] text-[var(--t0)] font-body">
      <canvas ref={canvasRef} id="particles-canvas" className="fixed inset-0 z-0 pointer-events-none opacity-100" />
      
      {/* Navigation */}
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-[var(--gold)] z-[60] transition-all" style={{ width: `${scrollProgress}%` }} />
      
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-[68px] bg-[var(--nav-bg)] backdrop-blur-[20px] border-b border-[var(--bd)] transition-all">
        <a href="#" className="font-display text-[21px] font-extrabold tracking-[-0.5px] flex items-center gap-1">
          <span className="text-[var(--gold)]">I</span>ntegrityDesk
        </a>
        
        <div className="hidden md:flex gap-7 items-center">
          <a href="#product" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Product</a>
          <a href="#why-it-wins" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Why It Wins</a>
          <a href="#live-demo" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Live Demo</a>
          <a href="#architecture" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Architecture</a>
          <a href="#pricing" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Pricing</a>
          <a href="#faq" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">FAQ</a>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="w-11 h-6 rounded-full bg-[var(--bg3)] border border-[var(--bd2)] cursor-pointer relative transition-all"
            aria-label="Toggle theme"
            aria-pressed={theme === 'light'}
          >
            <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-[var(--gold)] transition-all ${theme === 'light' ? 'left-[24px]' : 'left-[3px]'}`} />
            <span className={`absolute top-1/2 -translate-y-1/2 text-[10px] left-1.5 transition-opacity ${theme === 'light' ? 'opacity-100' : 'opacity-35'}`}>☀</span>
            <span className={`absolute top-1/2 -translate-y-1/2 text-[10px] right-1.5 transition-opacity ${theme === 'dark' ? 'opacity-100' : 'opacity-35'}`}>☽</span>
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden w-10 h-10 flex flex-col gap-1.5 items-center justify-center"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`w-5 h-0.5 bg-[var(--t0)] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-[var(--t0)] transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-[var(--t0)] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
          
          <a href="#" className="hidden md:block px-4 py-1.75 rounded-md border border-[var(--bd2)] text-[13px] text-[var(--t1)] hover:text-[var(--t0)] transition-all">Log in</a>
          <a href="#" className="hidden md:block px-5 py-2 rounded-md bg-[var(--gold)] text-[#0A0800] text-[13px] font-semibold hover:-translate-y-px transition-all">Get started free</a>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 z-40 bg-[var(--bg1)] pt-[68px] transition-all duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
        <div className="flex flex-col gap-6 p-8">
          <a href="#product" onClick={() => setMobileMenuOpen(false)} className="text-xl text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Product</a>
          <a href="#why-it-wins" onClick={() => setMobileMenuOpen(false)} className="text-xl text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Why It Wins</a>
          <a href="#live-demo" onClick={() => setMobileMenuOpen(false)} className="text-xl text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Live Demo</a>
          <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="text-xl text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Architecture</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-xl text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Pricing</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-xl text-[var(--t1)] hover:text-[var(--t0)] transition-colors">FAQ</a>
          <div className="h-px bg-[var(--bd)] my-2" />
          <a href="#" className="px-5 py-3 rounded-md border border-[var(--bd2)] text-center text-[var(--t1)] hover:text-[var(--t0)] transition-all">Log in</a>
          <a href="#" className="px-5 py-3 rounded-md bg-[var(--gold)] text-center text-[#0A0800] font-semibold">Get started free</a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero min-h-screen flex flex-col items-center justify-center text-center py-[120px_5vw_80px] relative z-10">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg0)]" style={{
          backgroundImage: `linear-gradient(var(--bd) 1px, transparent 1px), linear-gradient(90deg, var(--bd) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 100%)'
        }} />
        
        <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-gradient-radial from-[rgba(232,197,71,0.07)] to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-[var(--gold-g)] border border-[rgba(232,197,71,0.3)] rounded-full px-4.5 py-1.75 mb-9 text-[13px] font-medium text-[var(--gold)] animate-fadeSlideDown">
            <span className="text-[15px]">👑</span>
            <div className="w-px h-3.5 bg-[rgba(232,197,71,0.3)]" />
            <span>Rated #1 Academic Integrity Platform — 2,000+ Institutions</span>
          </div>

          <h1 className="font-display text-[clamp(40px,6vw,76px)] font-extrabold leading-[1.1] tracking-[-3px] mb-2 animate-fadeUp">
            The World's Most Powerful
          </h1>

          <div className="overflow-hidden mb-7 animate-fadeUp">
            <span className="block font-display text-[clamp(40px,6vw,76px)] font-extrabold leading-[1.1] tracking-[-3px] text-[var(--teal)]">
              Integrity Platform.
            </span>
          </div>

          <p className="text-[clamp(16px,2vw,19px)] text-[var(--t1)] max-w-[560px] mx-auto mb-11 font-light leading-[1.65] animate-fadeUp">
            IntegrityDesk is the first integrity platform built around multiple engines, assignment-specific weighting, and preset review modes.
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-16 animate-fadeUp">
            <a href="#" className="px-9 py-3.75 rounded-xl bg-[var(--gold)] text-[#080600] text-[16px] font-semibold hover:-translate-y-0.75 transition-transform">
              Start free — no card needed →
            </a>
            <a href="#live-demo" className="px-9 py-3.75 rounded-xl border border-[var(--bd2)] text-[16px] font-normal hover:bg-[var(--bg2)] transition-colors">
              Watch 2-min demo
            </a>
          </div>

          <div className="flex flex-wrap justify-center border border-[var(--bd)] rounded-xl overflow-hidden bg-[var(--bg1)] animate-fadeUp">
            {[
              { value: '500B+', label: 'Sources indexed' },
              { value: '17', label: 'Signals fused per review' },
              { value: '< 8s', label: 'Average check time' },
              { value: '4', label: 'Preset review modes' },
              { value: '99.1%', label: 'Detection accuracy' },
              { value: '2,000+', label: 'Universities trust us' },
            ].map((stat, i) => (
              <div key={i} className="px-8 py-4.5 text-center border-r border-[var(--bd)] last:border-r-0 hover:bg-[var(--bg2)] transition-colors">
                <div className="font-display text-[26px] font-extrabold text-[var(--gold)] tracking-[-1px]">{stat.value}</div>
                <div className="text-[12px] text-[var(--t2)] font-normal mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-[60px_5vw] border-y border-[var(--bd)] bg-[var(--bg1)] relative z-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--t2)] mb-8">
            TRUSTED BY LEADING INSTITUTIONS WORLDWIDE
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-50">
            {['MIT', 'Stanford', 'Harvard', 'Oxford', 'Cambridge', 'Berkeley', 'CMU', 'ETH Zurich', 'UCL', 'University of Toronto', 'Georgia Tech', 'University of Tokyo'].map((uni, i) => (
              <div key={i} className="text-center font-display font-extrabold text-[20px] text-[var(--t1)]">{uni}</div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-8 mt-10 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[16px]">🏆</span>
              <span className="text-[13px] text-[var(--t2)]">G2 Leader 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[16px]">🔒</span>
              <span className="text-[13px] text-[var(--t2)]">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[16px]">🛡️</span>
              <span className="text-[13px] text-[var(--t2)]">FERPA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[16px]">✅</span>
              <span className="text-[13px] text-[var(--t2)]">ISO 27001</span>
            </div>
          </div>
        </div>
      </section>

      {/* Advantage Section */}
      <section id="why-it-wins" className="py-[110px_5vw] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3.5 flex items-center justify-center gap-2">
              <div className="w-5 h-px bg-[var(--gold)]"></div>
              Why it wins
            </div>
            <h2 className="font-display text-[clamp(32px,4.5vw,54px)] font-extrabold tracking-[-2px] leading-[1.02] mb-4.5">
              Built for nuance.<br/><span className="text-[var(--gold)]">Not generic scoring.</span>
            </h2>
            <p className="text-[17px] text-[var(--t1)] max-w-[760px] mx-auto leading-[1.65] font-light">
              Most tools use one fixed formula for every assignment. IntegrityDesk adapts engine weighting by assignment type.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
            <div className="border border-[var(--bd)] rounded-2xl overflow-hidden bg-[var(--bg1)]">
              <div className="grid grid-cols-[1fr_1fr] border-b border-[var(--bd)]">
                <div className="p-6 border-r border-[var(--bd)]">
                  <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--t2)] mb-2">Typical tools</div>
                  <h3 className="font-display text-[22px] font-bold tracking-[-0.5px]">One score for everything</h3>
                </div>
                <div className="p-6 bg-[rgba(232,197,71,0.04)]">
                  <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--gold)] mb-2">IntegrityDesk</div>
                  <h3 className="font-display text-[22px] font-bold tracking-[-0.5px]">Adaptive, evidence-first analysis</h3>
                </div>
              </div>

              {[
                {
                  label: 'Detection model',
                  basic: 'One score is reused across every submission type.',
                  advanced: 'Multiple engines score structure, sources, authorship, peer overlap, and AI probability together.'
                },
                {
                  label: 'Assignment fit',
                  basic: 'The same weighting is applied to essays, code, and lab work.',
                  advanced: 'Weights can be rebalanced so code-heavy work is judged differently from citation-heavy writing.'
                },
                {
                  label: 'Instructor control',
                  basic: 'Teams get a threshold slider and hope it generalizes.',
                  advanced: 'Preset modes give fast defaults, with optional custom weighting.'
                },
                {
                  label: 'Decision quality',
                  basic: 'Investigations start from a flag and manual interpretation.',
                  advanced: 'Reports explain why a case was flagged and what evidence deserves follow-up.'
                }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] border-b border-[var(--bd)] last:border-b-0">
                  <div className="p-5 md:p-6 text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--t2)] border-b md:border-b-0 md:border-r border-[var(--bd)]">
                    {row.label}
                  </div>
                  <div className="p-5 md:p-6 text-[14px] text-[var(--t1)] leading-[1.7] border-b md:border-b-0 md:border-r border-[var(--bd)]">
                    {row.basic}
                  </div>
                  <div className="p-5 md:p-6 text-[14px] text-[var(--t0)] leading-[1.7]">
                    {row.advanced}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-5">
              {[
                {
                  title: 'Multi-engine consensus',
                  desc: 'No single detector dominates the decision. Signals are fused into one balanced result.',
                  tag: 'Higher-confidence reviews'
                },
                {
                  title: 'Assignment-specific weighting',
                  desc: 'A coding task should not be scored like a literature review. IntegrityDesk reflects that.',
                  tag: 'Designed for academic reality'
                },
                {
                  title: 'Preset review modes',
                  desc: 'Departments can standardize reviews quickly without losing nuance.',
                  tag: 'Fast to adopt'
                }
              ].map((item, i) => (
                <div key={i} className="bg-[var(--bg1)] border border-[var(--bd)] rounded-xl p-7 hover:bg-[var(--bg2)] transition-colors">
                  <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--teal)] mb-3">{item.tag}</div>
                  <h3 className="font-display text-[20px] font-bold tracking-[-0.5px] mb-3">{item.title}</h3>
                  <p className="text-[15px] text-[var(--t1)] leading-[1.75]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
                {
                  value: 'Fewer blanket flags',
                  desc: 'Assignment-aware weighting reduces noise.'
                },
                {
                  value: 'Faster triage',
                  desc: 'Preset modes speed up review.'
                },
                {
                  value: 'Stronger evidence',
                  desc: 'Evidence-chain reporting supports committees, Deans, and administrators.'
                },
                {
                  value: 'Consistent policy',
                  desc: 'Departments can standardize reviews across courses.'
                }
              ].map((item, i) => (
              <div key={i} className="bg-[var(--bg1)] border border-[var(--bd)] rounded-xl p-7">
                <h3 className="font-display text-[22px] font-bold tracking-[-0.5px] mb-3">{item.value}</h3>
                <p className="text-[14px] text-[var(--t1)] leading-[1.75]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="live-demo" className="py-[110px_5vw] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3.5 flex items-center justify-center gap-2">
              <div className="w-5 h-px bg-[var(--gold)]"></div>
              Live demo
            </div>
            <h2 className="font-display text-[clamp(32px,4.5vw,54px)] font-extrabold tracking-[-2px] leading-[1.02] mb-4.5">
              See a review move from<br/><span className="text-[var(--gold)]">submission to evidence.</span>
            </h2>
            <p className="text-[17px] text-[var(--t1)] max-w-[720px] mx-auto leading-[1.65] font-light">
              See what faculty care about: what was submitted, what the engines found, and what evidence is ready.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
            <div className="bg-[var(--bg1)] border border-[var(--bd)] rounded-2xl overflow-hidden">
              <div className="border-b border-[var(--bd)] px-7 py-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--teal)] mb-2">Demo case</div>
                  <h3 className="font-display text-[24px] font-bold tracking-[-0.5px]">Assignment Review Workspace</h3>
                </div>
                <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--gold)] border border-[rgba(232,197,71,0.22)] rounded px-2 py-1">Take-home coding preset</span>
              </div>

              <div className="p-7">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Overall risk', value: '0.87', tone: 'text-[var(--gold)]' },
                    { label: 'Consensus index', value: '0.93', tone: 'text-[var(--teal)]' },
                    { label: 'Review status', value: 'High', tone: 'text-[var(--t0)]' },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl border border-[var(--bd)] bg-[var(--bg0)] p-4">
                      <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--t2)] mb-2">{item.label}</div>
                      <div className={`font-display text-[30px] font-extrabold tracking-[-1px] ${item.tone}`}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {[
                    { engine: 'AST / structure', score: '0.91', note: 'High structural equivalence after normalization' },
                    { engine: 'Cross-language / semantic', score: '0.84', note: 'Behavior and flow remain aligned' },
                    { engine: 'Peer similarity', score: '0.79', note: 'Candidate surfaced from indexed retrieval' },
                    { engine: 'AI tracing', score: '0.41', note: 'Useful context, but not dominant' },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-[var(--bd)] bg-[var(--bg0)] p-4 items-start">
                      <div>
                        <div className="font-display text-[17px] font-bold tracking-[-0.3px] mb-1">{row.engine}</div>
                        <div className="text-[13px] text-[var(--t1)] leading-[1.7]">{row.note}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--t2)] mb-1">Signal</div>
                        <div className="font-display text-[24px] font-extrabold tracking-[-0.6px] text-[var(--gold)]">{row.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              {[
                {
                  title: '1. Candidate surfaced fast',
                  desc: 'Indexed retrieval narrows the dataset before deeper analysis runs.'
                },
                {
                  title: '2. Preset selects the right emphasis',
                  desc: 'The coding preset increases structural and semantic weight while keeping AI signals in context.'
                },
                {
                  title: '3. Fusion produces one defensible score',
                  desc: 'Weighted scoring turns multiple engine outputs into one defensible result.'
                },
                {
                  title: '4. Evidence is ready to export',
                  desc: 'The reviewer gets a full evidence chain ready for export.'
                }
              ].map((item, i) => (
                <div key={i} className="bg-[var(--bg1)] border border-[var(--bd)] rounded-xl p-7 hover:bg-[var(--bg2)] transition-colors">
                  <h3 className="font-display text-[20px] font-bold tracking-[-0.5px] mb-3">{item.title}</h3>
                  <p className="text-[14px] text-[var(--t1)] leading-[1.75]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-[110px_5vw] bg-[var(--bg1)] relative z-10 border-y border-[var(--bd)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3.5 flex items-center justify-center gap-2">
              <div className="w-5 h-px bg-[var(--gold)]"></div>
              Six-layer architecture
            </div>
            <h2 className="font-display text-[clamp(32px,4.5vw,54px)] font-extrabold tracking-[-2px] leading-[1.02] mb-4.5">
              Accuracy is engineered<br/><span className="text-[var(--gold)]">layer by layer.</span>
            </h2>
            <p className="text-[17px] text-[var(--t1)] max-w-[760px] mx-auto leading-[1.65] font-light">
              Every review moves through six layers designed to improve speed, accuracy, and false-positive control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Feature Extraction Layer',
                desc: 'Code is normalized into stable signatures across structural, token, fingerprint, embedding, and winnowing views.'
              },
              {
                step: '02',
                title: 'Indexing / Retrieval Layer',
                desc: 'MinHash, LSH, and vector search keep lookup fast across large datasets.'
              },
              {
                step: '03',
                title: 'Candidate Generation Layer',
                desc: 'Fast retrieval narrows the search space, then reranking orders the strongest candidates.'
              },
              {
                step: '04',
                title: 'Fusion / Scoring Layer',
                desc: 'Weighted fusion and Bayesian arbitration combine multiple engine outputs into one score.'
              },
              {
                step: '05',
                title: 'Explainability Layer',
                desc: 'Heatmaps, diffs, engine breakdowns, and evidence-chain reports show why a case deserves review.'
              },
              {
                step: '06',
                title: 'Calibration Layer',
                desc: 'Threshold optimization and confidence calibration reduce false positives.'
              }
            ].map((layer, i) => (
              <div key={i} className="bg-[var(--bg0)] border border-[var(--bd)] rounded-xl p-8 hover:bg-[var(--bg2)] transition-colors">
                <div className="mb-5">
                  <span className="font-display text-[34px] font-extrabold tracking-[-1px] text-[var(--gold)]">{layer.step}</span>
                </div>
                <h3 className="font-display text-[21px] font-bold tracking-[-0.5px] mb-3">{layer.title}</h3>
                <p className="text-[14px] text-[var(--t1)] leading-[1.75]">{layer.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[var(--bg0)] border border-[var(--bd)] rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3">What this means</div>
                <h3 className="font-display text-[30px] font-extrabold tracking-[-1px] leading-[1.1] mb-4">
                  More sensitive than a single engine. More selective than a generic threshold.
                </h3>
                <p className="text-[15px] text-[var(--t1)] leading-[1.8]">
                  Retrieval keeps the system fast, fusion keeps decisions balanced, and calibration keeps thresholds trustworthy.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Normalized signatures reduce superficial noise',
                  'Indexed retrieval avoids slow brute-force scans',
                  'Candidate reranking sharpens review priority',
                  'Weighted scoring reflects engine strength',
                  'Evidence exports support committee review',
                  'Calibration reduces false-positive drift'
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border border-[var(--bd)] bg-[var(--bg1)] px-4 py-3 text-[13px] text-[var(--t1)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-[120px_5vw] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3.5 flex items-center justify-center gap-2">
              <div className="w-5 h-px bg-[var(--gold)]"></div>
              How it works
            </div>
            <h2 className="font-display text-[clamp(32px,4.5vw,54px)] font-extrabold tracking-[-2px] leading-[1.02] mb-4.5">
              Dead simple.<br/><span className="text-[var(--gold)]">Devastatingly effective.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload',
                desc: 'Upload files, paste text, or connect your LMS.'
              },
              {
                step: '02',
                title: 'Tune',
                desc: 'Choose a preset mode or set assignment-specific weights.'
              },
              {
                step: '03',
                title: 'Act',
                desc: 'Get an evidence report with diffs, heatmaps, and source links.'
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-[80px] font-display font-extrabold text-[var(--gold)] opacity-[0.08] absolute -top-5 left-0">{item.step}</div>
                <div className="relative z-10 pt-8">
                  <h3 className="font-display text-[20px] font-bold mb-3">{item.title}</h3>
                  <p className="text-[15px] text-[var(--t1)] leading-[1.7]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 mt-16">
            <div className="bg-[var(--bg1)] border border-[var(--bd)] rounded-2xl p-8">
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3">Engine studio</div>
              <h3 className="font-display text-[30px] font-extrabold tracking-[-1px] leading-[1.1] mb-4">
                The first review workflow designed around assignment types.
              </h3>
              <p className="text-[15px] text-[var(--t1)] leading-[1.75] mb-6">
                Faculty can start from presets, then fine-tune engine influence to match the assignment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Code similarity engine',
                  'Cross-language structure match',
                  'AI authorship tracer',
                  'Source overlap & citation scan',
                  'Peer cluster detection',
                  'Evidence confidence synthesis'
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border border-[var(--bd)] bg-[var(--bg2)] px-4 py-3 text-[13px] text-[var(--t1)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {[
                {
                  preset: 'Take-home coding',
                  weights: ['Code structure 40%', 'Cross-language 25%', 'Peer similarity 20%', 'AI tracing 15%'],
                  desc: 'Prioritizes algorithmic equivalence, semantic reuse, and cohort-level coordination.'
                },
                {
                  preset: 'Research essay',
                  weights: ['Source overlap 35%', 'Citation integrity 25%', 'AI tracing 25%', 'Peer similarity 15%'],
                  desc: 'Tuned for source-heavy work where improper borrowing and synthetic writing are the main risks.'
                },
                {
                  preset: 'Lab report',
                  weights: ['Source overlap 30%', 'AI tracing 30%', 'Pattern similarity 25%', 'Peer similarity 15%'],
                  desc: 'Balances expected template reuse against suspicious phrasing, fabricated explanation, and repeated structure.'
                },
                {
                  preset: 'Reflective writing',
                  weights: ['AI tracing 45%', 'Language variance 25%', 'Source overlap 15%', 'Peer similarity 15%'],
                  desc: 'Reduces false alarms on shared prompts while focusing on authorship authenticity and voice consistency.'
                }
              ].map((preset, i) => (
                <div key={i} className="bg-[var(--bg1)] border border-[var(--bd)] rounded-xl p-6 hover:bg-[var(--bg2)] transition-colors">
                  <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                    <h4 className="font-display text-[20px] font-bold tracking-[-0.5px]">{preset.preset}</h4>
                    <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--gold)] border border-[rgba(232,197,71,0.22)] rounded px-2 py-1">Preset mode</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {preset.weights.map((weight, index) => (
                      <span key={index} className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[var(--t1)] border border-[var(--bd)] rounded-full px-3 py-1.5 bg-[var(--bg2)]">
                        {weight}
                      </span>
                    ))}
                  </div>
                  <p className="text-[14px] text-[var(--t1)] leading-[1.7]">{preset.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="product" className="py-[100px_5vw] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3.5 flex items-center justify-center gap-2">
              <div className="w-5 h-px bg-[var(--gold)]"></div>
              Full platform
            </div>
            <h2 className="font-display text-[clamp(32px,4.5vw,54px)] font-extrabold tracking-[-2px] leading-[1.02] mb-4.5">
              Every capability you'll<br/><span className="text-[var(--gold)]">ever need.</span>
            </h2>
            <p className="text-[17px] text-[var(--t1)] max-w-[500px] mx-auto leading-[1.65] font-light">
              IntegrityDesk is the complete integrity operating system for modern academic institutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--bd)] border border-[var(--bd)] rounded-xl overflow-hidden">
            {[
              {
                icon: '🧬',
                title: 'Nexus AST Engine',
                desc: 'Our proprietary Abstract Syntax Tree engine fingerprints code at the semantic level. Renaming, shuffling, dead code injection, cross-language ports — all caught. 99.1% accuracy.',
                tag: 'Flagship · In-house'
              },
              {
                icon: '🌐',
                title: 'Cross-Language Detection',
                desc: 'A student converts their Python solution to Java hoping to evade detection. IntegrityDesk catches it. Algorithmic equivalence across any language pair — a world first.',
                tag: 'World-first capability'
              },
              {
                icon: '🤖',
                title: 'Spectra AI Tracer',
                desc: 'Model-attributed AI detection for every major LLM. Sentence-level heatmaps. Humanizer tool signature recognition. The most advanced AI detector in academic use.',
                tag: 'GPT · Gemini · Claude · Llama'
              },
              {
                icon: '🎚️',
                title: 'Adaptive Engine Weighting',
                desc: 'Set how much each engine matters for code projects, lab reports, research essays, reflective writing, or custom assessment formats. The scoring model bends to the assignment, not the other way around.',
                tag: 'Assignment-aware'
              },
              {
                icon: '🧠',
                title: 'Preset Review Modes',
                desc: 'Standardize reviews across a department with presets like Balanced, Code-Heavy, AI-Sensitive, and Source Audit. Faculty get consistency without losing expert control.',
                tag: 'Fast + flexible'
              },
              {
                icon: '📡',
                title: 'Deep Web Crawl',
                desc: '500B+ sources: GitHub, GitLab, Stack Overflow, arXiv, PubMed, Wikipedia, Chegg, Course Hero, and the live web — crawled daily. Nothing hides for long.',
                tag: '500B+ sources'
              },
              {
                icon: '🔗',
                title: 'Peer-to-Peer Clustering',
                desc: 'Submit an entire cohort. Sentinel cross-compares every pair simultaneously. Interactive cluster graphs show networks of collusion — who copied from whom, visualized.',
                tag: 'Cohort-wide'
              },
              {
                icon: '🔌',
                title: 'LMS Integration',
                desc: 'Native plugins for Canvas, Blackboard, Moodle, Brightspace, and Google Classroom. Submissions sync automatically via LTI 1.3. Zero extra steps for instructors.',
                tag: '5 platforms · LTI 1.3'
              },
              {
                icon: '⚖️',
                title: 'Hearing-Grade Reports',
                desc: 'Digitally signed, timestamped PDF reports with source URLs, similarity percentages, side-by-side diffs, and full evidence-chain context. Built for disciplinary hearings, Deans, and academic integrity committees.',
                tag: 'Evidence-ready'
              },
              {
                icon: '🪜',
                title: 'Explainable Risk Breakdown',
                desc: 'See which engines contributed to a flag and how strongly. Reviewers can tell the difference between source borrowing, AI authorship risk, and coordinated peer reuse before escalating.',
                tag: 'Transparent decisions'
              },
              {
                icon: '🛡',
                title: 'Obfuscation-Proof',
                desc: 'Whitespace, comments, variable renaming, loop restructuring, dead code — IntegrityDesk measures logic, not syntax. Surface changes are completely irrelevant to our engine.',
                tag: 'Logic-aware'
              },
              {
                icon: '🔑',
                title: 'REST API + 4 SDKs',
                desc: 'Full-featured API with Python, Node.js, Java, and Go client libraries. Integrate integrity checks directly into CI/CD pipelines, grading platforms, or custom tools.',
                tag: 'Developer-first'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-[var(--bg1)] p-9 hover:bg-[var(--bg2)] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-11.5 h-11.5 rounded-[10px] bg-[var(--gold-g)] border border-[rgba(232,197,71,0.2)] flex items-center justify-center text-[20px] mb-5">
                  {feature.icon}
                </div>
                <h3 className="font-display text-[17px] font-bold tracking-[-0.3px] mb-2.5">{feature.title}</h3>
                <p className="text-[14px] text-[var(--t2)] leading-[1.65] mb-4">{feature.desc}</p>
                <span className="inline-block text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--teal)] border border-[rgba(62,237,197,0.25)] rounded px-2 py-1">{feature.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-[100px_5vw] bg-[var(--bg1)] relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3.5 flex items-center justify-center gap-2">
              <div className="w-5 h-px bg-[var(--gold)]"></div>
              Pricing
            </div>
            <h2 className="font-display text-[clamp(32px,4.5vw,54px)] font-extrabold tracking-[-2px] leading-[1.02] mb-4.5">
              Simple. Transparent.<br/><span className="text-[var(--gold)]">No surprises.</span>
            </h2>
            <p className="text-[17px] text-[var(--t1)] max-w-[500px] mx-auto leading-[1.65] font-light">
              No per-check credit system. No hidden enterprise tier for basic features. Unlimited checks on every paid plan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[var(--bg1)] border border-[var(--bd)] rounded-xl p-9 flex flex-col hover:-translate-y-1 transition-transform">
              <div className="font-display text-[20px] font-extrabold mb-1">Starter</div>
              <div className="text-[13px] text-[var(--t2)] mb-6">Individual instructors & small courses</div>
              <div className="font-display text-[52px] font-extrabold tracking-[-3px] text-[var(--gold)] mb-1">$29</div>
              <div className="text-[13px] text-[var(--t2)] mb-7">per month · billed annually</div>
              
              <ul className="flex-1 flex flex-col gap-3 mb-7">
                {[
                  'Up to 3 courses simultaneously',
                  '500 submissions per month',
                  'Code plagiarism — 80+ languages',
                  'Essay & document detection',
                  'AI detection (generic flag)',
                  'Balanced review preset',
                  'Web & peer comparison',
                  'PDF report export',
                  'Email support'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[var(--t1)]">
                    <span className="text-[var(--teal)] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              
              <a href="#" className="block text-center py-3.25 rounded-md border border-[var(--bd2)] text-[15px] font-medium hover:bg-[var(--bg3)] transition-colors">
                Start free trial →
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-[var(--bg2)] to-[rgba(232,197,71,0.04)] border border-[rgba(232,197,71,0.35)] rounded-xl p-9 flex flex-col hover:-translate-y-1 transition-transform relative">
              <div className="absolute -top-3.25 left-1/2 -translate-x-1/2 bg-[var(--gold)] text-[#080600] text-[10px] font-extrabold tracking-[0.08em] uppercase px-4 py-1.25 rounded-full">Most popular</div>
              
              <div className="font-display text-[20px] font-extrabold mb-1">Department</div>
              <div className="text-[13px] text-[var(--t2)] mb-6">Academic departments & program coordinators</div>
              <div className="font-display text-[52px] font-extrabold tracking-[-3px] text-[var(--gold)] mb-1">$149</div>
              <div className="text-[13px] text-[var(--t2)] mb-7">per month · billed annually</div>
              
              <ul className="flex-1 flex flex-col gap-3 mb-7">
                {[
                  'Unlimited courses & instructors',
                  'Unlimited submissions',
                  'Everything in Starter, plus:',
                  'AI model attribution (GPT, Gemini, Claude…)',
                  'Sentence-level AI heatmaps',
                  'Humanization tool detection',
                  'Assignment-specific engine weighting',
                  'Department-level preset templates',
                  'Cross-language code detection',
                  'LMS integration — Canvas, Moodle, Blackboard',
                  'Cohort cluster visualizations',
                  'Priority support & dedicated Slack channel'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[var(--t1)]">
                    <span className="text-[var(--teal)] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              
              <a href="#" className="block text-center py-3.25 rounded-md bg-[var(--gold)] text-[#080600] text-[15px] font-semibold hover:-translate-y-0.5 transition-transform">
                Start 14-day free trial →
              </a>
            </div>
            
            <div className="bg-[var(--bg1)] border border-[var(--bd)] rounded-xl p-9 flex flex-col hover:-translate-y-1 transition-transform">
              <div className="font-display text-[20px] font-extrabold mb-1">Institution</div>
              <div className="text-[13px] text-[var(--t2)] mb-6">Universities, colleges & boot camps</div>
              <div className="font-display text-[40px] font-extrabold tracking-[-2px] text-[var(--gold)] mb-1">Custom</div>
              <div className="text-[13px] text-[var(--t2)] mb-7">volume pricing available</div>
              
              <ul className="flex-1 flex flex-col gap-3 mb-7">
                {[
                  'Everything in Department, plus:',
                  'SSO / SAML authentication',
                  'On-premise deployment option',
                  'Dedicated SLA & uptime guarantee',
                  'Custom data retention policies',
                  'GitHub Classroom integration',
                  'Custom integrity policy presets',
                  'Custom branding on all reports',
                  'Dedicated customer success manager',
                  'Annual contract with volume discounts'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[var(--t1)]">
                    <span className="text-[var(--teal)] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              
              <a href="#" className="block text-center py-3.25 rounded-md border border-[var(--bd2)] text-[15px] font-medium hover:bg-[var(--bg3)] transition-colors">
                Contact sales →
              </a>
            </div>
          </div>
          
          <p className="text-center mt-6 text-[13px] text-[var(--t2)]">All plans include a 14-day free trial. No credit card required. Students never pay.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-[100px_5vw] relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3.5 flex items-center justify-center gap-2">
              <div className="w-5 h-px bg-[var(--gold)]"></div>
              Frequently asked
            </div>
            <h2 className="font-display text-[clamp(32px,4.5vw,48px)] font-extrabold tracking-[-2px] leading-[1.02] mb-4.5">
              Answers to your questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How accurate is the AI detection?',
                a: '99.1% accuracy with 0.8% false positive rate. We are the only platform that can attribute which specific LLM generated text, not just that it was AI generated.'
              },
              {
                q: 'What makes IntegrityDesk different from other integrity tools?',
                a: 'Most products rely on one fixed scoring model. IntegrityDesk combines multiple engines and lets teams tune their weighting by assignment type, which produces more context-aware and defensible results.'
              },
              {
                q: 'Can we create different presets for essays, code, and lab reports?',
                a: 'Yes. Preset review modes are built for exactly that workflow. You can standardize settings per assignment category, then refine engine emphasis for departments with stricter or more flexible review policies.'
              },
              {
                q: 'Can IntegrityDesk generate a report for Deans or formal academic integrity cases?',
                a: 'Yes. IntegrityDesk can produce evidence-chain reports that package the case summary, engine rationale, source links, diffs, and supporting context into a format suitable for Deans, academic integrity offices, and formal review processes.'
              },
              {
                q: 'What programming languages are supported?',
                a: 'Over 80 languages including Python, Java, C/C++, JavaScript, Go, Rust, Swift, Kotlin, and every language used in computer science education.'
              },
              {
                q: 'Do you store submitted documents?',
                a: 'No. You control retention policies. Documents can be permanently deleted immediately after analysis, or retained for your required compliance period.'
              },
              {
                q: 'Can this be deployed on-premise?',
                a: 'Yes. Enterprise plans include fully air-gapped on-premise deployment options with zero external network calls required.'
              },
              {
                q: 'Is this FERPA compliant?',
                a: 'Yes. We are fully FERPA, COPPA, GDPR, and HIPAA compliant with signed BAAs available for healthcare education institutions.'
              }
            ].map((faq, i) => {
              const open = openFaqIndex === i;
              return (
                <div key={i} 
                  className={`border ${open ? 'border-[var(--gold)]' : 'border-[var(--bd)]'} rounded-lg overflow-hidden bg-[var(--bg1)] hover:bg-[var(--bg2)] transition-all cursor-pointer`}
                  onClick={() => setOpenFaqIndex(open ? null : i)}
                  role="button"
                  aria-expanded={open}
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setOpenFaqIndex(open ? null : i)}
                >
                  <div className="flex justify-between items-center p-6">
                    <h4 className="font-display text-[17px] font-bold">{faq.q}</h4>
                    <span className={`text-[var(--gold)] transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[14px] text-[var(--t1)] leading-[1.7] px-6 pb-6">{faq.a}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-[120px_5vw] bg-gradient-to-b from-[var(--bg1)] to-[var(--bg0)] relative z-10 border-t border-[var(--bd)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-[clamp(36px,5vw,64px)] font-extrabold tracking-[-2.5px] leading-[1.05] mb-6">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-[18px] text-[var(--t1)] max-w-[560px] mx-auto mb-10 leading-[1.7]">
            Join 2,000+ institutions that trust IntegrityDesk to protect academic integrity. Start your free trial today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#" className="px-10 py-4 rounded-xl bg-[var(--gold)] text-[#080600] text-[17px] font-semibold hover:-translate-y-1 transition-transform">
              Start free trial
            </a>
            <a href="#" className="px-10 py-4 rounded-xl border border-[var(--bd2)] text-[17px] font-medium hover:bg-[var(--bg2)] transition-colors">
              Book enterprise demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Back To Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[var(--gold)] text-[#080600] flex items-center justify-center shadow-lg z-50 transition-all ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        ↑
      </button>

      <footer className="py-[60px_5vw_32px] border-t border-[var(--bd)] bg-[var(--bg0)] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="font-display text-[19px] font-extrabold mb-3.5">
                <span className="text-[var(--gold)]">I</span>ntegrityDesk
              </div>
              <p className="text-[14px] text-[var(--t2)] leading-[1.7] max-w-[270px]">
                The world's most advanced academic integrity platform — unifying code plagiarism, content plagiarism, and AI detection in a single, devastatingly accurate system.
              </p>
            </div>
            
            <div>
              <h4 className="text-[12px] font-bold tracking-[0.08em] uppercase text-[var(--t1)] mb-4">Product</h4>
              {['Features', 'Detection Engines', 'Integrations', 'API & CLI', 'Changelog', 'System Status'].map((item, i) => (
                <a key={i} href="#" className="block text-[13px] text-[var(--t2)] mb-2.5 hover:text-[var(--t0)] transition-colors">{item}</a>
              ))}
            </div>
            
            <div>
              <h4 className="text-[12px] font-bold tracking-[0.08em] uppercase text-[var(--t1)] mb-4">Resources</h4>
              {['Documentation', 'For Instructors', 'For Institutions', 'Blog', 'Case Studies', 'API Reference'].map((item, i) => (
                <a key={i} href="#" className="block text-[13px] text-[var(--t2)] mb-2.5 hover:text-[var(--t0)] transition-colors">{item}</a>
              ))}
            </div>
            
            <div>
              <h4 className="text-[12px] font-bold tracking-[0.08em] uppercase text-[var(--t1)] mb-4">Company</h4>
              {['About', 'Privacy Policy', 'Terms of Service', 'Security & Compliance', 'Careers', 'Contact'].map((item, i) => (
                <a key={i} href="#" className="block text-[13px] text-[var(--t2)] mb-2.5 hover:text-[var(--t0)] transition-colors">{item}</a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-[var(--bd)] text-[12px] text-[var(--t2)]">
            <span>© 2025 IntegrityDesk Technologies Inc. All rights reserved.</span>
            <div className="mt-3 md:mt-0">
              {['Privacy', 'Terms', 'Security', 'Accessibility'].map((item, i) => (
                <a key={i} href="#" className="ml-5 text-[var(--t2)] hover:text-[var(--t0)] transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx global>{`
        :root {
          --bg0: #05060C;
          --bg1: #0C0F1A;
          --bg2: #131725;
          --bg3: #1C2133;
          --nav-bg: rgba(5,6,12,0.75);
          --t0: #F2EEE5;
          --t1: #9396A8;
          --t2: #555869;
          --bd: rgba(255,255,255,0.07);
          --bd2: rgba(255,255,255,0.12);
          --gold: #E8C547;
          --gold2: #C9A832;
          --gold-g: rgba(232,197,71,0.06);
          --teal: #3EEDC5;
          --teal2: #27C9A3;
          --teal-g: rgba(62,237,197,0.06);
          --red: #FF5257;
          --amber: #FFB03A;
        }
        
        [data-theme="light"] {
          --bg0: #F8F6F0;
          --bg1: #EEEAE0;
          --bg2: #E4DFCF;
          --bg3: #D8D2C0;
          --nav-bg: rgba(248,246,240,0.88);
          --t0: #0F1018;
          --t1: #4A4C5E;
          --t2: #8C8E9E;
          --bd: rgba(0,0,0,0.08);
          --bd2: rgba(0,0,0,0.15);
          --gold: #B8900A;
          --gold2: #9A7800;
          --gold-g: rgba(184,144,10,0.08);
          --teal: #0C9A78;
          --teal2: #0A7D62;
          --teal-g: rgba(12,154,120,0.06);
          --red: #D42B2F;
          --amber: #C07800;
        }
        
        @font-face {
          font-family: 'Bricolage Grotesque';
          src: url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,700;12..96,800&display=swap');
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Outfit';
          src: url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap');
          font-display: swap;
        }
        
        .font-display {
          font-family: 'Bricolage Grotesque', system-ui, -apple-system, sans-serif;
        }
        
        .font-body {
          font-family: 'Outfit', system-ui, -apple-system, sans-serif;
        }
        
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeSlideDown {
          animation: fadeSlideDown 0.8s ease both;
        }
        
        .animate-fadeUp {
          animation: fadeUp 0.9s ease both;
        }
        
        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .animate-fadeSlideDown,
          .animate-fadeUp {
            animation: none;
          }
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: var(--bg0);
        }
        
        ::-webkit-scrollbar-thumb {
          background: var(--bg3);
          border-radius: 99px;
        }
      `}</style>
    </main>
  );
}
