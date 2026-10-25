import type { CSSProperties, PointerEvent } from 'react'
import type { Project } from '../data/projects'
import { ArrowIcon } from './ArrowIcon'
import { ProjectVisual } from './ProjectVisual'

export function ProjectShowcase({ project }: { project: Project }) {
  if (project.showcase) {
    const { showcase } = project
    const rows = { left: 0, right: 0 }
    const tags = showcase.tags.map((entry, index) => {
      const tag = typeof entry === 'string' ? { label: entry } : entry
      const side = tag.side ?? (index < Math.ceil(showcase.tags.length / 2) ? 'left' : 'right')
      const row = Math.max(0, Math.floor(tag.row ?? rows[side]))
      rows[side] = Math.max(rows[side], row + 1)
      const alternating = row % 2 === 0
      return {
        ...tag, side, row,
        rotation: tag.rotation ?? (side === 'left' ? (alternating ? 8 : -18) : (alternating ? 10 : 23)),
        expandedRotation: tag.expandedRotation ?? (side === 'left' ? (alternating ? -10 : 13) : (alternating ? -13 : 9)),
      }
    })
    const theme = {
      '--project-bg': showcase.background,
      '--project-tag-bg': showcase.tagBackground,
      '--project-tag-ink': showcase.tagColor,
      '--tag-space': `${Math.max(0, Math.max(rows.left, rows.right) - 4) * 94}px`,
      '--tag-right-gap': `${rows.right > 2 ? 94 : 68}px`,
    } as CSSProperties
    const Stage = project.caseStudyUrl ? 'a' : 'div'
    const positionPreview = (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'mouse') return
      const bounds = event.currentTarget.getBoundingClientRect()
      event.currentTarget.style.setProperty('--cta-x', `${event.clientX - bounds.left + 48}px`)
      event.currentTarget.style.setProperty('--cta-y', `${event.clientY - bounds.top - 36}px`)
    }

    return (
      <article className={`work-showcase${showcase.portrait ? ' work-showcase--portrait' : ''}`} style={theme} aria-labelledby={`${project.slug}-title`}>
        <Stage className="work-showcase__stage" href={project.caseStudyUrl} tabIndex={0} aria-label={project.caseStudyUrl ? `${project.title}，查看项目案例` : `${project.title}，聚焦以展开界面预览`}
          onPointerMove={positionPreview}
          onFocus={(event) => {
            if (!event.target.matches(':focus-visible')) return
            event.currentTarget.style.removeProperty('--cta-x')
            event.currentTarget.style.removeProperty('--cta-y')
          }}>
          <div className="work-showcase__canvas" aria-hidden="true" />
          <div className="work-showcase__tags" aria-hidden="true">
            {tags.map((tag, index) => (
              <span className="work-showcase__tag" data-side={tag.side} key={`${tag.label}-${index}`}
                style={{ '--tag-row': tag.row, '--tag-rotation': `${tag.rotation}deg`, '--tag-expanded-rotation': `${tag.expandedRotation}deg` } as CSSProperties}>{tag.label}</span>
            ))}
          </div>
          <div className="work-showcase__mockup"><ProjectVisual project={project} /></div>
          <div className="work-showcase__fog" aria-hidden="true">
            <div className="work-showcase__fog-field">
              <span className="work-showcase__blur work-showcase__blur--near" />
              <span className="work-showcase__blur work-showcase__blur--middle" />
              <span className="work-showcase__blur work-showcase__blur--far" />
            </div>
          </div>
          {showcase.demoUrl && !project.caseStudyUrl ? (
            <a className="work-showcase__cta" href={showcase.demoUrl} target="_blank" rel="noreferrer">{showcase.ctaLabel}<ArrowIcon /></a>
          ) : (
            <span className="work-showcase__cta work-showcase__cta--preview" aria-hidden="true">{showcase.ctaLabel}</span>
          )}
        </Stage>
        <div className="work-showcase__caption">
          <h3 id={`${project.slug}-title`}>{showcase.statement}</h3>
          <p><span>{project.title}</span><span aria-hidden="true"> · </span>{project.category}</p>
        </div>
      </article>
    )
  }

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
