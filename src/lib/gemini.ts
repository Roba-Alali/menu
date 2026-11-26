import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { VoiceAgentVoice } from "./types";

export const VALID_VOICE_AGENT_VOICES: VoiceAgentVoice[] = [
  "Kore",
  "Charon",
  "Puck",
  "Fenrir",
  "Zephyr",
];

export const VOICE_AGENT_VOICE_LABELS: Record<
  VoiceAgentVoice,
  { label: string; labelAr: string; tone: string }
> = {
  Kore: {
    label: "Kore · Warm Hostess",
    labelAr: "كوري · صوت نسائي ترحيبي دافئ",
    tone: "Warm & welcoming female Saudi hospitality host",
  },
  Charon: {
    label: "Charon · Deep Chef",
    labelAr: "كارون · صوت رجالي رزين وعميق",
    tone: "Deep, refined Saudi head-chef presence",
  },
  Puck: {
    label: "Puck · Lively Host",
    labelAr: "باك · صوت شبابي حيوي وودود",
    tone: "Energetic, friendly Saudi dining host",
  },
  Fenrir: {
    label: "Fenrir · Expressive Chef",
    labelAr: "فنرير · صوت رجالي واثق وحماسي",
    tone: "Bold, enthusiastic Saudi culinary storyteller",
  },
  Zephyr: {
    label: "Zephyr · Calm Concierge",
    labelAr: "زيفير · صوت هادئ وراقٍ",
    tone: "Calm, refined fine-dining concierge",
  },
};

export function normalizeVoiceAgentVoice(input?: string | null): VoiceAgentVoice {
  if (input && (VALID_VOICE_AGENT_VOICES as string[]).includes(input)) {
    return input as VoiceAgentVoice;
  }
  return "Kore";
}

export function getGeminiServerClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(
      "GEMINI_API_KEY is not configured on the server environment."
    );
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export { ThinkingLevel };
