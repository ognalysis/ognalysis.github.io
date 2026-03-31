import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "wiki-pages";

const DEFAULT_PAGES = [
  {
    id: "welcome",
    title: "Welcome to My Wiki",
    category: "Meta",
    content: `# Welcome to My Wiki\n\nThis is your personal wiki. Use it to capture how-to guides, notes, and documentation on any topic.\n\n## Getting started\n\n- Click **New page** to create your first entry\n- Use the sidebar to browse pages by category\n- Click the edit button on any page to update it\n- Pages are saved automatically in your browser\n\n## Markdown supported\n\nYou can use basic markdown in your pages:\n\n- **Bold** with \`**text**\`\n- *Italic* with \`*text*\`\n- \`Code\` with backticks\n- Headers with \`#\`, \`##\`, \`###\`\n- Lists with \`-\` or \`1.\`\n- Horizontal rules with \`---\``,
    updatedAt: new Date().toISOString(),
  },
];

function parseMarkdown(md) {
  if (!md) return "";
  let html = md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/^\d+\. (.+)$/gm, "<li style='list-style:decimal;margin-left:20px'>$1</li>")
    .replace(/^- (.+)$/gm, "<li style='list-style:disc;margin-left:20px'>$1</li>");
  html = html.replace(/(<li.*<\/li>\n?)+/g, m => `<ul style='margin:0.5rem 0'>${m}</ul>`);
  html = html.split(/\n\n+/).map(block => {
    if (/^<(h[123]|ul|hr|li)/.test(block.trim())) return block;
    if (block.trim() === "") return "";
    return `<p style='margin:0 0 0.75rem;line-height:1.7'>${block.replace(/\n/g, "<br/>")}</p>`;
  }).join("\n");
  return html;
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "page";
}

export default function Wiki() {
  const [pages, setPages] = useState(null);
  const [currentId, setCurrentId] = useState("welcome");
  const [view, setView] = useState("read");
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editContent, setEditContent] = useState("");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result && result.value) {
          const parsed = JSON.parse(result.value);
          setPages(parsed.length ? parsed : DEFAULT_PAGES);
          setCurrentId(parsed[0]?.id || "welcome");
        } else {
          setPages(DEFAULT_PAGES);
        }
      } catch {
        setPages(DEFAULT_PAGES);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (pages === null) return;
    window.storage.set(STORAGE_KEY, JSON.stringify(pages)).catch(() => {});
  }, [pages]);

  const currentPage = pages?.find(p => p.id === currentId) || pages?.[0];

  const categories = pages
    ? [...new Set(pages.map(p => p.category).filter(Boolean))].sort()
    : [];

  const filtered = pages
    ? pages.filter(p =>
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  function openEdit(page) {
    setEditTitle(page.title);
    setEditCategory(page.category || "");
    setEditContent(page.content);
    setView("edit");
    setConfirmDelete(false);
  }

  function openNew() {
    setEditTitle("");
    setEditCategory("");
    setEditContent("");
    setView("new");
    setConfirmDelete(false);
  }

  function saveEdit() {
    if (!editTitle.trim()) return;
    setPages(prev => prev.map(p =>
      p.id === currentId
        ? { ...p, title: editTitle.trim(), category: editCategory.trim(), content: editContent, updatedAt: new Date().toISOString() }
        : p
    ));
    setView("read");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function saveNew() {
    if (!editTitle.trim()) return;
    const id = slugify(editTitle) + "-" + Date.now();
    const newPage = {
      id,
      title: editTitle.trim(),
      category: editCategory.trim(),
      content: editContent,
      updatedAt: new Date().toISOString(),
    };
    setPages(prev => [newPage, ...prev]);
    setCurrentId(id);
    setView("read");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function deletePage() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    const remaining = pages.filter(p => p.id !== currentId);
    setPages(remaining.length ? remaining : DEFAULT_PAGES);
    setCurrentId(remaining[0]?.id || "welcome");
    setView("read");
    setConfirmDelete(false);
  }

  function insertMarkdown(before, after = "") {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const selected = editContent.slice(start, end);
    const newText = editContent.slice(0, start) + before + selected + after + editContent.slice(end);
    setEditContent(newText);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  }

  if (!pages) {
    return <div style={{ padding: "2rem", color: "var(--color-text-secondary)", fontSize: 14 }}>Loading…</div>;
  }

  const isEditing = view === "edit" || view === "new";
  const editingPage = view === "edit" ? currentPage : null;

  return (
    <div style={{ display: "flex", minHeight: 600, fontFamily: "var(--font-sans)", fontSize: 14 }}>
      <aside style={{
        width: 220, flexShrink: 0, borderRight: "0.5px solid var(--color-border-tertiary)",
        padding: "16px 0", display: "flex", flexDirection: "column", gap: 0
      }}>
        <div style={{ padding: "0 12px 12px" }}>
          <div style={{ fontWeight: 500, fontSize: 15, color: "var(--color-text-primary)", marginBottom: 10 }}>
            My Wiki
          </div>
          <input
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", fontSize: 13, padding: "6px 8px" }}
          />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          {search ? (
            <>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", padding: "4px 8px 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
              {filtered.map(p => (
                <SidebarLink key={p.id} page={p} active={p.id === currentId} onClick={() => { setCurrentId(p.id); setView("read"); setSearch(""); }} />
              ))}
            </>
          ) : categories.length ? categories.map(cat => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", padding: "4px 8px 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{cat}</div>
              {pages.filter(p => p.category === cat).map(p => (
                <SidebarLink key={p.id} page={p} active={p.id === currentId} onClick={() => { setCurrentId(p.id); setView("read"); }} />
              ))}
            </div>
          )) : pages.map(p => (
            <SidebarLink key={p.id} page={p} active={p.id === currentId} onClick={() => { setCurrentId(p.id); setView("read"); }} />
          ))}
          {pages.filter(p => !p.category).length > 0 && categories.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", padding: "4px 8px 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Other</div>
              {pages.filter(p => !p.category).map(p => (
                <SidebarLink key={p.id} page={p} active={p.id === currentId} onClick={() => { setCurrentId(p.id); setView("read"); }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "12px 8px 0", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <button onClick={openNew} style={{ width: "100%", fontSize: 13, padding: "7px 0" }}>
            + New page
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, padding: "24px 32px", overflowY: "auto" }}>
        {isEditing ? (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
              <button onClick={() => { setView("read"); setConfirmDelete(false); }} style={{ fontSize: 13 }}>Cancel</button>
              <button onClick={view === "new" ? saveNew : saveEdit} style={{ fontSize: 13, background: "var(--color-text-primary)", color: "var(--color-background-primary)", border: "none" }}>
                {view === "new" ? "Create page" : "Save changes"}
              </button>
              {view === "edit" && (
                <button onClick={deletePage} style={{ fontSize: 13, marginLeft: "auto", color: confirmDelete ? "var(--color-text-danger)" : "var(--color-text-tertiary)", borderColor: confirmDelete ? "var(--color-border-danger)" : "var(--color-border-tertiary)" }}>
                  {confirmDelete ? "Confirm delete?" : "Delete"}
                </button>
              )}
            </div>

            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="Page title"
              style={{ width: "100%", fontSize: 20, fontWeight: 500, marginBottom: 10, padding: "8px 10px", border: "0.5px solid var(--color-border-secondary)" }}
            />
            <input
              value={editCategory}
              onChange={e => setEditCategory(e.target.value)}
              placeholder="Category (optional)"
              style={{ width: "100%", fontSize: 13, marginBottom: 14, padding: "6px 10px" }}
            />

            <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
              {[["B", "**", "**"], ["I", "*", "*"], ["#", "# ", ""], ["##", "## ", ""], ["Code", "`", "`"]].map(([label, before, after]) => (
                <button key={label} onClick={() => insertMarkdown(before, after)} style={{ fontSize: 12, padding: "4px 9px" }}>{label}</button>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              placeholder="Write your page content in Markdown…"
              rows={22}
              style={{ width: "100%", fontSize: 13, fontFamily: "var(--font-mono)", lineHeight: 1.65, padding: "12px", resize: "vertical", border: "0.5px solid var(--color-border-secondary)" }}
            />
          </div>
        ) : currentPage ? (
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
              <div>
                {currentPage.category && (
                  <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-tertiary)", marginBottom: 6 }}>
                    {currentPage.category}
                  </div>
                )}
                <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0, color: "var(--color-text-primary)" }}>{currentPage.title}</h1>
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}>
                  Updated {formatDate(currentPage.updatedAt)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                {saved && <span style={{ fontSize: 12, color: "var(--color-text-success)" }}>Saved</span>}
                <button onClick={() => openEdit(currentPage)} style={{ fontSize: 13 }}>Edit</button>
              </div>
            </div>

            <div
              style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 20, color: "var(--color-text-primary)", fontSize: 15, lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(currentPage.content) }}
            />
          </div>
        ) : (
          <div style={{ color: "var(--color-text-secondary)", paddingTop: 40, textAlign: "center" }}>
            No page selected
          </div>
        )}
      </main>
    </div>
  );
}

function SidebarLink({ page, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block", width: "100%", textAlign: "left",
        padding: "5px 8px", fontSize: 13, border: "none", cursor: "pointer",
        borderRadius: "var(--border-radius-md)",
        background: active ? "var(--color-background-secondary)" : "transparent",
        color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
        fontWeight: active ? 500 : 400,
      }}
    >
      {page.title}
    </button>
  );
}
