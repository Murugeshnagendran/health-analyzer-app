'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Auth from './components/Auth';

// Icon component using Google Material Symbols
const Icon = ({ name, className }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

// Upload Screen Component
const UploadScreen = ({ onUpload }) => (
  <div className="flex flex-col h-screen justify-between text-slate-800">
    <header className="p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-slate-900 flex-1 text-center ml-10">
        AI Medical Analyzer
      </h1>
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-blue-500/10">
        <Icon name="help" className="text-slate-600" />
      </button>
    </header>
    <main className="flex-grow flex flex-col items-center justify-center p-4">
      <div
        className="relative w-full max-w-md bg-white/50 backdrop-blur-xl border border-blue-500/20 rounded-xl p-8 text-center transition-shadow duration-300 cursor-pointer"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-500/20 rounded-full">
            <Icon name="cloud_upload" className="text-blue-500 text-5xl" />
          </div>
          <p className="text-lg font-semibold text-slate-700">
            Drag & drop your medical report here, or click to browse
          </p>
        </div>
        <input
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          type="file"
          onChange={onUpload}
          accept="application/pdf,image/*,text/plain"
        />
      </div>
      <p className="mt-4 text-sm text-slate-500">Supports PDF, image, or text reports.</p>
    </main>
    <footer className="bg-white border-t border-blue-500/20">
      <nav className="flex justify-around p-2">
        <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg w-24 text-blue-500 bg-blue-500/10" href="#">
          <Icon name="upload" />
          <span className="text-xs font-medium">Upload</span>
        </a>
        <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg w-24 text-slate-500 hover:bg-blue-500/10 transition-colors" href="#">
          <Icon name="analytics" />
          <span className="text-xs font-medium">Results</span>
        </a>
        <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg w-24 text-slate-500 hover:bg-blue-500/10 transition-colors" href="#">
          <Icon name="group" />
          <span className="text-xs font-medium">Connect</span>
        </a>
      </nav>
    </footer>
  </div>
);

// Analyzing Screen Component
const AnalyzingScreen = () => (
  <div className="flex flex-col h-screen text-slate-800">
    <header className="flex items-center justify-between p-4">
      <h1 className="text-lg font-bold text-slate-900 mx-auto">Analyzing...</h1>
    </header>
    <main className="flex flex-col items-center justify-center flex-grow px-4 text-center">
      <div className="relative w-48 h-24 mb-10 flex items-center justify-center">
        <div className="absolute w-24 h-24 bg-blue-500/20 rounded-full animate-ping"></div>
        <div className="relative w-20 h-20 bg-blue-500/30 rounded-full flex items-center justify-center">
          <Icon name="biotech" className="text-4xl text-blue-600" />
        </div>
      </div>
      <div className="h-6 text-slate-600 font-semibold">
        <p>Preparing summary...</p>
      </div>
      <div className="w-full max-w-xs mt-8 overflow-hidden rounded-full bg-slate-200 h-2">
        <div className="relative h-full w-full">
          <div className="absolute h-full bg-blue-500 w-1/2 animate-[progress_2s_infinite]"></div>
        </div>
      </div>
    </main>
    <style jsx>{`
      @keyframes progress {
        0% {
          left: -50%;
        }
        100% {
          left: 100%;
        }
      }
    `}</style>
  </div>
);

// Results Screen Component with safe array checks
const ResultsScreen = ({ onReset, resultData }) => {
  if (!resultData) return null;
  const { summary, abnormalResults, allMetrics } = resultData;
  return (
    <div className="flex h-full min-h-screen w-full flex-col bg-slate-100">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/80 p-4 pb-3 backdrop-blur-sm">
        <button onClick={onReset} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-200">
          <Icon name="arrow_back" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Results</h1>
        <div className="h-10 w-10" />
      </header>
      <main className="flex-1 space-y-6 p-4">
        <div className="rounded-xl bg-white/50 p-5 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-lg">
          <h2 className="text-xl font-bold text-slate-900">Summary</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{summary}</p>
        </div>
        <div className="rounded-xl bg-red-500/10 p-5 shadow-sm ring-1 ring-red-500/20 backdrop-blur-lg">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-red-800">Abnormal Results</h2>
            <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">Warning</span>
          </div>
          <ul className="mt-4 space-y-3">
            {(Array.isArray(abnormalResults) ? abnormalResults : []).map((r, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <Icon name="warning" className="text-red-500" />
                <div>
                  <p className="font-semibold text-slate-800">{r.metric}</p>
                  <p className="text-sm text-slate-600">
                    {r.value} ({r.note})
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white/50 p-5 shadow-sm ring-1 ring-slate-200/50 backdrop-blur-lg">
          <h2 className="text-xl font-bold text-slate-900">All Metrics</h2>
          <ul className="mt-4 space-y-3">
            {(Array.isArray(allMetrics) ? allMetrics : []).map((m, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <Icon name="check_circle" className="text-green-500" />
                <div>
                  <p className="font-semibold text-slate-800">{m.metric}</p>
                  <p className="text-sm text-slate-600">{m.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('upload');
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleUpload = async (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      return;
    }
    setCurrentScreen('analyzing');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      let data = null;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Response is not valid JSON:', text);
        data = { error: 'Invalid JSON from server', raw: text };
      }

      setResultData(data);
      setCurrentScreen('results');
    } catch (error) {
      console.error('Upload failed:', error);
      setCurrentScreen('upload');
    }
  };

  const handleReset = () => {
    setCurrentScreen('upload');
    setResultData(null);
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <p className="text-slate-700 font-semibold">Welcome, {user.email}</p>
        <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded shadow">
          Sign Out
        </button>
      </div>

      <div className="font-sans bg-slate-50">
        {currentScreen === 'upload' && <UploadScreen onUpload={handleUpload} />}
        {currentScreen === 'analyzing' && <AnalyzingScreen />}
        {currentScreen === 'results' && <ResultsScreen onReset={handleReset} resultData={resultData} />}
      </div>
    </div>
  );
}
