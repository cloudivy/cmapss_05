// Sidebar — updated to show FD001 and FD003 engine groups
// and display combined fault mode badges correctly.

export default function Sidebar({ engines, activeEngine, onAnalyse, running }) {
  const levelColor = l => ({ NORMAL: '#3fb950', WARNING: '#d29922', CRITICAL: '#f85149' })[l] || '#8b949e'
  const levelBg    = l => ({ NORMAL: '#0d2818', WARNING: '#2a1f04', CRITICAL: '#2a0d0d' })[l] || '#161b22'

  // Group engines by subset for display
  const fd001 = engines.filter(e => e.subset === 'FD001')
  const fd003 = engines.filter(e => e.subset === 'FD003')

  const faultColor = fault => {
    if (!fault || fault === 'NOMINAL') return '#3fb950'
    if (fault === 'HPC_DEG+FAN_DEG')  return '#f85149'
    if (fault === 'FAN_DEG')           return '#bc8cff'
    return '#d29922' // HPC_DEG
  }

  const faultLabel = fault => {
    if (!fault || fault === 'NOMINAL') return '✅ NOMINAL'
    if (fault === 'HPC_DEG+FAN_DEG')  return '⚠️ HPC + FAN'
    if (fault === 'FAN_DEG')           return '⚠️ FAN_DEG'
    return `⚠️ ${fault}`
  }

  const renderEngine = eq => {
    const isActive = activeEngine === eq.id
    const color    = levelColor(eq.anomalyLevel)
    const bg       = levelBg(eq.anomalyLevel)
    const rulPct   = Math.max(0, Math.min(100, Math.round(eq.rul / 3.6)))

    // Key sensors to show — include fan sensors for FD003
    const keySensors = eq.subset === 'FD003'
      ? ['s3', 's8', 's13', 's15']  // mix of HPC + fan sensors
      : ['s3', 's7', 's8', 's12']   // original FD001 sensors

    return (
      <div
        key={eq.id}
        className={`engine-card ${isActive ? 'engine-card-active' : ''}`}
        style={{ borderColor: isActive ? color : 'transparent', background: isActive ? bg : undefined }}
      >
        {/* Card header */}
        <div className="engine-card-header">
          <div>
            <div className="engine-id">{eq.id}</div>
            <div className="engine-name">{eq.name}</div>
          </div>
          <span className="level-badge" style={{ color, borderColor: color }}>
            {eq.anomalyLevel}
          </span>
        </div>

        {/* RUL gauge */}
        <div className="rul-section">
          <div className="rul-label">
            <span>RUL</span>
            <span style={{ color }} className="rul-value">{eq.rul} cycles</span>
          </div>
          <div className="rul-bar-bg">
            <div className="rul-bar-fill" style={{ width: `${rulPct}%`, background: color }} />
          </div>
        </div>

        {/* Key sensors */}
        <div className="sensor-grid">
          {keySensors.map(key => {
            const s  = eq.sensors[key]
            const sc = levelColor(s.status)
            return (
              <div key={key} className="sensor-mini">
                <span className="sensor-mini-key">{key}</span>
                <span className="sensor-mini-val" style={{ color: sc }}>{s.value}</span>
                <span className="sensor-mini-unit">{s.unit}</span>
              </div>
            )
          })}
        </div>

        {/* Fault badge — handles combined HPC+FAN */}
        <div className="fault-row">
          <span className="fault-label">Fault:</span>
          <span className="fault-value" style={{ color: faultColor(eq.faultMode) }}>
            {faultLabel(eq.faultMode)}
          </span>
        </div>

        {/* Score bar */}
        <div className="score-row">
          <span className="score-label">Score: {eq.anomalyScore}/100</span>
          <div className="score-bar-bg">
            <div className="score-bar-fill" style={{ width: `${eq.anomalyScore}%`, background: color }} />
          </div>
        </div>

        {/* Analyse button */}
        <button
          className="btn-analyse"
          style={{ borderColor: color, color }}
          onClick={() => onAnalyse(eq)}
          disabled={running}
        >
          {running && activeEngine === eq.id ? '⏳ Analysing…' : '▶ Analyse'}
        </button>
      </div>
    )
  }

  return (
    <aside className="sidebar">

      {/* FD001 group */}
      <div className="sidebar-title">
        <span>🚀 FD001 — HPC Degradation</span>
        <span className="sidebar-sub">NASA CMAPSS · 1 condition · HPC fault only</span>
      </div>
      {fd001.map(renderEngine)}

      {/* FD003 group */}
      <div className="sidebar-title" style={{ marginTop: '8px' }}>
        <span>🚀 FD003 — HPC + Fan Degradation</span>
        <span className="sidebar-sub">NASA CMAPSS · 1 condition · dual fault modes</span>
      </div>
      {fd003.map(renderEngine)}

      <div className="sidebar-footer">
        <div className="sidebar-footer-text">
          FD001: Saxena et al. 2008 · NASA TM-2008-215546<br/>
          FD003: Fan faults · AGARD-R-785
        </div>
      </div>
    </aside>
  )
}
