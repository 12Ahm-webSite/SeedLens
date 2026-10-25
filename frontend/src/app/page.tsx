'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AnalysisResults from '@/components/AnalysisResults';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import HowItWorks from '@/components/HowItWorks';
import CategoriesInfo from '@/components/CategoriesInfo';
import Footer from '@/components/Footer';
import { analyzeSeed } from '@/lib/api';
import type { AnalyzeSuccessResponse } from '@/types/seedlens';

type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Home() {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [currentSeed, setCurrentSeed] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('26.3');
  const [selectedEdition, setSelectedEdition] = useState<'java' | 'bedrock'>('java');
  const [results, setResults] = useState<AnalyzeSuccessResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Record authentic visitor session
  React.useEffect(() => {
    try {
      let vid = localStorage.getItem('seedlens_vid');
      if (!vid) {
        vid = 'usr_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        localStorage.setItem('seedlens_vid', vid);
      }

      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_visit',
          visitorHash: vid,
          edition: selectedEdition,
        }),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }
  }, []);

  const handleAnalyze = async (seedInput: string, version: string) => {
    setCurrentSeed(seedInput);
    setSelectedVersion(version);
    setStatus('loading');
    setErrorMessage(null);

    try {
      const data = await analyzeSeed({ seed: seedInput, version });
      setResults(data);
      setStatus('success');

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
      setStatus('error');
    }
  };

  const handleTryAnother = () => {
    const inputEl = document.getElementById('analyzer');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#D0D0D0] dark:bg-[#121316] text-[#1E1E1E] dark:text-[#E2E8F0] selection:bg-[#5B8731] selection:text-white transition-colors duration-200">
      {/* Top Header */}
      <Header
        selectedVersion={selectedVersion}
        onVersionChange={setSelectedVersion}
        edition={selectedEdition}
      />

      <main className="flex-1">
        {/* Hero Section with Seed Input */}
        <Hero
          onAnalyze={handleAnalyze}
          isLoading={status === 'loading'}
          selectedVersion={selectedVersion}
          onVersionChange={setSelectedVersion}
          edition={selectedEdition}
          onEditionChange={setSelectedEdition}
          initialSeed={currentSeed}
          errorMessage={status === 'error' ? errorMessage : null}
        />

        {/* Dynamic State Section */}
        <div id="results-section" className="scroll-mt-16">
          {status === 'loading' && <LoadingState seed={currentSeed} />}

          {status === 'error' && (
            <ErrorState
              message={errorMessage || 'Failed to complete analysis.'}
              onRetry={() => handleAnalyze(currentSeed, selectedVersion)}
            />
          )}

          {status === 'success' && results && (
            <AnalysisResults
              data={results}
              edition={selectedEdition}
              onTryAnotherSeed={handleTryAnother}
            />
          )}
        </div>

        {/* Educational & Taxonomic Sections */}
        <HowItWorks />
        <CategoriesInfo />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
