import { useState } from "react";
import { markToolUsed } from "@/stores/progression";
import { Upload, FileText, AlertTriangle } from "lucide-react";

type Node = { name: string; text?: string; children: Node[]; attrs: Record<string, string> };

function parseXML(xml: string): Node | null {
  try {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    if (doc.querySelector("parsererror")) return null;
    const convert = (el: Element): Node => ({
      name: el.tagName,
      text: Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => (n.nodeValue ?? "").trim()).filter(Boolean).join(" "),
      children: Array.from(el.children).map(convert),
      attrs: Array.from(el.attributes).reduce<Record<string, string>>((a, x) => { a[x.name] = x.value; return a; }, {}),
    });
    return convert(doc.documentElement);
  } catch { return null; }
}

function TreeNode({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  return (
    <div className="font-mono text-xs" style={{ paddingLeft: depth * 12 }}>
      <button onClick={() => setOpen(!open)} className="text-left hover:bg-sky-50 rounded px-1">
        <span className="text-[var(--color-muted-foreground)]">{hasChildren ? (open ? "▼" : "▶") : " "}</span>
        <span className="ml-1 text-sky-800 font-semibold">&lt;{node.name}&gt;</span>
        {node.text && <span className="ml-2 text-emerald-700">{node.text}</span>}
      </button>
      {open && hasChildren && <div>{node.children.map((c, i) => <TreeNode key={i} node={c} depth={depth + 1} />)}</div>}
    </div>
  );
}

async function extractEmbeddedXML(file: File): Promise<string | null> {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = (await import("pdfjs-dist/build/pdf.worker.mjs?url")).default;
  const buf = await file.arrayBuffer();
  const pdf = await getDocument({ data: buf }).promise;
  const attachments = await (pdf as unknown as { getAttachments: () => Promise<Record<string, { filename: string; content: Uint8Array }> | null> }).getAttachments();
  if (!attachments) return null;
  const candidates = Object.values(attachments).filter((a) => /factur-x\.xml|xrechnung|zugferd|facture/i.test(a.filename));
  const pick = candidates[0] ?? Object.values(attachments)[0];
  if (!pick) return null;
  return new TextDecoder("utf-8").decode(pick.content);
}

export default function FacturXViewer() {
  const [xml, setXml] = useState<string>("");
  const [node, setNode] = useState<Node | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFile(f: File) {
    setError(null); setXml(""); setNode(null);
    markToolUsed("factur-x-viewer");
    try {
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        const x = await extractEmbeddedXML(f);
        if (!x) { setError("Aucun XML Factur-X trouvé dans ce PDF."); return; }
        setXml(x); setNode(parseXML(x));
      } else {
        const text = await f.text();
        setXml(text); setNode(parseXML(text));
      }
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="space-y-6">
      <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-8 cursor-pointer hover:border-[var(--color-accent)] transition-colors">
        <Upload className="h-8 w-8 text-[var(--color-muted-foreground)]" aria-hidden="true" />
        <span className="mt-3 text-sm font-medium">Déposer un PDF Factur-X ou un XML</span>
        <span className="mt-1 text-xs text-[var(--color-muted-foreground)]">Traité localement dans votre navigateur — aucun envoi serveur.</span>
        <input type="file" accept=".pdf,.xml,application/pdf,application/xml,text/xml" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      </label>

      {error && (
        <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3 text-amber-900 text-sm">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" aria-hidden="true"/>{error}
        </div>
      )}

      {node && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-[var(--color-primary)]"><FileText className="h-4 w-4" aria-hidden="true"/> Arborescence XML</div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto"><TreeNode node={node} /></div>
        </div>
      )}

      {xml && !node && (
        <pre className="rounded-xl border border-[var(--color-border)] bg-white p-4 text-xs overflow-auto max-h-96"><code>{xml}</code></pre>
      )}
    </div>
  );
}
