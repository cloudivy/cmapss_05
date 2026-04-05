// KB Query Tool — Autonomous Knowledge Base Interface
// =====================================================
// Updated to fully support FAN_DEG (FD003/FD004) alongside HPC_DEG (FD001/FD002).
//
// New in this version:
//   - FAN_DEG thresholds from AGARD-R-785 (s2, s8, s13, s15)
//   - Combined fault procedures: HPC_DEG+FAN_DEG_HIGH, HPC_DEG+FAN_DEG_CRITICAL
//   - Combined fault priority escalation rule
//   - query_kb now accepts sensor="HPC_DEG+FAN_DEG" for combined procedure lookup
//
// Separation of concerns:
//   kbQueryTool.js  → thresholds for AGENT to query at runtime (tool use)
//   driftAgent.js   → vocabulary for VALIDATOR to check (drift scoring)
//
// Referenced by: diagnosisAgent.js

// ── KB Thresholds ─────────────────────────────────────────────────────────
// Source: NASA TM-2008-215546, ISO 13379-1, AGARD-R-785
const KB_THRESHOLDS = {

  // ── HPC Degradation (FD001, FD002, FD003, FD004) ──────────────────────
  // Source: Saxena et al. 2008, ISO 13379-1
  HPC_DEG: {
    s3:  { op: '>',  value: 1592.0, label: 'HPC Outlet Temp',     unit: '°R',       standard: 'NASA TM-2008-215546' },
    s4:  { op: '>',  value: 1415.0, label: 'LPT Outlet Temp',     unit: '°R',       standard: 'NASA TM-2008-215546' },
    s7:  { op: '<',  value: 549.0,  label: 'HPC Outlet Pressure', unit: 'psia',     standard: 'ISO 13379-1'         },
    s11: { op: '<',  value: 47.0,   label: 'HPC Static Pressure', unit: 'psia',     standard: 'ISO 13379-1'         },
    s12: { op: '>',  value: 524.0,  label: 'Fuel Flow Ratio',     unit: 'pps/psia', standard: 'NASA TM-2008-215546' },
  },

  // ── Fan Degradation (FD003, FD004 only) ────────────────────────────────
  // Source: AGARD-R-785, Saxena et al. 2008 Section 3.3
  // Simulates rotor blade erosion, foreign object damage, tip clearance increase.
  FAN_DEG: {
    s2:  { op: '>',  value: 644.0,  label: 'LPC Outlet Temp',     unit: '°R',  standard: 'AGARD-R-785' },
    // s2 rises when fan inefficiency causes LPC inlet temperature to increase
    s8:  { op: '<',  value: 2385.0, label: 'Physical Fan Speed',  unit: 'rpm', standard: 'AGARD-R-785' },
    // s8 drops when fan blade erosion reduces rotor speed
    s13: { op: '<',  value: 2387.0, label: 'Corrected Fan Speed', unit: 'rpm', standard: 'AGARD-R-785' },
    // s13 drops — corrected speed normalised for altitude/temperature
    s15: { op: '<',  value: 8.40,   label: 'Bypass Ratio',        unit: '–',   standard: 'AGARD-R-785' },
    // s15 drops when fan produces less thrust relative to core
  },
}

// ── KB Priority Rules ──────────────────────────────────────────────────────
// Source: ISO 13381-1:2015, SAE JA1012
// Note: Combined fault (HPC_DEG+FAN_DEG) should escalate one priority level.
const KB_PRIORITY = [
  { max: 10,       priority: 'CRITICAL', action: 'Immediate grounding',    standard: 'ISO 13381-1:2015' },
  { max: 30,       priority: 'HIGH',     action: 'Ground within 48 hours', standard: 'ISO 13381-1:2015' },
  { max: 100,      priority: 'MEDIUM',   action: 'Schedule within 7 days', standard: 'SAE JA1012'       },
  { max: Infinity, priority: 'LOW',      action: 'Routine monitoring',     standard: 'SAE JA1012'       },
]

// ── KB Procedures ──────────────────────────────────────────────────────────
// Source: cmapss_scheduling_001, cmapss_equip_registry_001, AGARD-R-785
const KB_PROCEDURES = {

  // ── HPC_DEG procedures ──────────────────────────────────────────────────
  HPC_DEG_CRITICAL: { id: 'cmapss_proc_borescope_001',         name: 'HPC Borescope Inspection',       standard: 'FAA AC 43.13-1B' },
  HPC_DEG_HIGH:     { id: 'cmapss_proc_borescope_001',         name: 'HPC Borescope Inspection',       standard: 'FAA AC 43.13-1B' },
  HPC_DEG_MEDIUM:   { id: 'cmapss_proc_compressor_wash_001',   name: 'Compressor Wash',                standard: 'GE Aviation MM'  },
  HPC_DEG_LOW:      { id: 'cmapss_proc_compressor_wash_001',   name: 'Compressor Wash',                standard: 'GE Aviation MM'  },

  // ── FAN_DEG procedures ──────────────────────────────────────────────────
  // Source: AGARD-R-785 — Fan blade inspection procedures
  FAN_DEG_CRITICAL: { id: 'cmapss_proc_fan_inspection_001',    name: 'Fan Blade Inspection',           standard: 'AGARD-R-785'     },
  FAN_DEG_HIGH:     { id: 'cmapss_proc_fan_inspection_001',    name: 'Fan Blade Inspection',           standard: 'AGARD-R-785'     },
  FAN_DEG_MEDIUM:   { id: 'cmapss_proc_fan_inspection_001',    name: 'Fan Blade Inspection',           standard: 'AGARD-R-785'     },
  FAN_DEG_LOW:      { id: 'cmapss_proc_fan_inspection_001',    name: 'Fan Blade Inspection',           standard: 'AGARD-R-785'     },

  // ── Combined fault procedures (HPC_DEG + FAN_DEG) ──────────────────────
  // When both faults are active, BOTH procedures must be performed.
  // Priority is escalated one level above the RUL-derived priority.
  // Source: ISO 13381-1 §7.3 — combined fault escalation policy
  'HPC_DEG+FAN_DEG_CRITICAL': {
    id: 'cmapss_proc_borescope_001+cmapss_proc_fan_inspection_001',
    name: 'Combined HPC Borescope + Fan Blade Inspection',
    standard: 'FAA AC 43.13-1B + AGARD-R-785',
    note: 'Both procedures required. Perform concurrently where possible.',
  },
  'HPC_DEG+FAN_DEG_HIGH': {
    id: 'cmapss_proc_borescope_001+cmapss_proc_fan_inspection_001',
    name: 'Combined HPC Borescope + Fan Blade Inspection',
    standard: 'FAA AC 43.13-1B + AGARD-R-785',
    note: 'Ground within 48 hours. Both procedures required.',
  },
  'HPC_DEG+FAN_DEG_MEDIUM': {
    id: 'cmapss_proc_borescope_001+cmapss_proc_fan_inspection_001',
    name: 'Combined HPC Borescope + Fan Blade Inspection',
    standard: 'FAA AC 43.13-1B + AGARD-R-785',
    note: 'Schedule within 7 days. Both inspections required.',
  },

  // ── Nominal procedures ──────────────────────────────────────────────────
  NOMINAL_LOW:      { id: 'routine_monitoring', name: 'Routine Monitoring', standard: 'SAE JA1012' },
  NOMINAL_MEDIUM:   { id: 'routine_monitoring', name: 'Routine Monitoring', standard: 'SAE JA1012' },
}

// ── Main query function ────────────────────────────────────────────────────
export function queryKB(sensor, faultType) {

  // ── RUL priority table query ──────────────────────────────────────────
  if (faultType === 'priority') {
    return {
      query:       'RUL priority rules',
      source:      'ISO 13381-1:2015 + SAE JA1012',
      description: 'Maps RUL (cycles remaining) to maintenance priority and required action',
      rules: KB_PRIORITY.map(r => ({
        condition: r.max === Infinity ? 'RUL >= 100' : `RUL < ${r.max}`,
        priority:  r.priority,
        action:    r.action,
        standard:  r.standard,
      })),
      escalationRule: 'For combined faults (HPC_DEG+FAN_DEG): escalate priority one level above RUL-derived value. Per ISO 13381-1 §7.3.',
      usage: 'Find first matching condition for engine RUL. That is the KB-prescribed priority. Escalate one level if both HPC_DEG and FAN_DEG are confirmed.',
    }
  }

  // ── Procedure lookup ──────────────────────────────────────────────────
  if (faultType === 'procedure') {
    const proc = KB_PROCEDURES[sensor]
    if (!proc) {
      return {
        error:         `No procedure found for key: ${sensor}`,
        availableKeys: Object.keys(KB_PROCEDURES),
        hint:          'Key format: FAULT_PRIORITY e.g. HPC_DEG_HIGH, FAN_DEG_MEDIUM, HPC_DEG+FAN_DEG_HIGH, NOMINAL_LOW',
      }
    }
    return {
      query:       sensor,
      procedureId: proc.id,
      name:        proc.name,
      standard:    proc.standard,
      note:        proc.note || null,
      isCombined:  sensor.includes('+'),
      usage:       `Reference this exact procedure ID in your maintenance recommendation: ${proc.id}`,
    }
  }

  // ── All thresholds for a fault type ──────────────────────────────────
  if (faultType === 'all_thresholds') {
    const faultDef = KB_THRESHOLDS[sensor]
    if (!faultDef) {
      return {
        error:           `Unknown fault type: ${sensor}`,
        availableFaults: Object.keys(KB_THRESHOLDS),
        hint:            'Valid fault types for all_thresholds: HPC_DEG, FAN_DEG',
      }
    }
    return {
      query:      `All thresholds for ${sensor}`,
      faultType:  sensor,
      logic:      'ANY single threshold breach confirms this fault type',
      subsetsApplicable: sensor === 'FAN_DEG'
        ? 'FD003 and FD004 only — Fan degradation does not occur in FD001/FD002'
        : 'All subsets (FD001, FD002, FD003, FD004)',
      thresholds: Object.entries(faultDef).map(([s, def]) => ({
        sensor:    s,
        label:     def.label,
        operator:  def.op,
        threshold: def.value,
        unit:      def.unit,
        standard:  def.standard,
        rule:      `If ${s} (${def.label}) ${def.op} ${def.value} ${def.unit} → ${sensor} confirmed [${def.standard}]`,
      })),
    }
  }

  // ── Single sensor threshold query ────────────────────────────────────
  const faultDef = KB_THRESHOLDS[faultType]
  if (!faultDef) {
    return {
      error:           `Unknown fault type: ${faultType}`,
      availableFaults: Object.keys(KB_THRESHOLDS),
      hint:            'Valid fault types: HPC_DEG, FAN_DEG',
    }
  }

  const sensorDef = faultDef[sensor]
  if (!sensorDef) {
    return {
      error:            `Sensor ${sensor} not in KB for fault type ${faultType}`,
      availableSensors: Object.keys(faultDef),
      hint:             `Sensors defined for ${faultType}: ${Object.keys(faultDef).join(', ')}`,
    }
  }

  return {
    query:     `${sensor} threshold for ${faultType}`,
    sensor,
    faultType,
    label:     sensorDef.label,
    operator:  sensorDef.op,
    threshold: sensorDef.value,
    unit:      sensorDef.unit,
    standard:  sensorDef.standard,
    rule:      `If ${sensor} (${sensorDef.label}) ${sensorDef.op} ${sensorDef.value} ${sensorDef.unit} → ${faultType} indicator [${sensorDef.standard}]`,
    howToUse:  `Compare actual sensor value against threshold using operator '${sensorDef.op}'. Breach = (actual ${sensorDef.op} ${sensorDef.value}).`,
  }
}

// ── OpenAI function calling schema ────────────────────────────────────────
// Updated description to guide agent through combined fault querying.
export function buildKBToolDefinition() {
  return {
    type: 'function',
    function: {
      name: 'query_kb',
      description: `Query the NASA CMAPSS Knowledge Base (KB) to retrieve:
- All thresholds for HPC fault: use fault_type="all_thresholds", sensor="HPC_DEG"
- All thresholds for Fan fault: use fault_type="all_thresholds", sensor="FAN_DEG"
- Single sensor threshold: use sensor="s3", fault_type="HPC_DEG"
- RUL priority mapping: use sensor="RUL", fault_type="priority"
- Single fault procedure: use sensor="HPC_DEG_HIGH", fault_type="procedure"
- Fan fault procedure:    use sensor="FAN_DEG_HIGH", fault_type="procedure"
- Combined fault procedure: use sensor="HPC_DEG+FAN_DEG_HIGH", fault_type="procedure"

CRITICAL RULES:
1. Always call this tool BEFORE making any diagnostic claim.
2. Never use your internal memory for threshold values.
3. For FD003 engines, ALWAYS query BOTH HPC_DEG and FAN_DEG thresholds.
4. If BOTH fault types are confirmed, retrieve the combined procedure key.`,
      parameters: {
        type: 'object',
        properties: {
          sensor: {
            type: 'string',
            description: `What to query:
- Sensor ID (s2,s3,s4,s7,s8,s9,s11,s12,s13,s14,s15) for single threshold
- "HPC_DEG" or "FAN_DEG" when fault_type is "all_thresholds"
- "RUL" when fault_type is "priority"
- Procedure key examples:
    "HPC_DEG_HIGH"         → HPC fault, high priority
    "FAN_DEG_MEDIUM"       → Fan fault, medium priority
    "HPC_DEG+FAN_DEG_HIGH" → Both faults, high priority (FD003 combined)
    "NOMINAL_LOW"          → No fault, low priority`,
          },
          fault_type: {
            type: 'string',
            enum: ['HPC_DEG', 'FAN_DEG', 'priority', 'procedure', 'all_thresholds'],
            description: `Query category:
- "all_thresholds": get all thresholds for a fault type at once (fastest, do this first)
- "HPC_DEG": single sensor threshold for HPC degradation
- "FAN_DEG": single sensor threshold for Fan degradation
- "priority": get full RUL-to-priority table (includes combined fault escalation rule)
- "procedure": get maintenance procedure ID for a fault+priority combination`,
          },
        },
        required: ['sensor', 'fault_type'],
      },
    },
  }
}
