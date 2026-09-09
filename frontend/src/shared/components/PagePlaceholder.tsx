type PagePlaceholderProps = {
  title: string;
  description: string;
  action?: string;
};

export function PagePlaceholder({ title, description, action }: PagePlaceholderProps) {
  return (
    <section className="page">
      <header className="page-header">
        <div><h1>{title}</h1><p>{description}</p></div>
        {action && <button className="primary" type="button">{action}</button>}
      </header>
      <div className="surface">
        <h2>Modül başlangıç alanı</h2>
        <p>API, bileşen, hook ve model dosyaları bu feature klasörü içinde geliştirilecektir.</p>
      </div>
    </section>
  );
}

