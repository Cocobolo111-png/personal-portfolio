type Props = { index: string; title: string; description: string }

export function CapabilityItem({ index, title, description }: Props) {
  return (
    <article className="capability-item reveal">
      <span>{index}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
