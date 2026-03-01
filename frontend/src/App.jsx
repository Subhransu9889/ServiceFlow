import './App.css'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import HowItWorks from './components/HowItWorks'
import ServiceCategories from './components/ServiceCategories'
import WhyChooseUs from './components/WhyChooseUs'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="landing-page">
      <div className="ambient ambient-1" aria-hidden="true" />
      <div className="ambient ambient-2" aria-hidden="true" />

      <Header />

      <main>
        <HeroSection />
        <HowItWorks />
        <ServiceCategories />
        <WhyChooseUs />
      </main>

      <Footer />
    </div>
  )
}
