import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { SUBJECT_BY_ID } from '../data/subjects';
import { Empty } from '../components/Empty';

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ProgressPage() {
  const { t, b, n, lang } = useLang();
  const { attempts, subjectStats, clearAll } = useProgress();

  const entries = Object.entries(subjectStats)
    .filter(([, stat]) => stat.attempted > 0)
    .sort((a, b2) => b2[1].attempted - a[1].attempted);

  const totalAttempted = entries.reduce((sum, [, s]) => sum + s.attempted, 0);
  const totalCorrect = entries.reduce((sum, [, s]) => sum + s.correct, 0);
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  if (attempts.length === 0 && entries.length === 0) {
    return (
      <div className="stack">
        <h1 className="display">{t('navProgress')}</h1>
        <Empty icon="📊">{t('noAttempts')}</Empty>
        <Link to="/practice" className="btn btn-primary btn-block">{t('practiceQuiz')}</Link>
      </div>
    );
  }

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{t('overview')}</div>
        <h1 className="display">{t('navProgress')}</h1>
      </div>

      <div className="grid grid-3">
        <div className="stat">
          <div className="stat-value">{n(attempts.length)}</div>
          <div className="stat-label">{t('totalAttempts')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(totalAttempted)}</div>
          <div className="stat-label">{t('questionsAttempted')}</div>
        </div>
        <div className="stat">
          <div className="stat-value">{n(accuracy)}%</div>
          <div className="stat-label">{t('overallAccuracy')}</div>
        </div>
      </div>

      {entries.length > 0 && (
        <section>
          <div className="eyebrow">{t('bySubject')}</div>
          <div className="card stack">
            {entries.map(([subjectId, stat]) => {
              const subject = SUBJECT_BY_ID[subjectId];
              const percent = Math.round((stat.correct / stat.attempted) * 100);
              return (
                <div key={subjectId}>
                  <div className="between small" style={{ marginBottom: 5 }}>
                    <span>
                      <span aria-hidden="true">{subject?.icon} </span>
                      {subject ? b(subject.short) : subjectId}
                    </span>
                    <span className="mono-num muted">
                      {n(stat.correct)}/{n(stat.attempted)} · {n(percent)}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {attempts.length > 0 && (
        <section>
          <div className="eyebrow">{t('recentAttempts')}</div>
          <div className="card">
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{t('navPractice')}</th>
                    <th>{t('score')}</th>
                    <th>{t('accuracy')}</th>
                    <th>{t('timeTaken')}</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice(0, 15).map((attempt) => {
                    const attemptedCount = attempt.correct + attempt.wrong;
                    const acc = attemptedCount > 0 ? Math.round((attempt.correct / attemptedCount) * 100) : 0;
                    const subject = attempt.subjectId ? SUBJECT_BY_ID[attempt.subjectId] : null;
                    return (
                      <tr key={attempt.id}>
                        <td>
                          <div>{attempt.mode === 'mock' ? t('fullMockTest') : subject ? b(subject.short) : t('mixedPractice')}</div>
                          <div className="tiny muted">
                            {new Date(attempt.finishedAt).toLocaleDateString(lang === 'ne' ? 'ne-NP' : 'en-GB')}
                          </div>
                        </td>
                        <td className="mono-num">{n(attempt.score)}/{n(attempt.maxScore)}</td>
                        <td className="mono-num">{n(acc)}%</td>
                        <td className="mono-num">{n(formatClock(attempt.seconds))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        className="btn btn-danger btn-block"
        onClick={() => { if (window.confirm(t('confirmClear'))) clearAll(); }}
      >
        {t('clearProgress')}
      </button>
    </div>
  );
}
