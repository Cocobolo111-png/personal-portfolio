import type { Project } from '../data/projects'

type Props = { project: Project }

export function ProjectVisual({ project }: Props) {
  const { visual } = project
  const ratio = 'ratio' in visual ? visual.ratio ?? 'wide' : 'wide'

  if (visual.kind === 'workflow') {
    return (
      <figure className="project-visual project-visual--workflow" aria-label={`${project.title} 的工作流结构预览`}>
        <figcaption className="workflow-preview__heading">{visual.label}</figcaption>
        <ol className="workflow-preview__steps">
          {visual.steps.map((step, index) => (
            <li key={`${step}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>
          ))}
        </ol>
      </figure>
    )
  }

  if (visual.kind === 'image') {
    return <figure className={`project-visual project-visual--image project-visual--${ratio}`}><img src={visual.image.src} alt={visual.image.alt} loading="lazy" /></figure>
  }

  if (visual.kind === 'comparison') {
    return (
      <figure className={`project-visual project-visual--comparison project-visual--${ratio}`}>
        <div><img src={visual.before.src} alt={visual.before.alt} loading="lazy" /><span>Before</span></div>
        <div><img src={visual.after.src} alt={visual.after.alt} loading="lazy" /><span>After</span></div>
      </figure>
    )
  }

  return (
    <figure className={`project-visual project-visual--gallery project-visual--${ratio}`}>
      {visual.images.map((image) => <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />)}
    </figure>
  )
}
