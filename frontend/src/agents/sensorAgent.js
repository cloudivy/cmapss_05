// Sensor Agent — pure JS, no API call needed
// =====================================================
// ARCHITECTURE NOTE:
//   This agent produces TWO outputs from the same sensor data:
//
//   1. sensorReport (passed to Diagnosis Agent LLM)
//      → Raw sensor values ONLY — no breach flags, no fault conclusions
//      → The LLM must query the KB to discover thresholds itself
//
//   2. The full breach analysis is done separately in driftAgent.js
//      via validateSensorStep() — this is the KB ground truth
//
// This separation is critical for meaningful drift measurement.
// If we hand breach flags to the LLM, we are giving it the answer.
// The LLM must reason from raw values → KB query → comparison → diagnosis.

export function generateSensorReport(engine) {
  const { id, name, cycle, rul, sensors } = engine

  // ── Raw sensor table — values only, no status flags passed to LLM ─────────
  const rows = Object.entries(sensors).map(([key, s]) =>
    `| ${key.padEnd(4)} | ${s.label.padEnd(26)} | ${String(s.value).padEnd(10)} | ${s.unit.padEnd(9)} |`
  ).join('\n')

  // RUL status shown (this is observable fact, not KB-derived diagnosis)
  const rulStatus = rul < 10 ? '🔴 CRITICAL (<10 cycles)'
    : rul < 30  ? '🔴 HIGH (10–30 cycles)'
    : rul < 100 ? '⚠️ MEDIUM (30–100 cycles)'
    : '✅ LOW (>100 cycles)'

  return `## Sensor Monitor Report — ${name} (${id})

**Dataset:** NASA CMAPSS FD001 | **Cycle:** ${cycle} | **RUL:** ${rul} cycles | **RUL Band:** ${rulStatus}

### Raw Sensor Readings
| Sensor | Description                | Value      | Unit      |
|--------|----------------------------|------------|-----------|
${rows}

*${Object.keys(sensors).length} diagnostic sensors recorded at cycle ${cycle}.*
*Source: Saxena et al. 2008 — NASA TM-2008-215546*

---
**Instructions for Diagnosis Agent:**
Query the knowledge base (query_kb tool) to retrieve fault thresholds for each sensor.
Compare the raw values above against KB thresholds to determine fault mode and severity.
Do NOT infer fault status from value proximity — always retrieve KB thresholds first.`
}
