import { useState, useEffect, FormEvent } from 'react';
import { ConversionMode, PolishingResult, HistoryItem } from './types';
import ModeSelector from './components/ModeSelector';
import ExampleTemplates from './components/ExampleTemplates';
import ResultCard from './components/ResultCard';
import HistoryList from './components/HistoryList';
import { 
  Sparkles, 
  BrainCircuit, 
  ArrowRight, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  Info,
  Layers,
  HelpCircle
} from 'lucide-react';

const LOADING_STEPS = [
  "입력된 어휘에 깃든 잠재적 공격성과 심리적 방어 기제를 필터링하고 있습니다...",
  "상대방이 느낄 무의식적 반발심과 조직 내 소통 리스크를 분석하고 있습니다...",
  "관계 훼손 없이 우리의 실리를 100% 관철시킬 유화 명분을 도출하고 있습니다...",
  "지정하신 모드에 정확히 맞춘 품격 있는 비즈니스 문장들을 조율하고 있습니다...",
  "메모리에서 전송 매체별 최적 시점과 실천적인 마음가짐 코칭을 다듬고 있습니다..."
];

export default function App() {
  const [selectedMode, setSelectedMode] = useState<ConversionMode>('거절');
  const [rawText, setRawText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PolishingResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 1. Initial Load History
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biz_polish_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('로컬스토리지 히스토리 로드 실패:', e);
    }
  }, []);

  // 2. Loading Step Cylcer
  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStepIdx(0);
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1800);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // 3. Form submission -> API invocation
  const handlePolish = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!rawText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/polish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: selectedMode,
          rawText: rawText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '윤문 처리 도중 예상하지 못한 문제가 발생했습니다.');
      }

      setResult(data);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        mode: selectedMode,
        rawText: rawText.trim(),
        result: data,
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('biz_polish_history', JSON.stringify(updatedHistory));

      // Scroll to result smoothly
      setTimeout(() => {
        const target = document.getElementById('result-section-anchor');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err: any) {
      console.error(err);
      setError(err.message || '네트워크 통신 오류 혹은 가용 모델이 만료되었습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Quick Sample selection
  const handleSelectTemplate = (text: string) => {
    setRawText(text);
    setError(null);
  };

  // 5. Clean / Reset
  const handleReset = () => {
    setRawText('');
    setResult(null);
    setError(null);
  };

  // 6. Toggle Favorite on History item
  const handleToggleFavorite = (id: string) => {
    const updated = history.map((item) => {
      if (item.id === id) {
        return { ...item, isFavorite: !item.isFavorite };
      }
      return item;
    });
    setHistory(updated);
    localStorage.setItem('biz_polish_history', JSON.stringify(updated));
  };

  // 7. Delete History item
  const handleDeleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem('biz_polish_history', JSON.stringify(updated));
  };

  // 8. Select from History to review
  const handleSelectHistory = (item: HistoryItem) => {
    setSelectedMode(item.mode);
    setRawText(item.rawText);
    setResult(item.result);
    setError(null);

    // Smooth scroll back to top editor
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans" id="app-root-container">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Elegant Minimal Executive Header */}
        <header className="text-center space-y-3" id="main-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-900 bg-white text-[11px] font-bold text-slate-900 uppercase tracking-widest shadow-2xs">
            <BrainCircuit className="h-3.5 w-3.5 text-slate-900" />
            <span>Executive Communication Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            비즈니스 소통 윤문 컨설턴트
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-slate-500 leading-relaxed font-normal">
            날것의 거칠고 무질서한 대화 초안을 임상심리학적 관점에서 해석하고 해독합니다.<br/>
            어휘의 마찰력을 혁신적으로 깎아내어, 기품과 우아함이 가득 담긴 공식 비즈니스 전문 문장군으로 조율하십시오.
          </p>
        </header>

        {/* Dashboard Grid Container */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="main-dashboard-grid">
          
          {/* LEFT SECTION: Standard Input Form Area (7 spans on desktop) */}
          <section className="lg:col-span-7 space-y-6" id="input-section">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              
              {/* Mode Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-slate-500" />
                    <span>소통 조율 모드 선택</span>
                  </label>
                  <span className="text-[11px] text-slate-400">네 가지 정렬 모드 제공</span>
                </div>
                <ModeSelector 
                  selectedMode={selectedMode} 
                  onSelectMode={(mode) => {
                    setSelectedMode(mode);
                    setError(null);
                  }} 
                />
              </div>

              {/* Dynamic Preset Templates */}
              <ExampleTemplates 
                currentMode={selectedMode} 
                onSelectTemplate={handleSelectTemplate} 
              />

              {/* Raw Draft Text Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="raw-text-input" className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>날것의 정제되지 않은 대화 초안 (원문)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {rawText.length > 0 && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-[11px] text-slate-400 hover:text-rose-600 transition flex items-center gap-0.5 cursor-pointer font-medium"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>비우기</span>
                      </button>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rawText.length}자 입력됨
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    id="raw-text-input"
                    rows={6}
                    value={rawText}
                    onChange={(e) => {
                      setRawText(e.target.value);
                      setError(null);
                    }}
                    placeholder={`상대방에게 공격적으로 하고 싶은 속마음이나 감정적인 표현을 날것 그대로 적어주세요.
(예: "일처리 어이가 없네. 당장 다시 기획해오세요.")`}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-slate-950 transition-all font-medium leading-relaxed"
                  />
                  {!rawText && (
                    <div className="absolute right-3.5 bottom-3.5 text-xs text-slate-300 pointer-events-none sm:block hidden">
                      최소 5자 이상 적어주십시오
                    </div>
                  )}
                </div>
              </div>

              {/* Error Overlay Message */}
              {error && (
                <div className="p-4 border border-rose-200 bg-rose-50/50 rounded-xl flex items-start gap-3" id="error-alert">
                  <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs text-rose-800 leading-normal">
                    <p className="font-bold">분석 보정 실패</p>
                    <p className="mt-1 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Translate Action Button */}
              <div>
                <button
                  type="button"
                  id="submit-polish-btn"
                  onClick={() => handlePolish()}
                  disabled={loading || !rawText.trim() || rawText.trim().length < 2}
                  className={`w-full text-white text-sm font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    loading 
                      ? 'bg-slate-700' 
                      : !rawText.trim() || rawText.trim().length < 2
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-slate-900 hover:bg-black shadow-xs hover:shadow-md'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
                      <span>분석 조율 진행 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse mr-0.5" />
                      <span>최고급 품격 변환 및 심리 리스크 진단 개시</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </section>

          {/* RIGHT SECTION: Dynamic Loaded Results Board (5 spans on desktop) */}
          <section className="lg:col-span-5 flex flex-col h-full" id="result-workspace-section">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex-1 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-slate-900" />
                    <span>실시간 품격 조율 대시보드</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">WORKSPACE</span>
                </div>

                {/* Case 1: Loading State */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-16 px-4 space-y-6 text-center animate-fade-in" id="workspace-loading">
                    {/* Spinning elegant orbit */}
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      <div className="absolute inset-0 border-3 border-slate-100 rounded-full" />
                      <div className="absolute inset-0 border-3 border-transparent border-t-slate-800 rounded-full animate-spin" />
                      <BrainCircuit className="h-6 w-6 text-slate-900 animate-pulse" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-900">임상 심리학적 윤문 가치 조율하는 중</h4>
                      <div className="h-10 flex items-center justify-center">
                        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs animate-pulse">
                          {LOADING_STEPS[loadingStepIdx]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 pt-4">
                      {LOADING_STEPS.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                            i === loadingStepIdx ? 'bg-slate-900 scale-125' : 'bg-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Case 2: Clean slate, no interactions yet */}
                {!loading && !result && (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4" id="workspace-empty">
                    <div className="p-3.5 bg-slate-50 rounded-full text-slate-400">
                      <BrainCircuit className="h-8 w-8" />
                    </div>
                    <div className="space-y-1.5 max-w-xs">
                      <h4 className="text-sm font-bold text-slate-800">분석 대기 중</h4>
                      <p className="text-xs text-slate-400 leading-normal">
                        왼쪽 영역에 거울 같은 솔직한 날것의 속마음을 한 자라도 좋으니 적어보세요. 조율 모드에 맞춰 즉시 고품격 화법으로 가공해 드립니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* Case 3: Result ready */}
                {!loading && result && (
                  <div className="space-y-6 animate-fade-in" id="result-section-anchor">
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                        <Check className="h-4 w-4 text-slate-900" />
                        <span>성공적으로 품격 윤문 분석을 도출했습니다.</span>
                      </div>
                    </div>
                    <ResultCard result={result} />
                  </div>
                )}
              </div>

              {/* Interactive Info Footer within Workspace Card */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Info className="h-3 w-3 inline" />
                  <span>실시간 클라이언트 상태 암호화 유지</span>
                </span>
                <span>Powered by Gemini 3.5</span>
              </div>

            </div>
          </section>

        </main>

        {/* Dynamic Persistent History Module */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6" id="archive-board">
          <HistoryList 
            items={history}
            onToggleFavorite={handleToggleFavorite}
            onDeleteItem={handleDeleteItem}
            onSelectHistory={handleSelectHistory}
          />
        </section>

      </div>
    </div>
  );
}
