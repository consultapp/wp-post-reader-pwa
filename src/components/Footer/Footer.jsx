export default function Footer() {
  return (
    <footer
      id="footer"
      className="site-footer"
      role="contentinfo"
      itemScope="itemscope"
      itemType="http://schema.org/WPFooter"
    >
      <div className="grid-container site-footer-inner">
        <div className="site-footer-01"></div>
        <div className="site-footer-02">{`© ${new Date().getFullYear()}`}</div>
      </div>
    </footer>
  );
}
