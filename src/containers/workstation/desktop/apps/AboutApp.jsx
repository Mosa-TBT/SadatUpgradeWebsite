export default function AboutApp() {
  return (
    <div className="dt-app dt-about">
      <img className="dt-about-logo" src="/susvg.svg" alt="Sadat Upgrade" />
      <h3 className="dt-app-title">Sadat Upgrade</h3>
      <p>
        Sadat Upgrade is an IT services company focused on transforming ideas
        into practical digital solutions. From modern websites and custom
        software to mobile applications and AI-powered experiences, we help
        businesses simplify their work, strengthen their digital presence, and
        unlock new opportunities for growth.
      </p>

      <h4 className="dt-app-subtitle">What you can explore here</h4>
      <ul className="dt-about-list">
        <li><strong>Terminal</strong> — type <code>help</code>, learn about us, or play <code>snake</code>.</li>
        <li><strong>File Explorer</strong> — browse the Documents and Projects folders.</li>
        <li><strong>Browser</strong> — run a real web search.</li>
        <li><strong>Settings</strong> — change the wallpaper of this virtual desktop.</li>
      </ul>

      <h4 className="dt-app-subtitle">Get in touch</h4>
      <ul className="dt-about-list">
        <li>Email: <a href="mailto:info@sadaatupgrade.com">info@sadaatupgrade.com</a></li>
        <li>Website: sadaatupgrade.com</li>
      </ul>

      <p className="dt-app-note">
        This virtual computer is a safe, client-side demonstration running in
        your browser. Nothing here executes real commands or touches your
        device.
      </p>
    </div>
  );
}
