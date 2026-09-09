import type { PropsWithChildren, ReactNode } from "react";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return <section className={`card ${className}`.trim()}>{children}</section>;
}

export function Badge({ children, tone = "neutral" }: PropsWithChildren<{ tone?: "neutral" | "success" | "warning" | "danger" }>) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="state-panel">
      <div className="state-icon" aria-hidden="true">○</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function LoadingState({ label = "Yükleniyor..." }: { label?: string }) {
  return (
    <div className="loading-grid" role="status" aria-label={label}>
      {[1, 2, 3].map((item) => <div className="skeleton" key={item} />)}
    </div>
  );
}

export function ErrorState({ message = "Bilgiler şu anda yüklenemedi." }: { message?: string }) {
  return (
    <div className="state-panel state-error" role="alert">
      <h2>Bir sorun oluştu</h2>
      <p>{message}</p>
    </div>
  );
}
