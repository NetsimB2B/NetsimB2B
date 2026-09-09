import { useState, type FormEvent } from "react";
import "./login.css";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="login-page">
      <section className="login-intro" aria-labelledby="login-intro-title">
        <div className="login-intro-content">
          <a className="login-brand login-brand-light" href="/" aria-label="Netsim B2B ana sayfa">
            <span className="login-brand-mark" aria-hidden="true">N</span>
            <span>Netsim <strong>B2B</strong></span>
          </a>

          <div className="login-intro-copy">
            <p className="login-eyebrow">İşinizi hızlandıran B2B deneyimi</p>
            <h1 id="login-intro-title">Ticari süreçleriniz tek bir ekranda.</h1>
            <p>
              Ürünleri keşfedin, size özel fiyatları görüntüleyin ve
              siparişlerinizi kolayca yönetin.
            </p>
          </div>

          <div className="login-highlights" aria-label="Platform özellikleri">
            <span>Güncel ürün ve stok bilgileri</span>
            <span>Size özel fiyatlandırma</span>
            <span>Kolay sipariş takibi</span>
          </div>
        </div>
        <p className="login-intro-footer">Netsim ERP ile entegre B2B portalı</p>
      </section>

      <section className="login-form-panel" aria-labelledby="login-title">
        <div className="login-form-wrapper">
          <a className="login-brand login-brand-mobile" href="/" aria-label="Netsim B2B ana sayfa">
            <span className="login-brand-mark" aria-hidden="true">N</span>
            <span>Netsim <strong>B2B</strong></span>
          </a>

          <div className="login-heading">
            <p className="login-eyebrow">Hoş geldiniz</p>
            <h2 id="login-title">Hesabınıza giriş yapın</h2>
            <p>Devam etmek için hesap bilgilerinizi girin.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">E-posta adresi</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="ornek@firma.com"
              />
            </div>

            <div className="login-field">
              <div className="login-field-label">
                <label htmlFor="password">Şifre</label>
                <button className="login-link" type="button">
                  Şifremi unuttum
                </button>
              </div>
              <div className="login-password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Şifrenizi girin"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>

            <label className="login-remember">
              <input type="checkbox" name="remember" />
              <span>Beni hatırla</span>
            </label>

            <button className="login-submit" type="submit">
              Giriş Yap
            </button>
          </form>

          <p className="login-support">
            Giriş yapmakta sorun mu yaşıyorsunuz?{" "}
            <button className="login-link" type="button">Destek alın</button>
          </p>
        </div>
        <p className="login-copyright">© 2026 Netsim Yazılım. Tüm hakları saklıdır.</p>
      </section>
    </main>
  );
}
