import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { HeroSection } from './sections/HeroSection'
import { WorkSection } from './sections/WorkSection'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <WorkSection />
      </main>
      <Footer />
    </>
  )
}
