import Hero from '../components/Hero'
import AdventureCategories from '../components/AdventureCategories'
import Regions from '../components/Regions'
import FeaturedStays from '../components/FeaturedStays'
import Trekkings from '../components/Trekkings'
import Experiences from '../components/Experiences'
import CTASection from '../components/CTASection'

export default function Landing() {
  return (
    <>
      <Hero />
      <main>
        <AdventureCategories />
        <Regions />
        <FeaturedStays />
        <Experiences />
        <Trekkings />
        <CTASection />
      </main>
    </>
  )
}