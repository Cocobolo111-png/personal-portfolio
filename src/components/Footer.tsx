import { profile } from '../data/profile'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__identity"><strong>{profile.romanName}</strong><span>{profile.eyebrow}</span></div>
      <span>© 2026 {profile.name}</span>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">赣ICP备2026027416号</a>
      <a href="#top">Back to top ↑</a>
    </footer>
  )
}
