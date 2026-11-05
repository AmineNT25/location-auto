import { useEffect, useState } from 'react';
import type { SystemStatus } from '../shared/api';

const sections = ['Dashboard', 'Cars', 'Reservations', 'Clients', 'Contracts', 'Disputes', 'Finance', 'Settings'] as const;
type Section = typeof sections[number];

function Dashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [bridgeUnavailable, setBridgeUnavailable] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    async function check() {
      if (active) setChecking(true);
      try {
        if (!window.drivego) throw new Error('Desktop bridge unavailable');
        const result = await window.drivego.getSystemStatus();
        if (active) { setStatus(result); setBridgeUnavailable(false); }
      } catch {
        if (active) { setStatus(null); setBridgeUnavailable(true); }
      } finally {
        if (active) { setChecking(false); timer = setTimeout(check, 15000); }
      }
    }
    void check();
    return () => { active = false; clearTimeout(timer); };
  }, [attempt]);

  return <>
    <div className="page-heading">
      <div><p className="eyebrow">SYSTEM OVERVIEW</p><h1>Dashboard</h1>
        <p className="subheading">A connected foundation for your rental operations.</p></div>
      <button className="refresh" disabled={checking} onClick={() => setAttempt(value => value + 1)}>
        {checking ? 'Checking…' : 'Check connection'}
      </button>
    </div>
    <section className="welcome"><span className="foundation-tag">FOUNDATION · v0.1</span>
      <h2>Welcome to DriveGo Admin</h2>
      <p>Your desktop workspace is ready for the next stage. Business modules will be added in later sessions.</p>
    </section>
    <section className="connections" aria-label="Service connections" aria-live="polite" aria-busy={checking}>
      {(['backend', 'database'] as const).map(service => {
        const state = checking ? 'checking' : status?.[service] ?? 'unavailable';
        return <article className="connection" key={service}>
          <div className="connection-top"><h2>{service === 'backend' ? 'Backend API' : 'PostgreSQL database'}</h2>
            <span className={`badge ${state}`}><span aria-hidden="true" className="dot" />
              {state === 'checking' ? 'Checking…' : state === 'connected' ? 'Connected' : 'Unavailable'}
            </span></div>
          <p>{service === 'backend' ? 'Shared service for the website and desktop.' : 'Readiness reported by the backend.'}</p>
          {state === 'unavailable' && <p className="hint">{service === 'backend'
            ? 'Start the backend and confirm the configured address.'
            : 'Check PostgreSQL and the backend database configuration.'}</p>}
        </article>;
      })}
    </section>
    {bridgeUnavailable && <p role="alert" className="notice">Desktop bridge unavailable. Open this workspace through Electron, or restart the app.</p>}
    <p className="last-checked">{status ? `Last checked ${new Date(status.checkedAt).toLocaleTimeString()}. ` : ''}Connections refresh every 15 seconds.</p>
    <section className="next-stage"><h2>Built one step at a time</h2>
      <p>Fleet, reservations, clients, contracts, disputes, and finance are not implemented yet. No business data is loaded or stored by this version.</p>
    </section>
  </>;
}

export function App() {
  const [section, setSection] = useState<Section>('Dashboard');
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon" aria-hidden="true">D</div><div>DriveGo<span>ADMIN WORKSPACE</span></div></div>
      <p className="nav-label">WORKSPACE</p>
      <nav aria-label="Main navigation">{sections.map((item, index) =>
        <button key={item} className={section === item ? 'nav-item active' : 'nav-item'}
          aria-current={section === item ? 'page' : undefined} onClick={() => setSection(item)}>
          <span aria-hidden="true" className="nav-marker">{String(index + 1).padStart(2, '0')}</span>{item}
        </button>)}
      </nav>
      <div className="sidebar-note"><span className="sidebar-dot" />Online-first foundation<span>Local workspace · v0.1.0</span></div>
    </aside>
    <div className="workspace"><header className="topbar"><span>DriveGo / <strong>{section}</strong></span><span className="admin-label">Desktop administration</span></header>
      <main>{section === 'Dashboard' ? <Dashboard /> : <>
        <div className="page-heading"><div><p className="eyebrow">WORKSPACE</p><h1>{section}</h1></div></div>
        <section className="empty-state"><span aria-hidden="true" className="empty-symbol">◇</span>
          <h2>Not implemented yet</h2><p>The {section.toLowerCase()} module is planned for a later phase.</p>
          <button className="refresh" onClick={() => setSection('Dashboard')}>Back to Dashboard</button>
        </section></>}</main>
    </div>
  </div>;
}
