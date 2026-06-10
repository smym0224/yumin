import { useState } from 'react';
import { HistoryItem, ConversionMode } from '../types';
import { Star, Trash2, Calendar, FileText, ChevronRight, Bookmark } from 'lucide-react';

interface HistoryListProps {
  items: HistoryItem[];
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onSelectHistory: (item: HistoryItem) => void;
}

export default function HistoryList({
  items,
  onToggleFavorite,
  onDeleteItem,
  onSelectHistory,
}: HistoryListProps) {
  const [filterMode, setFilterMode] = useState<ConversionMode | '전체'>('전체');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesMode = filterMode === '전체' || item.mode === filterMode;
    const matchesFavorite = !showOnlyFavorites || item.isFavorite;
    return matchesMode && matchesFavorite;
  });

  const getModeColorBadge = (mode: ConversionMode) => {
    switch (mode) {
      case '거절':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case '비즈니스':
        return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      case '사과':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      case '피드백':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-200';
    }
  };

  return (
    <div className="space-y-4" id="history-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Bookmark className="h-4 w-4 text-slate-500" />
            <span>최근 소통 윤문 아카이브</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">클라이언트 브라우저에 자동 누적 조율 저장된 메시지 히스토리</p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <select
            id="filter-mode-select"
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as any)}
            className="text-xs border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-950 cursor-pointer font-medium text-slate-700"
          >
            <option value="전체">모든 모드</option>
            <option value="거절">거절</option>
            <option value="비즈니스">비즈니스</option>
            <option value="사과">사과</option>
            <option value="피드백">피드백</option>
          </select>

          <button
            id="toggle-filter-favorites"
            type="button"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center gap-1 text-xs border rounded-lg px-2.5 py-1.5 font-medium transition cursor-pointer ${
              showOnlyFavorites
                ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Star className={`h-3 w-3 ${showOnlyFavorites ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>중요만</span>
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50" id="history-empty">
          <p className="text-xs text-slate-400 font-normal">아직 아카이브에 부합하는 분석 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="history-items-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              id={`history-item-${item.id}`}
              className="group relative border border-slate-100 bg-white rounded-xl p-4 shadow-3xs hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] uppercase font-bold border px-2 py-0.5 rounded-md ${getModeColorBadge(item.mode)}`}>
                      {item.mode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                      <Calendar className="h-3 w-3 inline" />
                      {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-amber-500 hover:bg-slate-50 transition cursor-pointer"
                      title="중유 중요문 지정/해제"
                    >
                      <Star className={`h-3.5 w-3.5 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-50 transition cursor-pointer"
                      title="아카이브 삭제"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">원문 초안</span>
                  <p className="text-xs text-slate-500 font-normal line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg italic">
                    "{item.rawText}"
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">A추천 변환문</span>
                  <p className="text-xs text-slate-800 font-semibold line-clamp-2 leading-relaxed">
                    "{item.result.versionA}"
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectHistory(item)}
                  className="text-[11px] text-slate-900 group-hover:text-black font-bold flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>이 교정문 워크스페이스에 즉시 적용</span>
                  <ChevronRight className="h-3 w-3 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
