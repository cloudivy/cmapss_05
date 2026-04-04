// DriftPanel — SFS + IGS Drift Display
// Based on: Rath (2026) "Agent Drift: Quantifying Behavioral Degradation
//           in Multi-Agent LLM Systems Over Extended Interactions"
//
// Shows two metrics clearly:
//   SFS (Semantic Fidelity Score)    — Agent 2 — did it use the KB?
//   IGS (Inter-Agent Grounding Score)— Agent 3 — did it use Agent 2's output?

import { getAllMemory } from '../agents/driftAgent.js'

// ── Colour helpers ─────────────────────────────────────────────────────────
const scoreColor = s => s >= 0.75 ? '#3fb950' : s >= 0.5 ? '#d29922' : '#f85149'
const driftColor = s => s === 0 ? '#3fb950' : s <= 25 ? '#d29922' : s <= 50 ? '#f0883e' : '#f85149'
const scoreIcon  = s => s >= 0.75 ? '✅' : s >= 0.5 ? '🟡' : '🔴'
const pct        = v => `${Math.round(v * 100)}%`

// ── Signal Card ────────────────────────────────────────────────────────────
function SignalCard({ signal }) {
  return (
    <div className={`exp-card ${signal.passed ? 'exp-pass' : 'exp-fail'}`}>
      <div className="exp-card-header">
        <span className="exp-icon">{signal.passed ? '✅' : '❌'}</span>
        <span className="exp-id">{signal.id}</span>
        <span className="exp-name">{signal.name}</span>
        <span className={`exp-drift-type exp-drift-${signal.driftType}`}>
          {signal.driftType === 'semantic' ? 'Semantic' : 'Coordination'}
        </span>
        <span className="exp-source">{signal.source}</span>
      </div>
      <div className="exp-kb-fact">
        <span className="exp-label">KB expects:</span> {signal.kbFact}
      </div>
      <div className="exp-agent-claim">
        <span className="exp-label">Agent did:</span> {signal.agentDid}
      </div>
      {!signal.passed && (
        <div className="exp-explanation">
          <span className="exp-label">Why drift:</span> {signal.detail}
        </div>
      )}
    </div>
  )
}

// ── Score Bar ──────────────────────────────────────────────────────────────
function ScoreBar({ value, threshold = 0.75 }) {
  const col = scoreColor(value)
  return (
    <div style={{ position: 'relative' }}>
      <div className="drift-bar-bg">
        <div className="drift-bar-fill" style={{ width: pct(value), background: col }} />
      </div>
      {/* threshold marker */}
      <div
        style={{
          position: 'absolute', top: '-3px',
          left: `${threshold * 100}%`,
          width: '2px', height: '12px',
          background: '#f0883e', borderRadius: '1px',
        }}
        title={`τ = ${threshold}`}
      />
    </div>
  )
}

// ── Metric Block ───────────────────────────────────────────────────────────
function MetricBlock({ agentResult, metricName, agentLabel, icon }) {
  if (!agentResult) return null
  const col = scoreColor(agentResult.ASI)
  return (
    <div className="agent-drift-block">
      <div className="agent-drift-header">
        <span className="agent-drift-label">{icon} {agentLabel}</span>
        <span className="agent-drift-asi" style={{ color: col }}>
          {metricName} = {agentResult.ASI.toFixed(3)}
        </span>
      </div>
      <div className="agent-drift-note">{agentResult.fullName || metricName}</div>
      <ScoreBar value={agentResult.ASI} />
      <div style={{ marginTop: '6px', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', color: col, fontWeight: 600 }}>
          {scoreIcon(agentResult.ASI)} {agentResult.verdict}
        </span>
      </div>
      {/* Signal breakdown */}
      {agentResult.signals && agentResult.signals.map(s => (
        <SignalCard key={s.id} signal={s} />
      ))}
    </div>
  )
}

// ── Memory Log ─────────────────────────────────────────────────────────────
function MemoryLogPanel() {
  const allMemory = getAllMemory()
  const engines   = Object.keys(allMemory)
  if (engines.length === 0) return null

  return (
    <div className="memory-log">
      <div className="memory-log-title">🗂️ Memory Log — All Stored Runs</div>
      {engines.map(engineId => (
        <div key={engineId} className="memory-engine-block">
          <div className="memory-engine-header">{engineId}</div>
          {allMemory[engineId].map((run, i) => {
            const ts = run.timestamp ? new Date(run.timestamp).toLocaleString() : `Run ${i + 1}`
            return (
              <div key={i} className="memory-run-row">
                <div className="memory-run-top">
                  <span className="memory-run-ts">{i === 0 ? '🔵 Latest' : ts}</span>
                  <span className="memory-run-score" style={{ color: driftColor(run.driftScore) }}>
                    {run.driftScore}/100
                  </span>
                  <span className="memory-run-asi">ASI {run.ASI}</span>
                  <span className="memory-run-verdict"
                    style={{ color: driftColor(run.driftScore), fontSize: '9px', fontWeight: 600 }}>
                    {run.verdict}
                  </span>
                </div>
                <div className="memory-run-steps">
                  {run.SFS !== undefined && (
                    <span className="memory-step" style={{ color: scoreColor(run.SFS) }}>
                      📐 SFS: {run.SFS.toFixed(2)}
                    </span>
                  )}
                  {run.IGS !== undefined && (
                    <span className="memory-step" style={{ color: scoreColor(run.IGS) }}>
                      🔗 IGS: {run.IGS.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ── Run History ────────────────────────────────────────────────────────────
function RunHistory({ runHistory, engineId }) {
  if (!runHistory || runHistory.length === 0) return null
  return (
    <div className="run-history">
      <div className="run-history-title">Run History — {engineId}</div>
      <div className="run-history-list">
        {runHistory.map((r, i) => {
          const col  = driftColor(r.driftScore)
          const ts   = r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : `Run ${runHistory.length - i}`
          const trend = i < runHistory.length - 1
            ? r.driftScore < runHistory[i + 1].driftScore ? '↓'
            : r.driftScore > runHistory[i + 1].driftScore ? '↑' : '→'
            : '—'
          const trendColor = trend === '↓' ? '#3fb950' : trend === '↑' ? '#f85149' : '#8b949e'
          return (
            <div key={i} className="run-history-row">
              <span className="run-ts">{i === 0 ? '🔵 Latest' : ts}</span>
              <span className="run-score" style={{ color: col }}>{r.driftScore}/100</span>
              <span className="run-asi">ASI {r.ASI}</span>
              {r.SFS !== undefined && (
                <span style={{ fontSize: '10px', color: scoreColor(r.SFS) }}>
                  SFS {r.SFS.toFixed(2)}
                </span>
              )}
              {r.IGS !== undefined && (
                <span style={{ fontSize: '10px', color: scoreColor(r.IGS) }}>
                  IGS {r.IGS.toFixed(2)}
                </span>
              )}
              <span className="run-trend" style={{ color: trendColor }}>{trend}</span>
            </div>
          )
        })}
      </div>
      {runHistory.length >= 2 && (() => {
        const delta    = runHistory[0].driftScore - runHistory[1].driftScore
        const trendMsg = delta < 0 ? `↓ Improved by ${Math.abs(delta)} points vs last run`
                       : delta > 0 ? `↑ Increased by ${delta} points vs last run`
                       : '→ No change vs last run'
        const trendCol = delta < 0 ? '#3fb950' : delta > 0 ? '#f85149' : '#8b949e'
        return <div className="run-trend-summary" style={{ color: trendCol }}>{trendMsg}</div>
      })()}
    </div>
  )
}

// ── Main Panel ─────────────────────────────────────────────────────────────
export default function DriftPanel({ result, runHistory = [] }) {

  if (!result) return (
    <aside className="drift-panel">
      <div className="drift-title">📊 Drift Validator</div>
      <div className="drift-empty">
        <p>Drift report appears here after analysis.</p>
        <p className="drift-hint">
          <strong>SFS</strong> (Semantic Fidelity Score) — Did Agent 2 demonstrably use the KB?
        </p>
        <p className="drift-hint">
          <strong>IGS</strong> (Inter-Agent Grounding Score) — Did Agent 3 carry Agent 2's KB-grounded content?
        </p>
        <p className="drift-hint">
          <strong>ASI</strong> = (SFS + IGS) / 2 — τ = 0.75 drift threshold (Rath 2026)
        </p>
        <p className="drift-hint">
          Fully deterministic — no LLM in validator. Uses kbCallLog audit trail.
        </p>
      </div>
      <MemoryLogPanel />
    </aside>
  )

  const asiColor   = scoreColor(result.ASI)
  const driftCol   = driftColor(result.driftScore)

  return (
    <aside className="drift-panel">
      <div className="drift-title">📊 Drift Validator</div>
      <div className="drift-engine">{result.engineId}</div>

      {/* ── Overall Drift Score ────────────────────────────────────────── */}
      <div className="drift-score-section">
        <div className="drift-score-label">Overall Drift Score</div>
        <div className="drift-score-val" style={{ color: driftCol }}>{result.driftScore}/100</div>
        <div className="drift-bar-bg">
          <div className="drift-bar-fill" style={{ width: `${result.driftScore}%`, background: driftCol }} />
        </div>
        <div className="drift-verdict" style={{ color: driftCol }}>
          {result.driftScore === 0 ? '✅' : result.driftScore <= 25 ? '🟡' : result.driftScore <= 50 ? '🟠' : '🔴'} {result.verdict}
        </div>
      </div>

      {/* ── ASI Score ─────────────────────────────────────────────────── */}
      <div className="asi-score-section">
        <div className="asi-score-row">
          <span className="asi-score-label">ASI = (SFS + IGS) / 2</span>
          <span className="asi-score-val" style={{ color: asiColor }}>{result.ASI.toFixed(3)}</span>
        </div>
        <ScoreBar value={result.ASI} threshold={0.75} />
        <div className="asi-threshold-label">
          τ = 0.75 {result.ASI < 0.75 ? '⚠️ DRIFT DETECTED' : '✅ STABLE'}
        </div>
      </div>

      {/* ── Metric Summary Table ───────────────────────────────────────── */}
      <div className="drift-thresholds">
        <div className="drift-thresh-title">Metric Summary (Rath 2026)</div>

        {/* SFS row */}
        <div className="drift-thresh-row">
          <span className="drift-thresh-sensor" style={{ width: '40px', color: '#58a6ff' }}>SFS</span>
          <span className="drift-thresh-val" style={{ flex: 1 }}>Semantic Fidelity — Agent 2</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: scoreColor(result.SFS) }}>
            {result.SFS.toFixed(3)}
          </span>
          <span className={`drift-thresh-status ${result.driftTypes.semanticDrift ? 'triggered' : 'ok'}`}
            style={{ marginLeft: '6px' }}>
            {result.driftTypes.semanticDrift ? '⚠️ DRIFT' : '✅ OK'}
          </span>
        </div>

        {/* IGS row */}
        <div className="drift-thresh-row">
          <span className="drift-thresh-sensor" style={{ width: '40px', color: '#bc8cff' }}>IGS</span>
          <span className="drift-thresh-val" style={{ flex: 1 }}>Inter-Agent Grounding — Agent 3</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: scoreColor(result.IGS) }}>
            {result.IGS.toFixed(3)}
          </span>
          <span className={`drift-thresh-status ${result.driftTypes.coordinationDrift ? 'triggered' : 'ok'}`}
            style={{ marginLeft: '6px' }}>
            {result.driftTypes.coordinationDrift ? '⚠️ DRIFT' : '✅ OK'}
          </span>
        </div>

        {/* ASI row */}
        <div className="drift-thresh-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '6px', marginTop: '4px' }}>
          <span className="drift-thresh-sensor" style={{ width: '40px', color: asiColor }}>ASI</span>
          <span className="drift-thresh-val" style={{ flex: 1 }}>Agent Stability Index (Overall)</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: asiColor }}>
            {result.ASI.toFixed(3)}
          </span>
          <span className={`drift-thresh-status ${result.ASI < 0.75 ? 'triggered' : 'ok'}`}
            style={{ marginLeft: '6px' }}>
            {result.ASI < 0.75 ? '⚠️ DRIFT' : '✅ STABLE'}
          </span>
        </div>
      </div>

      {/* ── Drift Type Flags ───────────────────────────────────────────── */}
      <div className="drift-types-section">
        <div className="drift-types-title">Drift Taxonomy (Rath 2026 §2.3)</div>
        <div className="drift-type-row">
          <span className={`drift-type-badge ${result.driftTypes.semanticDrift     ? 'drift-active' : 'drift-ok'}`}>
            {result.driftTypes.semanticDrift     ? '⚠️' : '✅'} Semantic (SFS)
          </span>
          <span className={`drift-type-badge ${result.driftTypes.coordinationDrift ? 'drift-active' : 'drift-ok'}`}>
            {result.driftTypes.coordinationDrift ? '⚠️' : '✅'} Coordination (IGS)
          </span>
        </div>
      </div>

      {/* ── SFS — Agent 2 Detail ───────────────────────────────────────── */}
      <div className="asi-categories">
        <div className="asi-categories-title">SFS — Semantic Fidelity (Agent 2)</div>
        <div className="asi-formula-note">
          SFS = (KB queried + sensors cited + standard cited) / 3
        </div>
        <MetricBlock
          agentResult={{ ...result.agent2, ASI: result.SFS, signals: result.agent2.signals }}
          metricName="SFS"
          agentLabel="Agent 2 — Diagnosis (GPT-4o)"
          icon="🧠"
        />
      </div>

      {/* ── IGS — Agent 3 Detail ───────────────────────────────────────── */}
      <div className="asi-categories">
        <div className="asi-categories-title">IGS — Inter-Agent Grounding (Agent 3)</div>
        <div className="asi-formula-note">
          IGS = (handoff phrase + procedure ID carried) / 2
        </div>
        <MetricBlock
          agentResult={{ ...result.agent3, ASI: result.IGS, signals: result.agent3.signals }}
          metricName="IGS"
          agentLabel="Agent 3 — Maintenance (GPT-4o)"
          icon="🔧"
        />
      </div>

      {/* ── Run History ────────────────────────────────────────────────── */}
      <RunHistory runHistory={runHistory} engineId={result.engineId} />

      {/* ── Full Memory Log ────────────────────────────────────────────── */}
      <MemoryLogPanel />

      <div className="drift-source">
        SFS: Semantic Fidelity · IGS: Inter-Agent Grounding<br />
        ASI: Rath (2026) arXiv:2601.04070 · τ = 0.75<br />
        KB: NASA TM-2008-215546 · ISO 13381-1 · FAA AC 43.13-1B
      </div>
    </aside>
  )
}
