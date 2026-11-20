export const MAX_LOGO_DATA_URL_LENGTH = 190000;
const MAX_SOURCE_FILE_BYTES = 8 * 1024 * 1024;

export interface ProcessedLogoResult {
  dataUrl: string;
  width: number;
  height: number;
  byteSize: number;
}

const ALLOWED_URL_PATTERN =
  /^(https?:\/\/|\/|data:image\/(png|jpeg|jpg|webp|gif);base64,).+/i;

export function isValidLogoUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.length > 200000) return false;
  return ALLOWED_URL_PATTERN.test(trimmed);
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read this image file. Try PNG, JPG, WebP, or SVG."));
    };
    img.src = objectUrl;
  });
}

function renderScaledDataUrl(
  img: HTMLImageElement,
  maxDimension: number,
  quality: number
): { dataUrl: string; width: number; height: number } {
  const naturalW = img.naturalWidth || maxDimension;
  const naturalH = img.naturalHeight || maxDimension;
  const scale = Math.min(1, maxDimension / Math.max(naturalW, naturalH));
  const width = Math.max(1, Math.round(naturalW * scale));
  const height = Math.max(1, Math.round(naturalH * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Image processing is unavailable in this browser.");
  }

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, width, height);

  const webp = canvas.toDataURL("image/webp", quality);
  if (webp.startsWith("data:image/webp;base64,")) {
    return { dataUrl: webp, width, height };
  }
  const png = canvas.toDataURL("image/png");
  return { dataUrl: png, width, height };
}

async function processOptimizedImage(
  file: File,
  attempts: Array<{ maxDim: number; quality: number }>
): Promise<ProcessedLogoResult> {
  const lowerName = file.name.toLowerCase();
  const isImageMime = file.type.startsWith("image/");
  const isAllowedExt = /\.(png|jpe?g|webp|gif|svg)$/i.test(lowerName);
  if (!isImageMime && !isAllowedExt) {
    throw new Error("Please select an image file (PNG, JPG, WebP, GIF, or SVG).");
  }
  if (file.size > MAX_SOURCE_FILE_BYTES) {
    throw new Error("Image file must be 8 MB or smaller.");
  }

  const img = await loadImageFromFile(file);

  for (const { maxDim, quality } of attempts) {
    const rendered = renderScaledDataUrl(img, maxDim, quality);
    if (rendered.dataUrl.length <= MAX_LOGO_DATA_URL_LENGTH) {
      return {
        ...rendered,
        byteSize: Math.round((rendered.dataUrl.length * 3) / 4),
      };
    }
  }

  throw new Error(
    "This image stays too large after optimization. Try a smaller or simpler image."
  );
}

export async function processLogoFile(file: File): Promise<ProcessedLogoResult> {
  return processOptimizedImage(file, [
    { maxDim: 256, quality: 0.9 },
    { maxDim: 192, quality: 0.85 },
    { maxDim: 160, quality: 0.8 },
    { maxDim: 128, quality: 0.72 },
  ]);
}

export async function processDishImageFile(
  file: File
): Promise<ProcessedLogoResult> {
  return processOptimizedImage(file, [
    { maxDim: 720, quality: 0.84 },
    { maxDim: 560, quality: 0.8 },
    { maxDim: 440, quality: 0.76 },
    { maxDim: 320, quality: 0.7 },
  ]);
}
