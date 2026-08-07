




import { FormEvent, useEffect, useState } from "react";

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [backendStatus, setBackendStatus] = useState<"checking" | "ok" | "error">("checking");
  const [backendMessage, setBackendMessage] = useState("Checking login server...");
  const [userName, setUserName] = useState("Alex Rivera");

  const apiUrl = import.meta.env.VITE_API_URL;
  console.log("VITE_API_URL", apiUrl);

  useEffect(() => {
    const checkBackend = async () => {
      if (!apiUrl) {
        setBackendStatus("error");
        setBackendMessage("Missing VITE_API_URL. Set the deployed backend URL in your env.");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/v1/health`);
        const text = await response.text();
        let data: any = null;
        try {
          data = JSON.parse(text);
        } catch {
          // not JSON
        }

        if (!response.ok || data?.status !== "ok") {
          throw new Error(`Health check failed: ${text}`);
        }

        setBackendStatus("ok");
        setBackendMessage("Backend connected");
      } catch (error) {
        console.error("Backend health check error:", error);
        setBackendStatus("error");
        setBackendMessage("Backend unavailable. Update VITE_API_URL to your deployed backend.");
      }
    };

    checkBackend();
  }, [apiUrl]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${apiUrl}/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      let json: any = null;

      try {
        json = JSON.parse(text);
      } catch {
        // ignore invalid JSON
      }

      if (!response.ok) {
        const message = json?.error || json?.message || text || `Login failed (${response.status})`;
        setErrorMessage(message);
        return;
      }

      const userLabel = json.user?.user_metadata?.full_name || json.user?.email || "User";
      setUserName(userLabel);
      setShowDashboard(true);
      setShowLogin(false);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Login request failed: ${message}`);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((value) => !value);
  };

  const handleLogout = () => {
    setShowDashboard(false);
    setShowLogin(true);
    setShowPassword(false);
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  if (showDashboard) {
    return (
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <span className="logo-mark" />
            TaskFlow
          </div>

          <div className="ws-switcher">
            <div className="ws-icon" />
            <div className="ws-name">Meridian &amp; Co.</div>
            <span className="material-symbols-outlined">unfold_more</span>
          </div>

          <div className="nav-section">
            <div className="nav-item active">
              <span className="material-symbols-outlined">home</span>Home
            </div>
            <div className="nav-item">
              <span className="material-symbols-outlined">check_circle</span>My tasks<span className="count">6</span>
            </div>
            <div className="nav-item">
              <span className="material-symbols-outlined">notifications</span>Notifications<span className="count">3</span>
            </div>
            <div className="nav-item">
              <span className="material-symbols-outlined">group</span>Members
            </div>
            <div className="nav-item">
              <span className="material-symbols-outlined">settings</span>Settings
            </div>
          </div>

          <div className="nav-section boards-list">
            <div className="nav-label">Boards</div>
            <div className="board-link">
              <span className="board-dot" style={{ background: "var(--coral)" }} />Product Roadmap
            </div>
            <div className="board-link">
              <span className="board-dot" style={{ background: "var(--teal)" }} />Marketing Campaign
            </div>
            <div className="board-link">
              <span className="board-dot" style={{ background: "var(--violet)" }} />Sprint 14
            </div>
            <div className="board-link">
              <span className="board-dot" style={{ background: "var(--amber)" }} />Client Onboarding
            </div>
            <div className="nav-item" style={{ color: "#8B8F99" }}>
              <span className="material-symbols-outlined">add</span>New board
            </div>
          </div>

          <div className="sidebar-bottom">
            <div className="user-avatar" />
            <div className="user-meta">
              <div className="user-name">Alex Rivera</div>
              <div className="user-role">Member</div>
            </div>
            <button className="icon-btn logout-btn" type="button" onClick={handleLogout} aria-label="Log out" title="Log out">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="search-box">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search boards, cards, people…" />
              <span className="kbd">⌘K</span>
            </div>
            <div className="topbar-right">
              <button className="icon-btn" type="button">
                <span className="material-symbols-outlined">notifications</span>
                <span className="badge" />
              </button>
              <button className="icon-btn" type="button">
                <span className="material-symbols-outlined">help</span>
              </button>
              <button className="btn-new" type="button">
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>New board
              </button>
              <div className="user-avatar" />
            </div>
          </div>

          <div className="content">
            <div className="greet-row">
              <div className="greet">
                <h1 className="display">Good evening, Alex 👋</h1>
                <p>Here's what's moving across Meridian &amp; Co. today.</p>
              </div>
              <div className="date-pill">Monday, August 3, 2026</div>
            </div>

            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon" style={{ background: "#FFEDEA" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--coral-deep)" }}>assignment</span>
                  </div>
                  <div className="stat-trend up">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_upward</span>12%
                  </div>
                </div>
                <div className="stat-num display">128</div>
                <div className="stat-label">Total tasks across boards</div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon" style={{ background: "#FFF3D6" }}>
                    <span className="material-symbols-outlined" style={{ color: "#B8860B" }}>pending_actions</span>
                  </div>
                  <div className="stat-trend up">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_upward</span>4%
                  </div>
                </div>
                <div className="stat-num display">34</div>
                <div className="stat-label">In progress right now</div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon" style={{ background: "#FFEDEA" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--coral-deep)" }}>warning</span>
                  </div>
                  <div className="stat-trend down">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_downward</span>2%
                  </div>
                </div>
                <div className="stat-num display">5</div>
                <div className="stat-label">Overdue tasks</div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-icon" style={{ background: "#E3F7F4" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--teal)" }}>task_alt</span>
                  </div>
                  <div className="stat-trend up">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_upward</span>18%
                  </div>
                </div>
                <div className="stat-num display">41</div>
                <div className="stat-label">Completed this week</div>
              </div>
            </div>

            <div className="body-grid">
              <div>
                <div className="section-title">
                  <h2>Your boards</h2>
                  <a href="#">View all</a>
                </div>

                <div className="board-grid">
                  <div className="board-card">
                    <div className="board-card-top">
                      <div className="board-icon" style={{ background: "var(--coral)" }}>
                        <span className="material-symbols-outlined">map</span>
                      </div>
                      <span className="material-symbols-outlined" style={{ color: "var(--ink-faint)", fontSize: "18px" }}>more_horiz</span>
                    </div>
                    <h3>Product Roadmap</h3>
                    <div className="sub">18 cards · 3 lists</div>
                    <div className="board-progress"><div className="board-progress-fill" style={{ width: "62%", background: "var(--coral)" }} /></div>
                    <div className="board-bottom">
                      <div className="avatar-stack">
                        <div className="a" style={{ background: "var(--violet)" }} />
                        <div className="a" style={{ background: "var(--teal)" }} />
                        <div className="a" style={{ background: "var(--amber)" }} />
                      </div>
                      <div className="board-meta">Updated 12m ago</div>
                    </div>
                  </div>

                  <div className="board-card">
                    <div className="board-card-top">
                      <div className="board-icon" style={{ background: "var(--teal)" }}>
                        <span className="material-symbols-outlined">campaign</span>
                      </div>
                      <span className="material-symbols-outlined" style={{ color: "var(--ink-faint)", fontSize: "18px" }}>more_horiz</span>
                    </div>
                    <h3>Marketing Campaign</h3>
                    <div className="sub">24 cards · 4 lists</div>
                    <div className="board-progress"><div className="board-progress-fill" style={{ width: "38%", background: "var(--teal)" }} /></div>
                    <div className="board-bottom">
                      <div className="avatar-stack">
                        <div className="a" style={{ background: "var(--coral)" }} />
                        <div className="a" style={{ background: "var(--violet)" }} />
                      </div>
                      <div className="board-meta">Updated 1h ago</div>
                    </div>
                  </div>

                  <div className="board-card">
                    <div className="board-card-top">
                      <div className="board-icon" style={{ background: "var(--violet)" }}>
                        <span className="material-symbols-outlined">bolt</span>
                      </div>
                      <span className="material-symbols-outlined" style={{ color: "var(--ink-faint)", fontSize: "18px" }}>more_horiz</span>
                    </div>
                    <h3>Sprint 14</h3>
                    <div className="sub">31 cards · 5 lists</div>
                    <div className="board-progress"><div className="board-progress-fill" style={{ width: "81%", background: "var(--violet)" }} /></div>
                    <div className="board-bottom">
                      <div className="avatar-stack">
                        <div className="a" style={{ background: "var(--teal)" }} />
                        <div className="a" style={{ background: "var(--coral)" }} />
                        <div className="a" style={{ background: "var(--amber)" }} />
                      </div>
                      <div className="board-meta">Updated 3h ago</div>
                    </div>
                  </div>

                  <div className="board-card">
                    <div className="board-card-top">
                      <div className="board-icon" style={{ background: "var(--amber)" }}>
                        <span className="material-symbols-outlined">handshake</span>
                      </div>
                      <span className="material-symbols-outlined" style={{ color: "var(--ink-faint)", fontSize: "18px" }}>more_horiz</span>
                    </div>
                    <h3>Client Onboarding</h3>
                    <div className="sub">12 cards · 3 lists</div>
                    <div className="board-progress"><div className="board-progress-fill" style={{ width: "20%", background: "var(--amber)" }} /></div>
                    <div className="board-bottom">
                      <div className="avatar-stack">
                        <div className="a" style={{ background: "var(--violet)" }} />
                      </div>
                      <div className="board-meta">Updated yesterday</div>
                    </div>
                  </div>
                </div>

                <div className="section-title">
                  <h2>Assigned to you</h2>
                  <a href="#">View all</a>
                </div>

                <div className="task-list">
                  <div className="task-row">
                    <div className="task-check" />
                    <div className="task-title"><span className="task-cid">#TF-142</span>&nbsp; Prep launch checklist</div>
                    <div className="task-due due-soon">Due today</div>
                  </div>
                  <div className="task-row">
                    <div className="task-check" />
                    <div className="task-title"><span className="task-cid">#TF-138</span>&nbsp; Set up S3 attachments</div>
                    <div className="task-due due-soon">Due tomorrow</div>
                  </div>
                  <div className="task-row">
                    <div className="task-check" />
                    <div className="task-title"><span className="task-cid">#TF-119</span>&nbsp; Review onboarding copy</div>
                    <div className="task-due due-ok">Due in 4 days</div>
                  </div>
                  <div className="task-row">
                    <div className="task-check" />
                    <div className="task-title"><span className="task-cid">#TF-104</span>&nbsp; QA mobile push notifications</div>
                    <div className="task-due due-ok">Due in 6 days</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="section-title">
                  <h2>Recent activity</h2>
                </div>
                <div className="activity-card">
                  <div className="activity-item">
                    <div className="act-avatar" style={{ background: "var(--teal)" }} />
                    <div>
                      <div className="act-text"><b>Sofia Reyes</b> moved <b>#TF-142</b> to Done</div>
                      <div className="act-time">6 minutes ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="act-avatar" style={{ background: "var(--violet)" }} />
                    <div>
                      <div className="act-text"><b>David Chen</b> commented on <b>#TF-138</b></div>
                      <div className="act-time">42 minutes ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="act-avatar" style={{ background: "var(--coral)" }} />
                    <div>
                      <div className="act-text"><b>You</b> attached a file to <b>#TF-119</b></div>
                      <div className="act-time">1 hour ago</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="act-avatar" style={{ background: "var(--amber)" }} />
                    <div>
                      <div className="act-text"><b>Amara Okafor</b> created board <b>Client Onboarding</b></div>
                      <div className="act-time">Yesterday</div>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="act-avatar" style={{ background: "var(--teal)" }} />
                    <div>
                      <div className="act-text"><b>Sofia Reyes</b> invited <b>3 members</b> to Meridian &amp; Co.</div>
                      <div className="act-time">2 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!showLogin) {
    return (
      <div>
        <nav>
          <div className="wrap navrow">
            <div className="logo logo-with-image">
              <img src="/images/taskflow.png" alt="TaskFlow logo" className="logo-image" />
              <span className="display">TaskFlow</span>
            </div>

            <div className="navlinks">
              <a href="#features">Product</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Enterprise</a>
              <a href="#">Docs</a>
            </div>

            <div className="navcta">
              <button className="btn btn-ghost" type="button" onClick={() => setShowLogin(true)}>
                Log in
              </button>
              <button className="btn btn-primary" type="button" onClick={() => setShowLogin(true)}>
                Start free trial
              </button>
            </div>
          </div>
        </nav>

        <main>
          <section className="hero">
            <div className="wrap hero-inner">
              <div className="eyebrow">
                <span className="dot" />
                TaskFlow for modern delivery teams
              </div>

              <h1 className="display">
                Boards that move as fast as your team <span className="accent">does</span>.
              </h1>

              <p className="lead">Real-time sync, role-based access, and a full audit trail in one workspace built for teams that need clarity without friction.</p>

              <div className="hero-actions">
                <button className="btn btn-primary btn-lg" type="button" onClick={() => setShowLogin(true)}>
                  Open workspace
                </button>
                <a className="btn btn-ghost btn-lg" href="#product">
                  See the product
                </a>
              </div>

              <div className="hero-note">No credit card required. Trusted by fast-moving product, ops, and engineering teams.</div>

              <div className="product-frame" id="product">
                <div className="frame-bar">
                  <div className="frame-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="frame-url">workspace.taskflow.app/boards/launch</div>
                  <div className="live-pill">
                    <span className="dot" />
                    Live sync
                  </div>
                </div>

                <div className="frame-body">
                  <div className="demo-toprow">
                    <div className="demo-title">Sprint board snapshot</div>
                    <div className="live-pill">
                      <span className="dot" />
                      40ms updates
                    </div>
                  </div>

                  <div className="board">
                    <div className="col col1">
                      <div className="col-head">
                        <span className="swatch" />
                        Planned
                      </div>
                      <div className="card">
                        <span className="cid">TF-182</span>
                        Launch workspace overview
                        <div className="avatar" style={{ background: "linear-gradient(135deg, var(--coral), var(--amber))" }} />
                      </div>
                      <div className="card ghost">
                        <span className="cid">TF-184</span>
                        Review onboarding copy
                      </div>
                    </div>

                    <div className="col col2">
                      <div className="col-head">
                        <span className="swatch" />
                        In progress
                      </div>
                      <div className="card">
                        <span className="cid">TF-201</span>
                        Connect billing + trial flow
                        <div className="avatar" style={{ background: "linear-gradient(135deg, var(--violet), var(--coral))" }} />
                      </div>
                      <div className="card">
                        <span className="cid">TF-203</span>
                        Finalize permissions matrix
                      </div>
                    </div>

                    <div className="col col3">
                      <div className="col-head">
                        <span className="swatch" />
                        Shipped
                      </div>
                      <div className="card">
                        <span className="cid">TF-177</span>
                        Improve board filters
                      </div>
                      <div className="card">
                        <span className="cid">TF-179</span>
                        Add activity log export
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="trusted">
            <div className="wrap">
              <div className="trusted-label">Trusted by teams shipping every day</div>
              <div className="logo-row">
                <div className="logo-item">Northwind</div>
                <div className="logo-item">Vertex Labs</div>
                <div className="logo-item">Argon Systems</div>
                <div className="logo-item">Meridian &amp; Co.</div>
                <div className="logo-item">Fenwick Rowe</div>
              </div>
            </div>
          </section>

          <div className="wrap stats">
            <div className="stats-row">
              <div className="stat"><div className="num display">40ms</div><div className="label">avg. update latency across clients</div></div>
              <div className="stat"><div className="num display">99.95%</div><div className="label">uptime over the last 90 days</div></div>
              <div className="stat"><div className="num display">4 roles</div><div className="label">owner, admin, member, viewer</div></div>
              <div className="stat"><div className="num display">1-click</div><div className="label">self-host with Docker Compose</div></div>
            </div>
          </div>

          <section className="section" id="features">
            <div className="wrap">
              <div className="section-head">
                <span className="tag">// what's inside</span>
                <h2 className="display">Everything a real board needs, nothing it doesn't</h2>
                <p>No setup tax. Create a workspace, invite your team, and start moving cards in under a minute.</p>
              </div>

              <div className="features">
                <div className="feature">
                  <div className="icon" style={{ background: "#FFEDEA" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--coral-deep)" }}>
                      bolt
                    </span>
                  </div>
                  <h3>Real-time by default</h3>
                  <p>Every move, comment, and edit reaches teammates the instant it happens — powered by WebSockets, not polling.</p>
                </div>

                <div className="feature">
                  <div className="icon" style={{ background: "#FFF3D6" }}>
                    <span className="material-symbols-outlined" style={{ color: "#B8860B" }}>
                      lock
                    </span>
                  </div>
                  <h3>Roles that actually restrict</h3>
                  <p>Owners, admins, members, and viewers each see and change exactly what they should — enforced on every request.</p>
                </div>

                <div className="feature">
                  <div className="icon" style={{ background: "#E3F7F4" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--teal)" }}>
                      notifications
                    </span>
                  </div>
                  <h3>Notifications that matter</h3>
                  <p>Get pinged when you're assigned, mentioned, or a due date's close — nowhere else.</p>
                </div>

                <div className="feature">
                  <div className="icon" style={{ background: "#EFECFF" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--violet)" }}>
                      attach_file
                    </span>
                  </div>
                  <h3>Files live on the card</h3>
                  <p>Drop a file straight onto a card. It's stored, versioned, and visible to anyone with access to the board.</p>
                </div>

                <div className="feature">
                  <div className="icon" style={{ background: "#FFEDEA" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--coral-deep)" }}>
                      search
                    </span>
                  </div>
                  <h3>Search that finds cards</h3>
                  <p>Full-text search across every board in a workspace — titles, descriptions, comments included.</p>
                </div>

                <div className="feature">
                  <div className="icon" style={{ background: "#E3F7F4" }}>
                    <span className="material-symbols-outlined" style={{ color: "var(--teal)" }}>
                      monitoring
                    </span>
                  </div>
                  <h3>A dashboard with real numbers</h3>
                  <p>Completion rate, overdue count, and team velocity — computed from your actual cards, not sample data.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section security-section" id="security">
            <div className="wrap">
              <div className="security">
                <div className="security-head">
                  <span className="material-symbols-outlined">shield</span>
                  <h3>Built for how IT teams actually evaluate tools</h3>
                </div>

                <div className="security-grid">
                  <div className="security-item">
                    <span className="material-symbols-outlined">key</span>
                    <div>
                      <h4>SSO &amp; SAML</h4>
                      <p>Sign in through your identity provider. Provision and deprovision access centrally.</p>
                    </div>
                  </div>

                  <div className="security-item">
                    <span className="material-symbols-outlined">history</span>
                    <div>
                      <h4>Full audit log</h4>
                      <p>Every board, card, and permission change is timestamped and attributable.</p>
                    </div>
                  </div>

                  <div className="security-item">
                    <span className="material-symbols-outlined">enhanced_encryption</span>
                    <div>
                      <h4>Encrypted everywhere</h4>
                      <p>Data encrypted at rest and in transit. Self-host it entirely if your policy requires it.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="how">
            <div className="wrap">
              <div className="section-head">
                <span className="tag">// how it works</span>
                <h2 className="display">From workspace to first card</h2>
                <p>Three steps, in order — because that's really how it goes.</p>
              </div>

              <div className="steps">
                <div className="step">
                  <div className="step-top">
                    <div className="stepbadge">01</div>
                    <span className="material-symbols-outlined step-icon">group_add</span>
                  </div>
                  <h3>Create a workspace</h3>
                  <p>Name it after your team or your project. Invite people by email — they land straight on the first board.</p>
                </div>

                <div className="step">
                  <div className="step-top">
                    <div className="stepbadge">02</div>
                    <span className="material-symbols-outlined step-icon">view_kanban</span>
                  </div>
                  <h3>Build your board</h3>
                  <p>Add lists for each stage of work, then start dropping in cards. Rename, reorder, and recolor anything.</p>
                </div>

                <div className="step">
                  <div className="step-top">
                    <div className="stepbadge">03</div>
                    <span className="material-symbols-outlined step-icon">bolt</span>
                  </div>
                  <h3>Move work forward</h3>
                  <p>Drag cards across lists, assign teammates, attach files, and comment — everyone sees it update live.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section testimonial-section">
            <div className="wrap">
              <div className="testimonial">
                <blockquote>"We moved four teams onto TaskFlow in a week. The audit log alone made our security review the easiest one we've had."</blockquote>
                <div className="testimonial-person">
                  <div className="testimonial-avatar" />
                  <div>
                    <div className="testimonial-name">Priya Nandakumar</div>
                    <div className="testimonial-role">Head of Engineering Operations, Meridian &amp; Co.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section" id="pricing">
            <div className="wrap">
              <div className="section-head center">
                <span className="tag">// pricing</span>
                <h2 className="display">Straightforward, per-seat pricing</h2>
                <p>Start free. Move to Team when you outgrow ten seats. Move to Enterprise when IT gets involved.</p>
              </div>
              <div className="pricing">
                <div className="price-card">
                  <div className="price-name">FREE</div>
                  <div className="price-amount">$0<span> / month</span></div>
                  <div className="price-desc">For small teams getting started.</div>
                  <ul className="price-list">
                    <li><span className="material-symbols-outlined">check</span>Up to 10 members</li>
                    <li><span className="material-symbols-outlined">check</span>Unlimited boards</li>
                    <li><span className="material-symbols-outlined">check</span>Real-time sync</li>
                    <li><span className="material-symbols-outlined">check</span>Basic notifications</li>
                  </ul>
                  <a href="#" className="btn btn-ghost" style={{ textAlign: "center" }}>
                    Start free
                  </a>
                </div>

                <div className="price-card highlight">
                  <div className="price-name">TEAM</div>
                  <div className="price-amount">$9<span> / user / month</span></div>
                  <div className="price-desc">For growing teams that need control.</div>
                  <ul className="price-list">
                    <li><span className="material-symbols-outlined">check</span>Unlimited members</li>
                    <li><span className="material-symbols-outlined">check</span>Role-based permissions</li>
                    <li><span className="material-symbols-outlined">check</span>File attachments &amp; search</li>
                    <li><span className="material-symbols-outlined">check</span>Analytics dashboard</li>
                    <li><span className="material-symbols-outlined">check</span>Priority support</li>
                  </ul>
                  <a href="#" className="btn btn-primary" style={{ textAlign: "center" }}>
                    Start free trial
                  </a>
                </div>

                <div className="price-card">
                  <div className="price-name">ENTERPRISE</div>
                  <div className="price-amount">Custom</div>
                  <div className="price-desc">For organizations with security and scale requirements.</div>
                  <ul className="price-list">
                    <li><span className="material-symbols-outlined">check</span>SSO &amp; SAML</li>
                    <li><span className="material-symbols-outlined">check</span>Full audit log</li>
                    <li><span className="material-symbols-outlined">check</span>Self-hosting option</li>
                    <li><span className="material-symbols-outlined">check</span>Dedicated support</li>
                  </ul>
                  <a href="#" className="btn btn-ghost" style={{ textAlign: "center" }}>
                    Talk to sales
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="wrap" style={{ paddingBottom: "100px" }}>
            <div className="cta-band">
              <div>
                <h2 className="display">Stop checking if your board updated. Start knowing it did.</h2>
                <p>Free for teams up to 10 people. Upgrade only when you outgrow it.</p>
              </div>
              <a href="#" className="btn btn-primary btn-lg">
                Start free trial
              </a>
            </div>
          </div>

          <footer>
            <div className="wrap">
              <div className="foot-grid">
                <div className="foot-col">
                  <div className="logo logo-with-image">
                    <img src="/images/taskflow.png" alt="TaskFlow logo" className="logo-image" />
                    <span className="display">TaskFlow</span>
                  </div>
                  <p className="foot-desc">The project tracker teams rely on when the work can't wait for a page refresh.</p>
                </div>
                <div className="foot-col">
                  <h4>Product</h4>
                  <a href="#features">Features</a>
                  <a href="#pricing">Pricing</a>
                  <a href="#">Changelog</a>
                  <a href="#">Status</a>
                </div>
                <div className="foot-col">
                  <h4>Company</h4>
                  <a href="#">About</a>
                  <a href="#">Careers</a>
                  <a href="#">Blog</a>
                  <a href="#">Contact</a>
                </div>
                <div className="foot-col">
                  <h4>Resources</h4>
                  <a href="#">Documentation</a>
                  <a href="#">API reference</a>
                  <a href="#">Security</a>
                  <a href="#">GitHub</a>
                </div>
              </div>
              <div className="foot-bottom">
                <div>© 2026 TaskFlow, Inc. All rights reserved.</div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <a href="#">Privacy</a>
                  <a href="#">Terms</a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="brand-panel">
        <div className="brand-top">
          <div className="logo logo-with-image">
            <img src="/images/taskflow.png" alt="TaskFlow logo" className="logo-image" />
            <span className="display">TaskFlow</span>
          </div>
        </div>

        <div className="brand-mid">
          <h1 className="display">Boards that move as fast as your team does.</h1>
          <p>Real-time sync, role-based access, and a full audit trail — built for teams that can't afford to lose track of the work.</p>

          <div className="trust-list">
            <div className="trust-item">
              <span className="material-symbols-outlined">bolt</span>
              <span className="txt">Updates sync across your team in ~40ms</span>
            </div>
            <div className="trust-item">
              <span className="material-symbols-outlined">key</span>
              <span className="txt">SSO &amp; SAML for centralized access control</span>
            </div>
            <div className="trust-item">
              <span className="material-symbols-outlined">history</span>
              <span className="txt">Every change logged and attributable</span>
            </div>
          </div>
        </div>

        <div className="brand-bottom">
          <p className="brand-quote">"We moved four teams onto TaskFlow in a week. The audit log alone made our security review the easiest one we've had."</p>
          <div className="brand-person">
            <div className="brand-avatar" />
            <div>
              <div className="name">Priya Nandakumar</div>
              <div className="role">Head of Engineering Operations, Meridian &amp; Co.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-panel">
        <div className="form-wrap">
          <div className="mobile-logo logo-with-image">
            <img src="/images/taskflow.png" alt="TaskFlow logo" className="logo-image" />
            <span className="display">TaskFlow</span>
          </div>

          <div className="back-row">
            <button className="btn btn-ghost back-btn" type="button" aria-label="Back to home" title="Back to home" onClick={() => setShowLogin(false)}>
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="back-text">Back to home</span>
            </button>
          </div>

          <div className="form-head">
            <h2 className="display">Log in to your workspace</h2>
            <p>
              New to TaskFlow? <a href="#">Start a free trial</a>
            </p>
          </div>

          <div style={{ marginBottom: 16, fontSize: 14, color: backendStatus === "ok" ? "#0b8457" : backendStatus === "checking" ? "#6b7280" : "#b91c1c" }}>
            {backendMessage}
          </div>

          <div className="oauth-row">
            <button className="oauth-btn" type="button">
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.89c2.28-2.1 3.56-5.2 3.56-8.81z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.89-3.01c-1.08.73-2.46 1.16-4.06 1.16-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1C3.26 21.3 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 010-4.58v-3.1H1.28a11.98 11.98 0 000 10.78l4.01-3.1z" />
                <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.6l4.01 3.1c.94-2.83 3.59-4.93 6.71-4.93z" />
              </svg>
              Continue with Google
            </button>
            <button className="oauth-btn" type="button">
              <span className="material-symbols-outlined">key</span>
              Continue with SSO
            </button>
          </div>

          <div className="divider">
            <span>OR CONTINUE WITH EMAIL</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Work email</label>
              <div className="input-wrap">
                <span className="material-symbols-outlined">mail</span>
                <input type="email" id="email" placeholder="you@company.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="material-symbols-outlined">lock</span>
                <input type={showPassword ? "text" : "password"} id="password" placeholder="••••••••••" required value={password} onChange={(event) => setPassword(event.target.value)} />
                <button
                  type="button"
                  className="toggle-visibility"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={togglePasswordVisibility}
                >
                  <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div className="field-row">
              <label className="remember">
                <input type="checkbox" />Remember me
              </label>
              <a href="#" className="forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-submit">
              Log in <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            {errorMessage ? <div className="form-error">{errorMessage}</div> : null}
          </form>

          <div className="form-footer">
            By continuing you agree to TaskFlow&apos;s <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
