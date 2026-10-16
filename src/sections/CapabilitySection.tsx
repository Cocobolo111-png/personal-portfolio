import { CapabilityItem } from '../components/CapabilityItem'
import { SectionHeader } from '../components/SectionHeader'
import { capabilities } from '../data/capabilities'

export function CapabilitySection() {
  return (
    <section className="section" id="about">
      <SectionHeader index="02" eyebrow="What I Do" title="能力不是工具清单，而是解决问题的方式。" />
      <div className="capabilities-grid">
        {capabilities.map((item) => <CapabilityItem key={item.index} {...item} />)}
      </div>
    </section>
  )
}
