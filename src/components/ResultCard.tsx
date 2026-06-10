import { useState } from 'react';
import { PolishingResult } from '../types';
import { ShieldAlert, Check, Copy, Volume2, Sparkles, Compass, Lightbulb } from 'lucide-react';

interface ResultCardProps {
  result: PolishingResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const [copiedKey, setCopiedKey] = useState<'A' | 'B' | null>(null);
  const [speakingKey, setSpeakingKey] = useState<'A' | 'B' | null>(null);

  const handleCopy = async (text: string, key: 'A' | 'B') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const handleSpeak = (text: string, key: 'A' | 'B') => {
    if ('speechSynthesis' in window) {
      if (speakingKey === key) {
        window.speechSynthesis.cancel();
        setSpeakingKey(null);
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      
      utterance.onend = () => {
        setSpeakingKey(null);
      };
      utterance.onerror = () => {
        setSpeakingKey(null);
      };

      setSpeakingKey(key);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('이 브라우저는 음성 음독(TTS) 기능을 지원하지 않습니다.');
    }
  };

  return (
    <div className="space-y-6" id="result-card-outer">
      {/* 1. Risk Diagnosis Card */}
      <div 
        id="risk-diagnosis-box"
        className="border border-amber-200/80 bg-amber-50/40 rounded-xl p-5"
      >
        <div className="flex items-start">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700 mr-4 flex-shrink-0 border border-amber-200">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-1.5 tracking-tight mb-1">
              <span>임상 심리학적 원문 리스크 진단</span>
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed font-normal">
              {result.riskAnalysis}
            </p>
          </div>
        </div>
      </div>

      {/* 2. A / B Version Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" id="alternatives-grid">
        {/* Recommended Version A */}
        <div 
          id="version-a-container"
          className="border border-slate-900 bg-white rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
        >
          <div className="p-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white font-mono">
                  A
                </span>
                <span className="font-bold text-sm text-slate-900 tracking-tight">공식 비즈니스 표준 추천안</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSpeak(result.versionA, 'A')}
                  className={`p-1.5 rounded-md border text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer ${
                    speakingKey === 'A' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-100'
                  }`}
                  title="한국어 음성 음독"
                >
                  <Volume2 className={`h-4 w-4 ${speakingKey === 'A' ? 'animate-pulse' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(result.versionA, 'A')}
                  className="p-1.5 rounded-md border border-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="클립보드 복사"
                >
                  {copiedKey === 'A' ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <blockquote className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans font-medium select-all">
              "{result.versionA}"
            </blockquote>
          </div>
          
          <div className="bg-slate-50 border-t border-slate-100 px-5 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">격식 지향형 • 하십시오체 극대화</span>
            {copiedKey === 'A' && <span className="text-emerald-600 font-bold">복사 완료 • 전송 준비</span>}
          </div>
        </div>

        {/* Alternative Version B */}
        <div 
          id="version-b-container"
          className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
        >
          <div className="p-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-[10px] font-bold text-slate-800 font-mono">
                  B
                </span>
                <span className="font-bold text-sm text-slate-800 tracking-tight">상냥하고 유연한 조율 대안</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSpeak(result.versionB, 'B')}
                  className={`p-1.5 rounded-md border text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer ${
                    speakingKey === 'B' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-100'
                  }`}
                  title="한국어 음성 음독"
                >
                  <Volume2 className={`h-4 w-4 ${speakingKey === 'B' ? 'animate-pulse' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(result.versionB, 'B')}
                  className="p-1.5 rounded-md border border-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="클립보드 복사"
                >
                  {copiedKey === 'B' ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <blockquote className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans font-medium select-all">
              "{result.versionB}"
            </blockquote>
          </div>
          
          <div className="bg-slate-50 border-t border-slate-100 px-5 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-600">협업 지향형 • 상냥한 해요체</span>
            {copiedKey === 'B' && <span className="text-emerald-600 font-bold">복사 완료 • 전송 준비</span>}
          </div>
        </div>
      </div>

      {/* 3. Expert Coaching Tips */}
      <div 
        id="coaching-tips-box"
        className="border border-slate-200/80 bg-white rounded-xl p-5 shadow-xs"
      >
        <div className="flex items-start">
          <div className="p-2 bg-emerald-100/60 rounded-lg text-emerald-800 mr-4 flex-shrink-0 border border-emerald-200/50">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 tracking-tight mb-1">
              <span>임상심리전문가의 커뮤니케이션 코칭 가이드</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {result.coachingTips}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
