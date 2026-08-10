import { HeroSearch } from "@/modules/home/components/hero-search";
import { PopularDestinations } from "@/modules/home/components/popular-destinations";
import { ValueProps } from "@/modules/home/components/value-props";
import { FeaturedProperties } from "@/modules/home/components/featured-properties";
import { PartnerCta } from "@/modules/home/components/partner-cta";

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <PopularDestinations />
      <ValueProps />
      <FeaturedProperties />
      <PartnerCta />
    </>
  );
}
