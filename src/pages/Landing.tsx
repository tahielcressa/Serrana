import Hero from '../components/Hero'
import AdventureCategories from '../components/AdventureCategories'
import Regions from '../components/Regions'
import FeaturedStays from '../components/FeaturedStays'
import Experiences from '../components/Experiences'
import Trekkings from '../components/Trekkings'
import CTASection from '../components/CTASection'
import MapTeaser from '../components/MapTeaser'

export default function Landing() {
  return (
    <>
      <Hero />
      <main>
        <AdventureCategories />
        <Regions />
        <FeaturedStays />
        <MapTeaser />
        <Experiences />
        <Trekkings />
        <CTASection />
      </main>
    </>
  )
}
