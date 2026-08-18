import { HeroSection, FeaturedAlbum, UpcomingEvents, PastEvents, LatestPosts } from '@/components/home/sections'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedAlbum />
      <UpcomingEvents />
      <PastEvents />
      <LatestPosts />
    </div>
  )
}
