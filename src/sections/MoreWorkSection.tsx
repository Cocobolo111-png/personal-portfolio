import { SectionHeader } from '../components/SectionHeader'
import { experiments } from '../data/experiments'

export function MoreWorkSection() {
  return (
    <section className="section more-work-section">
      <SectionHeader index="04" eyebrow="More Work / Experiments" title="小项目，也应该有明确的问题与判断。" />
      <div className="experiments-grid">
        {experiments.map((item, index) => (
          <article className="experiment-card reveal" key={item.title}>
            <div><span>{item.type}</span><span>0{index + 1}</span></div>
            <h3>{item.title}</h3>
            <p>{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
