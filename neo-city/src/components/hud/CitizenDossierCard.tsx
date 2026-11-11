import React from 'react';
import { useCityStore } from '../../store/useCityStore';
import {
  User,
  Heart,
  Smile,
  Briefcase,
  Home,
  Navigation,
  X,
  Compass,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const CitizenDossierCard: React.FC = () => {
  const selectedCitizenId = useCityStore((state) => state.stats.selectedCitizenId);
  const selectCitizen = useCityStore((state) => state.selectCitizen);
  const simulatedCitizens = useCityStore((state) => state.stats.simulatedCitizens) || [];
  const buildings = useCityStore((state) => state.buildings);
  const flyToCamera = useCityStore((state) => state.flyToCamera);

  if (!selectedCitizenId) return null;

  const citizen = simulatedCitizens.find((c) => c.id === selectedCitizenId);
  if (!citizen) return null;

  const homeBuilding = buildings.find((b) => b.id === citizen.homeBuildingId);
  const workBuilding = citizen.workBuildingId ? buildings.find((b) => b.id === citizen.workBuildingId) : null;

  const formatActivity = (act: string) => {
    switch (act) {
      case 'commuting_to_work':
        return 'Morning Commute to Workplace';
      case 'working':
        return 'Active on Workplace Duty';
      case 'dining_and_retail':
        return 'Lunch, Dining & Retail Stroll';
      case 'visiting_park':
        return 'Civic Park & Biosphere Recreation';
      case 'commuting_home':
        return 'Evening Transit to Residence';
      case 'nightlife_entertainment':
        return 'Nightlife & Cultural Pavilion';
      case 'resting_at_home':
        return 'Resting at Private Arcology';
      case 'seeking_medical_care':
        return 'En Route to Medical Center';
      default:
        return 'Strolling Metropolis Promenade';
    }
  };

  const locateHome = () => {
    if (homeBuilding) {
      flyToCamera(
        [homeBuilding.position[0] + 16, Math.max(12, homeBuilding.height + 6), homeBuilding.position[2] + 18],
        [homeBuilding.position[0], homeBuilding.height * 0.4, homeBuilding.position[2]]
      );
    }
  };

  const locateWork = () => {
    if (workBuilding) {
      flyToCamera(
        [workBuilding.position[0] + 16, Math.max(12, workBuilding.height + 6), workBuilding.position[2] + 18],
        [workBuilding.position[0], workBuilding.height * 0.4, workBuilding.position[2]]
      );
    }
  };

  const locateCitizen = () => {
    flyToCamera(
      [citizen.targetPos[0] + 8, 6, citizen.targetPos[2] + 10],
      [citizen.targetPos[0], 0.5, citizen.targetPos[2]]
    );
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 w-84 md:w-96 orbital-surface-elevated rounded-2xl border border-[#00f0ff]/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(0,240,255,0.2)] overflow-hidden font-mono select-none pointer-events-auto backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* DOSSIER HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#080d16] border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              CITIZEN TELEMETRY DOSSIER
            </span>
            <span className="text-white font-['Chakra_Petch'] font-black text-sm tracking-wide">
              {citizen.name}
            </span>
          </div>
        </div>

        <button
          onClick={() => selectCitizen(null)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* DOSSIER CONTENT */}
      <div className="p-4 flex flex-col gap-3 text-xs">
        {/* BIO & IDENTIFICATION */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-sm shadow-inner"
              style={{
                backgroundColor: citizen.suitColor + '22',
                borderColor: citizen.suitColor,
                color: citizen.suitColor,
              }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-bold block">{citizen.occupation}</span>
              <span className="text-[10px] text-slate-400">
                Age {citizen.age} • Gender: {citizen.gender} • ID: {citizen.id}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] uppercase text-cyan-300 font-bold block flex items-center gap-1 justify-end">
              <GraduationCap className="w-3 h-3" /> {citizen.education.replace('_', ' ')}
            </span>
            <span className="text-[9px] text-slate-400">Tier Credential</span>
          </div>
        </div>

        {/* CURRENT ACTIVITY */}
        <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex flex-col gap-1">
          <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> LIVE ROUTINE ACTIVITY
          </span>
          <span className="text-white font-bold text-[11px]">{formatActivity(citizen.activity)}</span>
          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-cyan-500/10">
            <span>Destination: {citizen.destinationName || 'Local Plaza'}</span>
            <button
              onClick={locateCitizen}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Navigation className="w-3 h-3" /> TRACK
            </button>
          </div>
        </div>

        {/* HEALTH & HAPPINESS GAUGES */}
        <div className="grid grid-cols-2 gap-2">
          {/* Health */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" /> Vitality
              </span>
              <strong className="text-rose-400">{citizen.health}%</strong>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{ width: `${citizen.health}%` }}
              />
            </div>
          </div>

          {/* Happiness */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Smile className="w-3 h-3 text-amber-400" /> Morale
              </span>
              <strong className="text-amber-400">{citizen.happiness}%</strong>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all"
                style={{ width: `${citizen.happiness}%` }}
              />
            </div>
          </div>
        </div>

        {/* HOME & WORK LOCATION CARDS */}
        <div className="flex flex-col gap-2">
          {/* Home */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Home Residence</span>
                <span className="text-white font-bold text-[11px] truncate max-w-[170px] block">
                  {citizen.homeBuildingName}
                </span>
              </div>
            </div>
            <button
              onClick={locateHome}
              className="px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[10px] cursor-pointer"
            >
              FLY TO
            </button>
          </div>

          {/* Work */}
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Workplace Facility</span>
                <span className="text-white font-bold text-[11px] truncate max-w-[170px] block">
                  {citizen.workBuildingName}
                </span>
              </div>
            </div>
            {workBuilding ? (
              <button
                onClick={locateWork}
                className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] cursor-pointer"
              >
                FLY TO
              </button>
            ) : (
              <span className="text-[10px] text-slate-500">None</span>
            )}
          </div>
        </div>

        {/* COMMUTE MODE FOOTER */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
          <span>Preferred Transit:</span>
          <span className="font-bold text-cyan-300 capitalize flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {citizen.commuteMode.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};
