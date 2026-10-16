import type { Project } from '../data/projects'
import { ArrowIcon } from './ArrowIcon'
import { ProjectVisual } from './ProjectVisual'

export function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article className={`project project--${project.visual.kind}`}>
      <ProjectVisual project={project} />
      <div className="project__info">
        <div className="project__topline">
          <span>{project.englishTitle}</span>
          <span className="status">{project.status}</span>
        </div>
        <h3>{project.title}</h3>
        <p className="project__category">{project.category}</p>
        <dl className="project__details">
          {project.details.map((detail) => (
            <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>
          ))}
        </dl>
        {project.caseStudyUrl && <a className="button project__link" href={project.caseStudyUrl}>View project <ArrowIcon /></a>}
      </div>
    </article>
  )
}
