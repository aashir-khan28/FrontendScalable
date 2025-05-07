import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

 export const baseApi = createApi({
  reducerPath: `Api`,
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://sharingphotoapp-bwbrbnd9e5csf6hj.canadacentral-01.azurewebsites.net/api',
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
