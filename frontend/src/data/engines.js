// NASA CMAPSS — 6 engines across FD001 (HPC_DEG) and FD003 (HPC+FAN_DEG)
// Source: Saxena et al. 2008, NASA TM-2008-215546
//
// FD001 — 1 operating condition, HPC degradation only
//   ENG-001  WARNING   RUL=112  HPC_DEG
//   ENG-055  CRITICAL  RUL=18   HPC_DEG
//   ENG-023  NORMAL    RUL=241  NOMINAL
//
// FD003 — 1 operating condition, HPC + Fan degradation
//   ENG-F014 WARNING   RUL=89   FAN_DEG       (fan sensors degraded, HPC normal)
//   ENG-F031 CRITICAL  RUL=22   HPC_DEG+FAN   (both fault modes active)
//   ENG-F067 NORMAL    RUL=198  NOMINAL        (healthy FD003 engine)
//
// Sensor normal ranges from dataset baseline statistics (Saxena et al. 2008)

export const ENGINES = [

  // ── FD001 Engines (HPC Degradation only) ───────────────────────────────

  {
    id: 'ENG-001',
    name: 'Turbofan Engine 1',
    subset: 'FD001',
    cycle: 192,
    rul: 112,
    anomalyScore: 63,
    anomalyLevel: 'WARNING',
    faultMode: 'HPC_DEG',
    operatingHours: 192,
    location: 'Bay-2',
    sensors: {
      s2:  { value: 642.38, unit: '°R',       label: 'LPC Outlet Temp',      status: 'NORMAL',   normalRange: [641.0,   644.0]  },
      s3:  { value: 1590.1, unit: '°R',       label: 'HPC Outlet Temp',      status: 'WARNING',  normalRange: [1585.0,  1592.0] },
      s4:  { value: 1408.2, unit: '°R',       label: 'LPT Outlet Temp',      status: 'WARNING',  normalRange: [1400.0,  1415.0] },
      s7:  { value: 550.3,  unit: 'psia',     label: 'HPC Outlet Pressure',  status: 'NORMAL',   normalRange: [549.0,   554.0]  },
      s8:  { value: 2388.1, unit: 'rpm',      label: 'Physical Fan Speed',   status: 'NORMAL',   normalRange: [2385.0,  2390.0] },
      s9:  { value: 9058.2, unit: 'rpm',      label: 'Physical Core Speed',  status: 'NORMAL',   normalRange: [9050.0,  9070.0] },
      s11: { value: 47.6,   unit: 'psia',     label: 'HPC Static Pressure',  status: 'NORMAL',   normalRange: [47.0,    48.5]   },
      s12: { value: 522.1,  unit: 'pps/psia', label: 'Fuel Flow Ratio',      status: 'WARNING',  normalRange: [521.0,   524.0]  },
      s13: { value: 2390.4, unit: 'rpm',      label: 'Corrected Fan Speed',  status: 'NORMAL',   normalRange: [2387.0,  2395.0] },
      s14: { value: 8148.2, unit: 'rpm',      label: 'Corrected Core Speed', status: 'NORMAL',   normalRange: [8140.0,  8160.0] },
      s15: { value: 8.44,   unit: '–',        label: 'Bypass Ratio',         status: 'NORMAL',   normalRange: [8.40,    8.50]   },
      s17: { value: 393.2,  unit: '–',        label: 'Bleed Enthalpy',       status: 'NORMAL',   normalRange: [391.0,   396.0]  },
      s20: { value: 38.9,   unit: 'lbm/s',   label: 'HP Turbine Cool Air',  status: 'NORMAL',   normalRange: [38.7,    39.2]   },
      s21: { value: 23.2,   unit: 'lbm/s',   label: 'LP Turbine Cool Air',  status: 'NORMAL',   normalRange: [23.1,    23.5]   },
    }
  },

  {
    id: 'ENG-055',
    name: 'Turbofan Engine 55',
    subset: 'FD001',
    cycle: 298,
    rul: 18,
    anomalyScore: 91,
    anomalyLevel: 'CRITICAL',
    faultMode: 'HPC_DEG',
    operatingHours: 298,
    location: 'Bay-1',
    sensors: {
      s2:  { value: 643.1,  unit: '°R',       label: 'LPC Outlet Temp',      status: 'NORMAL',   normalRange: [641.0,   644.0]  },
      s3:  { value: 1594.8, unit: '°R',       label: 'HPC Outlet Temp',      status: 'CRITICAL', normalRange: [1585.0,  1592.0] },
      s4:  { value: 1418.3, unit: '°R',       label: 'LPT Outlet Temp',      status: 'CRITICAL', normalRange: [1400.0,  1415.0] },
      s7:  { value: 547.2,  unit: 'psia',     label: 'HPC Outlet Pressure',  status: 'CRITICAL', normalRange: [549.0,   554.0]  },
      s8:  { value: 2386.4, unit: 'rpm',      label: 'Physical Fan Speed',   status: 'NORMAL',   normalRange: [2385.0,  2390.0] },
      s9:  { value: 9052.1, unit: 'rpm',      label: 'Physical Core Speed',  status: 'NORMAL',   normalRange: [9050.0,  9070.0] },
      s11: { value: 46.3,   unit: 'psia',     label: 'HPC Static Pressure',  status: 'CRITICAL', normalRange: [47.0,    48.5]   },
      s12: { value: 523.8,  unit: 'pps/psia', label: 'Fuel Flow Ratio',      status: 'CRITICAL', normalRange: [521.0,   524.0]  },
      s13: { value: 2388.2, unit: 'rpm',      label: 'Corrected Fan Speed',  status: 'NORMAL',   normalRange: [2387.0,  2395.0] },
      s14: { value: 8143.5, unit: 'rpm',      label: 'Corrected Core Speed', status: 'NORMAL',   normalRange: [8140.0,  8160.0] },
      s15: { value: 8.41,   unit: '–',        label: 'Bypass Ratio',         status: 'NORMAL',   normalRange: [8.40,    8.50]   },
      s17: { value: 395.1,  unit: '–',        label: 'Bleed Enthalpy',       status: 'NORMAL',   normalRange: [391.0,   396.0]  },
      s20: { value: 39.0,   unit: 'lbm/s',   label: 'HP Turbine Cool Air',  status: 'NORMAL',   normalRange: [38.7,    39.2]   },
      s21: { value: 23.3,   unit: 'lbm/s',   label: 'LP Turbine Cool Air',  status: 'NORMAL',   normalRange: [23.1,    23.5]   },
    }
  },

  {
    id: 'ENG-023',
    name: 'Turbofan Engine 23',
    subset: 'FD001',
    cycle: 87,
    rul: 241,
    anomalyScore: 12,
    anomalyLevel: 'NORMAL',
    faultMode: 'NOMINAL',
    operatingHours: 87,
    location: 'Bay-4',
    sensors: {
      s2:  { value: 641.8,  unit: '°R',       label: 'LPC Outlet Temp',      status: 'NORMAL',   normalRange: [641.0,   644.0]  },
      s3:  { value: 1586.2, unit: '°R',       label: 'HPC Outlet Temp',      status: 'NORMAL',   normalRange: [1585.0,  1592.0] },
      s4:  { value: 1401.4, unit: '°R',       label: 'LPT Outlet Temp',      status: 'NORMAL',   normalRange: [1400.0,  1415.0] },
      s7:  { value: 552.8,  unit: 'psia',     label: 'HPC Outlet Pressure',  status: 'NORMAL',   normalRange: [549.0,   554.0]  },
      s8:  { value: 2389.0, unit: 'rpm',      label: 'Physical Fan Speed',   status: 'NORMAL',   normalRange: [2385.0,  2390.0] },
      s9:  { value: 9065.4, unit: 'rpm',      label: 'Physical Core Speed',  status: 'NORMAL',   normalRange: [9050.0,  9070.0] },
      s11: { value: 48.2,   unit: 'psia',     label: 'HPC Static Pressure',  status: 'NORMAL',   normalRange: [47.0,    48.5]   },
      s12: { value: 521.4,  unit: 'pps/psia', label: 'Fuel Flow Ratio',      status: 'NORMAL',   normalRange: [521.0,   524.0]  },
      s13: { value: 2393.1, unit: 'rpm',      label: 'Corrected Fan Speed',  status: 'NORMAL',   normalRange: [2387.0,  2395.0] },
      s14: { value: 8157.2, unit: 'rpm',      label: 'Corrected Core Speed', status: 'NORMAL',   normalRange: [8140.0,  8160.0] },
      s15: { value: 8.48,   unit: '–',        label: 'Bypass Ratio',         status: 'NORMAL',   normalRange: [8.40,    8.50]   },
      s17: { value: 392.1,  unit: '–',        label: 'Bleed Enthalpy',       status: 'NORMAL',   normalRange: [391.0,   396.0]  },
      s20: { value: 39.1,   unit: 'lbm/s',   label: 'HP Turbine Cool Air',  status: 'NORMAL',   normalRange: [38.7,    39.2]   },
      s21: { value: 23.4,   unit: 'lbm/s',   label: 'LP Turbine Cool Air',  status: 'NORMAL',   normalRange: [23.1,    23.5]   },
    }
  },

  // ── FD003 Engines (Fan Degradation active alongside HPC) ────────────────
  // FD003 uses same sensor ranges but both HPC and Fan fault modes are present.
  // Fan sensors: s8 (Physical Fan Speed), s13 (Corrected Fan Speed),
  //              s15 (Bypass Ratio), s2 (LPC Outlet Temp)
  // HPC sensors: s3, s4, s7, s11, s12 (same as FD001)

  {
    // Pure FAN_DEG — fan sensors degraded, HPC sensors still normal
    // Simulates early-stage fan blade erosion (foreign object damage)
    // RUL=89 → MEDIUM priority per ISO 13381-1
    id: 'ENG-F014',
    name: 'Turbofan Engine F14',
    subset: 'FD003',
    cycle: 156,
    rul: 89,
    anomalyScore: 58,
    anomalyLevel: 'WARNING',
    faultMode: 'FAN_DEG',
    operatingHours: 156,
    location: 'Bay-3',
    sensors: {
      // Fan sensors — degraded (below normal range thresholds)
      s2:  { value: 644.9,  unit: '°R',       label: 'LPC Outlet Temp',      status: 'WARNING',  normalRange: [641.0,   644.0]  },
      // s2 > 644.0 → FAN_DEG indicator (LPC inlet temp rising due to fan inefficiency)
      s3:  { value: 1587.4, unit: '°R',       label: 'HPC Outlet Temp',      status: 'NORMAL',   normalRange: [1585.0,  1592.0] },
      s4:  { value: 1403.1, unit: '°R',       label: 'LPT Outlet Temp',      status: 'NORMAL',   normalRange: [1400.0,  1415.0] },
      s7:  { value: 551.8,  unit: 'psia',     label: 'HPC Outlet Pressure',  status: 'NORMAL',   normalRange: [549.0,   554.0]  },
      s8:  { value: 2383.2, unit: 'rpm',      label: 'Physical Fan Speed',   status: 'WARNING',  normalRange: [2385.0,  2390.0] },
      // s8 < 2385.0 → FAN_DEG indicator (fan rotor speed loss)
      s9:  { value: 9061.3, unit: 'rpm',      label: 'Physical Core Speed',  status: 'NORMAL',   normalRange: [9050.0,  9070.0] },
      s11: { value: 47.9,   unit: 'psia',     label: 'HPC Static Pressure',  status: 'NORMAL',   normalRange: [47.0,    48.5]   },
      s12: { value: 521.9,  unit: 'pps/psia', label: 'Fuel Flow Ratio',      status: 'NORMAL',   normalRange: [521.0,   524.0]  },
      s13: { value: 2385.6, unit: 'rpm',      label: 'Corrected Fan Speed',  status: 'WARNING',  normalRange: [2387.0,  2395.0] },
      // s13 < 2387.0 → FAN_DEG indicator (corrected fan speed drop)
      s14: { value: 8151.4, unit: 'rpm',      label: 'Corrected Core Speed', status: 'NORMAL',   normalRange: [8140.0,  8160.0] },
      s15: { value: 8.38,   unit: '–',        label: 'Bypass Ratio',         status: 'WARNING',  normalRange: [8.40,    8.50]   },
      // s15 < 8.40 → FAN_DEG indicator (bypass ratio decrease)
      s17: { value: 393.8,  unit: '–',        label: 'Bleed Enthalpy',       status: 'NORMAL',   normalRange: [391.0,   396.0]  },
      s20: { value: 38.9,   unit: 'lbm/s',   label: 'HP Turbine Cool Air',  status: 'NORMAL',   normalRange: [38.7,    39.2]   },
      s21: { value: 23.3,   unit: 'lbm/s',   label: 'LP Turbine Cool Air',  status: 'NORMAL',   normalRange: [23.1,    23.5]   },
    }
  },

  {
    // HPC_DEG + FAN_DEG — both fault modes active simultaneously
    // Most complex case: represents late-stage FD003 engine near failure
    // RUL=22 → HIGH priority (10–30 cycles remaining per ISO 13381-1)
    // This is the key test case for multi-fault drift detection
    id: 'ENG-F031',
    name: 'Turbofan Engine F31',
    subset: 'FD003',
    cycle: 241,
    rul: 22,
    anomalyScore: 87,
    anomalyLevel: 'CRITICAL',
    faultMode: 'HPC_DEG+FAN_DEG',
    operatingHours: 241,
    location: 'Bay-5',
    sensors: {
      // Fan sensors — degraded
      s2:  { value: 645.3,  unit: '°R',       label: 'LPC Outlet Temp',      status: 'WARNING',  normalRange: [641.0,   644.0]  },
      // s2 > 644.0 → FAN_DEG
      // HPC sensors — degraded
      s3:  { value: 1593.7, unit: '°R',       label: 'HPC Outlet Temp',      status: 'CRITICAL', normalRange: [1585.0,  1592.0] },
      // s3 > 1592.0 → HPC_DEG
      s4:  { value: 1416.8, unit: '°R',       label: 'LPT Outlet Temp',      status: 'CRITICAL', normalRange: [1400.0,  1415.0] },
      // s4 > 1415.0 → HPC_DEG
      s7:  { value: 547.9,  unit: 'psia',     label: 'HPC Outlet Pressure',  status: 'CRITICAL', normalRange: [549.0,   554.0]  },
      // s7 < 549.0 → HPC_DEG
      s8:  { value: 2382.1, unit: 'rpm',      label: 'Physical Fan Speed',   status: 'WARNING',  normalRange: [2385.0,  2390.0] },
      // s8 < 2385.0 → FAN_DEG
      s9:  { value: 9053.4, unit: 'rpm',      label: 'Physical Core Speed',  status: 'NORMAL',   normalRange: [9050.0,  9070.0] },
      s11: { value: 46.6,   unit: 'psia',     label: 'HPC Static Pressure',  status: 'CRITICAL', normalRange: [47.0,    48.5]   },
      // s11 < 47.0 → HPC_DEG
      s12: { value: 524.2,  unit: 'pps/psia', label: 'Fuel Flow Ratio',      status: 'CRITICAL', normalRange: [521.0,   524.0]  },
      // s12 > 524.0 → HPC_DEG
      s13: { value: 2384.3, unit: 'rpm',      label: 'Corrected Fan Speed',  status: 'WARNING',  normalRange: [2387.0,  2395.0] },
      // s13 < 2387.0 → FAN_DEG
      s14: { value: 8144.1, unit: 'rpm',      label: 'Corrected Core Speed', status: 'NORMAL',   normalRange: [8140.0,  8160.0] },
      s15: { value: 8.37,   unit: '–',        label: 'Bypass Ratio',         status: 'WARNING',  normalRange: [8.40,    8.50]   },
      // s15 < 8.40 → FAN_DEG
      s17: { value: 395.6,  unit: '–',        label: 'Bleed Enthalpy',       status: 'NORMAL',   normalRange: [391.0,   396.0]  },
      s20: { value: 39.0,   unit: 'lbm/s',   label: 'HP Turbine Cool Air',  status: 'NORMAL',   normalRange: [38.7,    39.2]   },
      s21: { value: 23.3,   unit: 'lbm/s',   label: 'LP Turbine Cool Air',  status: 'NORMAL',   normalRange: [23.1,    23.5]   },
    }
  },

  {
    // NOMINAL FD003 engine — healthy, early cycle
    // All fan and HPC sensors within normal range
    // RUL=198 → LOW priority, routine monitoring
    // Used to test: does agent correctly identify NO fault despite FD003 context?
    id: 'ENG-F067',
    name: 'Turbofan Engine F67',
    subset: 'FD003',
    cycle: 62,
    rul: 198,
    anomalyScore: 8,
    anomalyLevel: 'NORMAL',
    faultMode: 'NOMINAL',
    operatingHours: 62,
    location: 'Bay-2',
    sensors: {
      s2:  { value: 642.1,  unit: '°R',       label: 'LPC Outlet Temp',      status: 'NORMAL',   normalRange: [641.0,   644.0]  },
      s3:  { value: 1586.8, unit: '°R',       label: 'HPC Outlet Temp',      status: 'NORMAL',   normalRange: [1585.0,  1592.0] },
      s4:  { value: 1402.3, unit: '°R',       label: 'LPT Outlet Temp',      status: 'NORMAL',   normalRange: [1400.0,  1415.0] },
      s7:  { value: 553.1,  unit: 'psia',     label: 'HPC Outlet Pressure',  status: 'NORMAL',   normalRange: [549.0,   554.0]  },
      s8:  { value: 2388.7, unit: 'rpm',      label: 'Physical Fan Speed',   status: 'NORMAL',   normalRange: [2385.0,  2390.0] },
      s9:  { value: 9063.8, unit: 'rpm',      label: 'Physical Core Speed',  status: 'NORMAL',   normalRange: [9050.0,  9070.0] },
      s11: { value: 48.1,   unit: 'psia',     label: 'HPC Static Pressure',  status: 'NORMAL',   normalRange: [47.0,    48.5]   },
      s12: { value: 521.7,  unit: 'pps/psia', label: 'Fuel Flow Ratio',      status: 'NORMAL',   normalRange: [521.0,   524.0]  },
      s13: { value: 2391.4, unit: 'rpm',      label: 'Corrected Fan Speed',  status: 'NORMAL',   normalRange: [2387.0,  2395.0] },
      s14: { value: 8153.6, unit: 'rpm',      label: 'Corrected Core Speed', status: 'NORMAL',   normalRange: [8140.0,  8160.0] },
      s15: { value: 8.46,   unit: '–',        label: 'Bypass Ratio',         status: 'NORMAL',   normalRange: [8.40,    8.50]   },
      s17: { value: 392.4,  unit: '–',        label: 'Bleed Enthalpy',       status: 'NORMAL',   normalRange: [391.0,   396.0]  },
      s20: { value: 39.0,   unit: 'lbm/s',   label: 'HP Turbine Cool Air',  status: 'NORMAL',   normalRange: [38.7,    39.2]   },
      s21: { value: 23.2,   unit: 'lbm/s',   label: 'LP Turbine Cool Air',  status: 'NORMAL',   normalRange: [23.1,    23.5]   },
    }
  },
]

// ── DIAGNOSIS SYSTEM PROMPT ──────────────────────────────────────────────────
// Updated to instruct agent to check BOTH HPC_DEG and FAN_DEG thresholds.
// Agent is now told FD003 engines can have both fault modes simultaneously.
export const DIAGNOSIS_SYSTEM_PROMPT = `You are an autonomous turbofan engine diagnosis agent for NASA CMAPSS engines.

You have access to a knowledge base tool: query_kb(sensor, fault_type)
This returns official thresholds, priority rules, and procedure IDs
from NASA TM-2008-215546, ISO 13379-1, ISO 13381-1, FAA and AGARD standards.

## Engine Subsets
- FD001: HPC degradation only. Check HPC_DEG thresholds.
- FD003: HPC AND Fan degradation possible. Check BOTH HPC_DEG and FAN_DEG thresholds.
  Both fault modes can be active simultaneously in FD003 engines.

## Your Mandatory Reasoning Process

STEP 1 — Query all HPC_DEG thresholds at once:
  query_kb(sensor="HPC_DEG", fault_type="all_thresholds")

STEP 2 — Query all FAN_DEG thresholds at once:
  query_kb(sensor="FAN_DEG", fault_type="all_thresholds")

STEP 3 — Compare each raw sensor reading against retrieved KB thresholds:
  For each threshold returned, check: does actual value breach it?
  Use the operator field (> or <) returned by KB.
  ANY single breach in HPC group → HPC_DEG confirmed.
  ANY single breach in FAN group → FAN_DEG confirmed.
  BOTH groups breached → HPC_DEG + FAN_DEG (combined fault, FD003 only).

STEP 4 — Determine priority from RUL:
  query_kb(sensor="RUL", fault_type="priority")
  Apply the engine RUL to find the matching priority rule.
  For combined faults (HPC_DEG+FAN_DEG), escalate priority by one level.

STEP 5 — Get the required maintenance procedure(s):
  For single fault: query_kb(sensor="FAULT_PRIORITY", fault_type="procedure")
    e.g. query_kb(sensor="HPC_DEG_HIGH", fault_type="procedure")
         query_kb(sensor="FAN_DEG_HIGH", fault_type="procedure")
  For combined fault, retrieve BOTH procedure IDs.

STEP 6 — Produce your diagnosis stating:
  1. All confirmed fault modes (HPC_DEG and/or FAN_DEG or NOMINAL)
  2. Which sensors breached KB thresholds (exact value vs KB limit)
  3. Severity level (from KB RUL priority rule, escalated if combined)
  4. Required procedure ID(s) from KB procedure registry
  5. Confidence % and reasoning

## Rules
- NEVER use internal memory for threshold values — always call query_kb first
- ALWAYS cite the KB standard source for each claim (NASA TM, ISO 13379-1, AGARD-R-785)
- For FD003 engines, explicitly check BOTH fault modes — do not stop at first fault found
- Be technically precise — include exact sensor values and KB thresholds`

// ── MAINTENANCE SYSTEM PROMPT ────────────────────────────────────────────────
// Updated to handle combined fault work orders and multi-procedure references.
export const MAINTENANCE_SYSTEM_PROMPT = `You are a turbofan engine maintenance planner using real aerospace procedures.

You will receive a diagnosis from the Diagnosis Agent. That diagnosis includes
the KB-prescribed procedure ID(s), fault mode(s), and priority level.

## Your Mandatory Requirements

1. Start with "Based on the diagnosis" or "Consistent with the diagnosis agent's findings"
   (this confirms inter-agent coordination — required for the ASI framework)

2. Reference the EXACT procedure ID(s) from the diagnosis
   Do NOT invent new procedure IDs.
   If both HPC_DEG and FAN_DEG are diagnosed, reference BOTH procedure IDs.

3. State the priority level as determined by the Diagnosis Agent.
   For combined HPC_DEG + FAN_DEG faults, the priority should be escalated
   (e.g. MEDIUM → HIGH, HIGH → CRITICAL) as both systems are degraded.

4. For COMBINED faults (HPC_DEG + FAN_DEG), produce a work order that:
   - Addresses BOTH fault modes with separate task sections
   - Schedules HPC inspection AND fan blade inspection
   - Notes which tasks can be done concurrently to reduce downtime

5. Produce a structured work order with:
   - Procedure ID(s) and name(s)
   - Priority level
   - Step-by-step maintenance tasks (per fault mode if combined)
   - Required parts and tools
   - Estimated time (combined if both faults)
   - Certification requirements
   - Safety precautions
   - Human review / escalation trigger

## Known Procedure References
- cmapss_proc_borescope_001     — HPC Borescope Inspection (FAA AC 43.13-1B)
- cmapss_proc_compressor_wash_001 — Compressor Wash (GE Aviation MM)
- cmapss_proc_fan_inspection_001  — Fan Blade Inspection (AGARD-R-785)
- routine_monitoring              — Routine Monitoring (SAE JA1012)

Be specific. Reference the exact procedure ID(s) provided in the diagnosis.`
