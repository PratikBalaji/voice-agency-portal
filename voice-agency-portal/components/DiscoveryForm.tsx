'use client';

import { useState, useEffect, useRef } from 'react';
// Vapi is browser-only — imported dynamically inside useEffect to avoid SSR crash

// ─── Icon components (inline SVG, no extra deps) ─────────────────────────────

function SpinnerIcon() {
  return (
    <svg
      className="spinner w-4 h-4 text-white/80"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6.364 10.243a.75.75 0 0 1 1.415.514A7.5 7.5 0 0 1 12.75 18.43V21h2.25a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5h2.25v-2.57a7.5 7.5 0 0 1-6.778-6.673.75.75 0 0 1 1.415-.514A6 6 0 0 0 12 18a6 6 0 0 0 5.364-6.757z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" clipRule="evenodd" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15zM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75zM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75zM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75zM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5z" clipRule="evenodd" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.12-.879H5.25zM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25z" clipRule="evenodd" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function DiscoveryForm() {
  const vapiInstance = useRef<any>(null);
  const [businessName, setBusinessName] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [referenceUrl, setReferenceUrl] = useState<string>('');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'voice-agent' | 'backend-demo'>('voice-agent');

  // ── Backend Demo state ─────────────────────────────────────────────────────
  const [testOrderNumber, setTestOrderNumber] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  useEffect(() => {
    // Dynamic import ensures Vapi only loads in the browser, never during SSR
    let vapi: any;
    import('@vapi-ai/web').then(({ default: Vapi }) => {
      if (!vapiInstance.current) {
        vapiInstance.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
      }
      vapi = vapiInstance.current;
      vapi.on('call-start', () => setIsCalling(true));
      vapi.on('call-end',   () => setIsCalling(false));
    });

    return () => {
      if (vapiInstance.current) {
        vapiInstance.current.removeAllListeners();
      }
    };
  }, []);

  const handleGenerateAndDeploy = async () => {
    console.log('[handleGenerateAndDeploy] fired');
    setLoading(true);
    setGeneratedContent(null);
    setAgentId(null);
    setError(null);

    try {
      // Step 1: Scrape & Generate Prompt
      setLoadingStep('Scraping website data...');
      const generateRes = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, sector, url: referenceUrl, additionalContext }),
      });

      const generateData = await generateRes.json();

      if (!generateRes.ok) {
        throw new Error(generateData.error || `Generate failed (${generateRes.status})`);
      }

      setGeneratedContent(generateData.prompt);

      // Step 2: Deploy Agent
      setLoadingStep('Deploying voice agent...');
      const deployRes = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generatedPrompt: generateData.prompt }),
      });

      const deployData = await deployRes.json();

      if (!deployRes.ok) {
        throw new Error(deployData.error || `Deploy failed (${deployRes.status})`);
      }

      setAgentId(deployData.agentId);

    } catch (error: any) {
      console.error('API Error:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      // Guaranteed to run — button will ALWAYS be re-enabled
      setLoading(false);
      setLoadingStep('');
    }
  };

  // ── Simulate a Vapi tool call against /api/check-order ─────────────────────
  const handleTestOrder = async () => {
    if (!testOrderNumber.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/check-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Mirror the exact payload structure Vapi sends
        body: JSON.stringify({
          message: {
            toolCalls: [{
              id: 'simulated_call_123',
              function: {
                arguments: JSON.stringify({ orderNumber: testOrderNumber }),
              },
            }],
          },
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ error: 'Request failed. Is the dev server running?' });
    } finally {
      setIsTesting(false);
    }
  };

  const startCall = () => {
    if (agentId && vapiInstance.current) {
      vapiInstance.current.start(agentId);
    }
  };

  const isDisabled = loading || isCalling;

  return (
    <div className="bg-mesh min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-96 h-96 rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative">

        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <MicIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            AI Voice Agency
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Build & deploy intelligent voice agents in seconds
          </p>
        </div>

        {/* Glass card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8">

          {/* ── Tab Toggle ── */}
          <div className="flex items-center gap-1 p-1 mb-6 rounded-xl bg-slate-900/70 border border-slate-700/40">
            <button
              type="button"
              onClick={() => setActiveTab('voice-agent')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'voice-agent'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <MicIcon className="w-3.5 h-3.5" />
              Voice Agent Builder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('backend-demo')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'backend-demo'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527zM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 1 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0z" clipRule="evenodd" />
              </svg>
              Backend Demo
            </button>
          </div>

          {/* ── Voice Agent Builder ── */}
          {activeTab === 'voice-agent' && (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${agentId ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>1</div>
                  <span className="text-xs text-slate-500 font-medium hidden sm:block">Configure</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-purple-500/30" />
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${generatedContent ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-700/60 text-slate-500 border border-slate-600/40'}`}>2</div>
                  <span className="text-xs text-slate-500 font-medium hidden sm:block">Generate</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-emerald-500/20" />
                <div className="flex items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${agentId ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : 'bg-slate-700/60 text-slate-500 border border-slate-600/40'}`}>3</div>
                  <span className="text-xs text-slate-500 font-medium hidden sm:block">Deploy</span>
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-5">

                {/* Business Name */}
                <div className="space-y-1.5">
                  <label htmlFor="businessName" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <BuildingIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    className="input-field w-full px-4 py-3 rounded-xl text-sm font-medium"
                    placeholder="e.g. Apex Dental Clinic"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    disabled={isDisabled}
                  />
                </div>

                {/* Sector */}
                <div className="space-y-1.5">
                  <label htmlFor="sector" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <TagIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Industry / Sector
                  </label>
                  <input
                    type="text"
                    id="sector"
                    className="input-field w-full px-4 py-3 rounded-xl text-sm font-medium"
                    placeholder="e.g. Healthcare, Real Estate, SaaS"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    required
                    disabled={isDisabled}
                  />
                </div>

                {/* Reference URL */}
                <div className="space-y-1.5">
                  <label htmlFor="referenceUrl" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Reference URL
                  </label>
                  <input
                    type="url"
                    id="referenceUrl"
                    className="input-field w-full px-4 py-3 rounded-xl text-sm font-medium"
                    placeholder="https://www.yourbusiness.com"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    required
                    disabled={isDisabled}
                  />
                  <p className="text-xs text-slate-500 pl-1">
                    We&apos;ll scrape this page to personalise your agent prompt.
                  </p>
                </div>

                {/* Additional Context (optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="additionalContext" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <svg className="w-3.5 h-3.5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75zM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75zM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6z" clipRule="evenodd" />
                      <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75z" />
                    </svg>
                    Additional Rules
                    <span className="ml-auto text-slate-600 normal-case font-medium tracking-normal">Optional</span>
                  </label>
                  <textarea
                    id="additionalContext"
                    rows={3}
                    className="input-field w-full px-4 py-3 rounded-xl text-sm font-medium resize-none"
                    placeholder="e.g. Always ask for the caller's email before ending the call. Avoid discussing pricing. Focus only on appointment booking."
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    disabled={isDisabled}
                  />
                  <p className="text-xs text-slate-500 pl-1">
                    Extra rules or instructions to inject into the agent&apos;s system prompt.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  id="generate-deploy-btn"
                  onClick={() => handleGenerateAndDeploy()}
                  className="btn-primary w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-semibold text-white mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <SpinnerIcon />
                      <span>{loadingStep || 'Scraping & Generating...'}</span>
                    </>
                  ) : (
                    <>
                      <MicIcon className="w-4 h-4" />
                      <span>Generate &amp; Deploy Agent</span>
                    </>
                  )}
                </button>

              </div>
            </>
          )}

          {/* ── Backend Demo Panel ── */}
          {activeTab === 'backend-demo' && (
            <div className="py-4">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-violet-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5zM18 1.5a.75.75 0 0 1 .728.568l.258 1.036a2.63 2.63 0 0 0 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258a2.63 2.63 0 0 0-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.63 2.63 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.63 2.63 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Agentic Automation Testing</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Watch your agent trigger backend tools in real-time.
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Watch your agent trigger backend tools like <span className="text-indigo-400 font-medium">Order Lookups</span> and{' '}
                <span className="text-emerald-400 font-medium">Calendar Bookings</span> in real-time. When a live call is active, tool invocations from Vapi will appear here as they happen.
              </p>

              {/* ── Order Lookup Tester ── */}
              <div className="mt-2 space-y-4">

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-700/50" />
                  <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">Simulate a Tool Call</span>
                  <div className="flex-1 h-px bg-slate-700/50" />
                </div>

                {/* Order number input */}
                <div className="space-y-1.5">
                  <label htmlFor="testOrderNumber" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <svg className="w-3.5 h-3.5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15z" />
                      <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75z" />
                      <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
                    </svg>
                    Order Number
                  </label>
                  <input
                    type="text"
                    id="testOrderNumber"
                    className="input-field w-full px-4 py-3 rounded-xl text-sm font-medium"
                    placeholder="e.g. 12345 or 99999"
                    value={testOrderNumber}
                    onChange={(e) => setTestOrderNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTestOrder()}
                    disabled={isTesting}
                  />
                  <p className="text-xs text-slate-600 pl-1">Try <code className="text-blue-400/80">12345</code>, <code className="text-amber-400/80">99999</code>, or any unknown number.</p>
                </div>

                {/* Simulate button */}
                <button
                  type="button"
                  id="simulate-order-btn"
                  onClick={handleTestOrder}
                  disabled={isTesting || !testOrderNumber.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl text-sm font-semibold text-white"
                >
                  {isTesting ? (
                    <>
                      <SpinnerIcon />
                      <span>Querying Database...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                      <span>Simulate AI Call</span>
                    </>
                  )}
                </button>

                {/* Terminal output */}
                {testResult && (
                  <div className="fade-in-up rounded-xl overflow-hidden border border-slate-700/50">
                    {/* Terminal titlebar */}
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800/80 border-b border-slate-700/50">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                      <span className="ml-2 text-xs text-slate-500 font-mono">tool_response · /api/check-order</span>
                    </div>
                    {/* Terminal body */}
                    <div className="bg-slate-950 p-4 font-mono text-sm">
                      {testResult.error ? (
                        <p className="text-red-400">❌ Error: {testResult.error}</p>
                      ) : (
                        <>
                          <p className="text-slate-500 text-xs mb-2">$ POST /api/check-order → 200 OK</p>
                          <p className="text-slate-500 text-xs mb-3">toolCallId: <span className="text-indigo-400">simulated_call_123</span></p>
                          <p className="text-green-400 leading-relaxed">
                            &gt; {testResult.results?.[0]?.result ?? JSON.stringify(testResult, null, 2)}
                          </p>
                          <p className="text-slate-600 text-xs mt-3">↑ This is exactly what your AI will say out loud to the caller.</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Generated Prompt Card — voice-agent tab only */}
        {activeTab === 'voice-agent' && generatedContent && (
          <div className="fade-in-up mt-4 glass-card rounded-2xl p-5 sm:p-6 border-indigo-500/25">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircleIcon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <h2 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">Generated System Prompt</h2>
            </div>
            <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-700/40 max-h-48 overflow-y-auto">
              <p className="text-slate-300 text-xs leading-relaxed font-mono whitespace-pre-wrap">{generatedContent}</p>
            </div>
          </div>
        )}

        {/* Deploy Success / Start Call Card */}
        {activeTab === 'voice-agent' && agentId && (
          <div className="fade-in-up mt-4 glass-card rounded-2xl p-5 sm:p-6 border-emerald-500/25">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircleIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <h2 className="text-sm font-semibold text-emerald-300">Agent deployed successfully!</h2>
                <p className="text-xs text-slate-500 mt-0.5">Agent ID: <span className="font-mono text-slate-400">{agentId}</span></p>
              </div>
            </div>

            <button
              id="start-call-btn"
              onClick={startCall}
              disabled={isCalling}
              className="btn-success w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-sm font-semibold text-white"
            >
              {isCalling ? (
                <>
                  <span className="relative inline-flex">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-dot relative" />
                  </span>
                  <span>Call in Progress...</span>
                </>
              ) : (
                <>
                  <PhoneIcon className="w-4 h-4" />
                  <span>Start Call</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Card */}
        {error && (
          <div className="fade-in-up mt-4 rounded-2xl p-5 border border-red-500/25 bg-red-950/30 backdrop-blur-sm">
            <div className="flex items-start gap-2.5">
              <AlertIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-red-300 mb-1">Something went wrong</h2>
                <p className="text-xs text-red-400/80 leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Powered by DeepSeek &amp; Vapi &middot; Secured end-to-end
        </p>
      </div>
    </div>
  );
}