import { profile } from '../data/profile'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__identity"><strong>{profile.romanName}</strong><span>{profile.eyebrow}</span></div>
      <span>© 2026 {profile.name}</span>
      <a href="#top">Back to top ↑</a>
    </footer>
  )
}
