import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';
import { useProgress } from '../hooks/useProgress';
import { LESSON_BY_ID } from '../data/lessons';
import { QUESTIONS } from '../data/questions';
import { SUBJECT_BY_ID } from '../data/subjects';
import { Empty } from '../components/Empty';

const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

export function Saved() {
  const { t, b, n } = useLang();
  const { savedLessons, savedQuestions, toggleSavedLesson, toggleSavedQuestion } = useProgress();

  const lessons = savedLessons.map((id) => LESSON_BY_ID[id]).filter(Boolean);
  const questions = savedQuestions.map((id) => QUESTION_BY_ID[id]).filter(Boolean);

  if (lessons.length === 0 && questions.length === 0) {
    return (
      <div className="stack">
        <h1 className="display">{t('navSaved')}</h1>
        <Empty icon="⭐">{t('nothingSaved')}</Empty>
      </div>
    );
  }

  return (
    <div className="stack">
      <h1 className="display">{t('navSaved')}</h1>

      {lessons.length > 0 && (
        <section>
          <div className="eyebrow">{t('savedLessons')} · {n(lessons.length)}</div>
          <div className="stack">
            {lessons.map((lesson) => (
              <div className="card" key={lesson.id}>
                <div className="between" style={{ alignItems: 'flex-start' }}>
                  <Link to={`/lesson/${lesson.id}`} style={{ color: 'inherit' }}>
                    <strong>{b(lesson.title)}</strong>
                    <div className="small muted">{b(lesson.summary)}</div>
                  </Link>
                  <button type="button" className="bookmark-btn on" onClick={() => toggleSavedLesson(lesson.id)}>
                    ★
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {questions.length > 0 && (
        <section>
          <div className="eyebrow">{t('savedQuestions')} · {n(questions.length)}</div>
          <div className="stack">
            {questions.map((question) => {
              const subject = SUBJECT_BY_ID[question.subjectId];
              return (
                <div className="card" key={question.id}>
                  <div className="between" style={{ alignItems: 'flex-start', marginBottom: 6 }}>
                    <span className="pill">{subject ? b(subject.short) : question.subjectId}</span>
                    <button type="button" className="bookmark-btn on" onClick={() => toggleSavedQuestion(question.id)}>
                      ★
                    </button>
                  </div>
                  <p style={{ fontWeight: 600, marginBottom: 6 }}>{b(question.prompt)}</p>
                  <p className="small" style={{ marginBottom: 6 }}>
                    <span className="muted">{t('correctAnswer')}: </span>
                    <strong>{b(question.options[question.answer])}</strong>
                  </p>
                  <div className="notice tone-tip">
                    <div className="small">{b(question.explanation)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
