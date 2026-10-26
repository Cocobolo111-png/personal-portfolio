import resume from '../data/resume.json'
import { siteUrl } from '../paths'

function Chapter({ number, title }: { number: string; title: string }) {
  return <h2 className="resume-chapter"><span>{number}</span>{title}</h2>
}
export function ResumePage() {
  const pdf = siteUrl(resume.profile.pdfPath)
  return <article className="resume-page" id="top">
    <header className="resume-opening">
      <p className="resume-edition">01 / PROFILE<span>{resume.profile.graduation}</span></p>
      <h1>Resume<span>.</span></h1>
      <div className="resume-profile">
        <div><p className="resume-name">{resume.profile.name}<span>{resume.profile.romanName}</span></p><p className="resume-direction">{resume.profile.direction}</p></div>
        <div><p className="resume-intro">{resume.profile.summary}</p><div className="resume-contacts">
          <a href={`mailto:${resume.profile.email}`}>{resume.profile.email}</a>
          <a href={resume.profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={resume.profile.portfolio}>个人作品集 ↗</a>
        </div></div>
      </div>
      <nav className="resume-index" aria-label="履历章节">
        <a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#skills">Skills</a><a href="#education">Education</a><a href="#download">PDF ↓</a>
      </nav>
    </header>
    <section id="experience" className="resume-section">
      <Chapter number="02" title="Experience" />
      {resume.experiences.map(item => <div className="resume-row" key={item.id}>
        <p className="resume-date">{item.period}</p>
        <div className="resume-detail"><h3>{item.title}</h3><p className="resume-subtitle">{item.subtitle}{'role' in item && <><span> / </span>{item.role}</>}</p>
          <ul>{item.bullets.map(b => <li key={b.id}>{b.text}</li>)}</ul>
          {'cooperation' in item && item.cooperation && <aside className="resume-cooperation" aria-label="关联合作经历">
            <p className="resume-cooperation__label">RELATED COLLABORATION</p><h4>{item.cooperation.title}</h4>
            <p className="resume-subtitle">{item.cooperation.subtitle} · {item.cooperation.period}</p>
            <p>{item.cooperation.text}</p>
          </aside>}
        </div>
      </div>)}
    </section>
    <section id="projects" className="resume-section">
      <Chapter number="03" title="Selected projects" />
      {resume.projects.map(item => <div className="resume-row" key={item.id}>
        <div className="resume-date"><p>{item.period}</p><p>{item.role}</p></div>
        <div className="resume-detail"><h3><a href={siteUrl(item.casePath)}>{item.title}<span aria-hidden="true"> ↗</span></a></h3><p className="resume-subtitle">{item.subtitle}</p>
          <ul>{item.bullets.map(b => <li key={b.id}>{b.text}</li>)}</ul>
        </div>
      </div>)}
    </section>
    <section id="skills" className="resume-section">
      <Chapter number="04" title="Skills" />
      <div className="resume-skills">{resume.skills.map(group => <div key={group.title}><h3>{group.title}</h3><p>{group.items.join(' / ')}</p></div>)}</div>
    </section>
    <section id="education" className="resume-section">
      <Chapter number="05" title="Education & recognition" />
      <div className="resume-row"><p className="resume-date">{resume.education.period}<br />{resume.education.note}</p>
        <div className="resume-detail"><h3>{resume.education.school}</h3><p className="resume-subtitle">{resume.education.major} / {resume.education.degree}</p><ul className="resume-honors">{resume.education.honors.map(h => <li key={h}>{h}</li>)}</ul></div>
      </div>
    </section>
    <section id="download" className="resume-download">
      <Chapter number="06" title="Take a copy." /><div><p>一页履历，便于保存与交流。</p><div className="resume-actions"><a className="resume-button" href={pdf} download="何扬_个人履历.pdf">下载 PDF <span aria-hidden="true">↓</span></a><a href={pdf} target="_blank" rel="noreferrer">在线预览 ↗</a><a href={`mailto:${resume.profile.email}`}>联系邮箱 ↗</a></div></div>
    </section>
  </article>
}
