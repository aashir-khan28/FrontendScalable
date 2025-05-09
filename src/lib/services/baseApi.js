import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

 export const baseApi = createApi({
  reducerPath: `Api`,
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({}), 
});
