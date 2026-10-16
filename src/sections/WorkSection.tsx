import { ProjectShowcase } from '../components/ProjectShowcase'
import { visibleProjects } from '../data/projects'

export function WorkSection() {
  return (
    <section className="section work-section" id="work">
      <div className="work-section__heading">
        <h2>Selected Work</h2>
        <p>Products, systems &amp; growth experiments.</p>
      </div>
      <div className="projects-list">
        {visibleProjects.map((project) => <ProjectShowcase key={project.slug} project={project} />)}
      </div>
    </section>
  )
}
