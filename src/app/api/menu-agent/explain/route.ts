import { NextRequest, NextResponse } from "next/server";
import {
  ThinkingLevel,
  getGeminiServerClient,
  normalizeVoiceAgentVoice,
} from "@/lib/gemini";

interface ExplainRequestBody {
  dishName?: string;
  dishNameAr?: string;
  description?: string;
  descriptionAr?: string;
  categoryName?: string;
  price?: number;
  currency?: string;
  allergens?: string[];
  options?: Array<{ name?: string; values?: string[] }>;
  restaurantName?: string;
  restaurantNameAr?: string;
  question?: string;
  voiceName?: string;
}

function isTransientHighDemandError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return (
    message.includes("high demand") ||
    message.includes("UNAVAILABLE") ||
    message.includes("503")
  );
}

function getHttpStatusFromGeminiError(err: unknown): number {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("GEMINI_API_KEY") || isTransientHighDemandError(err)) {
    return 503;
  }
  if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429")) return 429;
  if (
    message.includes("PERMISSION_DENIED") ||
    message.includes("API_KEY_INVALID") ||
    message.includes("401") ||
    message.includes("403")
  ) {
    return 502;
  }
  return 500;
}

export async function POST(req: NextRequest) {
  let body: ExplainRequestBody;
  try {
    body = (await req.json()) as ExplainRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const dishName = (body.dishName || "").trim();
  const dishNameAr = (body.dishNameAr || "").trim();
  if (!dishName && !dishNameAr) {
    return NextResponse.json(
      { error: "Dish name is required." },
      { status: 400 }
    );
  }

  const voiceName = normalizeVoiceAgentVoice(body.voiceName);
  const question = (body.question || "").trim().slice(0, 300);

  const restaurantLabel =
    (body.restaurantNameAr || "").trim() ||
    (body.restaurantName || "").trim() ||
    "مطعمنا";
  const dishTitle = dishNameAr || dishName;
  const dishDesc =
    (body.descriptionAr || "").trim() || (body.description || "").trim();
  const allergensList = Array.isArray(body.allergens)
    ? body.allergens.filter(Boolean).slice(0, 10)
    : [];
  const optionSummaries = Array.isArray(body.options)
    ? body.options
        .slice(0, 6)
        .map((opt) =>
          opt?.name
            ? `${opt.name}: ${(opt.values || []).slice(0, 4).join("، ")}`
            : ""
        )
        .filter(Boolean)
    : [];

  const dishPrompt = [
    `المطعم: ${restaurantLabel}`,
    `التصنيف: ${(body.categoryName || "الأطباق").trim()}`,
    `اسم الطبق: ${dishTitle}${dishName && dishNameAr && dishName !== dishNameAr ? ` (${dishName})` : ""}`,
    dishDesc ? `وصف الطبق: ${dishDesc}` : "",
    typeof body.price === "number"
      ? `السعر: ${body.price} ${(body.currency || "SAR").trim()}`
      : "",
    allergensList.length > 0
      ? `مسببات الحساسية: ${allergensList.join("، ")}`
      : "لا توجد مسببات حساسية مسجلة.",
    optionSummaries.length > 0
      ? `الإضافات والخيارات المتاحة: ${optionSummaries.join(" | ")}`
      : "",
    question ? `سؤال الضيف: ${question}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const systemInstruction = [
    "أنت مضيف ومستشار ضيافة سعودي أصيل وودود في مطعم راقٍ.",
    "مهمتك تشرح كل طبق للضيف باللهجة السعودية الطبيعية الدافئة (مثل: يا هلا والله، حياكم الله، أبشر، محضّر على أصوله، طعمه خيالي، يذوب بالفم، على كيف كيفك).",
    "اكتب نصاً صوتياً جاهزاً للنطق مباشرة في ٣ إلى ٤ جمل قصيرة ومترابطة فقط.",
    "إذا سأل الضيف سؤالاً محدداً، جاوبه أولاً بوضوح ولطف باللهجة السعودية ثم أضف نبذة شهية عن الطبق.",
    "اشرح المكونات وطريقة التحضير والنكهات، واذكر مسببات الحساسية أو الخيارات المتوفرة إن وجدت بشكل طبيعي.",
    "ممنوع تماماً استخدام الرموز التعبيرية الإيموجي، أو النقاط والتنسيقات مثل النجمات والشرطات، أو الأحرف الإنجليزية أو أي لغة غير العربية حتى يمكن قراءته صوتياً بسلاسة.",
    "اكتب الأرقام أو العملات بالعربية إذا احتجتها (مثل ريال أو ريال سعودي).",
  ].join(" ");

  try {
    const ai = getGeminiServerClient();

    // 1) Generate authentic Saudi dialect culinary explanation (fallback to gemini-3.1-flash-lite on transient 503)
    let textResponse;
    try {
      textResponse = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: dishPrompt,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });
    } catch (textErr) {
      if (!isTransientHighDemandError(textErr)) {
        throw textErr;
      }
      textResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: dishPrompt,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });
    }

    const scriptAr = (textResponse.text || "")
      .replace(/[*#_`~>\[\]]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!scriptAr) {
      return NextResponse.json(
        { error: "Gemini returned an empty Saudi explanation script." },
        { status: 502 }
      );
    }

    // 2) Synthesize natural Saudi Arabic speech WAV via Gemini TTS (single retry on transient 503)
    const ttsParams = {
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: scriptAr,
              speechMetadata: {
                style:
                  "Warm, welcoming Saudi Arabian hospitality host speaking naturally in authentic Saudi Arabic dialect with clear pronunciation and appetizing warmth.",
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName,
            },
          },
        },
      },
    };

    let ttsResponse;
    try {
      ttsResponse = await ai.models.generateContent(ttsParams);
    } catch (ttsErr) {
      if (!isTransientHighDemandError(ttsErr)) {
        throw ttsErr;
      }
      await new Promise((resolve) => setTimeout(resolve, 600));
      ttsResponse = await ai.models.generateContent(ttsParams);
    }

    const audioPart = ttsResponse.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData?.data
    );
    const audioBase64 = audioPart?.inlineData?.data;
    const mimeType = audioPart?.inlineData?.mimeType || "audio/wav";

    if (!audioBase64) {
      return NextResponse.json(
        {
          error:
            "Gemini TTS did not return audio bytes for this dish explanation.",
          scriptAr,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      scriptAr,
      audioBase64,
      mimeType,
      voiceName,
    });
  } catch (err) {
    let message =
      err instanceof Error ? err.message : "Failed to generate voice response.";
    try {
      const parsed = JSON.parse(message) as {
        error?: { message?: string };
      };
      if (parsed?.error?.message) {
        message = parsed.error.message;
      }
    } catch {
      // Keep original error message string
    }
    return NextResponse.json(
      { error: message },
      { status: getHttpStatusFromGeminiError(err) }
    );
  }
}
