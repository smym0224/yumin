export type ConversionMode = '거절' | '비즈니스' | '사과' | '피드백';

export interface PolishingResult {
  riskAnalysis: string;
  versionA: string;
  versionB: string;
  coachingTips: string;
}

export interface HistoryItem {
  id: string;
  mode: ConversionMode;
  rawText: string;
  result: PolishingResult;
  createdAt: string;
  isFavorite?: boolean;
}
