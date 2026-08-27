import type { ReactNode } from 'react';

export function Empty({ icon = '📭', children }: { icon?: string; children: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty-icon" aria-hidden="true">{icon}</span>
      {children}
    </div>
  );
}
