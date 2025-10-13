export const oklchToHex = (oklch: string): string => {
  const match = oklch.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/);
  if (!match) return "#000000";

  const [, lStr, cStr, hStr] = match;
  const L = parseFloat(lStr);
  const C = parseFloat(cStr);
  const H = parseFloat(hStr);

  const aLab = C * Math.cos((H * Math.PI) / 180);
  const bLab = C * Math.sin((H * Math.PI) / 180);

  const fy = (L + 0.16) / 1.16;
  const fx = aLab / 5.0 + fy;
  const fz = fy - bLab / 2.0;

  const xr = fx ** 3 > 0.008856 ? fx ** 3 : (fx - 16 / 116) / 7.787;
  const yr = L > 0.08 ? ((L + 0.16) / 1.16) ** 3 : L / 9.033;
  const zr = fz ** 3 > 0.008856 ? fz ** 3 : (fz - 16 / 116) / 7.787;

  const X = xr * 95.047;
  const Y = yr * 100.0;
  const Z = zr * 108.883;

  let R = X * 0.032406 + Y * -0.015372 + Z * -0.004986;
  let G = X * -0.009689 + Y * 0.018758 + Z * 0.000415;
  let B = X * 0.000557 + Y * -0.00204 + Z * 0.01057;

  R = R > 0.0031308 ? 1.055 * R ** (1 / 2.4) - 0.055 : 12.92 * R;
  G = G > 0.0031308 ? 1.055 * G ** (1 / 2.4) - 0.055 : 12.92 * G;
  B = B > 0.0031308 ? 1.055 * B ** (1 / 2.4) - 0.055 : 12.92 * B;

  const r = Math.max(0, Math.min(255, Math.round(R * 255)));
  const g = Math.max(0, Math.min(255, Math.round(G * 255)));
  const b = Math.max(0, Math.min(255, Math.round(B * 255)));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};
