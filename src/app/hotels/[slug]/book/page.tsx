import { notFound } from "next/navigation";
import { BookingForm } from "@/features/booking/components/booking-form";
import { getPropertyBySlug } from "@/features/property/services/get-properties";
import { getRoomsByProperty } from "@/features/room/services/get-rooms";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

export default async function BookRoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ roomId?: string }>;
}) {
  const { slug } = await params;
  const { roomId } = await searchParams;

  const property = await getPropertyBySlug(slug);
  if (!property) {
    notFound();
  }

  const rooms = (await getRoomsByProperty(property.id)) ?? [];
  const room = rooms.find((item) => item.id === roomId);
  if (!room) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <RequireAuth>
        <BookingForm property={property} room={room} />
      </RequireAuth>
      <Footer />
    </>
  );
}
