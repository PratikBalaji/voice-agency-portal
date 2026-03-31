'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';

export default function DiscoveryForm() {
  const vapiInstance = useRef<Vapi | null>(null);
  const [businessName, setBusinessName] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [referenceUrl, setReferenceUrl] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Renamed from 'isLoading'
  const [isCalling, setIsCalling] = useState<boolean>(false);


  useEffect(() => {
    if (!vapiInstance.current) {
      vapiInstance.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '');
    }

    const vapi = vapiInstance.current;

    vapi.on('call-start', () => {
      setIsCalling(true);
    });

    vapi.on('call-end', () => {
      setIsCalling(false);
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const handleGenerateAndDeploy = async (e: FormEvent) => {
    e.preventDefault(); // <-- FIX 1: Prevent default form submission
    setLoading(true);
    setGeneratedContent(null);
    setAgentId(null);
    setError(null);

    try {
      // Step 1: Generate Prompt
      const generateRes = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessName, sector, referenceUrl }),
      });

      const generateData = await generateRes.json();
      if (generateRes.status === 429) {
        setError(generateData.error || "Too many requests to Anthropic. Pause for 60 seconds due to high traffic.");
        setLoading(false);
        return;
      } else if (!generateRes.ok) {
        setError(generateData.error || 'Failed to generate prompt.');
        setLoading(false);
        return;
      }
      setGeneratedContent(generateData.generatedContent);

      // Step 2: Deploy Agent
      const deployRes = await fetch('/api/agent', { // Corrected endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ generatedPrompt: generateData.generatedContent }),
      });

      const deployData = await deployRes.json();

      if (!deployRes.ok) {
        setError(deployData.error || 'Failed to deploy Vapi agent.');
        setLoading(false);
        return;
      }
      setAgentId(deployData.agentId);

    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false); // Set loading to false on finish/fail
    }
  };

  const startCall = () => {
    if (agentId && vapiInstance.current) {
      vapiInstance.current.start(agentId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">AI Voice Agency - Prompt Discovery & Call</h1>
        <form onSubmit={handleGenerateAndDeploy} className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name:</label>
            <input
              type="text"
              id="businessName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              disabled={loading || isCalling}
            />
          </div>
          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Sector:</label>
            <input
              type="text"
              id="sector"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              required
              disabled={loading || isCalling}
            />
          </div>
          <div>
            <label htmlFor="referenceUrl" className="block text-sm font-medium text-gray-700">Reference URL:</label>
            <input
              type="url"
              id="referenceUrl"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              required
              disabled={loading || isCalling}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading || isCalling}
          >
            {loading ? 'Deploying Agent...' : 'Generate & Deploy'} {/* <-- FIX 2: Dynamic button text */}
          </button>
        </form>

        {generatedContent && (
          <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded-md">
            <h2 className="font-semibold">Generated Prompt:</h2>
            <p>{generatedContent}</p>
          </div>
        )}

        {agentId && (
          <div className="mt-6">
            <button
              onClick={startCall}
              disabled={isCalling}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isCalling ? 'Calling...' : 'Start Call'}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-md">
            <h2 className="font-semibold">Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}