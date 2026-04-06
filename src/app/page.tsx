'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{x: number, y: number, r: number, vx: number, vy: number, a: number}> = [];
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * (theme === 'dark' ? 0.45 : 0.2) + 0.05,
      });
    }

    let animFrame: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gold = theme === 'dark' ? '232,197,71' : '184,144,10';
      
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${gold},${p.a})`;
        ctx.fill();
      });
      
      animFrame = requestAnimationFrame(loop);
    };

    loop();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <main className="min-h-screen bg-[var(--bg0)] text-[var(--t0)] font-body">
      <canvas ref={canvasRef} id="particles-canvas" className="fixed inset-0 z-0 pointer-events-none opacity-100" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-[68px] bg-[rgba(5,6,12,0.75)] backdrop-blur-[20px] border-b border-[var(--bd)] transition-all">
        <a href="#" className="font-display text-[21px] font-extrabold tracking-[-0.5px] flex items-center gap-1">
          <span className="text-[var(--gold)]">I</span>ntegrityDesk
        </a>
        
        <div className="hidden md:flex gap-7 items-center">
          <a href="#features" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Features</a>
          <a href="#how-it-works" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">How it works</a>
          <a href="#pricing" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">Pricing</a>
          <a href="#faq" className="text-[14px] text-[var(--t1)] hover:text-[var(--t0)] transition-colors">FAQ</a>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="w-11 h-6 rounded-full bg-[var(--bg3)] border border-[var(--bd2)] cursor-pointer relative transition-all"
            aria-label="Toggle theme"
          >
            <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-[var(--gold)] transition-all ${theme === 'light' ? 'left-[24px]' : 'left-[3px]'}`} />
            <span className="absolute top-1/2 -translate-y-1/2 text-[10px] left-1.5 opacity-0">☀</span>
            <span className="absolute top-1/2 -translate-y-1/2 text-[10px] right-1.5 opacity-100">☽</span>
          </button>
          
          <a href="#" className="px-4 py-1.75 rounded-md border border-[var(--bd2)] text-[13px] text-[var(--t1)] hover:text-[var(--t0)] transition-all">Log in</a>
          <a href="#" className="px-5 py-2 rounded-md bg-[var(--gold)] text-[#0A0800] text-[13px] font-semibold hover:-translate-y-px transition-all">Get started free</a>
        </div>
      </nav>

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
            IntegrityDesk is the only platform that unifies code plagiarism, essay detection, and AI content tracing — with unprecedented accuracy, speed, and evidence-grade reporting.
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-16 animate-fadeUp">
            <a href="#" className="px-9 py-3.75 rounded-xl bg-[var(--gold)] text-[#080600] text-[16px] font-semibold hover:-translate-y-0.75 transition-transform">
              Start free — no card needed →
            </a>
            <a href="#" className="px-9 py-3.75 rounded-xl border border-[var(--bd2)] text-[16px] font-normal hover:bg-[var(--bg2)] transition-colors">
              Watch 2-min demo
            </a>
          </div>

          <div className="flex flex-wrap justify-center border border-[var(--bd)] rounded-xl overflow-hidden bg-[var(--bg1)] animate-fadeUp">
            {[
              { value: '500B+', label: 'Sources indexed' },
              { value: '< 8s', label: 'Average check time' },
              { value: '99.1%', label: 'Detection accuracy' },
              { value: '0.8%', label: 'False positive rate' },
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
                desc: 'Drag and drop any file, paste text, or connect your LMS. Code, essays, reports, presentations — we support every format.'
              },
              {
                step: '02',
                title: 'Analyze',
                desc: 'Our engine runs 17 separate analysis layers in parallel. Deep semantic comparison, AI detection, and source tracing complete in seconds.'
              },
              {
                step: '03',
                title: 'Act',
                desc: 'Get a full evidence report with side-by-side diffs, similarity heatmaps, and original source links. Export for disciplinary hearings.'
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
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-[100px_5vw] relative z-10">
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
              IntegrityDesk isn't a point tool — it's the complete integrity operating system for modern academic institutions.
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
                desc: 'Digitally signed, timestamped PDF reports with source URLs, similarity percentages, and side-by-side diffs. Built specifically for academic disciplinary hearings.',
                tag: 'Evidence-ready'
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
            ].map((faq, i) => (
              <div key={i} className="border border-[var(--bd)] rounded-lg p-6 bg-[var(--bg1)] hover:bg-[var(--bg2)] transition-colors">
                <h4 className="font-display text-[17px] font-bold mb-2">{faq.q}</h4>
                <p className="text-[14px] text-[var(--t1)] leading-[1.7]">{faq.a}</p>
              </div>
            ))}
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