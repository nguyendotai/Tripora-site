import { notFound } from "next/navigation";
import { getTransportRouteById } from "@/features/transport-route/services/get-transport-routes";
import { TransportBookingForm } from "@/features/transport-booking/components/transport-booking-form";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

export default async function BookTransportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const route = await getTransportRouteById(id);

  if (!route) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <RequireAuth>
        <TransportBookingForm route={route} />
      </RequireAuth>
      <Footer />
    </>
  );
}
