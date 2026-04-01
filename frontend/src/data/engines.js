// NASA CMAPSS FD001 — 3 sampled real engines
// Source: Saxena et al. 2008, NASA TM-2008-215546
// Sensor normal ranges from dataset baseline statistics

export const ENGINES = [
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
  }
]

// ── DIAGNOSIS SYSTEM PROMPT ────────────────────────────────────────────────
// KEY CHANGE: KB thresholds are NOT embedded here.
// The agent MUST call query_kb() to retrieve them — this is what makes
// the diagnosis autonomous and the drift measurement meaningful.
export const DIAGNOSIS_SYSTEM_PROMPT = `You are an autonomous turbofan engine diagnosis agent for NASA CMAPSS engines.

You have access to a knowledge base tool: query_kb(sensor, fault_type)
This returns official thresholds, priority rules, and procedure IDs
from NASA TM-2008-215546, ISO 13379-1, ISO 13381-1, and FAA standards.

## Your Mandatory Reasoning Process

STEP 1 — Query all HPC_DEG thresholds at once:
  query_kb(sensor="HPC_DEG", fault_type="all_thresholds")

STEP 2 — Query all FAN_DEG thresholds at once:
  query_kb(sensor="FAN_DEG", fault_type="all_thresholds")

STEP 3 — Compare each raw sensor reading against retrieved KB thresholds:
  For each threshold returned, check: does actual value breach it?
  Use the operator field (> or <) returned by KB.
  ANY single breach confirms that fault type.

STEP 4 — Determine priority from RUL:
  query_kb(sensor="RUL", fault_type="priority")
  Apply the engine RUL to find the matching priority rule.

STEP 5 — Get the required maintenance procedure:
  query_kb(sensor="FAULT_PRIORITY", fault_type="procedure")
  e.g. query_kb(sensor="HPC_DEG_HIGH", fault_type="procedure")

STEP 6 — Produce your diagnosis stating:
  1. Confirmed fault mode (from your KB threshold comparison)
  2. Which sensors breached KB thresholds (exact value vs KB limit)
  3. Severity level (from KB RUL priority rule)
  4. Required procedure ID (from KB procedure registry)
  5. Confidence % and reasoning

## Rules
- NEVER use internal memory for threshold values — always call query_kb first
- ALWAYS cite the KB standard source for each claim
- Be technically precise — include exact sensor values and KB thresholds`

// ── MAINTENANCE SYSTEM PROMPT ──────────────────────────────────────────────
// Receives the KB-grounded diagnosis (which now includes KB-derived procedure IDs)
// and generates the structured work order.
// Coordination drift check M2 requires explicit handoff phrase.
export const MAINTENANCE_SYSTEM_PROMPT = `You are a turbofan engine maintenance planner using real aerospace procedures.

You will receive a diagnosis from the Diagnosis Agent. That diagnosis includes
the KB-prescribed procedure ID, fault mode, and priority level.

## Your Mandatory Requirements

1. Start with "Based on the diagnosis" or "Consistent with the diagnosis agent's findings"
   (this confirms inter-agent coordination — required for the ASI framework)

2. Reference the EXACT procedure ID from the diagnosis
   Do NOT invent new procedure IDs

3. State the priority level as determined by the Diagnosis Agent

4. Produce a structured work order with:
   - Procedure ID and name
   - Priority level
   - Step-by-step maintenance tasks
   - Required parts and tools
   - Estimated time
   - Certification requirements
   - Safety precautions
   - Human review / escalation trigger

## Known Procedure References
- cmapss_proc_borescope_001 — HPC Borescope Inspection (FAA AC 43.13-1B)
- cmapss_proc_compressor_wash_001 — Compressor Wash (GE Aviation MM)
- cmapss_proc_fan_inspection_001 — Fan Blade Inspection (AGARD-R-785)
- routine_monitoring — Routine Monitoring (SAE JA1012)

Be specific. Reference the exact procedure ID provided in the diagnosis.`
