import type { LessonBlock } from '../types';
import { useLang } from '../i18n/LanguageContext';

const TONE_LABEL = { key: 'keyPoint', tip: 'tip', warn: 'watchOut' } as const;

export function LessonBlocks({ blocks }: { blocks: LessonBlock[] }) {
  const { b, t } = useLang();

  return (
    <div className="lesson-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <h3 key={index}>{b(block.text)}</h3>;

          case 'para':
            return <p key={index}>{b(block.text)}</p>;

          case 'list':
            return block.ordered ? (
              <ol key={index}>
                {block.items.map((item, i) => <li key={i}>{b(item)}</li>)}
              </ol>
            ) : (
              <ul key={index}>
                {block.items.map((item, i) => <li key={i}>{b(item)}</li>)}
              </ul>
            );

          case 'facts':
            return (
              <dl className="fact-grid" key={index}>
                {block.items.map((item, i) => (
                  <div className="fact" key={i}>
                    <dt>{b(item.label)}</dt>
                    <dd>{b(item.value)}</dd>
                  </div>
                ))}
              </dl>
            );

          case 'table':
            return (
              <div className="table-scroll" key={index}>
                <table>
                  <thead>
                    <tr>{block.headers.map((h, i) => <th key={i}>{b(h)}</th>)}</tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>{row.map((cell, c) => <td key={c}>{b(cell)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'callout':
            return (
              <div className={`notice tone-${block.tone}`} key={index}>
                <div>
                  <strong className="small">{t(TONE_LABEL[block.tone])}</strong>
                  <div>{b(block.text)}</div>
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
