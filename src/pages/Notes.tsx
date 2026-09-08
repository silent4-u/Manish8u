import { Link, useParams } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LEVEL_BY_ID, SYLLABUS_REVISION_NOTE } from '../data/levels';
import { LESSONS } from '../data/lessons';
import { SUBJECT_BY_ID } from '../data/subjects';
import { LessonBlocks } from '../components/LessonBlocks';
import { Empty } from '../components/Empty';
import type { Lesson } from '../types';

/**
 * A printable booklet of the app's own notes, for one subject or one paper.
 *
 * The browser's own print-to-PDF does the conversion, which is why there is no
 * PDF library here: it keeps the app offline and small, embeds no fonts of its
 * own, and renders Devanagari with the same shaper that draws it on screen.
 * The print stylesheet in app.css strips the app chrome and forces light ink.
 */
export function Notes() {
  const { scope, id } = useParams<{ scope: string; id: string }>();
  const { t, b, n, lang } = useLang();
  const { levelId } = useProgress();
  const level = levelId ? LEVEL_BY_ID[levelId] : null;

  if (!level || !id) return <Empty icon="📄">{t('noResults')}</Empty>;

  const forLevel = LESSONS.filter((l) => l.levels.includes(level.id));
  let title = '';
  let subtitle = '';
  let lessons: Lesson[] = [];

  if (scope === 'subject') {
    const subject = SUBJECT_BY_ID[id];
    if (!subject) return <Empty icon="📄">{t('noResults')}</Empty>;
    title = b(subject.name);
    subtitle = b(subject.description);
    lessons = forLevel.filter((l) => l.subjectId === id);
  } else {
    const paper = level.papers.find((p) => p.id === id);
    if (!paper) return <Empty icon="📄">{t('noResults')}</Empty>;
    title = b(paper.name);
    subtitle = b(paper.pattern);
    const sectionIds = new Set(paper.sections.map((s) => s.id));
    const subjectIds = new Set(paper.sections.flatMap((s) => s.subjectIds));
    // Notes written for one of this paper's sections come first, then anything
    // else on its subjects, so the booklet reads in the paper's own order.
    const written = forLevel.filter((l) => l.sections?.some((sec) => sectionIds.has(sec)));
    const writtenIds = new Set(written.map((l) => l.id));
    lessons = [...written, ...forLevel.filter((l) => !writtenIds.has(l.id) && subjectIds.has(l.subjectId))];
  }

  const readMinutes = lessons.reduce((sum, l) => sum + l.readMinutes, 0);

  return (
    <div className="notes">
      <div className="row no-print" style={{ marginBottom: 16 }}>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          {t('saveAsPdf')}
        </button>
        <Link to={scope === 'paper' ? `/paper/${id}` : `/study/${id}`} className="btn btn-ghost">
          {t('back')}
        </Link>
      </div>

      <div className="notes-cover">
        <div className="eyebrow">{t('appName')} · {b(level.name)}</div>
        <h1 className="display">{title}</h1>
        <p className="small muted">{subtitle}</p>
        <div className="row small muted" style={{ marginTop: 10 }}>
          <span>{n(lessons.length)} {t('lessons')}</span>
          <span>·</span>
          <span>{n(readMinutes)} {t('minutes')} {t('readTime')}</span>
          <span>·</span>
          <span>{t(lang === 'ne' ? 'nepaliMedium' : 'englishMedium')}</span>
        </div>
        <div className="notes-notice small">{t('notAffiliated')}</div>
        <div className="notes-notice small">{b(SYLLABUS_REVISION_NOTE)}</div>
      </div>

      {lessons.length === 0 ? (
        <Empty icon="📄">{t('noLessonsYet')}</Empty>
      ) : (
        <>
          <nav className="notes-contents">
            <div className="eyebrow">{t('contents')}</div>
            <ol className="small">
              {lessons.map((lesson) => <li key={lesson.id}>{b(lesson.title)}</li>)}
            </ol>
          </nav>

          {lessons.map((lesson) => (
            <article className="notes-lesson" key={lesson.id}>
              <h2>{b(lesson.title)}</h2>
              <p className="small muted">{b(lesson.summary)}</p>
              <LessonBlocks blocks={lesson.blocks} />
            </article>
          ))}
        </>
      )}
    </div>
  );
}
