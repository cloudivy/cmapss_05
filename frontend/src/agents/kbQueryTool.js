// KB Query Tool — Autonomous Knowledge Base Interface
// =====================================================
// Exposes KB thresholds as a callable tool for the Diagnosis Agent.
//
// IMPORTANT: This file is self-contained.
// KB thresholds live HERE — not imported from driftAgent.js
//
// Separation of concerns:
//   kbQueryTool.js  → thresholds for AGENT to query (tool use)
//   driftAgent.js   → vocabulary/standards for VALIDATOR to check (drift)
//
// Referenced by: diagnosisAgent.js

// ── KB Thresholds (self-contained) ────────────────────────────────────────
// Source: NASA TM-2008-215546, ISO 13379-1, AGARD-R-785
const KB_THRESHOLDS = {
  HPC_DEG: {
    s3:  { op: '>',  value: 1592.0, label: 'HPC Outlet Temp',     unit: '°R',       standard: 'NASA TM-2008-215546' },
    s4:  { op: '>',  value: 1415.0, label: 'LPT Outlet Temp',     unit: '°R',       standard: 'NASA TM-2008-215546' },
    s7:  { op: '<',  value: 549.0,  label: 'HPC Outlet Pressure', unit: 'psia',     standard: 'ISO 13379-1'         },
    s11: { op: '<',  value: 47.0,   label: 'HPC Static Pressure', unit: 'psia',     standard: 'ISO 13379-1'         },
    s12: { op: '>',  value: 524.0,  label: 'Fuel Flow Ratio',     unit: 'pps/psia', standard: 'NASA TM-2008-215546' },
  },
  FAN_DEG: {
    s8:  { op: '<', value: 2385.0, label: 'Physical Fan Speed',  unit: 'rpm', standard: 'AGARD-R-785' },
    s13: { op: '<', value: 2388.0, label: 'Corrected Fan Speed', unit: 'rpm', standard: 'AGARD-R-785' },
    s15: { op: '<', value: 8.40,   label: 'Bypass Ratio',        unit: '–',   standard: 'AGARD-R-785' },
  },
}

// ── KB Priority Rules ──────────────────────────────────────────────────────
// Source: ISO 13381-1:2015, SAE JA1012
const KB_PRIORITY = [
  { max: 10,       priority: 'CRITICAL', action: 'Immediate grounding',    standard: 'ISO 13381-1:2015' },
  { max: 30,       priority: 'HIGH',     action: 'Ground within 48 hours', standard: 'ISO 13381-1:2015' },
  { max: 100,      priority: 'MEDIUM',   action: 'Schedule within 7 days', standard: 'SAE JA1012'       },
  { max: Infinity, priority: 'LOW',      action: 'Routine monitoring',     standard: 'SAE JA1012'       },
]

// ── KB Procedures ──────────────────────────────────────────────────────────
// Source: cmapss_scheduling_001, cmapss_equip_registry_001
const KB_PROCEDURES = {
  HPC_DEG_CRITICAL: { id: 'cmapss_proc_borescope_001',       name: 'HPC Borescope Inspection', standard: 'FAA AC 43.13-1B' },
  HPC_DEG_HIGH:     { id: 'cmapss_proc_borescope_001',       name: 'HPC Borescope Inspection', standard: 'FAA AC 43.13-1B' },
  HPC_DEG_MEDIUM:   { id: 'cmapss_proc_compressor_wash_001', name: 'Compressor Wash',          standard: 'GE Aviation MM'  },
  HPC_DEG_LOW:      { id: 'cmapss_proc_compressor_wash_001', name: 'Compressor Wash',          standard: 'GE Aviation MM'  },
  FAN_DEG_CRITICAL: { id: 'cmapss_proc_fan_inspection_001',  name: 'Fan Blade Inspection',     standard: 'AGARD-R-785'     },
  FAN_DEG_HIGH:     { id: 'cmapss_proc_fan_inspection_001',  name: 'Fan Blade Inspection',     standard: 'AGARD-R-785'     },
  FAN_DEG_MEDIUM:   { id: 'cmapss_proc_fan_inspection_001',  name: 'Fan Blade Inspection',     standard: 'AGARD-R-785'     },
  FAN_DEG_LOW:      { id: 'cmapss_proc_fan_inspection_001',  name: 'Fan Blade Inspection',     standard: 'AGARD-R-785'     },
  NOMINAL_LOW:      { id: 'routine_monitoring',              name: 'Routine Monitoring',       standard: 'SAE JA1012'      },
  NOMINAL_MEDIUM:   { id: 'routine_monitoring',              name: 'Routine Monitoring',       standard: 'SAE JA1012'      },
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
      usage: 'Find first matching condition for the engine RUL. That is the KB-prescribed priority.',
    }
  }

  // ── Procedure lookup ──────────────────────────────────────────────────
  if (faultType === 'procedure') {
    const proc = KB_PROCEDURES[sensor]
    if (!proc) {
      return {
        error:         `No procedure found for key: ${sensor}`,
        availableKeys: Object.keys(KB_PROCEDURES),
        hint:          'Key format is FAULT_PRIORITY e.g. HPC_DEG_HIGH, FAN_DEG_MEDIUM, NOMINAL_LOW',
      }
    }
    return {
      query:       sensor,
      procedureId: proc.id,
      name:        proc.name,
      standard:    proc.standard,
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
      }
    }
    return {
      query:      `All thresholds for ${sensor}`,
      faultType:  sensor,
      logic:      'ANY single threshold breach confirms this fault type',
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
export function buildKBToolDefinition() {
  return {
    type: 'function',
    function: {
      name: 'query_kb',
      description: `Query the NASA CMAPSS Knowledge Base (KB) to retrieve:
- All thresholds for a fault type: use fault_type="all_thresholds", sensor="HPC_DEG" or "FAN_DEG"
- Single sensor threshold: use sensor="s3", fault_type="HPC_DEG"
- RUL priority mapping: use sensor="RUL", fault_type="priority"
- Maintenance procedure: use sensor="HPC_DEG_HIGH", fault_type="procedure"

CRITICAL: Always call this tool BEFORE making any diagnostic claim.
Never use your internal memory for threshold values — they must come from this tool.`,
      parameters: {
        type: 'object',
        properties: {
          sensor: {
            type: 'string',
            description: `What to query:
- Sensor ID (s2,s3,s4,s7,s8,s9,s11,s12,s13,s14,s15) for single threshold lookup
- "HPC_DEG" or "FAN_DEG" when fault_type is "all_thresholds"
- "RUL" when fault_type is "priority"
- Procedure key like "HPC_DEG_HIGH" or "FAN_DEG_MEDIUM" when fault_type is "procedure"`,
          },
          fault_type: {
            type: 'string',
            enum: ['HPC_DEG', 'FAN_DEG', 'priority', 'procedure', 'all_thresholds'],
            description: `Query category:
- "all_thresholds": get all thresholds for a fault type at once (fastest, recommended first)
- "HPC_DEG": single sensor threshold for HPC degradation
- "FAN_DEG": single sensor threshold for Fan degradation
- "priority": get full RUL-to-priority table
- "procedure": get maintenance procedure ID for a fault+priority combination`,
          },
        },
        required: ['sensor', 'fault_type'],
      },
    },
  }
}
