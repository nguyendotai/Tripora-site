import { notFound } from "next/navigation";
import { TourBookingForm } from "@/features/tour-booking/components/tour-booking-form";
import { getTourBySlug } from "@/features/tour/services/get-tours";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

export default async function BookTourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <RequireAuth>
        <TourBookingForm tour={tour} />
      </RequireAuth>
      <Footer />
    </>
  );
}
