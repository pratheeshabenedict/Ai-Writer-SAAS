import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => (
  <div className="auth-shell">
    {/* Background orbs */}
    <div className="orb orb-1" />
    <div className="orb orb-2" />

    {/* Brand panel - hidden on mobile */}
    <aside className="brand-panel">
      <div className="brand-logo">
        <span className="brand-dot" />
        WriteAI
      </div>

      <div className="brand-body">
        <h1 className="brand-headline">
          Write 10x faster<br />with <span>AI</span>
        </h1>
        <p className="brand-sub">
          Generate blog posts, emails, ad copy and more in seconds.
          Built on Claude — the most thoughtful AI.
        </p>
      </div>

      <ul className="brand-features">
        {[
          { icon: '✦', text: '50+ content templates' },
          { icon: '⚡', text: 'Real-time AI streaming' },
          { icon: '🔒', text: 'Role-based workspaces' },
          { icon: '💳', text: 'Free plan, no card needed' },
        ].map(({ icon, text }) => (
          <li key={text}>
            <span className="feature-icon">{icon}</span>
            {text}
          </li>
        ))}
      </ul>

      <p className="brand-footer">
        © {new Date().getFullYear()} WriteAI · <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link>
      </p>
    </aside>

    {/* Auth form panel */}
    <main className="auth-main">
      <div className="auth-card">
        {children}
      </div>
    </main>
  </div>
);

export default AuthLayout;