"use client";

import { useState } from "react";
import { Severity, Condition } from "@/types/chat";
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  MapPin,
  Loader2,
} from "lucide-react";

const severityConfig = {
  ringan: {
    label: "Ringan",
    className: "text-brand-600 bg-brand-50 border-brand-200",
    icon: <CheckCircle size={13} />,
  },
  sedang: {
    label: "Perlu diperhatikan",
    className: "text-amber-600 bg-amber-50 border-amber-200",
    icon: <AlertCircle size={13} />,
  },
  berat: {
    label: "Segera ke dokter",
    className: "text-red-600 bg-red-50 border-red-200",
    icon: <AlertTriangle size={13} />,
  },
};

interface Props {
  conditions: Condition[];
  severity: Severity;
  advice: string;
  disclaimer: string;
}

export default function DiagnosisCard({
  conditions,
  severity,
  advice,
  disclaimer,
}: Props) {
  const cfg = severityConfig[severity];
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);

  const findNearbyClinic = () => {
    setLoading(true);
    setDenied(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const query = encodeURIComponent("klinik dokter rumah sakit terdekat");
        const url = `https://www.google.com/maps/search/${query}/@${latitude},${longitude},15z`;
        window.open(url, "_blank");
        setLoading(false);
      },
      () => {
        const url = `https://www.google.com/maps/search/klinik+dokter+terdekat`;
        window.open(url, "_blank");
        setLoading(false);
        setDenied(true);
      },
      { timeout: 8000 },
    );
  };

  return (
    <div className="space-y-2 w-full">
      {/* Severity */}
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.className}`}
      >
        {cfg.icon}
        {cfg.label}
      </span>

      {/* Conditions */}
      <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        {conditions.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-3 py-2.5 bg-[var(--color-surface)]"
          >
            <div>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {c.name}
              </p>
              <p className="text-xs font-mono text-[var(--color-muted)] mt-0.5">
                ICD {c.icd}
              </p>
            </div>
            <div className="text-right ml-4">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {c.match}%
              </span>
              <div className="w-14 h-1 bg-[var(--color-border)] rounded-full mt-1">
                <div
                  className="h-1 bg-brand-500 rounded-full"
                  style={{ width: `${c.match}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advice */}
      <p className="text-sm text-[var(--color-text)] px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {advice}
      </p>

      {/* Nearby clinic — hanya muncul saat berat */}
      {severity === "berat" && (
        <button
          onClick={findNearbyClinic}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Mencari lokasi...
            </>
          ) : (
            <>
              <MapPin size={14} /> Cari klinik / IGD terdekat
            </>
          )}
        </button>
      )}

      {denied && (
        <p className="text-xs text-[var(--color-muted)] text-center">
          Izin lokasi ditolak — hasil pencarian mungkin tidak akurat
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-[var(--color-muted)] px-1">⚕ {disclaimer}</p>
    </div>
  );
}
