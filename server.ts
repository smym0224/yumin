import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Define API routing BEFORE Vite middleware
  app.post("/api/polish", async (req, res) => {
    try {
      const { mode, rawText } = req.body;

      if (!mode || !rawText || typeof rawText !== "string") {
        return res.status(400).json({ error: "올바른 모드와 원문 텍스트를 입력해주세요." });
      }

      // Check if GEMINI_API_KEY environment variable is defined
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY 환경변수가 정의되지 않았습니다. AI Studio Secrets 패널에서 키를 추가해주세요."
        });
      }

      // Lazy load/instantiate Gemini Client
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Formulate detailed system instructions
      const systemInstruction = `당신은 최고 수준의 기업 비즈니스 커뮤니케이션 컨설턴트이자 임상심리 전문가입니다.
사용자가 입력하는 날것의 무질서하고 감정적이며 정제되지 않은 대화 초안(원문)을 깊이 있게 해석하여, 지정된 소통 분위기 모드(거절, 비즈니스, 사과, 피드백)에 맞춰 가장 품격 있고 세련되며 비즈니스 목표를 100% 달성할 수 있는 세련된 구어/문장으로 번역(보정)하십시오.

[평가 및 작성 규칙]
1. riskAnalysis: 원문이 던져졌을 때 상대방이 느끼게 될 잠재적인 심리학적 거부감, 오해 요소 및 비즈니스적 손실 리스크를 1~2줄로 냉철하고 예리하게 분석하십시오.
2. versionA: 가장 격식 있는 비즈니스 예절과 완곡함을 극대화한 추천 보정문입니다. 상대방의 기분을 존중하면서 우리의 요구사항이나 의미는 한 치의 양보 없이 세련되게 전달해야 합니다. 한국어 존댓말(하십시오체 또는 해요체)을 사용하십시오.
3. versionB: 어감이나 핵심 구조의 뉘앙스를 바꾼 두 번째 보전문(대안)으로, 보다 상냥하고 부드러우면서도 목표 지향적인 어투를 띄어야 합니다. 한국어 존댓말(해요체를 위주로 부드럽게)을 사용하십시오.
4. coachingTips: 이 메시지를 발송하거나 관련 커뮤니케이션을 가질 때 실용적인 임상심리학적 행동 수칙, 적합한 타이밍(예: 즉시 전송 vs 한 템포 늦춤), 적합한 커뮤니케이션 매체 선정 등, 상황을 우호적으로 조율하기 위한 소통 가이드를 최대 3줄로 명확하게 제안하십시오.

반드시 존댓말을 정교하고 유려하게 구성하며, 본래의 소통 목표나 정보가 훼손되지 않도록 주의해야 합니다.`;

      const promptText = `모드: ${mode}\n원문: "${rawText}"\n\n위 원문을 해당 모드에 맞춰 분석하고 두 가지 격조 높은 대안 변환문군과 심리적 발송 가이드를 담아 엄격한 JSON 구조로 응답해주세요.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskAnalysis: {
                type: Type.STRING,
                description: "원문 분석 및 파생되는 오해 요인 서술 (최대 2줄)"
              },
              versionA: {
                type: Type.STRING,
                description: "가장 품격 있고 명확한 공식 비즈니스 변환문 A안"
              },
              versionB: {
                type: Type.STRING,
                description: "동일한 목적을 달성하되 어휘와 구조의 뉘앙스를 바꾼 차순위 대안 변환문 B안"
              },
              coachingTips: {
                type: Type.STRING,
                description: "메시지 발송 시 행동 수칙 및 전달 매너 (최대 3줄)"
              }
            },
            required: ["riskAnalysis", "versionA", "versionB", "coachingTips"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        return res.status(500).json({ error: "Gemini로부터 결과를 받지 못했습니다." });
      }

      const result = JSON.parse(responseText.trim());
      return res.json(result);
    } catch (error: any) {
      console.error("윤문 처리 중 오류 발생:", error);
      return res.status(500).json({
        error: "AI를 통한 윤문 분석 및 변환 중 예기치 못한 에러가 발생했습니다.",
        details: error.message
      });
    }
  });

  // Vite middle-ware setup for developer mode vs static assets for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
