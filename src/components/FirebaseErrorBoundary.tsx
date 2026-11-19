"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  isQuotaError: boolean;
}

export default class FirebaseErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      message: "",
      isQuotaError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const raw = error?.message || "Unexpected application error.";
    let friendly = raw;
    try {
      const parsed = JSON.parse(raw) as { error?: string; operationType?: string; path?: string };
      if (parsed && parsed.error) {
        friendly = `${parsed.error} (${parsed.operationType || "operation"} on ${parsed.path || "Firestore"})`;
      }
    } catch {
      // Non-JSON error message
    }
    const isQuotaError =
      raw.includes("Quota exceeded") ||
      raw.includes("Free daily read units");
    return {
      hasError: true,
      message: friendly,
      isQuotaError,
    };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[#090b0b] px-5 py-12 text-[#f5f5f1]">
          <div className="panel w-full max-w-lg p-7">
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#e5c991]">
              <AlertTriangle size={15} />
              <span>FIRESTORE SESSION NOTICE</span>
            </div>
            <h1 className="font-display mt-3 text-3xl font-semibold">
              {this.state.isQuotaError
                ? "Daily Firestore quota reached"
                : "Action could not be completed"}
            </h1>
            <p className="muted mt-3 break-words text-xs leading-6">
              {this.state.isQuotaError
                ? "The free-tier daily Firestore quota has been reached and resets tomorrow. You can upgrade your database tier in the Firebase Console."
                : this.state.message}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-full bg-[#c8a66a] px-5 py-2.5 text-xs font-semibold text-[#10110e]"
              >
                <RefreshCw size={14} /> Retry
              </button>
              <Link
                href="/"
                className="rounded-full border border-[#39413e] px-5 py-2.5 text-xs font-medium"
              >
                Return home
              </Link>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
