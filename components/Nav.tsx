export default function Nav() {
  return (
    <nav className="nav" aria-label="Utama">
      <div className="wrap">
        <div className="nav-inner">
          <a className="logo" href="#top">
            <img
              src="/icon.svg"
              alt="Comitea"
              style={{ width: "clamp(16px, 8vw, 90px)", maxWidth: "50%", height: "auto",borderRadius: "50%" }}
            />
          </a>
          <ul>
            <li><a href="#zoom">Kedai</a></li>
            <li><a href="#racikan">Racikan</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#kunjungi">Lokasi</a></li>
          </ul>
          <a className="go" href="#menu">Lihat menu</a>
        </div>
      </div>
    </nav>
  );
}
