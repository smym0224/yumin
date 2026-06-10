import React from 'react';
import { ConversionMode } from '../types';
import { Ban, Briefcase, HeartHandshake, MessageSquareText } from 'lucide-react';

interface ModeSelectorProps {
  selectedMode: ConversionMode;
  onSelectMode: (mode: ConversionMode) => void;
}

interface ModeDetail {
  id: ConversionMode;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  themeClass: string;
  badgeClass: string;
}

const modeDetails: ModeDetail[] = [
  {
    id: '거절',
    label: '우아한 거절 (Refusal)',
    description: '관계는 부드럽게 지키면서도 입장은 명확하고 명분 있게 정중한 거절',
    icon: Ban,
    themeClass: 'border-amber-200 bg-amber-50/40 hover:border-amber-400 text-amber-900',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: '비즈니스',
    label: '세련된 협상 (Business)',
    description: '격식 있고 전문성 넘치는 설득력으로 비즈니스 실리와 요구사항 관철',
    icon: Briefcase,
    themeClass: 'border-indigo-200 bg-indigo-50/40 hover:border-indigo-400 text-indigo-900',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    id: '사과',
    label: '회복의 사과 (Apology)',
    description: '변명은 배제하면서 책임감을 표현해 훼손된 파트너십과 신뢰를 회복',
    icon: HeartHandshake,
    themeClass: 'border-rose-200 bg-rose-50/40 hover:border-rose-400 text-rose-900',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: '피드백',
    label: '동기부여 피드백 (Feedback)',
    description: '상대방의 자존감을 다치지 않으면서 구체적인 행동 개선을 지향',
    icon: MessageSquareText,
    themeClass: 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400 text-emerald-900',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
];

export default function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="mode-selector-container">
      {modeDetails.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;

        return (
          <button
            key={mode.id}
            id={`mode-btn-${mode.id}`}
            type="button"
            onClick={() => onSelectMode(mode.id)}
            className={`flex items-start text-left p-4 rounded-xl border transition-all duration-200 ease-out cursor-pointer ${
              isSelected
                ? 'border-slate-800 bg-white ring-2 ring-slate-800 ring-offset-2 shadow-sm scale-[1.01]'
                : 'border-slate-100 bg-white shadow-xs hover:shadow-sm hover:translate-y-[-1px]'
            }`}
          >
            <div
              className={`p-2.5 rounded-lg mr-3.5 flex-shrink-0 border ${
                isSelected ? 'bg-slate-900 text-white border-slate-950' : mode.badgeClass
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-slate-900 tracking-tight">{mode.label}</span>
                {isSelected && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    선택됨
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{mode.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
