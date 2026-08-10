import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store/store';
import { env } from '@/configs/env';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

function isApiResponseEnvelope(value: unknown): value is ApiResponse<unknown> {
  return typeof value === 'object' && value !== null && 'success' in value && 'data' in value;
}

const baseQueryWithEnvelopeUnwrap: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // Backend luôn bọc response thành công qua ResponseInterceptor: { success, message, data, timestamp }.
  // Endpoint chỉ khai báo type của phần `data` — phải bóc vỏ ở đây 1 lần duy nhất.
  if (!result.error && isApiResponseEnvelope(result.data)) {
    return { data: result.data.data, meta: result.meta };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithEnvelopeUnwrap,
  tagTypes: ['User', 'Property', 'Booking'],
  endpoints: () => ({}),
});
