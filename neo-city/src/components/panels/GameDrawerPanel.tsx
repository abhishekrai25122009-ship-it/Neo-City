import React, { useState } from 'react';
import { useCityStore } from '../../store/useCityStore';
import type { ResearchCategory, MissionCategory, ShadowQuality, CorridorTrafficData } from '../../types/city';
import {
  X,
  Hammer,
  MapPin,
  Zap,
  TrendingUp,
  Users,
  Leaf,
  Bell,
  Sliders,
  Droplets,
  RotateCcw,
  FlaskConical,
  Target,
  Navigation,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  Footprints,
  Activity,
  Gauge,
  Castle,
  Cpu,
  Wrench,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';
import { DISTRICT_TIER_DESCRIPTIONS } from '../../data/districtEvolutionData';

export const GameDrawerPanel: React.FC = () => {
  const activeDrawer = useCityStore((state) => state.activeDrawer);
  const closeDrawer = useCityStore((state) => state.closeDrawer);
  const stats = useCityStore((state) => state.stats);
  const blueprints = useCityStore((state) => state.blueprints);
  const treasury = useCityStore((state) => state.stats.treasury);
  const startPlacement = useCityStore((state) => state.startPlacement);
  const flyToDistrict = useCityStore((state) => state.flyToDistrict);
  const events = useCityStore((state) => state.events);
  const taxRate = useCityStore((state) => state.taxRate);
  const setTaxRate = useCityStore((state) => state.setTaxRate);
  const budgetAllocations = useCityStore((state) => state.budgetAllocations);
  const setBudgetAllocation = useCityStore((state) => state.setBudgetAllocation);
  const gridVisible = useCityStore((state) => state.gridVisible);
  const toggleGrid = useCityStore((state) => state.toggleGrid);
  const trafficVisible = useCityStore((state) => state.trafficVisible);
  const toggleTraffic = useCityStore((state) => state.toggleTraffic);
  const autoRotate = useCityStore((state) => state.autoRotate);
  const toggleAutoRotate = useCityStore((state) => state.toggleAutoRotate);
  const resetCivilization = useCityStore((state) => state.resetCivilization);

  // Milestone 03: Research & Missions store hooks
  const techTree = useCityStore((state) => state.techTree);
  const unlockTech = useCityStore((state) => state.unlockTech);
  const missions = useCityStore((state) => state.missions);
  const claimMissionReward = useCityStore((state) => state.claimMissionReward);

  // Feature 6: Graphics Settings hooks
  const graphics = useCityStore((state) => state.graphics);
  const setGraphicsPreset = useCityStore((state) => state.setGraphicsPreset);
  const updateGraphicsSettings = useCityStore((state) => state.updateGraphicsSettings);
  const togglePerfMonitor = useCityStore((state) => state.togglePerfMonitor);

  const districtPolicies = useCityStore((state) => state.districtPolicies);
  const toggleDistrictPolicy = useCityStore((state) => state.toggleDistrictPolicy);
  const buildings = useCityStore((state) => state.buildings);

  // NEO CITY 6.0 Mega-Projects, Living Economy & Autonomous AI hooks
  const megaProjects = useCityStore((state) => state.megaProjects);
  const contributeMegaProjectStage = useCityStore((state) => state.contributeMegaProjectStage);
  const flyToCamera = useCityStore((state) => state.flyToCamera);
  const buyResource = useCityStore((state) => state.buyResource);
  const sellResource = useCityStore((state) => state.sellResource);
  const applyAIRecommendation = useCityStore((state) => state.applyAIRecommendation);
  const toggleAutoMaintenance = useCityStore((state) => state.toggleAutoMaintenance);
  const performEmergencyMaintenance = useCityStore((state) => state.performEmergencyMaintenance);

  // NEO CITY 9.0 Living Megacity hooks
  const selectCitizen = useCityStore((state) => state.selectCitizen);
  const setTradePolicy = useCityStore((state) => state.setTradePolicy);

  const [constructCategory, setConstructCategory] = useState<string>('all');
  const [researchCategory, setResearchCategory] = useState<ResearchCategory | 'all'>('all');
  const [missionFilter, setMissionFilter] = useState<MissionCategory | 'all'>('all');
  const [districtViewMode, setDistrictViewMode] = useState<'sectors' | 'policies'>('sectors');
  const [citizenSearch, setCitizenSearch] = useState<string>('');
  const [economySubTab, setEconomySubTab] = useState<'market' | 'trade_policies' | 'industry'>('market');

  if (!activeDrawer) return null;

  const categories = [
    { id: 'all', label: 'All Structures' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial & Spires' },
    { id: 'tech', label: 'Tech & AI' },
    { id: 'energy', label: 'Clean Energy' },
    { id: 'eco', label: 'Eco & Landmarks' },
  ];

  const filteredBlueprints = blueprints.filter((b) =>
    constructCategory === 'all' ? true : b.category === constructCategory
  );

  const researchCategories: { id: ResearchCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Fields' },
    { id: 'clean_energy', label: 'Clean Energy' },
    { id: 'ai', label: 'AI & Data' },
    { id: 'advanced_arch', label: 'Architecture' },
    { id: 'transportation', label: 'Transit' },
    { id: 'biotech', label: 'Biotech' },
    { id: 'environmental', label: 'Environmental' },
  ];

  const filteredTech = techTree.filter((t) =>
    researchCategory === 'all' ? true : t.category === researchCategory
  );

  const filteredMissions = missions.filter((m) =>
    missionFilter === 'all' ? true : m.category === missionFilter
  );

  const districts = [
    { id: 'Overview', name: 'Civilization Overview', desc: 'Full aerial view of all metropolitan sectors' },
    { id: 'Downtown', name: 'Financial Downtown Core', desc: 'Soaring glass spires, white monoliths & trading exchanges' },
    { id: 'Residential', name: 'Residential Gardens', desc: 'Stepped bio-ziggurats & colourful modular housing' },
    { id: 'Innovation', name: 'Tech & AI Innovation District', desc: 'Quantum Foundries, robotics works & cryogenic relays' },
    { id: 'Energy', name: 'Clean Energy Haven', desc: 'Tokamak fusion reactor, solar arrays & desalination plants' },
    { id: 'Botanical', name: 'Botanical Sanctuaries', desc: 'Grand Eden Bio-Dome complex & crystalline flora gardens' },
    { id: 'Waterfront', name: 'Celestial Waterfront', desc: 'The Celestial Needle landmark & twin suspension bridges' },
    { id: 'StreetLevel', name: 'Street-Level Inspection', desc: 'Pedestrian perspective along urban avenues' },
  ];

  return (
    <div className="fixed left-4 top-20 bottom-24 z-40 w-96 md:w-112 orbital-surface-elevated rounded-2xl flex flex-col pointer-events-auto border border-[#ff5500]/40 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(255,85,0,0.15)] overflow-hidden font-mono select-none">
      {/* DRAWER HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#080a0f]">
        <div className="flex items-center gap-2">
          {activeDrawer === 'construction' && <Hammer className="w-4 h-4 text-[#ff5500]" />}
          {activeDrawer === 'megaprojects' && <Castle className="w-4 h-4 text-[#ff8533]" />}
          {activeDrawer === 'ai_director' && <Cpu className="w-4 h-4 text-[#ffaa00]" />}
          {activeDrawer === 'research' && <FlaskConical className="w-4 h-4 text-[#ff5500]" />}
          {activeDrawer === 'missions' && <Target className="w-4 h-4 text-[#ff8533]" />}
          {activeDrawer === 'transit' && <Navigation className="w-4 h-4 text-[#00e676]" />}
          {activeDrawer === 'districts' && <MapPin className="w-4 h-4 text-[#ffaa00]" />}
          {activeDrawer === 'energy_grid' && <Zap className="w-4 h-4 text-[#ffaa00]" />}
          {activeDrawer === 'economy' && <TrendingUp className="w-4 h-4 text-[#ff5500]" />}
          {activeDrawer === 'demographics' && <Users className="w-4 h-4 text-[#ede5d8]" />}
          {activeDrawer === 'environment' && <Leaf className="w-4 h-4 text-[#00e676]" />}
          {activeDrawer === 'chronicle' && <Bell className="w-4 h-4 text-[#ff8533]" />}
          {activeDrawer === 'settings' && <Sliders className="w-4 h-4 text-[#64748b]" />}

          <span className="font-['Chakra_Petch'] font-black text-sm tracking-wide uppercase text-[#fcfaf6]">
            {activeDrawer === 'construction' && 'ZONING & CONSTRUCTION CAD'}
            {activeDrawer === 'megaprojects' && 'MEGA-PROJECTS CAD'}
            {activeDrawer === 'ai_director' && 'AUTONOMOUS CITY AI DIRECTOR'}
            {activeDrawer === 'research' && 'SCIENTIFIC RESEARCH TREE'}
            {activeDrawer === 'missions' && 'CIVIC DIRECTIVES & MILESTONES'}
            {activeDrawer === 'transit' && 'ADVANCED TRANSPORTATION GRID'}
            {activeDrawer === 'districts' && 'DISTRICTS & EVOLUTION'}
            {activeDrawer === 'energy_grid' && 'ENERGY & WATER GRID'}
            {activeDrawer === 'economy' && 'LIVING ECONOMY & MARKET'}
            {activeDrawer === 'demographics' && 'CITIZEN LIFE & DEMOGRAPHICS'}
            {activeDrawer === 'environment' && 'BIOSPHERE & AIR QUALITY'}
            {activeDrawer === 'chronicle' && 'CIVIC CHRONICLE LOG'}
            {activeDrawer === 'settings' && 'SIMULATION CONFIGURATION'}
          </span>
        </div>

        <button
          onClick={closeDrawer}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* DRAWER SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-xs">
        {/* ====================================================
            NEO CITY 6.0: MEGA-PROJECTS CAD
            ==================================================== */}
        {activeDrawer === 'megaprojects' && (
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-300 uppercase tracking-wider block">
                  CIVILIZATION MEGASTRUCTURES
                </span>
                <span className="font-['Chakra_Petch'] text-sm font-bold text-white">
                  STAGED CONSTRUCTION SYSTEM
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-300 uppercase tracking-wider block">TREASURY</span>
                <span className="font-['Chakra_Petch'] text-sm font-bold text-amber-300">
                  ₡{(stats.treasury / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {megaProjects.map((mp) => {
                const nextStageNum = mp.currentStage + 1;
                const nextStage = mp.stages.find((s) => s.stageNumber === nextStageNum);
                const isMax = mp.currentStage >= 3;

                return (
                  <div
                    key={mp.id}
                    className={`p-3.5 rounded-xl border flex flex-col gap-2.5 transition-all ${
                      isMax
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                        : mp.currentStage > 0
                        ? 'bg-slate-900/80 border-cyan-500/40'
                        : 'bg-slate-900/60 border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-mono tracking-widest text-amber-400 font-bold block uppercase">
                          {mp.codenamed}
                        </span>
                        <h3 className="font-['Chakra_Petch'] font-bold text-base text-white">{mp.name}</h3>
                      </div>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold border ${
                          isMax
                            ? 'bg-amber-500/30 text-amber-300 border-amber-400'
                            : mp.currentStage > 0
                            ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400'
                            : 'bg-slate-800 text-slate-400 border-white/10'
                        }`}
                      >
                        STAGE {mp.currentStage}/3 {isMax ? 'COMPLETED' : ''}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{mp.description}</p>

                    {/* Stage Progress Tracker */}
                    <div className="grid grid-cols-3 gap-1.5 py-1">
                      {mp.stages.map((st) => (
                        <div
                          key={st.stageNumber}
                          className={`p-1.5 rounded-lg border text-center text-[10px] ${
                            st.stageNumber <= mp.currentStage
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-slate-950/50 border-white/5 text-slate-500'
                          }`}
                        >
                          <span className="block font-mono">STAGE {st.stageNumber}</span>
                          <span className="text-[9px] truncate block opacity-80">{st.name.split(':')[1] || st.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Active Perks List */}
                    <div className="space-y-1 bg-slate-950/60 p-2 rounded-lg border border-white/5 text-[10px]">
                      <span className="text-slate-400 uppercase font-bold block">CIVILIZATION BONUSES:</span>
                      {mp.bonusesDescription.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-cyan-300">
                          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          flyToCamera(
                            [mp.location[0] + 25, 30, mp.location[2] + 25],
                            [mp.location[0], 10, mp.location[2]]
                          );
                          closeDrawer();
                        }}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <span>INSPECT 3D SITE</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>

                      {!isMax && nextStage && (
                        <button
                          onClick={() => contributeMegaProjectStage(mp.id)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-[11px] cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                        >
                          <span>ADVANCE STAGE {nextStageNum}</span>
                          <span className="text-[9px] opacity-80 font-mono">
                            (₡{(nextStage.costCredits / 1000).toFixed(0)}k | {nextStage.costMaterials} Mat)
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================
            NEO CITY 6.0: AUTONOMOUS CITY AI DIRECTOR
            ==================================================== */}
        {activeDrawer === 'ai_director' && (
          <div className="flex flex-col gap-3">
            {/* AI Director Status Banner */}
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                    NEURAL DIRECTOR MATRIX
                  </span>
                  <span className="font-['Chakra_Petch'] text-sm font-bold text-white uppercase">
                    STATUS: {stats.aiDirector?.threatLevel || 'NOMINAL'}
                  </span>
                </div>
              </div>

              <button
                onClick={toggleAutoMaintenance}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  stats.aiDirector?.autoMaintenanceActive
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-800 border-white/10 text-slate-400'
                }`}
              >
                AUTO-REPAIR: {stats.aiDirector?.autoMaintenanceActive ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {/* Infrastructure Wear Gauge */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-cyan-400" /> INFRASTRUCTURE WEAR INDEX
                </span>
                <span
                  className={`font-bold font-mono ${
                    (stats.aiDirector?.infrastructureWear || 0) > 70
                      ? 'text-rose-400'
                      : (stats.aiDirector?.infrastructureWear || 0) > 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {stats.aiDirector?.infrastructureWear || 22}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    (stats.aiDirector?.infrastructureWear || 0) > 70
                      ? 'bg-rose-500'
                      : (stats.aiDirector?.infrastructureWear || 0) > 40
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${stats.aiDirector?.infrastructureWear || 22}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">
                  {stats.aiDirector?.lastAutonomousAction}
                </span>
                <button
                  onClick={performEmergencyMaintenance}
                  className="px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-[10px] font-bold cursor-pointer shrink-0 ml-2"
                >
                  OVERHAUL (-40% Wear)
                </button>
              </div>
            </div>

            {/* AI Recommendations List */}
            <div className="space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                PRIORITIZED CONTEXTUAL RECOMMENDATIONS
              </span>

              {stats.aiDirector?.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-slate-900/70 border border-white/10 hover:border-indigo-400/40 transition-all flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-xs">{rec.title}</span>
                    <span
                      className={`text-[8px] font-mono px-1.5 py-0.2 rounded uppercase font-bold ${
                        rec.priority === 'critical'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : rec.priority === 'high'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-tight">{rec.description}</p>
                  {rec.actionLabel && (
                    <button
                      onClick={() => applyAIRecommendation(rec.id)}
                      className="mt-1 self-end px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold cursor-pointer transition-colors shadow-sm"
                    >
                      {rec.actionLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            1. RESEARCH & TECHNOLOGY TREE (Milestone 03)
            ==================================================== */}
        {activeDrawer === 'research' && (
          <div className="flex flex-col gap-3">
            {/* Research Points Header & Passive Generator Info */}
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <div>
                <span className="text-[10px] text-cyan-300 uppercase tracking-wider block">AVAILABLE RESEARCH</span>
                <div className="flex items-center gap-2">
                  <span className="font-['Chakra_Petch'] text-xl font-bold text-white">
                    {stats.researchPoints} <span className="text-cyan-400 text-sm">RP</span>
                  </span>
                  <span className="text-[10px] text-indigo-300 font-bold bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-400/30">
                    +{stats.researchPointsPerTick} RP/cycle
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-amber-300 uppercase tracking-wider block">TREASURY RESERVES</span>
                <span className="font-['Chakra_Petch'] text-sm font-bold text-amber-300">
                  {(stats.treasury / 1000000).toFixed(2)}M CR
                </span>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-white/10 pb-2">
              {researchCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setResearchCategory(c.id)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    researchCategory === c.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_#06b6d4]'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Tech Nodes List */}
            <div className="flex flex-col gap-2.5">
              {filteredTech.map((tech) => {
                const isUnlocked = tech.unlocked;
                const prereqsMet = tech.prerequisites.every((pid) =>
                  techTree.find((t) => t.id === pid)?.unlocked
                );
                const canAfford =
                  stats.researchPoints >= tech.costRP && stats.treasury >= tech.costCredits;
                const canUnlock = !isUnlocked && prereqsMet && canAfford;

                return (
                  <div
                    key={tech.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                      isUnlocked
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : canUnlock
                        ? 'bg-slate-900/80 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-950/50 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                            isUnlocked
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : canUnlock
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-slate-800 border-slate-700 text-slate-500'
                          }`}
                        >
                          {isUnlocked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : canUnlock ? (
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Lock className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div>
                          <div className="font-['Chakra_Petch'] font-bold text-xs text-white">
                            {tech.name}
                          </div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                            FIELD: {tech.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Unlock Status Badge */}
                      {isUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] text-emerald-300 font-bold">
                          OPERATIONAL
                        </span>
                      ) : (
                        <div className="text-right">
                          <span className="text-cyan-300 font-bold block">{tech.costRP} RP</span>
                          <span className="text-amber-300 text-[10px]">₡{tech.costCredits.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] font-sans text-slate-300 leading-snug">
                      {tech.perkDescription}
                    </p>

                    {/* Unlocks Blueprint Alert */}
                    {tech.unlocksBlueprintId && (
                      <div className="text-[10px] text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 px-2 py-1 rounded flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Unlocks blueprint in Construction CAD</span>
                      </div>
                    )}

                    {/* Prerequisite warnings or action button */}
                    {!isUnlocked && (
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        {!prereqsMet ? (
                          <span className="text-[10px] text-rose-400">
                            Prerequisites: {tech.prerequisites.join(', ')}
                          </span>
                        ) : !canAfford ? (
                          <span className="text-[10px] text-amber-400">
                            Requires {tech.costRP} RP & ₡{tech.costCredits.toLocaleString()}
                          </span>
                        ) : (
                          <button
                            onClick={() => unlockTech(tech.id)}
                            className="w-full py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            RESEARCH TECHNOLOGY
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================
            2. MISSIONS & PROGRESSION (Milestone 03)
            ==================================================== */}
        {activeDrawer === 'missions' && (
          <div className="flex flex-col gap-3">
            {/* Civilization Level & XP Progress Card */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/50 via-slate-900/60 to-indigo-950/50 border border-purple-500/40 flex flex-col gap-2 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-['Chakra_Petch'] font-bold text-sm text-white">
                      CIVILIZATION TIER {stats.civLevel}
                    </span>
                    <span className="text-[10px] text-purple-300 block">
                      {stats.civLevel <= 2 ? 'Awakening Outpost' : stats.civLevel <= 4 ? 'Metropolitan Sovereign' : 'Solar Megacity'}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-amber-400 font-bold">{stats.civXP}</span>
                  <span className="text-slate-400"> / {stats.civXPToNextLevel} XP</span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (stats.civXP / stats.civXPToNextLevel) * 100)}%` }}
                />
              </div>
            </div>

            {/* Mission Category Filters */}
            <div className="flex gap-1 border-b border-white/10 pb-2">
              {(['all', 'daily', 'milestone', 'district'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMissionFilter(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    missionFilter === cat
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_10px_#f59e0b]'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all'
                    ? 'All'
                    : cat === 'daily'
                    ? 'Daily'
                    : cat === 'milestone'
                    ? 'Milestones'
                    : 'District'}
                </button>
              ))}
            </div>

            {/* Missions List with Real State Evaluation */}
            <div className="flex flex-col gap-2.5">
              {filteredMissions.map((m) => {
                const pct =
                  m.targetType === 'aqi_below' || m.targetType === 'commute_time'
                    ? m.currentValue <= m.targetValue
                      ? 100
                      : Math.max(0, Math.round(((m.targetValue * 2 - m.currentValue) / m.targetValue) * 100))
                    : Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));

                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                      m.claimed
                        ? 'bg-slate-950/40 border-white/5 opacity-60'
                        : m.isCompleted
                        ? 'bg-amber-950/30 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-900/60 border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-['Chakra_Petch'] font-bold text-xs text-white">
                          {m.title}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-purple-300 font-mono">
                          {m.category.toUpperCase()} OBJECTIVE
                        </span>
                      </div>

                      {/* Status indicator */}
                      {m.claimed ? (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[9px] font-bold">
                          CLAIMED
                        </span>
                      ) : m.isCompleted ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[9px] font-bold animate-pulse">
                          READY TO CLAIM
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">{pct}%</span>
                      )}
                    </div>

                    <p className="text-[11px] font-sans text-slate-300 leading-snug">
                      {m.description}
                    </p>

                    {/* Live Progress Bar with Actual Numbers */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Current Progress:</span>
                        <strong className="text-amber-300">
                          {Math.round(m.currentValue).toLocaleString()} / {m.targetValue.toLocaleString()}
                        </strong>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            m.isCompleted ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                        />
                      </div>
                    </div>

                    {/* Rewards Ribbon & Claim Action */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px]">
                        {m.rewardCredits > 0 && (
                          <span className="text-amber-300 font-bold">
                            +₡{m.rewardCredits.toLocaleString()}
                          </span>
                        )}
                        {m.rewardRP > 0 && (
                          <span className="text-cyan-300 font-bold">+{m.rewardRP} RP</span>
                        )}
                        <span className="text-purple-300 font-bold">+{m.rewardXP} XP</span>
                      </div>

                      {m.isCompleted && !m.claimed && (
                        <button
                          onClick={() => claimMissionReward(m.id)}
                          className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-all cursor-pointer"
                        >
                          CLAIM REWARD
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================
            3. ADVANCED TRANSPORTATION (Milestone 03)
            ==================================================== */}
        {activeDrawer === 'transit' && (
          <div className="flex flex-col gap-3">
            {/* Transit Telemetry Overview */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 flex flex-col gap-2 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <div className="flex items-center justify-between">
                <span className="font-['Chakra_Petch'] font-bold text-sm text-blue-300 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-blue-400" /> SMART MOBILITY & TRANSIT MATRIX
                </span>
                <span className="text-blue-200 font-bold text-base">
                  {stats.transitStats.efficiencyPercent}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">AVG COMMUTE TIME</span>
                  <strong className="text-white text-sm">{stats.transitStats.avgCommuteMinutes} Mins</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CONGESTION INDEX</span>
                  <strong className={`${stats.transitStats.congestionIndex > 50 ? 'text-rose-400' : 'text-emerald-400'} text-sm`}>
                    {stats.transitStats.congestionIndex}%
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">HOVER-PODS ACTIVE</span>
                  <strong className="text-cyan-300 text-sm">{stats.transitStats.hoverPodsActive} Pods</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TRANSIT DEMAND</span>
                  <strong className="text-amber-300 text-sm">{stats.transitStats.transitDemand.toLocaleString()} /day</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PUBLIC TRANSIT SHARE</span>
                  <strong className="text-indigo-300 text-sm">{stats.transitStats.publicTransitShare || 52}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">JUNCTION DELAYS</span>
                  <strong className="text-teal-300 text-sm">{stats.transitStats.junctionDelaysPercent || 14}%</strong>
                </div>
              </div>

              {/* Smart City Infrastructure Telemetry */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-1 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Adaptive AI Traffic Signals:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    stats.transitStats.adaptiveSignalsActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stats.transitStats.adaptiveSignalsActive ? 'ACTIVE (CYCLE OPTIMISED)' : 'STANDBY'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dynamic Smart Streetlighting:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    stats.transitStats.smartLightingActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stats.transitStats.smartLightingActive ? 'ACTIVE (ADAPTIVE LUX)' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>

            {/* Live 6-Corridor Transit Network */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <span className="text-white font-bold uppercase">METROPOLITAN ARTERIALS (6/6 CONNECTED)</span>

              <div className="flex flex-col gap-1.5 text-[11px]">
                {(stats.transitStats.corridors || [
                  { id: 'north_bridge', name: 'North Suspension Bridge', type: 'bridge' as const, density: 18, avgSpeedKmH: 72, delaySeconds: 2, status: 'smooth' as const },
                  { id: 'south_bridge', name: 'South Suspension Bridge', type: 'bridge' as const, density: 24, avgSpeedKmH: 68, delaySeconds: 3, status: 'smooth' as const },
                  { id: 'east_boulevard', name: 'East Grand Boulevard', type: 'road' as const, density: 29, avgSpeedKmH: 64, delaySeconds: 4, status: 'smooth' as const },
                  { id: 'west_boulevard', name: 'West Grand Boulevard', type: 'road' as const, density: 22, avgSpeedKmH: 70, delaySeconds: 2, status: 'smooth' as const },
                  { id: 'maglev_loop', name: 'Maglev Ring Express', type: 'maglev' as const, density: 14, avgSpeedKmH: 140, delaySeconds: 0, status: 'smooth' as const },
                  { id: 'skyway_canyon', name: 'Skyway Aerial Canyon', type: 'aerial' as const, density: 19, avgSpeedKmH: 95, delaySeconds: 1, status: 'smooth' as const },
                ]).map((corridor: CorridorTrafficData) => (
                  <div key={corridor.id} className="p-2 rounded-lg bg-slate-800/60 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-white font-semibold block">{corridor.name}</span>
                      <span className="text-slate-400 text-[10px]">
                        {corridor.avgSpeedKmH} km/h • Delay: +{corridor.delaySeconds}s • Congestion: {corridor.density}%
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      corridor.status === 'smooth'
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                        : corridor.status === 'moderate'
                        ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                        : 'text-rose-400 bg-rose-950/40 border border-rose-500/30 animate-pulse'
                    }`}>
                      {corridor.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Guidance Tip */}
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-[11px] text-indigo-200">
              <div className="font-bold flex items-center gap-1 text-indigo-300 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> NEURAL DISPATCH STATUS
              </div>
              Autonomous hover-pods dynamically adjust altitude and lane offsets based on real-time population density. Researching Autonomous Neural Dispatch reduces commute times by 25%.
            </div>
          </div>
        )}

        {/* ====================================================
            4. CITIZENS & LIVING DEMOGRAPHICS (Milestone 03 Upgraded)
            ==================================================== */}
        {activeDrawer === 'demographics' && (
          <div className="flex flex-col gap-3">
            {/* Housing & Population */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300">METROPOLITAN DEMOGRAPHICS</span>
                <span className="text-purple-200 font-bold">{stats.population.toLocaleString()} CITIZENS</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Housing Capacity:</span>
                <strong className="text-white">{stats.totalHousingCapacity.toLocaleString()}</strong>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (stats.population / stats.totalHousingCapacity) * 100)}%` }}
                />
              </div>
            </div>

            {/* Visible Citizen Life Statistics */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <span className="text-white font-bold uppercase flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-purple-400" /> VISIBLE CITIZEN ACTIVITY
              </span>
              <div className="flex justify-between">
                <span className="text-slate-400">Pedestrians in Plazas & Walkways:</span>
                <span className="text-purple-300 font-bold">{stats.demographics.pedestriansInPlazas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Transit Commuters:</span>
                <span className="text-blue-400 font-bold">{stats.demographics.activeCommuters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Citizen Mood Sentiment:</span>
                <span className="text-emerald-400 font-bold uppercase">
                  {stats.demographics.citizenSentiment} ({stats.happiness}%)
                </span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10">
                Over 160 animated pedestrians render simultaneously via Three.js InstancedMesh along sidewalks, bridges, and botanical plazas.
              </div>
            </div>

            {/* Labor Force & Employment */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <span className="text-white font-bold uppercase">LABOR FORCE & EMPLOYMENT</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Available Jobs:</span>
                <span className="text-emerald-400 font-bold">{stats.totalJobs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Employed Technologists:</span>
                <span className="text-white font-bold">{stats.employedCitizens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10">
                <span className="text-slate-400">Unemployment Rate:</span>
                <span className={`font-bold ${stats.unemploymentRate > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {stats.unemploymentRate}%
                </span>
              </div>
            </div>

            {/* QUALITY OF LIFE BREAKDOWN (NEO CITY 9.0) */}
            {stats.qualityOfLife && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> QUALITY OF LIFE MATRIX
                  </span>
                  <span className="font-bold text-white text-sm">
                    {stats.qualityOfLife.overallHappiness}%
                  </span>
                </div>

                {/* 24-cycle Sparkline History */}
                {stats.qualityOfLife.history && stats.qualityOfLife.history.length > 1 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400">24-Cycle Satisfaction Trend:</span>
                    <div className="h-6 flex items-end gap-1 bg-slate-950/60 p-1 rounded">
                      {stats.qualityOfLife.history.map((val, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-cyan-400/80 hover:bg-cyan-300 rounded-t transition-all"
                          style={{ height: `${Math.max(15, (val / 100) * 100)}%` }}
                          title={`Cycle -${stats.qualityOfLife.history.length - idx}: ${val}%`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 9 Quality of Life Factors */}
                <div className="space-y-1.5 pt-1 text-[11px]">
                  {[
                    { label: 'Housing Security', score: stats.qualityOfLife.housingScore, color: 'bg-purple-400' },
                    { label: 'Employment Opportunity', score: stats.qualityOfLife.employmentScore, color: 'bg-emerald-400' },
                    { label: 'Healthcare Access', score: stats.qualityOfLife.healthcareScore, color: 'bg-rose-400' },
                    { label: 'Education & Academies', score: stats.qualityOfLife.educationScore, color: 'bg-cyan-400' },
                    { label: 'Biosphere / AQI Cleanliness', score: stats.qualityOfLife.environmentScore, color: 'bg-green-400' },
                    { label: 'Commute & Transit Speed', score: stats.qualityOfLife.transitScore, color: 'bg-blue-400' },
                    { label: 'Civil Safety & Security', score: stats.qualityOfLife.safetyScore, color: 'bg-amber-400' },
                    { label: 'Civic & Cultural Services', score: stats.qualityOfLife.servicesScore, color: 'bg-pink-400' },
                    { label: 'Taxation Fairness', score: stats.qualityOfLife.taxSatisfactionScore, color: 'bg-yellow-400' },
                  ].map((f) => (
                    <div key={f.label} className="flex flex-col gap-0.5">
                      <div className="flex justify-between text-slate-300">
                        <span>{f.label}:</span>
                        <strong className="text-white">{f.score}%</strong>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`${f.color} h-full rounded-full transition-all`}
                          style={{ width: `${f.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LIVE CITIZEN ROSTER */}
            {stats.simulatedCitizens && stats.simulatedCitizens.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold uppercase flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" /> CITIZEN DIRECTORY
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {stats.simulatedCitizens.length} Active Simulated
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="Filter citizens by name or occupation..."
                  value={citizenSearch}
                  onChange={(e) => setCitizenSearch(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950/80 border border-white/10 rounded-lg text-white text-[11px] placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />

                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {stats.simulatedCitizens
                    .filter((c) =>
                      citizenSearch
                        ? c.name.toLowerCase().includes(citizenSearch.toLowerCase()) ||
                          c.occupation.toLowerCase().includes(citizenSearch.toLowerCase())
                        : true
                    )
                    .slice(0, 20)
                    .map((c) => (
                      <div
                        key={c.id}
                        className={`p-2 rounded-lg border transition-all flex items-center justify-between ${
                          stats.selectedCitizenId === c.id
                            ? 'bg-cyan-950/50 border-cyan-400'
                            : 'bg-slate-950/40 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 max-w-[200px]">
                          <span className="font-bold text-white text-[11px] truncate">{c.name}</span>
                          <span className="text-[10px] text-cyan-300 truncate">{c.occupation}</span>
                          <span className="text-[9px] text-slate-400">
                            Vitality: {c.health}% • Morale: {c.happiness}%
                          </span>
                        </div>

                        <button
                          onClick={() => selectCitizen(c.id)}
                          className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[10px] cursor-pointer"
                        >
                          INSPECT
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            5. CONSTRUCTION PALETTE
            ==================================================== */}
        {activeDrawer === 'construction' && (
          <div className="flex flex-col gap-3">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1 border-b border-white/10 pb-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setConstructCategory(c.id)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    constructCategory === c.id
                      ? 'bg-orange-500 text-slate-950 font-bold shadow-[0_0_10px_#f97316]'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Blueprints List */}
            <div className="flex flex-col gap-2">
              {filteredBlueprints.map((bp) => {
                const canAfford = treasury >= bp.cost;
                const isLocked = bp.isLocked;

                return (
                  <div
                    key={bp.id}
                    onClick={() => {
                      if (canAfford && !isLocked) {
                        closeDrawer();
                        startPlacement(bp);
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                      isLocked
                        ? 'bg-slate-950/40 border-slate-800 opacity-60 cursor-not-allowed'
                        : canAfford
                        ? 'bg-slate-900/60 hover:bg-orange-950/40 border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)] cursor-pointer'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-['Chakra_Petch'] font-bold text-sm text-white flex items-center gap-1.5">
                        {isLocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                        {bp.name}
                      </span>
                      <span className="text-amber-400 font-bold text-xs">{bp.cost.toLocaleString()} CR</span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans leading-tight">
                      {bp.details}
                    </p>

                    {isLocked ? (
                      <div className="text-[10px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                        Locked: Research required in Scientific Tree
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
                        <span className="text-purple-300">{bp.jobsProvided} Jobs</span>
                        <span className="text-yellow-400">
                          {bp.powerProduction ? `+${bp.powerProduction}MW` : `-${bp.powerConsumption}MW`}
                        </span>
                        <span className="text-emerald-400">+{bp.revenue.toLocaleString()} CR/c</span>
                        <span className="text-orange-400 font-bold">PLACE &rarr;</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================
            6. DISTRICTS & CIVIC DIRECTIVES
            ==================================================== */}
        {activeDrawer === 'districts' && (
          <div className="flex flex-col gap-3">
            {/* View Sub-Tabs */}
            <div className="flex gap-1 border-b border-white/10 pb-2">
              <button
                onClick={() => setDistrictViewMode('sectors')}
                className={`flex-1 py-1 px-2 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  districtViewMode === 'sectors'
                    ? 'bg-indigo-500 text-slate-950 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                METROPOLITAN SECTORS
              </button>
              <button
                onClick={() => setDistrictViewMode('policies')}
                className={`flex-1 py-1 px-2 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  districtViewMode === 'policies'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span>CIVIC DIRECTIVES</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {/* SECTORS VIEW */}
            {districtViewMode === 'sectors' && (
              <div className="flex flex-col gap-2.5">
                {districts.map((d) => {
                  const bCount = buildings.filter((b) => {
                    if (d.id === 'Downtown') return b.district === 'downtown';
                    if (d.id === 'Residential') return b.district === 'residential';
                    if (d.id === 'Innovation') return b.district === 'tech_district';
                    if (d.id === 'Energy') return b.district === 'industrial';
                    if (d.id === 'Botanical') return b.district === 'green_zone';
                    if (d.id === 'Waterfront') return b.district === 'waterfront';
                    return true;
                  }).length;

                  const distKey =
                    d.id === 'Downtown'
                      ? 'downtown'
                      : d.id === 'Residential'
                      ? 'residential'
                      : d.id === 'Innovation'
                      ? 'tech_district'
                      : d.id === 'Energy'
                      ? 'industrial'
                      : d.id === 'Botanical'
                      ? 'green_zone'
                      : d.id === 'Waterfront'
                      ? 'waterfront'
                      : null;

                  const evo = distKey && stats.districtEvolution ? stats.districtEvolution[distKey] : null;
                  const tierDesc = evo ? DISTRICT_TIER_DESCRIPTIONS[evo.tier] : null;

                  return (
                    <div
                      key={d.id}
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 hover:border-indigo-400/50 transition-all flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-['Chakra_Petch'] font-bold text-sm">{d.name}</span>
                          <span className="text-[10px] text-slate-400">({bCount} Towers)</span>
                          {tierDesc && (
                            <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border font-bold ${tierDesc.color}`}>
                              {tierDesc.badge}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            flyToDistrict(d.id);
                            closeDrawer();
                          }}
                          className="text-indigo-400 hover:text-indigo-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>FLY TO</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="text-[11px] font-sans text-slate-300 leading-tight">{d.desc}</p>

                      {evo && (
                        <div className="space-y-1.5 pt-1.5 border-t border-white/10 text-[10px]">
                          <div className="flex justify-between items-center text-slate-400">
                            <span>Development Score:</span>
                            <span className="font-bold text-white">{evo.developmentScore}/100</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-400 h-full rounded-full transition-all"
                              style={{ width: `${evo.developmentScore}%` }}
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-1 pt-1 text-[9px] text-slate-400">
                            <div className="p-1 rounded bg-slate-950/60 text-center">
                              <span className="block text-amber-300 font-bold">{evo.prosperity}%</span>
                              <span>Prosperity</span>
                            </div>
                            <div className="p-1 rounded bg-slate-950/60 text-center">
                              <span className="block text-cyan-300 font-bold">{evo.passengerDemand}</span>
                              <span>Pass/Day</span>
                            </div>
                            <div className="p-1 rounded bg-slate-950/60 text-center">
                              <span className="block text-emerald-300 font-bold">{evo.cargoDemand}</span>
                              <span>Freight/Day</span>
                            </div>
                          </div>

                          {/* Autonomous District Development (NEO CITY 9.1) */}
                          {distKey && stats.districtStats && stats.districtStats[distKey] && (
                            <div className="grid grid-cols-2 gap-1 pt-1.5 text-[9px] text-slate-300 border-t border-white/5">
                              <div>
                                Pop: <strong className="text-white">{stats.districtStats[distKey].population.toLocaleString()}</strong>
                              </div>
                              <div>
                                Jobs: <strong className="text-emerald-400">{stats.districtStats[distKey].jobsAvailable.toLocaleString()}</strong>
                              </div>
                              <div>
                                Land Value: <strong className="text-amber-300">{stats.districtStats[distKey].landValue || 120} LV</strong>
                              </div>
                              <div>
                                Growth Rate: <strong className="text-cyan-300">+{stats.districtStats[distKey].growthRate || 2.4}%/c</strong>
                              </div>
                              <div>
                                Demand (R/C): <strong className="text-purple-300">{stats.districtStats[distKey].residentialDemand || 50}% / {stats.districtStats[distKey].commercialDemand || 50}%</strong>
                              </div>
                              <div>
                                Accessibility: <strong className="text-teal-300">{stats.districtStats[distKey].transportAccessibility || 85}%</strong>
                              </div>
                            </div>
                          )}

                          {evo.unlockedPerks && evo.unlockedPerks.length > 0 && (
                            <div className="pt-1 space-y-0.5 text-[9px] text-indigo-300">
                              <span className="text-slate-400 font-bold block uppercase">District Bonuses:</span>
                              {evo.unlockedPerks.map((p, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                  <span>{p}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* POLICIES VIEW */}
            {districtViewMode === 'policies' && (
              <div className="flex flex-col gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[10px] text-amber-200">
                  Enact municipal bylaws and economic subsidies tailored per sector. Active directives apply immediate simulation bonuses and are deducted during cycle budgeting.
                </div>

                {districtPolicies.map((pol) => (
                  <div
                    key={pol.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${
                      pol.active
                        ? 'bg-amber-950/20 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                        : 'bg-slate-900/60 border-white/10 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-['Chakra_Petch'] font-bold text-xs text-white">
                          {pol.name}
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {pol.district.replace('_', ' ')}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleDistrictPolicy(pol.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                          pol.active
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10'
                        }`}
                      >
                        {pol.active ? 'ACTIVE' : 'ENACT'}
                      </button>
                    </div>

                    <p className="text-[11px] font-sans text-slate-300 leading-snug">
                      {pol.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                      <span className="text-amber-400/90 font-mono">
                        COST: -₡{pol.costPerTick.toLocaleString()} CR/c
                      </span>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                        {pol.effects.powerMult && <span>+{pol.effects.powerMult * 100}% Power</span>}
                        {pol.effects.revenueMult && <span>+{pol.effects.revenueMult * 100}% Revenue</span>}
                        {pol.effects.pollutionDelta && <span>{pol.effects.pollutionDelta} AQI</span>}
                        {pol.effects.happinessDelta && <span>+{pol.effects.happinessDelta}% Mood</span>}
                        {pol.effects.transitBonus && <span>+{pol.effects.transitBonus * 100}% Transit</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            7. ENERGY & WATER GRID
            ==================================================== */}
        {activeDrawer === 'energy_grid' && (
          <div className="flex flex-col gap-3">
            {/* Power grid load card */}
            <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
              stats.powerDeficit ? 'bg-rose-950/40 border-rose-500' : 'bg-slate-900/60 border-yellow-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-yellow-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> ELECTRIC POWER MATRIX
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  stats.powerDeficit ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {stats.powerDeficit ? 'GRID OVERLOAD' : 'POWER STABLE'}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Generation:</span>
                <strong className="text-yellow-400">{stats.powerCapacity} MW</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Demand:</span>
                <strong className="text-white">{Math.round(stats.powerUsage)} MW</strong>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stats.powerDeficit ? 'bg-rose-500' : 'bg-yellow-400'
                  }`}
                  style={{ width: `${Math.min(100, (stats.powerUsage / stats.powerCapacity) * 100)}%` }}
                />
              </div>
            </div>

            {/* Water matrix load card */}
            <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
              stats.waterDeficit ? 'bg-rose-950/40 border-rose-500' : 'bg-slate-900/60 border-cyan-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4" /> HYDROLOGICAL SUPPLY
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  stats.waterDeficit ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {stats.waterDeficit ? 'WATER DEFICIT' : 'OPTIMAL HYDRATION'}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Purified:</span>
                <strong className="text-cyan-400">{stats.waterCapacity} ML</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Consumption:</span>
                <strong className="text-white">{stats.waterUsage} ML</strong>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stats.waterDeficit ? 'bg-rose-500' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.min(100, (stats.waterUsage / stats.waterCapacity) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            8. ECONOMY & FISCAL POLICY (NEO CITY 9.0 DEEP SIMULATION)
            ==================================================== */}
        {activeDrawer === 'economy' && (
          <div className="flex flex-col gap-3">
            {/* Economy Sub-Tabs */}
            <div className="flex gap-1 border-b border-white/10 pb-2">
              <button
                onClick={() => setEconomySubTab('market')}
                className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  economySubTab === 'market'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                COMMODITY MARKET
              </button>
              <button
                onClick={() => setEconomySubTab('trade_policies')}
                className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  economySubTab === 'trade_policies'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                AUTO-TRADE POLICIES
              </button>
              <button
                onClick={() => setEconomySubTab('industry')}
                className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  economySubTab === 'industry'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                SECTOR PRODUCTIVITY
              </button>
            </div>

            {/* TAB 1: COMMODITY MARKET */}
            {economySubTab === 'market' && stats.resources && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/40 flex flex-col gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-bold uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> LIVING COMMODITY EXCHANGE
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">6 CONNECTED CHAINS</span>
                </div>

                <div className="space-y-2">
                  {(
                    [
                      { key: 'energy', label: 'Energy Grid', unit: 'MW', color: 'text-yellow-400', barColor: 'bg-yellow-400' },
                      { key: 'water', label: 'Hydrological', unit: 'ML', color: 'text-cyan-400', barColor: 'bg-cyan-400' },
                      { key: 'food', label: 'Food Reserves', unit: 'Tons', color: 'text-emerald-400', barColor: 'bg-emerald-400' },
                      { key: 'materials', label: 'Raw Materials', unit: 'Units', color: 'text-orange-400', barColor: 'bg-orange-400' },
                      { key: 'manufactured_goods', label: 'Manufactured Goods', unit: 'Crates', color: 'text-blue-400', barColor: 'bg-blue-400' },
                      { key: 'services', label: 'Civic Services', unit: 'Index', color: 'text-purple-400', barColor: 'bg-purple-400' },
                    ] as const
                  ).map((r) => {
                    const res = stats.resources[r.key];
                    if (!res) return null;
                    const netRate = res.production - res.consumption;

                    return (
                      <div
                        key={r.key}
                        className={`p-2.5 rounded-lg border flex flex-col gap-1.5 ${
                          res.isShortage
                            ? 'bg-rose-950/40 border-rose-500/60'
                            : 'bg-slate-950/60 border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${r.color}`}>{r.label}</span>
                            {res.isShortage && (
                              <span className="text-[8px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded uppercase animate-pulse">
                                SHORTAGE
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] font-mono">
                            <span className="text-slate-300">
                              ₡{res.marketPrice} CR/{r.unit}
                            </span>
                            {res.trend === 'rising' ? (
                              <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                            ) : res.trend === 'falling' ? (
                              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                            ) : null}
                          </div>
                        </div>

                        {/* Storage Bar */}
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Stockpile: <strong className="text-white">{res.current.toLocaleString()}</strong> / {res.capacity.toLocaleString()}</span>
                          <span className={netRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {netRate >= 0 ? `+${netRate}` : netRate}/c
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`${r.barColor} h-full rounded-full transition-all`}
                            style={{ width: `${Math.min(100, (res.current / res.capacity) * 100)}%` }}
                          />
                        </div>

                        {/* Trade Action Buttons */}
                        <div className="flex items-center justify-end gap-1.5 pt-1 text-[10px]">
                          <button
                            onClick={() => buyResource(r.key, 100)}
                            className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-bold cursor-pointer"
                          >
                            +100 Buy
                          </button>
                          <button
                            onClick={() => sellResource(r.key, 100)}
                            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold cursor-pointer"
                          >
                            -100 Sell
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: AUTO-TRADE POLICIES */}
            {economySubTab === 'trade_policies' && stats.tradePolicies && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/40 flex flex-col gap-2.5">
                <span className="text-cyan-300 font-bold uppercase text-xs">
                  AUTOMATED COMMODITY TRADE PROTOCOLS
                </span>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Autonomous port algorithms buy emergency stockpiles below minimum reserve thresholds, and export surplus goods with municipal tariff collection.
                </p>

                <div className="space-y-2 pt-1">
                  {(
                    [
                      { key: 'energy', label: 'Energy Grid' },
                      { key: 'water', label: 'Hydrological' },
                      { key: 'food', label: 'Food Reserves' },
                      { key: 'materials', label: 'Raw Materials' },
                      { key: 'manufactured_goods', label: 'Manufactured Goods' },
                      { key: 'services', label: 'Civic Services' },
                    ] as const
                  ).map((item) => {
                    const policy = stats.tradePolicies[item.key];
                    if (!policy) return null;

                    return (
                      <div key={item.key} className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{item.label}</span>
                          <span className="text-[10px] text-slate-400">
                            Reserve: {policy.minReserve.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 text-[10px]">
                          <button
                            onClick={() => setTradePolicy(item.key, { autoImport: !policy.autoImport })}
                            className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                              policy.autoImport
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            Auto-Import: {policy.autoImport ? 'ON' : 'OFF'}
                          </button>

                          <button
                            onClick={() => setTradePolicy(item.key, { autoExport: !policy.autoExport })}
                            className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                              policy.autoExport
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            Auto-Export: {policy.autoExport ? 'ON' : 'OFF'}
                          </button>

                          <span className="text-amber-300 font-mono">
                            Tariff: {(policy.tariffRate * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SECTOR PRODUCTIVITY & FISCAL METRICS */}
            {economySubTab === 'industry' && (
              <div className="flex flex-col gap-2.5">
                {/* Commercial & Industrial Sector Health */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
                  <span className="text-white font-bold uppercase">SECTOR PRODUCTIVITY INDEX</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commercial Sector Profitability:</span>
                    <strong className="text-pink-400">{stats.commercialHealth ?? 85}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Industrial & Tech Productivity:</span>
                    <strong className="text-amber-400">{stats.industrialOutput ?? 88}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Healthcare Coverage Rating:</span>
                    <strong className="text-rose-400">{stats.healthcareCoverage ?? 90}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Education & Skill Rating:</span>
                    <strong className="text-cyan-400">{stats.educationRating ?? 88}%</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-300 font-bold uppercase">MUNICIPAL TAX LEVY</span>
                <span className="text-amber-400 font-bold text-base">{taxRate}%</span>
              </div>
              <input
                type="range"
                min={3}
                max={20}
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>3% (Max Happiness)</span>
                <span>20% (Aggressive Treasury)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <span className="text-white font-bold uppercase">FISCAL CASH FLOW</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Cycle Revenue:</span>
                <span className="text-emerald-400 font-bold">+{stats.incomePerTick.toLocaleString()} CR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Maintenance Costs:</span>
                <span className="text-rose-400 font-bold">-{stats.expensesPerTick.toLocaleString()} CR</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10">
                <span className="text-white font-bold">Net Cycle Surplus:</span>
                <span className="text-emerald-300 font-bold">
                  +{(stats.incomePerTick - stats.expensesPerTick).toLocaleString()} CR
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <span className="text-white font-bold uppercase">DEPARTMENT BUDGET SHARES</span>
              {Object.entries(budgetAllocations).map(([cat, val]) => (
                <div key={cat} className="flex flex-col gap-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="capitalize text-slate-300">{cat}</span>
                    <span className="text-amber-300 font-bold">{val}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    value={val}
                    onChange={(e) => setBudgetAllocation(cat as any, Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====================================================
            9. ENVIRONMENT & AQI
            ==================================================== */}
        {activeDrawer === 'environment' && (
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 font-bold">AIR QUALITY INDEX (AQI)</span>
                <span className="text-emerald-400 font-bold text-base">{stats.pollution} / 500</span>
              </div>
              <div className="text-[10px] text-slate-300">
                Atmospheric scrubbers and biospheres neutralise urban emissions continuously.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <span className="text-white font-bold uppercase">BIOSPHERES & CONSERVATION</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Grand Eden Bio-Dome:</span>
                <span className="text-emerald-400 font-bold">-38 AQI Offset</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Zenith Conservatory:</span>
                <span className="text-emerald-400 font-bold">-22 AQI Offset</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Terraced Green Ziggurats:</span>
                <span className="text-emerald-400 font-bold">-26 AQI Offset</span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            10. CIVIC CHRONICLE
            ==================================================== */}
        {activeDrawer === 'chronicle' && (
          <div className="flex flex-col gap-2">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-amber-400 font-bold">{ev.timestamp}</span>
                  <span
                    className={`uppercase font-bold ${
                      ev.type === 'success'
                        ? 'text-emerald-400'
                        : ev.type === 'alert'
                        ? 'text-rose-400 animate-pulse'
                        : ev.type === 'warning'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                    }`}
                  >
                    [{ev.type}]
                  </span>
                </div>
                <p className="text-slate-200 text-[11px] font-sans leading-tight">
                  {ev.message}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ====================================================
            11. SETTINGS, GRAPHICS & RESET
            ==================================================== */}
        {activeDrawer === 'settings' && (
          <div className="flex flex-col gap-3">
            {/* GRAPHICS PRESETS (FEATURE 6) */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" /> GRAPHICS PRESETS
                </span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40">
                  {graphics.preset} TIER
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {(['performance', 'balanced', 'ultra'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setGraphicsPreset(p)}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      graphics.preset === p
                        ? p === 'performance'
                          ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                          : p === 'ultra'
                          ? 'bg-purple-500 text-slate-950 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                          : 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 leading-tight">
                {graphics.preset === 'performance' && 'Performance: Slashes draw calls and GPU load. Directional shadows disabled, simplified LOD, light fleet (24 pods, 60 pedestrians), 0.85x DPR.'}
                {graphics.preset === 'balanced' && 'Balanced: Recommended for most hardware. Main tower hull shadows, native 1.0x DPR, full pedestrian & hover fleet, 120m LOD threshold.'}
                {graphics.preset === 'ultra' && 'Ultra: Maximum visual spectacle. High-res cascaded shadows on all structures, 1.25x supersampled DPR, 220m LOD distance, 80 hover pods & 200 pedestrians.'}
              </div>
            </div>

            {/* LIVE 3D TELEMETRY MONITOR TOGGLE */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10">
              <div>
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" /> Hardware & 3D Telemetry
                </div>
                <div className="text-[10px] text-slate-400">Live FPS, draw calls, triangles & frame time</div>
              </div>
              <button
                onClick={togglePerfMonitor}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  graphics.showPerfMonitor
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {graphics.showPerfMonitor ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* GRANULAR GRAPHICS ADJUSTMENTS */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex flex-col gap-2">
              <span className="text-white font-bold uppercase text-[10px] tracking-wider text-slate-300">
                CUSTOM GRAPHICS TUNING
              </span>

              {/* Shadow Quality */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Shadow Maps:</span>
                <div className="flex gap-1">
                  {(['off', 'low', 'high', 'ultra'] as ShadowQuality[]).map((sq) => (
                    <button
                      key={sq}
                      onClick={() => updateGraphicsSettings({ shadowQuality: sq })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        graphics.shadowQuality === sq
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Render Scale / DPR */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Render Resolution:</span>
                <div className="flex gap-1">
                  {[0.75, 1.0, 1.25, 1.5].map((scale) => (
                    <button
                      key={scale}
                      onClick={() => updateGraphicsSettings({ renderScale: scale })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        graphics.renderScale === scale
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {scale}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SIMULATION VISUAL TOGGLES */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10">
              <div>
                <div className="text-white font-semibold">Tactical Ground Grid</div>
                <div className="text-[10px] text-slate-400">Alignment grid overlay on terrain</div>
              </div>
              <button
                onClick={toggleGrid}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  gridVisible ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {gridVisible ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10">
              <div>
                <div className="text-white font-semibold">Autonomous Hover Traffic & Pedestrians</div>
                <div className="text-[10px] text-slate-400">Live hover-pods and walking citizens</div>
              </div>
              <button
                onClick={toggleTraffic}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  trafficVisible ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {trafficVisible ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/10">
              <div>
                <div className="text-white font-semibold">Cinematic Auto-Orbit</div>
                <div className="text-[10px] text-slate-400">Slow panoramic orbital rotation</div>
              </div>
              <button
                onClick={toggleAutoRotate}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  autoRotate ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {autoRotate ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={resetCivilization}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESET TO PLANETARY BASELINE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
