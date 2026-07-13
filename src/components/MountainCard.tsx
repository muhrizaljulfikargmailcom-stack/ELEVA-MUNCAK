import React from "react";
import { Mountain } from "../types";
import { Mountain as MountainIcon, Compass, ThermometerSnowflake, ShieldAlert, ChevronRight } from "lucide-react";

interface MountainCardProps {
  key?: React.Key;
  mountain: Mountain;
  onConsult: (mountainName: string) => void;
  onRent: (mountainId: string) => void;
}

export default function MountainCard({ mountain, onConsult, onRent }: MountainCardProps) {
  const isHighTrek = mountain.difficulty === "Trek Dingin/Tinggi";
  const isMediumTrek = mountain.difficulty === "Trek Sedang";

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-emerald-500/10 hover:border-emerald-500/30 flex flex-col h-full">
      {/* Mountain Image and Badges */}
      <div className="relative h-48 overflow-hidden bg-stone-900">
        <img
          src={mountain.image}
          alt={mountain.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 font-mono">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ${
            isHighTrek 
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
              : isMediumTrek
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
          }`}>
            {mountain.difficulty}
          </span>
          <span className="bg-stone-950/80 text-slate-200 text-[10px] tracking-wider uppercase font-mono px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
            {mountain.height} MDPL
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-stone-950/90 text-slate-200 text-[11px] font-medium px-2 py-1 rounded-md border border-white/10 shadow-md flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${mountain.status.includes('Buka') ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`}></span>
            {mountain.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-xl font-black text-white mb-1 flex items-center gap-2">
            <MountainIcon className="w-5 h-5 text-emerald-400" />
            {mountain.name}
          </h3>
          <p className="text-[11px] text-slate-400 font-mono mb-3 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            {mountain.location} • {mountain.coordinates}
          </p>
          <p className="text-slate-300 text-xs leading-relaxed mb-4">
            {mountain.description}
          </p>

          {/* Safety Warning/Advisory based on trek category */}
          <div className={`p-3 rounded-xl border mb-5 ${
            isHighTrek 
              ? "bg-rose-500/10 border-rose-500/20 text-rose-200" 
              : isMediumTrek
                ? "bg-amber-500/10 border-amber-500/20 text-amber-200"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
          }`}>
            <div className="flex gap-2">
              {isHighTrek ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : isMediumTrek ? (
                <ThermometerSnowflake className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="text-[11px]">
                <strong className="block font-semibold mb-0.5">Rekomendasi Alat:</strong>
                {isHighTrek ? (
                  <span>Wajib Tenda anti-badai, Jaket Windproof/Thermal, Sepatu tracking kuat, Sleeping bag tebal, & Carrier 60L+.</span>
                ) : isMediumTrek ? (
                  <span>Tenda double layer, Nesting (panci masak), Senter kepala (headlamp), & Matras tambahan.</span>
                ) : (
                  <span>Tenda dome standar, Sleeping bag dacron biasa, Matras spons, & Kompor portable mini.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
          <button
            onClick={() => onConsult(mountain.name)}
            className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 py-2.5 px-3 rounded-lg border border-emerald-500/20 transition-all text-center"
          >
            Tanya CampaBot
          </button>
          <button
            onClick={() => onRent(mountain.id)}
            className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-0.5 shadow-md shadow-emerald-950/20"
          >
            Sewa Alat
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
