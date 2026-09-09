import { Link, useRouteError } from "react-router-dom";
import { EmptyState } from "./Ui";

export function NotFoundPage() {
  return (
    <div className="page">
      <EmptyState
        title="Sayfa bulunamadı"
        description="Aradığınız sayfa taşınmış veya henüz hazırlanıyor olabilir."
        action={<Link className="button button-primary" to="/dashboard">Gösterge paneline dön</Link>}
      />
    </div>
  );
}

export function RouteErrorPage() {
  const error = useRouteError();
  console.error("Route error", error);

  return (
    <div className="page">
      <EmptyState
        title="Sayfa yüklenemedi"
        description="Beklenmeyen bir sorun oluştu. Lütfen gösterge paneline dönüp tekrar deneyin."
        action={<Link className="button button-primary" to="/dashboard">Gösterge paneline dön</Link>}
      />
    </div>
  );
}
