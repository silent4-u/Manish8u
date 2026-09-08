import type { ReactNode } from 'react';

/**
 * Diagrams the app draws for itself.
 *
 * A lesson figure names an entry in this registry rather than carrying image
 * data, which keeps three promises at once: nothing is fetched at runtime so
 * the app still works offline, the drawing follows the theme because it is
 * built from the same tokens as everything else, and the app ships no artwork
 * whose licence it cannot account for.
 *
 * Every figure is drawn from the syllabus or the Constitution — the structures
 * a candidate has to be able to reproduce — rather than decorating the page.
 */

const INK = 'var(--text)';
const SOFT = 'var(--text-muted)';
const LINE = 'var(--border-strong)';
const FILL = 'var(--surface-2)';
const ACCENT = 'var(--crimson)';
const OK = 'var(--ok)';

function Box({
  x, y, w, h, label, sub, tone = 'plain',
}: { x: number; y: number; w: number; h: number; label: string; sub?: string; tone?: 'plain' | 'accent' | 'ok' }) {
  const stroke = tone === 'accent' ? ACCENT : tone === 'ok' ? OK : LINE;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={FILL} stroke={stroke} strokeWidth="1.5" />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fill={INK} fontSize="12" fontWeight="600">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fill={SOFT} fontSize="10">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth="1.5" markerEnd="url(#fig-arrow)" />;
}

function Frame({ viewBox, children }: { viewBox: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} role="img" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <marker id="fig-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

/** The three stages every post now sits, and what carries forward from each. */
function ExamStages() {
  return (
    <Frame viewBox="0 0 520 210">
      <Box x={10} y={20} w={140} h={54} label="Stage I" sub="Preliminary · 100" tone="accent" />
      <Box x={190} y={20} w={140} h={54} label="Stage II" sub="Main examination" tone="ok" />
      <Box x={370} y={20} w={140} h={54} label="Final stage" sub="Skill test + interview" tone="ok" />
      <Arrow x1={152} y1={47} x2={188} y2={47} />
      <Arrow x1={332} y1={47} x2={368} y2={47} />
      <text x={80} y={98} textAnchor="middle" fill={ACCENT} fontSize="10.5" fontWeight="600">Screening only</text>
      <text x={80} y={113} textAnchor="middle" fill={SOFT} fontSize="10">pass 45%</text>
      <text x={80} y={128} textAnchor="middle" fill={SOFT} fontSize="10">marks not carried</text>
      <text x={260} y={98} textAnchor="middle" fill={OK} fontSize="10.5" fontWeight="600">Counts</text>
      <text x={260} y={113} textAnchor="middle" fill={SOFT} fontSize="10">pass 40 per paper</text>
      <text x={440} y={98} textAnchor="middle" fill={OK} fontSize="10.5" fontWeight="600">Counts</text>
      <line x1={190} y1={150} x2={510} y2={150} stroke={OK} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={350} y={168} textAnchor="middle" fill={INK} fontSize="11" fontWeight="600">
        Final result = Stage II + Final stage
      </text>
      <text x={350} y={184} textAnchor="middle" fill={SOFT} fontSize="10">
        Stage I decides only who sits Stage II
      </text>
    </Frame>
  );
}

/** How money and law divide across the three levels of government. */
function ThreeLevels() {
  return (
    <Frame viewBox="0 0 520 230">
      <Box x={160} y={12} w={200} h={48} label="Federation" sub="Schedule 5" tone="accent" />
      <Box x={160} y={92} w={200} h={48} label="Province · 7" sub="Schedule 6" />
      <Box x={160} y={172} w={200} h={48} label="Local level · 753" sub="Schedule 8" />
      <Arrow x1={260} y1={62} x2={260} y2={90} />
      <Arrow x1={260} y1={142} x2={260} y2={170} />
      <rect x={10} y={52} width={130} height={128} rx="8" fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={75} y={98} textAnchor="middle" fill={INK} fontSize="11" fontWeight="600">Concurrent</text>
      <text x={75} y={116} textAnchor="middle" fill={SOFT} fontSize="10">Schedule 7</text>
      <text x={75} y={130} textAnchor="middle" fill={SOFT} fontSize="10">federation +</text>
      <text x={75} y={144} textAnchor="middle" fill={SOFT} fontSize="10">province</text>
      <text x={75} y={164} textAnchor="middle" fill={SOFT} fontSize="10">Schedule 9 · all three</text>
      <text x={440} y={100} textAnchor="middle" fill={INK} fontSize="11" fontWeight="600">On conflict</text>
      <text x={440} y={118} textAnchor="middle" fill={SOFT} fontSize="10">federal law</text>
      <text x={440} y={132} textAnchor="middle" fill={SOFT} fontSize="10">prevails to the</text>
      <text x={440} y={146} textAnchor="middle" fill={SOFT} fontSize="10">extent of the</text>
      <text x={440} y={160} textAnchor="middle" fill={SOFT} fontSize="10">inconsistency</text>
    </Frame>
  );
}

/** The budget cycle, closing rather than ending. */
function BudgetCycle() {
  const steps = [
    ['1 Formulation', 'ceiling → estimates'],
    ['2 Approval', 'appropriation'],
    ['3 Implementation', 'authority released'],
    ['4 Accounting', 'booked and reported'],
    ['5 Audit', 'AG → Parliament'],
  ];
  return (
    <Frame viewBox="0 0 520 220">
      {steps.map(([label, sub], i) => (
        <g key={label}>
          <Box x={10 + (i % 3) * 172} y={i < 3 ? 14 : 110} w={158} h={52} label={label} sub={sub} tone={i === 4 ? 'accent' : 'plain'} />
        </g>
      ))}
      <Arrow x1={170} y1={40} x2={180} y2={40} />
      <Arrow x1={342} y1={40} x2={352} y2={40} />
      <Arrow x1={430} y1={68} x2={430} y2={104} />
      <Arrow x1={182} y1={136} x2={172} y2={136} />
      <line x1={90} y1={110} x2={90} y2={90} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1={90} y1={90} x2={89} y2={90} stroke={ACCENT} strokeWidth="1.5" />
      <Arrow x1={90} y1={90} x2={90} y2={70} />
      <text x={260} y={196} textAnchor="middle" fill={SOFT} fontSize="10.5">
        Audit findings shape the next year’s estimates — the cycle closes, it does not end
      </text>
    </Frame>
  );
}

/** Where an audit report goes, and why audit is parliamentary control. */
function AuditChain() {
  return (
    <Frame viewBox="0 0 520 150">
      <Box x={8} y={40} w={112} h={52} label="Office" sub="accounts" />
      <Box x={144} y={40} w={112} h={52} label="Auditor" sub="General" tone="accent" />
      <Box x={280} y={40} w={104} h={52} label="President" />
      <Box x={408} y={40} w={104} h={52} label="Parliament" sub="PAC" tone="ok" />
      <Arrow x1={122} y1={66} x2={142} y2={66} />
      <Arrow x1={258} y1={66} x2={278} y2={66} />
      <Arrow x1={386} y1={66} x2={406} y2={66} />
      <text x={260} y={124} textAnchor="middle" fill={SOFT} fontSize="10.5">
        The report is laid before Parliament, which is what makes audit a control and not an internal exercise
      </text>
    </Frame>
  );
}

/** A file's journey through an office, which Paper II examines directly. */
function FilingFlow() {
  return (
    <Frame viewBox="0 0 520 150">
      <Box x={6} y={40} w={94} h={52} label="Darta" sub="registration" tone="accent" />
      <Box x={116} y={40} w={94} h={52} label="Tippani" sub="note" />
      <Box x={226} y={40} w={94} h={52} label="Decision" />
      <Box x={336} y={40} w={80} h={52} label="Chalani" sub="dispatch" />
      <Box x={432} y={40} w={82} h={52} label="Filing" sub="index" tone="ok" />
      <Arrow x1={102} y1={66} x2={114} y2={66} />
      <Arrow x1={212} y1={66} x2={224} y2={66} />
      <Arrow x1={322} y1={66} x2={334} y2={66} />
      <Arrow x1={418} y1={66} x2={430} y2={66} />
      <text x={260} y={124} textAnchor="middle" fill={SOFT} fontSize="10.5">
        Every incoming paper takes this path; the record is what makes the decision reviewable later
      </text>
    </Frame>
  );
}

export const FIGURES: Record<string, () => ReactNode> = {
  'exam-stages': ExamStages,
  'three-levels': ThreeLevels,
  'budget-cycle': BudgetCycle,
  'audit-chain': AuditChain,
  'filing-flow': FilingFlow,
};

export const FIGURE_IDS = Object.keys(FIGURES);
