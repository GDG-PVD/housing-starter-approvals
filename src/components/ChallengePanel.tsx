// Challenge 2 tab: What does it take to get approved?
import React, { useState } from 'react';
import { ListChecks, Loader2, Printer, ShieldAlert, Sparkles } from 'lucide-react';
import { TownInfo } from '../types';

interface Step {
  name: string;
  reviewer: string;
  whoToContact: string;
  typicalTimeline: string;
  documents: string[];
  sure: boolean;
}

interface Props {
  address: string;
  town: TownInfo | null;
}

const CONFIRM = 'Confirm with the town';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// One-page printable summary of the checklist, in a new window
function printChecklist(address: string, town: string, steps: Step[], done: Set<number>) {
  const rows = steps
    .map(
      (s, i) => `<tr>
        <td>${done.has(i) ? '&#9745;' : '&#9744;'}</td>
        <td><b>${i + 1}. ${esc(s.name)}</b>${s.sure ? '' : `<br><i>${CONFIRM}</i>`}</td>
        <td>${esc(s.reviewer)}<br><small>${esc(s.whoToContact)}</small></td>
        <td>${esc(s.typicalTimeline)}</td>
        <td>${s.documents.map(esc).join('<br>')}</td>
      </tr>`
    )
    .join('');
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8">
    <title>Approvals checklist: ${esc(address)}</title>
    <style>
      body { font: 11pt/1.35 system-ui, sans-serif; margin: 0.5in; }
      h1 { font-size: 16pt; margin: 0 } p { margin: 4px 0 12px }
      table { border-collapse: collapse; width: 100% }
      td, th { border: 1px solid #999; padding: 4px 6px; vertical-align: top; text-align: left }
      small, i { color: #555 }
    </style></head><body>
    <h1>Approvals checklist</h1>
    <p>${esc(address)} (${esc(town)}). Small multifamily project.</p>
    <table><tr><th></th><th>Step</th><th>Reviewer</th><th>Typical timeline</th><th>Documents</th></tr>${rows}</table>
    <p><i>Drafted with Gemini as a starting point, not legal advice. Confirm every step with the town.</i></p>
    <script>window.onload = () => window.print()</script>
    </body></html>`);
  w.document.close();
}

export const ChallengePanel: React.FC<Props> = ({ address, town }) => {
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draft = async () => {
    if (!town) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          town: town.town,
          zoningUrl: town.zoningUrl,
          whereZoningSits: town.whereZoningSits,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not draft the checklist.');
      setSteps(data.steps || []);
      setDone(new Set());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i: number) => {
    const next = new Set(done);
    next.has(i) ? next.delete(i) : next.add(i);
    setDone(next);
  };

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-50 text-violet-700 rounded-2xl">
            <ListChecks className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">Challenge 2</p>
            <h3 className="text-2xl font-bold text-slate-900">What does it take to get approved?</h3>
          </div>
        </div>
        <div className="flex gap-2">
          {steps && steps.length > 0 && (
            <button
              onClick={() => printChecklist(address, town?.town || '', steps, done)}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold rounded-xl"
            >
              <Printer className="w-5 h-5" /> Print one page
            </button>
          )}
          <button
            onClick={draft}
            disabled={!town || loading}
            className="inline-flex items-center gap-2 px-5 py-3 bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {steps ? 'Redraft' : 'Draft the approvals checklist'}
          </button>
        </div>
      </div>

      {!town && (
        <p className="text-base text-slate-600">Pick the town in the zoning card above first.</p>
      )}
      {error && <p className="text-base text-rose-700 font-semibold">{error}</p>}

      {steps && (
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="p-4 border border-slate-200 rounded-xl flex gap-4">
              <input
                type="checkbox"
                checked={done.has(i)}
                onChange={() => toggle(i)}
                className="mt-1.5 w-5 h-5"
                aria-label={`Mark "${s.name}" done`}
              />
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900">
                  {i + 1}. {s.name}
                  {!s.sure && (
                    <span className="ml-2 align-middle text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {CONFIRM}
                    </span>
                  )}
                </p>
                <p className="text-slate-700">
                  <b>Reviewer:</b> {s.reviewer}. <b>Start with:</b> {s.whoToContact}
                </p>
                <p className="text-slate-700">
                  <b>Typical timeline:</b> {s.typicalTimeline}
                </p>
                {s.documents.length > 0 && (
                  <p className="text-slate-700">
                    <b>Documents:</b> {s.documents.join('; ')}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {steps && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-base font-bold text-amber-950">
            Drafted by Gemini as a starting point, not legal advice. Confirm every step with the town.
          </p>
        </div>
      )}
    </section>
  );
};
