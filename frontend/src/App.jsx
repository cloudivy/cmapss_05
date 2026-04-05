import { useState, useCallback } from 'react'
import { ENGINES } from './data/engines.js'
import { generateSensorReport } from './agents/sensorAgent.js'
import { streamDiagnosis } from './agents/diagnosisAgent.js'
import { streamMaintenance } from './agents/maintenanceAgent.js'
import { validateDrift, saveRunToMemory, getEngineMemory } from './agents/driftAgent.js'
import Sidebar from './components/Sidebar.jsx'
import Chat from './components/Chat.jsx'
import DriftPanel from './components/DriftPanel.jsx'

let msgId = 0
const newId = () => ++msgId

export default function App() {
  const [apiKey, setApiKey]           = useState('')
  const [keyInput, setKeyInput]       = useState('')
  const [messages, setMessages]       = useState([{
    id: newId(), role: 'system',
    content: `👋 Welcome to the **NASA CMAPSS Predictive Maintenance AI** — Autonomous Agent Edition.

Select an engine and click **"Analyse"** to run the full pipeline:

1. 📡 **Sensor Monitor** — reads raw sensor values (no fault flags)
2. 🧠 **Diagnosis Agent (GPT-4o)** — autonomously queries the KB for thresholds, compares values, diagnoses
3. 🔧 **Maintenance Planner (GPT-4o)** — generates work order from KB-grounded diagnosis
4. 📊 **Drift Validator** — measures SFS v2 (6 signals: Tier 1 Process + Tier 2 Reasoning) and IGS

**Two datasets available:**
- **FD001** engines (ENG-001, ENG-055, ENG-023) — HPC degradation only
- **FD003** engines (ENG-F014, ENG-F031, ENG-F067) — HPC + Fan degradation (dual fault modes)

Watch the **🔍 KB Query** steps appear live as the Diagnosis Agent retrieves thresholds autonomously.`,
    streaming: false,
  }])
  const [driftResult, setDriftResult]   = useState(null)
  const [runHistory, setRunHistory]     = useState([])
  const [running, setRunning]           = useState(false)
  const [activeEngine, setActiveEngine] = useState(null)

  // ── Message helpers ──────────────────────────────────────────────────────
  const addMsg = useCallback((role, content, label = '') => {
    const id = newId()
    setMessages(prev => [...prev, { id, role, content, label, streaming: false }])
    return id
  }, [])

  const addStreaming = useCallback((role, label = '') => {
    const id = newId()
    setMessages(prev => [...prev, { id, role, content: '', label, streaming: true }])
    return id
  }, [])

  const updateMsg = useCallback((id, content) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, content } : m))
  }, [])

  const finishMsg = useCallback((id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, streaming: false } : m))
  }, [])

  // ── Run full pipeline for an engine ─────────────────────────────────────
  const analyseEngine = useCallback(async (engine) => {
    if (running) return
    if (!apiKey) { addMsg('system', '⚠️ Please enter your OpenAI API key first.'); return }

    setRunning(true)
    setActiveEngine(engine.id)
    setDriftResult(null)
    setRunHistory(getEngineMemory(engine.id))

    addMsg('user',
      `Analyse engine **${engine.name}** (${engine.id}) — Dataset: ${engine.subset} | RUL: ${engine.rul} cycles | Fault: ${engine.faultMode} | Score: ${engine.anomalyScore}/100`
    )

    // ── Step 1 — Sensor Agent (pure JS, instant) ──────────────────────────
    addMsg('agent', '⏳ Running Sensor Monitor…', '📡 Sensor Monitor')
    const sensorReport = generateSensorReport(engine)
    setMessages(prev => {
      const last = [...prev]
      last[last.length - 1] = { ...last[last.length - 1], content: sensorReport }
      return last
    })

    // ── Step 2 — Diagnosis Agent (agentic KB query loop) ─────────────────
    const diagId = addStreaming('agent', `🧠 Diagnosis Agent (GPT-4o) — Querying KB [${engine.subset}]…`)
    let diagnosisText = ''
    let kbCallLog     = []
    try {
      const result  = await streamDiagnosis(apiKey, engine, sensorReport, txt => updateMsg(diagId, txt))
      diagnosisText = result.diagnosisText
      kbCallLog     = result.kbCallLog || []
      finishMsg(diagId)
    } catch (e) {
      updateMsg(diagId, `❌ API Error: ${e.message}`)
      finishMsg(diagId)
      setRunning(false)
      return
    }

    // ── Step 2b — KB Query Log ────────────────────────────────────────────
    if (kbCallLog.length > 0) {
      const queryLines = kbCallLog.map((c, i) => {
        const q = c.query
        const label =
          q.fault_type === 'all_thresholds' ? `All ${q.sensor} thresholds`
          : q.fault_type === 'priority'     ? 'RUL → Priority rules'
          : q.fault_type === 'procedure'    ? `Procedure for ${q.sensor}`
          : `${q.sensor} (${q.fault_type})`
        const summary = c.result.error          ? `⚠️ ${c.result.error}`
          : c.result.thresholds ? `${c.result.thresholds.length} thresholds`
          : c.result.rules      ? `${c.result.rules.length} rules`
          : c.result.procedureId ? c.result.procedureId
          : 'retrieved'
        return `${i + 1}. **${label}** → ${summary}`
      })
      addMsg('system',
        `🔍 **Autonomous KB Call Log — ${kbCallLog.length} query(s) made by Diagnosis Agent:**\n\n` +
        queryLines.join('\n') +
        `\n\nAgent retrieved these values from the KB before making any diagnostic claim.`,
        '📚 KB Query Log'
      )
    }

    // ── Step 3 — Maintenance Agent (streaming) ────────────────────────────
    const maintId = addStreaming('agent', '🔧 Maintenance Planner (GPT-4o)')
    let maintenanceText = ''
    try {
      maintenanceText = await streamMaintenance(apiKey, engine, diagnosisText, txt => updateMsg(maintId, txt))
      finishMsg(maintId)
    } catch (e) {
      updateMsg(maintId, `❌ API Error: ${e.message}`)
      finishMsg(maintId)
      setRunning(false)
      return
    }

    // ── Step 4 — Drift Validation ─────────────────────────────────────────
    const drift = validateDrift(engine, diagnosisText, maintenanceText, kbCallLog)
    saveRunToMemory(drift)
    setRunHistory(getEngineMemory(engine.id))
    setDriftResult(drift)

    // ── Step 4b — SFS Result (Diagnosis Agent) — with tier breakdown ──────
    const sfsIcon    = drift.SFS >= 0.75 ? '✅' : drift.SFS >= 0.5 ? '🟡' : '🔴'
    const tier1Score = drift.sfsTier1?.score.toFixed(3) || '—'
    const tier2Score = drift.sfsTier2?.score.toFixed(3) || '—'

    addMsg('system',
      `${sfsIcon} **SFS v2 (Semantic Fidelity Score): ${drift.SFS.toFixed(3)} — ${drift.agent2.verdict}**\n\n` +
      `**Tier 1 — Process Fidelity:** ${tier1Score} ${drift.driftTypes.processDrift ? '⚠️ DRIFT' : '✅ OK'}\n` +
      `**Tier 2 — Reasoning Fidelity:** ${tier2Score} ${drift.driftTypes.reasoningDrift ? '⚠️ DRIFT' : '✅ OK'}\n\n` +
      drift.agent2.signals.map(s =>
        `${s.passed ? '✅' : '❌'} **[T${s.tier}] ${s.name}**\n` +
        `  ${s.agentDid}`
      ).join('\n\n'),
      '📐 SFS v2 — Semantic Fidelity'
    )

    // ── Step 4c — IGS Result (Maintenance Agent) ─────────────────────────
    const igsIcon = drift.IGS >= 0.75 ? '✅' : drift.IGS >= 0.5 ? '🟡' : '🔴'
    addMsg('system',
      `${igsIcon} **IGS (Inter-Agent Grounding Score): ${drift.IGS.toFixed(3)} — ${drift.agent3.verdict}**\n\n` +
      drift.agent3.signals.map(s =>
        `${s.passed ? '✅' : '❌'} **${s.name}**\n` +
        `  ${s.agentDid}`
      ).join('\n\n'),
      '🔗 IGS — Inter-Agent Grounding'
    )

    // ── Step 4d — Final ASI Summary ───────────────────────────────────────
    const driftIcon = drift.driftScore === 0 ? '✅'
      : drift.driftScore <= 25 ? '🟡'
      : drift.driftScore <= 50 ? '🟠' : '🔴'

    addMsg('system',
      `${driftIcon} **Overall ASI: ${drift.ASI.toFixed(3)} — ${drift.verdict}**\n\n` +
      `| Metric | Score | Status |\n` +
      `|--------|-------|--------|\n` +
      `| SFS Tier 1 (Process Fidelity)   | ${tier1Score} | ${drift.driftTypes.processDrift     ? '⚠️ DRIFT' : '✅ OK'} |\n` +
      `| SFS Tier 2 (Reasoning Fidelity) | ${tier2Score} | ${drift.driftTypes.reasoningDrift   ? '⚠️ DRIFT' : '✅ OK'} |\n` +
      `| SFS (Semantic Fidelity Overall) | ${drift.SFS.toFixed(3)} | ${drift.driftTypes.semanticDrift     ? '⚠️ DRIFT' : '✅ OK'} |\n` +
      `| IGS (Inter-Agent Grounding)     | ${drift.IGS.toFixed(3)} | ${drift.driftTypes.coordinationDrift ? '⚠️ DRIFT' : '✅ OK'} |\n` +
      `| **ASI (Overall)**               | **${drift.ASI.toFixed(3)}** | **${drift.ASI >= 0.75 ? '✅ STABLE' : '⚠️ DRIFT DETECTED'} (τ=0.75)** |\n\n` +
      `Engine: **${engine.id}** (${engine.subset}) | Fault: **${engine.faultMode}** | RUL: **${engine.rul}** cycles\n` +
      `Agent made **${kbCallLog.length} autonomous KB queries** before diagnosing.\n` +
      `See **Drift Panel →** for full SFS tier breakdown and IGS coordination analysis.`,
      '📊 Final ASI Score'
    )

    setRunning(false)
  }, [apiKey, running, addMsg, addStreaming, updateMsg, finishMsg])

  // ── Handle free-text questions ───────────────────────────────────────────
  const handleQuestion = useCallback(async (question) => {
    if (running || !question.trim()) return
    if (!apiKey) { addMsg('system', '⚠️ Please enter your OpenAI API key first.'); return }

    setRunning(true)
    addMsg('user', question)
    const replyId = addStreaming('agent', '🤖 Assistant')

    try {
      const { default: OpenAI } = await import('openai')
      const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
      const stream = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert on the NASA CMAPSS turbofan engine dataset and predictive maintenance.
You understand both FD001 (HPC degradation) and FD003 (HPC + Fan degradation) subsets.
Answer concisely and technically. When relevant, distinguish between HPC_DEG and FAN_DEG fault modes.`,
          },
          { role: 'user', content: question },
        ],
        stream: true, max_tokens: 400, temperature: 0.3,
      })
      let full = ''
      for await (const chunk of stream) {
        full += chunk.choices[0]?.delta?.content ?? ''
        updateMsg(replyId, full)
      }
      finishMsg(replyId)
    } catch (e) {
      updateMsg(replyId, `❌ Error: ${e.message}`)
      finishMsg(replyId)
    }
    setRunning(false)
  }, [apiKey, running, addMsg, addStreaming, updateMsg, finishMsg])

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="header-icon">✈️</span>
          <div>
            <h1>NASA CMAPSS Predictive Maintenance</h1>
            <p>FD001 (HPC_DEG) + FD003 (FAN_DEG) · GPT-4o KB Tool Calling · SFS v2 (6 signals) + IGS Drift Validation</p>
          </div>
        </div>
        <div className="api-key-box">
          {apiKey ? (
            <div className="key-set">
              <span className="key-dot">🟢</span>
              <span>API Key set</span>
              <button onClick={() => setApiKey('')} className="btn-sm">Change</button>
            </div>
          ) : (
            <div className="key-input-row">
              <input
                type="password"
                placeholder="Enter OpenAI API key…"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && keyInput && setApiKey(keyInput)}
                className="key-input"
              />
              <button
                onClick={() => keyInput && setApiKey(keyInput)}
                className="btn-primary btn-sm"
              >Set Key</button>
            </div>
          )}
        </div>
      </header>

      <div className="main-layout">
        <Sidebar
          engines={ENGINES}
          activeEngine={activeEngine}
          onAnalyse={analyseEngine}
          running={running}
        />
        <div className="chat-area">
          <Chat
            messages={messages}
            onQuestion={handleQuestion}
            running={running}
          />
        </div>
        <DriftPanel result={driftResult} runHistory={runHistory} />
      </div>
    </div>
  )
}
