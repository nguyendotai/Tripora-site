import { getAirports } from "@/features/airport/services/get-airports";
import { ClosingCta } from "@/modules/home/components/closing-cta";
import { HeroSearch } from "@/modules/home/components/hero-search";
import { PopularDestinations } from "@/modules/home/components/popular-destinations";
import { TravelGuides } from "@/modules/home/components/travel-guides";
import { ValueProps } from "@/modules/home/components/value-props";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";

export default async function Home() {
  const airports = await getAirports();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSearch airports={airports} />
        <div className="mt-16 sm:mt-24">
          <ValueProps />
        </div>
        <PopularDestinations />
        <TravelGuides />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
