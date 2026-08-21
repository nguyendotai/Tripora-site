import { getAirports } from "@/features/airport/services/get-airports";
import { getPopularDestinations } from "@/features/destination/services/get-destinations";
import { getPopularExperiences } from "@/features/experience/services/get-experiences";
import { getPosts } from "@/features/post/services/get-posts";
import { getPopularProperties } from "@/features/property/services/get-properties";
import { getActivePromotions } from "@/features/promotion/services/get-active-promotions";
import { getReviewHighlights } from "@/features/review/services/get-review-highlights";
import { getPopularTours } from "@/features/tour/services/get-tours";
import { ActivePromotions } from "@/modules/home/components/active-promotions";
import { CategoryNav } from "@/modules/home/components/category-nav";
import { ClosingCta } from "@/modules/home/components/closing-cta";
import { CommunityHighlights } from "@/modules/home/components/community-highlights";
import { FeaturedExperiences } from "@/modules/home/components/featured-experiences";
import { FeaturedProperties } from "@/modules/home/components/featured-properties";
import { FeaturedTours } from "@/modules/home/components/featured-tours";
import { HeroSearch } from "@/modules/home/components/hero-search";
import { PopularDestinations } from "@/modules/home/components/popular-destinations";
import { RecommendedDestinations } from "@/modules/home/components/recommended-destinations";
import { ReviewHighlights } from "@/modules/home/components/review-highlights";
import { TravelGuides } from "@/modules/home/components/travel-guides";
import { ValueProps } from "@/modules/home/components/value-props";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";

export default async function Home() {
  const [
    airports,
    popularDestinations,
    popularProperties,
    popularTours,
    popularExperiences,
    activePromotions,
    reviewHighlights,
    posts,
  ] = await Promise.all([
    getAirports(),
    getPopularDestinations(7),
    getPopularProperties(),
    getPopularTours(),
    getPopularExperiences(),
    getActivePromotions(),
    getReviewHighlights(),
    getPosts({ limit: 6 }),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSearch airports={airports} />
        <div className="mt-16 sm:mt-24">
          <ValueProps />
        </div>
        <div className="mt-16 sm:mt-24">
          <CategoryNav />
        </div>
        <PopularDestinations destinations={popularDestinations ?? []} />
        <FeaturedProperties properties={popularProperties ?? []} />
        <FeaturedTours tours={popularTours ?? []} />
        <FeaturedExperiences experiences={popularExperiences ?? []} />
        <ActivePromotions promotions={activePromotions ?? []} />
        <RecommendedDestinations />
        <TravelGuides />
        <ReviewHighlights reviews={reviewHighlights ?? []} />
        <CommunityHighlights posts={posts?.items ?? []} />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
