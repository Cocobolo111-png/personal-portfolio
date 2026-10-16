import { currentFocus } from '../data/experiments'

export function CurrentlySection() {
  return (
    <section className="currently-section reveal" aria-labelledby="currently-title">
      <h2 id="currently-title">Currently</h2>
      <div className="currently-list">
        {currentFocus.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}
      </div>
      <span className="currently-updated">Updated · Sep 2026</span>
    </section>
  )
}
