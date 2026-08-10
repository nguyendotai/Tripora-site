import { baseApi } from '@/shared/services/base-api';
import type { CreatePartnerInput, Partner } from '../types/partner.types';

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPartner: builder.mutation<Partner, CreatePartnerInput>({
      query: (body) => ({ url: '/partners', method: 'POST', body }),
    }),
    getMyPartner: builder.query<Partner, void>({
      query: () => ({ url: '/partners/me' }),
    }),
  }),
});

export const { useCreatePartnerMutation, useGetMyPartnerQuery } = partnerApi;
