import { useState, useEffect } from "react";

const SECTIONS = ["Dashboard", "Projects", "Income", "Ideas & Research", "Goals", "Claude Prompts"];

const DEFAULT_DATA = {
  projects: [
    { id: 1, name: "Photography Website", status: "In Progress", type: "Photography", deadline: "2026-07-01", notes: "Need portfolio section + contact form" },
    { id: 2, name: "Gym June Content Calendar", status: "Active", type: "Social Media", deadline: "2026-06-30", notes: "Post 3x/week, 2 reels/week" },
    { id: 3, name: "Summer Promo Shoot", status: "Booked", type: "Photography", deadline: "2026-06-20", notes: "Family of 5, outdoor session" },
  ],
  income: [
    { id: 1, source: "Gym - Social Media Manager", amount: 0, frequency: "Monthly", type: "Stable", notes: "Add your monthly rate" },
    { id: 2, source: "Freelance Photography", amount: 0, frequency: "Variable", type: "Freelance", notes: "Track per session" },
    { id: 3, source: "Photography Website", amount: 0, frequency: "Goal", type: "Goal", notes: "Target passive/booking income" },
  ],
  ideas: [
    { id: 1, title: "Gym Photography Package", category: "Business Idea", priority: "High", detail: "Offer gym members headshots/fitness photos as upsell. Pitch to gym owner." },
    { id: 2, title: "Instagram Reel Templates", category: "Research", priority: "Medium", detail: "Study top gym accounts. Build repeatable reel formats to save time." },
    { id: 3, title: "Family Portrait Referral Program", category: "Business Idea", priority: "High", detail: "Give existing clients a discount card for referrals. Word of mouth system." },
  ],
  goals: [
    { id: 1, goal: "Launch photography website", deadline: "2026-07-01", category: "Website", done: false },
    { id: 2, goal: "Book 4 photography sessions per month", deadline: "2026-08-01", category: "Photography", done: false },
    { id: 3, goal: "Build 1 month of gym content in advance", deadline: "2026-06-30", category: "Social Media", done: false },
    { id: 4, goal: "Create a service pricing sheet", deadline: "2026-06-15", category: "Business", done: false },
    { id: 5, goal: "Save 1 month of household expenses", deadline: "2026-12-01", category: "Family", done: false },
  ],
  prompts: [
    { id: 1, title: "Write gym captions", prompt: "Write 5 Instagram captions for a gym post about [topic]. Make them energetic, motivational, and include a call to action. Vary the tone between hype, educational, and community-focused." },
    { id: 2, title: "Photography client email", prompt: "Write a professional but warm email to a new photography client confirming their session on [date] at [location]. Include what to wear, what to expect, and how to prepare." },
    { id: 3, title: "Plan a content week", prompt: "I manage social media for a gym. Plan a week of content (Mon-Sun) with post ideas, captions, and reel concepts. Theme: [weekly theme]. Platform: Instagram." },
    { id: 4, title: "Business strategy session", prompt: "I run a freelance photography business and manage social media for a gym. I have a family of 7. Help me identify my top 3 revenue priorities this month and action steps for each." },
    { id: 5, title: "Website copy", prompt: "Write a compelling About Me page for my photography website. I'm a family and lifestyle photographer who also does fitness/gym photography. Tone: warm, professional, personal." },
  ]
};

const STATUS_COLORS = { "In Progress": "#f59e0b", "Active": "#10b981", "Booked": "#6366f1", "Completed": "#64748b" };
const TYPE_COLORS = { "Photography": "#e879f9", "Social Media": "#22d3ee", "Business Idea": "#f59e0b", "Research": "#6366f1", "Goal": "#10b981", "Stable": "#10b981", "Freelance": "#e879f9" };
const STORAGE_KEY = "biz_hub_data_v2";

export default function App() {
  const [section, setSection] = useState("Dashboard");
  const [data, setData] = useState(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [modal, setModal] = useState(null);
  const [copied, setCopied] = useState(null);
  const [newItem, setNewItem] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData(JSON.parse(saved));
    } catch (e) {}
    setLoaded(true);
  }, []);

  const updateData = (newData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (e) {}
  };

  const copyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleGoal = (id) =>
    updateData({ ...data, goals: data.goals.map(g => g.id === id ? { ...g, done: !g.done } : g) });

  const doneGoals = data.goals.filter(g => g.done).length;
  const activeProjects = data.projects.filter(p => p.status !== "Completed").length;
  const highPriorityIdeas = data.ideas.filter(i => i.priority === "High").length;

  const s = {
    page: { minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'Georgia', serif" },
    header: { background: "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a1628 100%)", borderBottom: "1px solid #1e293b", padding: "20px 24px 0" },
    inner: { maxWidth: 1100, margin: "0 auto" },
    card: { background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: 16 },
    btn: (color) => ({ background: `linear-gradient(135deg, ${color})`, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }),
    tag: (color) => ({ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: `${color}22`, color }),
    mono: { fontFamily: "monospace" },
  };

  if (!loaded) return <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontFamily: "monospace" }}>LOADING...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.inner}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #e879f9, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>D</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: "bold", color: "#f1f5f9" }}>David's Business Hub</div>
                <div style={{ fontSize: 11, color: "#64748b", ...s.mono, letterSpacing: "0.08em" }}>PHOTOGRAPHY Â· SOCIAL MEDIA Â· GROWTH</div>
              </div>
            </div>
            <div style={{ ...s.mono, fontSize: 10, color: justSaved ? "#10b981" : "#334155", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: justSaved ? "#10b981" : "#334155", display: "inline-block" }} />
              {justSaved ? "SAVED âœ“" : "AUTO-SAVE ON"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 16, overflowX: "auto" }}>
            {SECTIONS.map(sec => (
              <button key={sec} onClick={() => setSection(sec)} style={{ background: section === sec ? "linear-gradient(135deg, #e879f9, #6366f1)" : "transparent", color: section === sec ? "white" : "#94a3b8", border: "none", borderRadius: "8px 8px 0 0", padding: "8px 14px", fontSize: 12, ...s.mono, cursor: "pointer", whiteSpace: "nowrap" }}>{sec.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...s.inner, padding: "24px 16px" }}>

        {section === "Dashboard" && (
          <div>
            <h2 style={{ fontSize: 22, color: "#f1f5f9", margin: "0 0 4px" }}>Welcome back, David ðŸ‘‹</h2>
            <p style={{ color: "#64748b", margin: "0 0 24px", fontSize: 14 }}>Your data saves to this browser automatically.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Active Projects", value: activeProjects, color: "#22d3ee", icon: "ðŸ“" },
                { label: "Goals Completed", value: `${doneGoals}/${data.goals.length}`, color: "#10b981", icon: "ðŸŽ¯" },
                { label: "High Priority Ideas", value: highPriorityIdeas, color: "#e879f9", icon: "ðŸ’¡" },
                { label: "Prompt Templates", value: data.prompts.length, color: "#f59e0b", icon: "ðŸ¤–" },
              ].map(stat => (
                <div key={stat.label} style={{ ...s.card, border: `1px solid ${stat.color}22` }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{stat.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: "bold", color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={{ ...s.card, background: "linear-gradient(135deg, #1a0a2e, #0a1628)", border: "1px solid #e879f933", marginBottom: 20 }}>
              <h3 style={{ color: "#e879f9", margin: "0 0 12px", fontSize: 15, ...s.mono }}>ðŸ¤– HOW TO USE CLAUDE FOR YOUR BUSINESS</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {[
                  { role: "ðŸ“¸ Photography", tips: ["Write client emails & contracts", "Create pricing packages", "Plan portfolio content", "Write website copy"] },
                  { role: "ðŸ“± Social Media", tips: ["Plan weekly content calendars", "Write captions in bulk", "Brainstorm reel ideas", "Analyze what's working"] },
                  { role: "ðŸŒ Website", tips: ["Write all page copy", "SEO meta descriptions", "Service descriptions", "FAQ sections"] },
                  { role: "ðŸ“ˆ Growth", tips: ["Identify next revenue moves", "Plan rates & packages", "Research competitors", "Build referral systems"] },
                ].map(r => (
                  <div key={r.role} style={{ background: "#ffffff08", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: "bold", color: "#f1f5f9", marginBottom: 8, fontSize: 13 }}>{r.role}</div>
                    {r.tips.map(t => <div key={t} style={{ fontSize: 12, color: "#94a3b8", padding: "2px 0", display: "flex", gap: 6 }}><span style={{ color: "#e879f9" }}>â†’</span>{t}</div>)}
                  </div>
                ))}
              </div>
            </div>
            <div style={s.card}>
              <h3 style={{ color: "#f1f5f9", margin: "0 0 12px", fontSize: 14, ...s.mono }}>â° UPCOMING DEADLINES</h3>
              {data.projects.filter(p => p.status !== "Completed").sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e293b" }}>
                  <span style={s.tag(TYPE_COLORS[p.type] || "#6366f1")}>{p.type}</span>
                  <span style={{ flex: 1, fontSize: 13 }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: "#64748b", ...s.mono }}>{p.deadline}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "Projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#f1f5f9" }}>Projects</h2>
              <button onClick={() => setModal("addProject")} style={s.btn("#e879f9, #6366f1")}>+ Add Project</button>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {data.projects.map(p => (
                <div key={p.id} style={{ ...s.card, borderLeft: `3px solid ${STATUS_COLORS[p.status] || "#6366f1"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 15, color: "#f1f5f9" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>Due: {p.deadline}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={s.tag(TYPE_COLORS[p.type] || "#6366f1")}>{p.type}</span>
                      <span style={s.tag(STATUS_COLORS[p.status] || "#6366f1")}>{p.status}</span>
                    </div>
                  </div>
                  {p.notes && <div style={{ fontSize: 12, color: "#94a3b8", padding: "8px 10px", background: "#ffffff06", borderRadius: 6, marginBottom: 10 }}>{p.notes}</div>}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["In Progress", "Active", "Booked", "Completed"].map(st => (
                      <button key={st} onClick={() => updateData({ ...data, projects: data.projects.map(pr => pr.id === p.id ? { ...pr, status: st } : pr) })} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: p.status === st ? `${STATUS_COLORS[st]}33` : "transparent", color: p.status === st ? STATUS_COLORS[st] : "#475569", border: `1px solid ${p.status === st ? STATUS_COLORS[st] : "#1e293b"}`, cursor: "pointer" }}>{st}</button>
                    ))}
                    <button onClick={() => updateData({ ...data, projects: data.projects.filter(pr => pr.id !== p.id) })} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "transparent", color: "#475569", border: "1px solid #1e293b", cursor: "pointer", marginLeft: "auto" }}>âœ• Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "Income" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#f1f5f9" }}>Income Tracker</h2>
              <button onClick={() => setModal("addIncome")} style={s.btn("#10b981, #6366f1")}>+ Add Source</button>
            </div>
            <div style={{ ...s.card, border: "1px solid #10b98133", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#64748b", ...s.mono, marginBottom: 4 }}>MONTHLY TOTAL</div>
              <div style={{ fontSize: 36, fontWeight: "bold", color: "#10b981" }}>${data.income.filter(i => i.frequency !== "Goal").reduce((sum, i) => sum + (Number(i.amount) || 0), 0).toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Updates automatically as you enter amounts</div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {data.income.map(inc => (
                <div key={inc.id} style={{ ...s.card, borderLeft: `3px solid ${TYPE_COLORS[inc.type] || "#6366f1"}`, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "bold", color: "#f1f5f9", fontSize: 14 }}>{inc.source}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{inc.frequency} Â· {inc.notes}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#64748b" }}>$</span>
                    <input type="number" value={inc.amount} onChange={e => updateData({ ...data, income: data.income.map(i => i.id === inc.id ? { ...i, amount: e.target.value } : i) })}
                      style={{ background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9", borderRadius: 6, padding: "6px 10px", width: 100, fontSize: 16, fontWeight: "bold" }} />
                  </div>
                  <span style={s.tag(TYPE_COLORS[inc.type] || "#6366f1")}>{inc.type}</span>
                  <button onClick={() => updateData({ ...data, income: data.income.filter(i => i.id !== inc.id) })} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "transparent", color: "#475569", border: "1px solid #1e293b", cursor: "pointer" }}>âœ•</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "Ideas & Research" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#f1f5f9" }}>Ideas & Research</h2>
              <button onClick={() => setModal("addIdea")} style={s.btn("#f59e0b, #e879f9")}>+ Add Idea</button>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {data.ideas.map(idea => (
                <div key={idea.id} style={{ ...s.card, borderLeft: `3px solid ${idea.priority === "High" ? "#f59e0b" : "#6366f1"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <div style={{ fontWeight: "bold", fontSize: 15, color: "#f1f5f9" }}>{idea.title}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={s.tag("#818cf8")}>{idea.category}</span>
                      <span style={s.tag(idea.priority === "High" ? "#f59e0b" : "#64748b")}>{idea.priority}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>{idea.detail}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Low", "Medium", "High"].map(p => (
                      <button key={p} onClick={() => updateData({ ...data, ideas: data.ideas.map(i => i.id === idea.id ? { ...i, priority: p } : i) })} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: idea.priority === p ? "#f59e0b22" : "transparent", color: idea.priority === p ? "#f59e0b" : "#475569", border: `1px solid ${idea.priority === p ? "#f59e0b" : "#1e293b"}`, cursor: "pointer" }}>{p}</button>
                    ))}
                    <button onClick={() => updateData({ ...data, ideas: data.ideas.filter(i => i.id !== idea.id) })} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "transparent", color: "#475569", border: "1px solid #1e293b", cursor: "pointer", marginLeft: "auto" }}>âœ• Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "Goals" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: "#f1f5f9" }}>Goals</h2>
              <button onClick={() => setModal("addGoal")} style={s.btn("#10b981, #22d3ee")}>+ Add Goal</button>
            </div>
            <div style={{ ...s.card, marginBottom: 16, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ fontSize: 28, fontWeight: "bold", color: "#10b981" }}>{doneGoals}/{data.goals.length}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#f1f5f9", marginBottom: 6 }}>Goals completed</div>
                <div style={{ height: 6, background: "#1e293b", borderRadius: 3 }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg, #10b981, #22d3ee)", borderRadius: 3, width: `${data.goals.length ? (doneGoals / data.goals.length) * 100 : 0}%`, transition: "width 0.3s" }} />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {data.goals.map(goal => (
                <div key={goal.id} onClick={() => toggleGoal(goal.id)} style={{ ...s.card, background: goal.done ? "#0a1a12" : "#111827", border: `1px solid ${goal.done ? "#10b98133" : "#1e293b"}`, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${goal.done ? "#10b981" : "#334155"}`, background: goal.done ? "#10b981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {goal.done && <span style={{ color: "white", fontSize: 12 }}>âœ“</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: goal.done ? "#64748b" : "#f1f5f9", textDecoration: goal.done ? "line-through" : "none" }}>{goal.goal}</div>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{goal.category} Â· Due {goal.deadline}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); updateData({ ...data, goals: data.goals.filter(g => g.id !== goal.id) }); }} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "transparent", color: "#475569", border: "1px solid #1e293b", cursor: "pointer" }}>âœ•</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "Claude Prompts" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 4px", color: "#f1f5f9" }}>Claude Prompt Library</h2>
              <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Copy any prompt, fill in [brackets], paste into Claude.</p>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {data.prompts.map(p => (
                <div key={p.id} style={s.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ fontWeight: "bold", color: "#f1f5f9", fontSize: 14 }}>{p.title}</div>
                    <button onClick={() => copyPrompt(p.prompt, p.id)} style={{ background: copied === p.id ? "#10b98122" : "#6366f122", color: copied === p.id ? "#10b981" : "#818cf8", border: `1px solid ${copied === p.id ? "#10b981" : "#6366f1"}`, borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>{copied === p.id ? "âœ“ Copied!" : "Copy"}</button>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", background: "#ffffff06", borderRadius: 6, padding: 10, lineHeight: 1.6, ...s.mono }}>{p.prompt}</div>
                </div>
              ))}
            </div>
            <div style={{ ...s.card, background: "linear-gradient(135deg, #1a0a2e, #0a1628)", border: "1px solid #6366f133", marginTop: 20 }}>
              <h3 style={{ color: "#818cf8", fontSize: 13, margin: "0 0 10px", ...s.mono }}>ðŸ’¡ TIPS FOR BETTER RESULTS FROM CLAUDE</h3>
              {["Be specific â€” include your goal, audience, or deadline", "Share context â€” mention family of 7, multiple income streams", "Ask for options â€” 'give me 3 versions' works great", "Iterate â€” paste output back and say 'make it shorter/warmer'", "Use it daily â€” treat Claude like your free business assistant"].map(tip => (
                <div key={tip} style={{ display: "flex", gap: 8, fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
                  <span style={{ color: "#6366f1" }}>â†’</span>{tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {modal && (
          <div style={{ position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} onClick={() => { setModal(null); setNewItem({}); }}>
            <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 16, padding: 24, width: "100%", maxWidth: 420 }} onClick={e => e.stopPropagation()}>
              <h3 style={{ margin: "0 0 16px", color: "#f1f5f9" }}>
                {modal === "addProject" ? "New Project" : modal === "addIncome" ? "New Income Source" : modal === "addIdea" ? "New Idea" : "New Goal"}
              </h3>
              {[
                ...(modal === "addProject" ? [{ key: "name", label: "PROJECT NAME" }] : []),
                ...(modal === "addIncome" ? [{ key: "source", label: "INCOME SOURCE" }] : []),
                ...(modal === "addIdea" ? [{ key: "title", label: "IDEA TITLE" }] : []),
                ...(modal === "addGoal" ? [{ key: "goal", label: "GOAL" }] : []),
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: "#64748b", ...s.mono, display: "block", marginBottom: 4 }}>{f.label}</label>
                  <input value={newItem[f.key] || ""} onChange={e => setNewItem(n => ({ ...n, [f.key]: e.target.value }))}
                    style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9", borderRadius: 8, padding: "8px 12px", fontSize: 14, boxSizing: "border-box" }} />
                </div>
              ))}
              {modal !== "addIncome" && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: "#64748b", ...s.mono, display: "block", marginBottom: 4 }}>DEADLINE</label>
                  <input type="date" value={newItem.deadline || ""} onChange={e => setNewItem(n => ({ ...n, deadline: e.target.value }))}
                    style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9", borderRadius: 8, padding: "8px 12px", fontSize: 14, boxSizing: "border-box" }} />
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: "#64748b", ...s.mono, display: "block", marginBottom: 4 }}>NOTES / DETAILS</label>
                <textarea value={newItem.notes || ""} onChange={e => setNewItem(n => ({ ...n, notes: e.target.value, detail: e.target.value }))} rows={3}
                  style={{ width: "100%", background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9", borderRadius: 8, padding: "8px 12px", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setModal(null); setNewItem({}); }} style={{ flex: 1, background: "transparent", color: "#64748b", border: "1px solid #1e293b", borderRadius: 8, padding: 10, cursor: "pointer" }}>Cancel</button>
                <button onClick={() => {
                  const id = Date.now();
                  let updated = data;
                  if (modal === "addProject") updated = { ...data, projects: [...data.projects, { id, name: newItem.name || "New Project", status: "In Progress", type: "Photography", deadline: newItem.deadline || "", notes: newItem.notes || "" }] };
                  if (modal === "addIncome") updated = { ...data, income: [...data.income, { id, source: newItem.source || "New Source", amount: 0, frequency: "Monthly", type: "Freelance", notes: newItem.notes || "" }] };
                  if (modal === "addIdea") updated = { ...data, ideas: [...data.ideas, { id, title: newItem.title || "New Idea", category: "Business Idea", priority: "Medium", detail: newItem.detail || "" }] };
                  if (modal === "addGoal") updated = { ...data, goals: [...data.goals, { id, goal: newItem.goal || "New Goal", deadline: newItem.deadline || "", category: "Business", done: false }] };
                  updateData(updated);
                  setModal(null); setNewItem({});
                }} style={{ flex: 2, background: "linear-gradient(135deg, #e879f9, #6366f1)", color: "white", border: "none", borderRadius: 8, padding: 10, cursor: "pointer", fontWeight: "bold" }}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
