import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { SUBJECTS, SUBJECT_BY_ID } from '../data/subjects';
import { LESSONS, LESSON_BY_ID } from '../data/lessons';
import { questionsFor } from '../data/questions';
import { LessonBlocks } from '../components/LessonBlocks';
import { Empty } from '../components/Empty';
import type { LevelId } from '../types';

export function SubjectList() {
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const [query, setQuery] = useState('');

  if (!levelId) return null;

  const subjects = SUBJECTS.filter((s) => s.levels.includes(levelId));
  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? subjects.filter((s) =>
        [s.name.en, s.name.ne, s.description.en, s.description.ne].some((text) =>
          text.toLowerCase().includes(needle),
        ),
      )
    : subjects;

  return (
    <div className="stack">
      <div>
        <div className="eyebrow">{t('navStudy')}</div>
        <h1 className="display">{t('subjects')}</h1>
      </div>

      <Link to="/first-paper" className="card" style={{ display: 'block', color: 'inherit' }}>
        <div className="between">
          <div>
            <div className="eyebrow" style={{ marginBottom: 2 }}>{t('paper')} I</div>
            <strong>{t('firstPaperTitle')}</strong>
            <div className="small muted">{t('firstPaperLede')}</div>
          </div>
          <span aria-hidden="true" className="muted">→</span>
        </div>
      </Link>

      <input
        className="input"
        type="search"
        placeholder={t('search')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label={t('search')}
      />

      {filtered.length === 0 ? (
        <Empty icon="🔍">{t('noResults')}</Empty>
      ) : (
        <div className="grid grid-2">
          {filtered.map((subject) => {
            const lessonCount = LESSONS.filter(
              (l) => l.subjectId === subject.id && l.levels.includes(levelId),
            ).length;
            const questionCount = questionsFor(levelId, subject.id).length;
            return (
              <Link key={subject.id} to={`/study/${subject.id}`} className="subject-tile">
                <span className="subject-icon" aria-hidden="true">{subject.icon}</span>
                <span style={{ minWidth: 0 }}>
                  <strong>{b(subject.name)}</strong>
                  <div className="small muted">{b(subject.description)}</div>
                  <div className="row" style={{ marginTop: 7 }}>
                    <span className="pill">{n(lessonCount)} {t('lessons')}</span>
                    <span className="pill">{n(questionCount)} {t('questions')}</span>
                  </div>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function LessonList() {
  const { subjectId = '' } = useParams();
  const { t, b, n } = useLang();
  const { levelId } = useProgress();
  const subject = SUBJECT_BY_ID[subjectId];

  const lessons = useMemo(
    () => LESSONS.filter((l) => l.subjectId === subjectId && (!levelId || l.levels.includes(levelId as LevelId))),
    [subjectId, levelId],
  );

  if (!subject) return <Empty icon="🤔">{t('noResults')}</Empty>;

  return (
    <div className="stack">
      <div className="breadcrumb">
        <Link to="/study">{t('subjects')}</Link> / {b(subject.short)}
      </div>

      <div>
        <h1 className="display">
          <span aria-hidden="true">{subject.icon} </span>
          {b(subject.name)}
        </h1>
        <p className="muted small">{b(subject.description)}</p>
        <Link to={`/practice/${subject.id}`} className="btn btn-primary btn-sm">
          {t('practiceThisSubject')}
        </Link>
      </div>

      {lessons.length === 0 ? (
        <Empty icon="📄">{t('noLessonsYet')}</Empty>
      ) : (
        <div className="stack">
          {lessons.map((lesson) => (
            <Link key={lesson.id} to={`/lesson/${lesson.id}`} className="card" style={{ display: 'block', color: 'inherit' }}>
              <h3 style={{ marginBottom: 4 }}>{b(lesson.title)}</h3>
              <p className="small muted" style={{ marginBottom: 8 }}>{b(lesson.summary)}</p>
              <span className="pill">{n(lesson.readMinutes)} {t('minutes')} {t('readTime')}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function LessonView() {
  const { lessonId = '' } = useParams();
  const { t, b, n } = useLang();
  const { savedLessons, toggleSavedLesson } = useProgress();
  const lesson = LESSON_BY_ID[lessonId];

  if (!lesson) return <Empty icon="🤔">{t('noResults')}</Empty>;

  const subject = SUBJECT_BY_ID[lesson.subjectId];
  const isSaved = savedLessons.includes(lesson.id);

  return (
    <div className="stack">
      <div className="breadcrumb">
        <Link to="/study">{t('subjects')}</Link>
        {subject && <> / <Link to={`/study/${subject.id}`}>{b(subject.short)}</Link></>}
      </div>

      <div className="between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 className="display" style={{ marginBottom: 4 }}>{b(lesson.title)}</h1>
          <span className="pill">{n(lesson.readMinutes)} {t('minutes')} {t('readTime')}</span>
        </div>
        <button
          type="button"
          className={`bookmark-btn${isSaved ? ' on' : ''}`}
          onClick={() => toggleSavedLesson(lesson.id)}
          aria-pressed={isSaved}
        >
          {isSaved ? `★ ${t('saved')}` : `☆ ${t('save')}`}
        </button>
      </div>

      <div className="card">
        <LessonBlocks blocks={lesson.blocks} />
      </div>

      {subject && (
        <Link to={`/practice/${subject.id}`} className="btn btn-primary btn-block">
          {t('practiceThisSubject')}
        </Link>
      )}
    </div>
  );
}
