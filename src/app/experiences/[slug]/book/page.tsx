import { notFound } from "next/navigation";
import { ExperienceBookingForm } from "@/features/experience-booking/components/experience-booking-form";
import { getExperienceBySlug } from "@/features/experience/services/get-experiences";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

export default async function BookExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);
  if (!experience) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <RequireAuth>
        <ExperienceBookingForm experience={experience} />
      </RequireAuth>
      <Footer />
    </>
  );
}
