import { baseApi } from "@/shared/services/base-api";
import type { Vehicle } from "@/features/vehicle/types/vehicle.types";
import type { TransportSchedule } from "@/features/transport-schedule/types/transport-schedule.types";
import type { AvailableVehicleOption, TransportBooking } from "../types/transport-booking.types";

export interface CreateTransportBookingInput {
  routeId: string;
  vehicleId: string;
  departureDate: string;
  numberOfPeople: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

export const transportBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Khong co endpoint Backend rieng tra ve "cac Vehicle con cho cho 1 Route+ngay" —
     * ghep 2 request cong khai (schedule theo ngay, roi vehicle theo tung id) trong 1
     * queryFn duy nhat, van di qua baseQuery chung (khong fetch/Axios truc tiep trong component).
     */
    listAvailableVehiclesForRoute: builder.query<
      AvailableVehicleOption[],
      { routeId: string; departureDate: string }
    >({
      async queryFn({ routeId, departureDate }, _api, _extraOptions, baseQuery) {
        const scheduleResult = await baseQuery({
          url: "/transport-schedules",
          params: { routeId, startDate: departureDate, endDate: departureDate },
        });
        if (scheduleResult.error) {
          return { error: scheduleResult.error };
        }

        const schedules = (scheduleResult.data as TransportSchedule[]).filter(
          (schedule) => schedule.available > 0,
        );

        const vehicleResults = await Promise.all(
          schedules.map((schedule) => baseQuery({ url: `/vehicles/${schedule.vehicleId}` })),
        );

        const options: AvailableVehicleOption[] = schedules
          .map((schedule, index) => ({
            schedule,
            vehicle: vehicleResults[index].data as Vehicle | undefined,
          }))
          .filter((option): option is AvailableVehicleOption => !!option.vehicle);

        return { data: options };
      },
    }),
    createTransportBooking: builder.mutation<TransportBooking, CreateTransportBookingInput>({
      query: (body) => ({ url: "/transport-bookings", method: "POST", body }),
      invalidatesTags: [{ type: "TransportBooking", id: "LIST" }],
    }),
  }),
});

export const {
  useListAvailableVehiclesForRouteQuery,
  useLazyListAvailableVehiclesForRouteQuery,
  useCreateTransportBookingMutation,
} = transportBookingApi;
