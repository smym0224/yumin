import { ConversionMode } from '../types';

interface Template {
  mode: ConversionMode;
  title: string;
  text: string;
}

const templates: Template[] = [
  {
    mode: '거절',
    title: '제안 협상 단호한 거절',
    text: '이번 주신 제안서 단가가 터무니없이 안 맞습니다. 다른 업체 찾을 테니 더 조율 안 해주실 거면 연락 주지 마세요.'
  },
  {
    mode: '거절',
    title: '무리한 외주 스케줄 거부',
    text: '그 일정은 절대 불가능합니다. 무슨 사정이 있으신진 몰라도 한 달 걸릴 일을 사흘 만에 해오라는 건 갑질 아닌가요?'
  },
  {
    mode: '비즈니스',
    title: '강력한 계약 파기 압박',
    text: '이거 다음 주 화요일까지 해오세요. 만약 또 늦거나 퀄리티 개판이면 이번 계약은 없던 걸로 하고 소송 걸 겁니다.'
  },
  {
    mode: '비즈니스',
    title: '협력사 자료 요청 촉구',
    text: '자료 빨리 좀 보내주세요. 맨날 늦게 줘서 정작 저희 일 일정이 다 엄청 꼬였습니다. 밀리면 그쪽 책임입니다.'
  },
  {
    mode: '사과',
    title: '귀책사유 책임 회피성 사과',
    text: '죄송하긴 한데 제 잘못은 아니고 서버 회사 점검 때문에 터진 거예요. 어차시 복구됐으니 이쯤에서 넘어가시죠.'
  },
  {
    mode: '사과',
    title: '업무 누락 지연 변명 사과',
    text: '제가 요새 다른 업무도 너무 마비가 될 지경이라 확인 전화를 깜빡했네요. 바쁘면 그럴 수도 있는 거 아닌가 싶습니다.'
  },
  {
    mode: '피드백',
    title: '후배 사원 업무태도 지적',
    text: '일 처리가 맨날 왜 이 모양입니까? 신입사원이라도 이 정도 기획서 수준이면 돈 받고 일하면 안 되죠. 기본부터 다시 배우세요.'
  },
  {
    mode: '피드백',
    title: '개발자 코드 퀄리티 힐난',
    text: '코드가 이게 뭡니까? 버그 투성이에 설명 주석도 하나도 없고 진짜 성의 없이 대충 코딩해서 넘기신 티가 나네요.'
  }
];

interface ExampleTemplatesProps {
  currentMode: ConversionMode;
  onSelectTemplate: (text: string) => void;
}

export default function ExampleTemplates({ currentMode, onSelectTemplate }: ExampleTemplatesProps) {
  const filtered = templates.filter((t) => t.mode === currentMode);

  return (
    <div className="space-y-2" id="example-templates-container">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          💡 {currentMode} 모드 추천 날것의 문장 예제
        </span>
        <span className="text-[10px] text-slate-400 font-mono">클릭 시 자동 입력</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filtered.map((tpl, idx) => (
          <button
            key={idx}
            id={`template-btn-${idx}`}
            type="button"
            onClick={() => onSelectTemplate(tpl.text)}
            className="text-xs border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors max-w-full text-ellipsis overflow-hidden whitespace-nowrap"
            title={tpl.text}
          >
            {tpl.title}
          </button>
        ))}
      </div>
    </div>
  );
}
