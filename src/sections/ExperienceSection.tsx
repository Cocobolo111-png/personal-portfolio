import { SectionHeader } from '../components/SectionHeader'
import { experiences } from '../data/experience'

export function ExperienceSection() {
  return (
    <section className="section experience-section" id="experience">
      <SectionHeader index="03" eyebrow="Selected Experience" title="只保留与产品、内容和增长有关的经历。" />
      <div className="experience-list">
        {experiences.map((item) => (
          <article className="experience-item reveal" key={item.title}>
            <span className="experience-item__period">{item.period}</span>
            <div><h3>{item.title}</h3><span className="experience-item__role">{item.role}</span></div>
            <div><p>{item.description}</p>{item.result && <strong>{item.result}</strong>}</div>
          </article>
        ))}
      </div>
    </section>
  )
}
