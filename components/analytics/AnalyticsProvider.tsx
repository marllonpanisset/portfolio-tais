"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useSyncExternalStore } from "react";

import { getStoredConsent, subscribe } from "./cookie-consent";

export function AnalyticsProvider() {
  const consent = useSyncExternalStore(subscribe, getStoredConsent, () => null);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!gaId || consent !== "accepted") {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
