import type { HeroChapterId } from '../data/hero'

// Abstract editorial geometry, not product UI or model-generated imagery.
// Who / Build stand on their typography and render no reserved media container.
export function HeroArtwork({ chapter }: { chapter: HeroChapterId }) {
  if (chapter === 'who' || chapter === 'build') return null

  return (
    <div className={`hero-art hero-art--${chapter}`} aria-hidden="true">
      <svg className="hero-art__graphic" viewBox="0 0 360 360" fill="none" focusable="false">
        {chapter === 'care' && <>
          <path d="M31 211C3 129 79 62 148 104c65 39 51 148-9 153-60 4-91-65-51-107 48-51 146-3 153 61 7 63-45 99-102 70" stroke="#e0e3eb" strokeWidth="18" strokeLinecap="round" />
          <path d="M39 179c30-43 95-14 68 40-16 31-54 31-59 2-6-37 58-77 102-45 53 38 9 123-30 91-38-31-10-101 48-88 57 13 51 76 19 96" stroke="#a5aab7" strokeWidth="2" strokeLinecap="round" />
          <path d="M60 72 88 50m-8 42 20-16M248 292l27 14" stroke="#161616" strokeWidth="3" strokeLinecap="round" />
          <path className="hero-art__trace" d="M27 301c62 1 89-24 113-68 24-45 8-108 60-121 43-11 86 13 113-38" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
          <g className="hero-art__settle">
            <circle cx="313" cy="74" r="23" fill="white" />
            <circle cx="313" cy="74" r="12" fill="currentColor" />
            <circle cx="28" cy="301" r="7" fill="#161616" />
          </g>
          <g transform="rotate(16 224 174)">
            <path d="M209 149h31v49h-31z" fill="white" />
            <path d="M216 155h18v36h-18z" fill="#161616" />
          </g>
          <circle cx="284" cy="200" r="5" fill="#161616" />
        </>}
        {chapter === 'believe' && <>
          <path d="M73 278C2 239 11 143 88 90c56-38 149-34 199 6 64 50 44 145-16 181-42 25-93 25-126 8" stroke="#d9dde6" strokeWidth="2" strokeDasharray="5 10" strokeLinecap="round" />
          <path className="hero-art__trace" d="M74 267C24 164 118 46 265 88" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <g transform="rotate(-14 136 237)">
            <g className="hero-art__prototype">
              <path d="M66 183h141v108H66z" fill="white" stroke="#161616" strokeWidth="2.5" />
              <path d="M66 183h141v25H66z" fill="#161616" />
              <circle cx="79" cy="195" r="2.5" fill="white" />
              <path d="M88 230h74m-74 15h48" stroke="#c1c7d3" strokeWidth="4" />
              <path d="M88 270h38" stroke="currentColor" strokeWidth="7" />
              <path d="m175 250 9 9-9 9m-11-9h19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
          <circle className="hero-art__experiment" cx="265" cy="88" r="24" fill="currentColor" />
          <circle cx="265" cy="88" r="36" stroke="currentColor" strokeWidth="1.5" />
          <path d="m284 229 41-18-18 41-6-16-17-7Z" fill="currentColor" />
          <path d="m302 235 23-24" stroke="white" strokeWidth="1.5" />
          <path d="m229 298-6 14 16-5" stroke="#161616" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="55" cy="121" r="5" fill="#161616" />
        </>}
        {chapter === 'now' && <>
          <path className="hero-art__trace" d="M42 270h35c15 0 22 8 22 22v17h165c17 0 28-10 28-26v-31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <g transform="rotate(-11 141 151)">
            <g className="hero-art__module">
              <rect x="42" y="60" width="179" height="192" rx="4" fill="white" stroke="#c7ccd7" strokeWidth="2" />
              <path d="M62 83h48m-48 18h121" stroke="#c7ccd7" strokeWidth="3" />
              <path d="M63 128h45v41H63z" fill="#edf1ff" />
              <path d="M119 128h80v5h-80zm0 17h53v4h-53z" fill="#dce1ec" />
            </g>
          </g>
          <g className="hero-art__module">
            <rect x="91" y="118" width="216" height="155" rx="4" fill="white" stroke="#161616" strokeWidth="2.5" />
            <path d="M92 150h214" stroke="#161616" strokeWidth="2" />
            <circle cx="106" cy="134" r="3" fill="currentColor" />
            <path d="M118 134h31m-35 39h71" stroke="#161616" strokeWidth="3" />
            <path d="M114 190h120m-120 13h79" stroke="#c7ccd7" strokeWidth="3" />
            <path d="M114 227h48v22h-48z" fill="currentColor" />
            <path d="M175 238h46m12 0h13" stroke="#c7ccd7" strokeWidth="3" />
          </g>
          <g transform="rotate(9 278 80)">
            <g className="hero-art__module">
              <path d="M231 56h96v49h-96z" fill="currentColor" />
              <text x="246" y="90" className="hero-art__wip">WIP</text>
            </g>
          </g>
          <g className="hero-art__module">
            <path d="M255 240h68v47h-68z" fill="currentColor" />
            <path d="m277 263 9 8 15-17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <circle cx="43" cy="270" r="6" fill="#161616" />
          <path d="M276 319h18m-9-9v18" stroke="#161616" strokeWidth="2" />
        </>}
      </svg>
    </div>
  )
}
