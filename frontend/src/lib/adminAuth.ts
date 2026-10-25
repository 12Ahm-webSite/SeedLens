import fs from 'fs';
import path from 'path';

function getPinFilePath(): string {
  const possible = [
    path.join(process.cwd(), 'data/admin_pin.txt'),
    path.join(process.cwd(), 'frontend/data/admin_pin.txt'),
  ];
  for (const p of possible) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) return p;
  }
  const target = possible[0];
  const dir = path.dirname(target);
  if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return target;
}

// Convert Arabic-Indic numerals (٠-٩) and Eastern Arabic numerals to standard digits (0-9) and trim
export function normalizePin(input: unknown): string {
  if (!input) return '';
  const str = String(input).trim();
  return str
    .replace(/[٠۰]/g, '0')
    .replace(/[١۱]/g, '1')
    .replace(/[٢۲]/g, '2')
    .replace(/[٣۳]/g, '3')
    .replace(/[٤۴]/g, '4')
    .replace(/[٥۵]/g, '5')
    .replace(/[٦۶]/g, '6')
    .replace(/[٧۷]/g, '7')
    .replace(/[٨۸]/g, '8')
    .replace(/[٩۹]/g, '9');
}

export function getAdminPin(): string {
  const filePath = getPinFilePath();
  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      const pin = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf-8').trim();
      if (pin) return pin;
    }
  } catch (err) {
    console.error('Failed to read admin pin:', err);
  }
  return process.env.ADMIN_PIN || '1234';
}

export function setAdminPin(newPin: string): boolean {
  const normalized = normalizePin(newPin);
  if (!normalized || normalized.length < 3) return false;
  const filePath = getPinFilePath();
  try {
    fs.writeFileSync(filePath, normalized, 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to save admin pin:', err);
    return false;
  }
}

export function verifyAdminPin(candidatePin: unknown): boolean {
  const currentPin = getAdminPin();
  const normalizedCandidate = normalizePin(candidatePin);
  return Boolean(normalizedCandidate && normalizedCandidate === currentPin);
}
