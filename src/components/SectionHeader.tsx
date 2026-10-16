type Props = { index: string; eyebrow: string; title: string; intro?: string }

export function SectionHeader({ index, eyebrow, title, intro }: Props) {
  return (
    <div className="section-header reveal">
      <div className="section-header__meta"><span>{index}</span><span>{eyebrow}</span></div>
      <div className="section-header__main">
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
    </div>
  )
}
