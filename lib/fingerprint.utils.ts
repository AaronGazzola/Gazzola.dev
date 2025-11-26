"use client";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { getBrowserAPI } from "@/lib/env.utils";

let cachedFingerprint: string | null = null;

export async function getDeviceFingerprint(): Promise<string> {
  if (cachedFingerprint) {
    return cachedFingerprint;
  }

  const storage = getBrowserAPI(() => sessionStorage);
  const storedFingerprint = storage?.getItem("device_fingerprint");

  if (storedFingerprint) {
    cachedFingerprint = storedFingerprint;
    return storedFingerprint;
  }

  const fp = await FingerprintJS.load();
  const result = await fp.get();

  cachedFingerprint = result.visitorId;
  storage?.setItem("device_fingerprint", result.visitorId);

  return result.visitorId;
}
