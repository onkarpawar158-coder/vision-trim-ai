export const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"] as const;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const DAILY_LIMIT = 5;

export const ERROR_MESSAGES = {
  UNSUPPORTED_FORMAT:
    "This file format isn't supported. Please upload PNG, JPG, JPEG, or WEBP.",
  TOO_LARGE: "This image is too large. Maximum file size is 5 MB.",
  NO_FILE: "Please select an image first.",
} as const;

export function validateImageFile(file: File | null | undefined): string | null {
  if (!file) return ERROR_MESSAGES.NO_FILE;
  if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type.toLowerCase())) {
    return ERROR_MESSAGES.UNSUPPORTED_FORMAT;
  }
  if (file.size > MAX_FILE_SIZE) return ERROR_MESSAGES.TOO_LARGE;
  if (file.size === 0) return ERROR_MESSAGES.NO_FILE;
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
