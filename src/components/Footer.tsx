export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-text">
          <span className="footer-brand"><a href="https://github.com/helenahsr">Helena Rezende</a></span>
        </p>
        <p>
          <span className="footer-brand"><a href="https://github.com/helenahsr/md-calculadoras">Matemática Discreta</a></span>
        </p>
        <p className="footer-credits">
          <a href="https://cotemig.com.br/">Faculdade COTEMIG</a> &bull; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
