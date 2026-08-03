import { HeroSection, FeaturedAlbum, UpcomingEvents, LatestPosts } from '@/components/home/sections'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedAlbum />
      <UpcomingEvents />
      <LatestPosts />
    </div>
  )
}
