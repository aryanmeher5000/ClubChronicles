import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosInstance } from "axios";
import { useNavigate } from "react-router-dom";
import useShowToast from "./useShowToast";
import { convertToFormData } from "./Utilities/utilFxns";
import { queryClient } from "./main";

export interface SuccessResponse<T> {
  message: string;
  body: T;
}

export interface InfiniteSuccessResponse<T> {
  message: string;
  body: T;
  currentPage: number;
  totalPages: number;
}

export interface ErrorResponse {
  error: string;
}

export function useGetQuery<T, Q = undefined>(
  queryKey: string[],
  apiClient: AxiosInstance,
  endpoint: string,
  query?: Q,
  staleTime?: number
) {
  return useQuery<SuccessResponse<T>, AxiosError<ErrorResponse>>({
    queryKey: [...queryKey, ...(query ? Object.values(query) : [])],
    queryFn: async () => {
      const response = await apiClient.get(`/${endpoint}`, {
        params: query,
      });
      return response.data;
    },
    staleTime: staleTime || 1000 * 60 * 60 * 10, // default value 10 min
    retry: 2,
    retryDelay: 5000,
  });
}

export function useGetQueryWithId<T, Q = undefined>(
  queryKey: string[],
  apiClient: AxiosInstance,
  endpoint: string,
  id?: string,
  query?: Q,
  staleTime?: number
) {
  const nav = useNavigate();
  if (!id) nav(-1);

  return useQuery<SuccessResponse<T>, AxiosError<ErrorResponse>>({
    queryKey: [...queryKey, id, ...(query ? Object.values(query) : [])],
    queryFn: async () => {
      const response = await apiClient.get(`/${endpoint}/${id}`, {
        params: query,
      });
      return response.data;
    },
    staleTime: staleTime || 1000 * 60 * 60 * 10, // default value 10 min
    retry: 2,
    retryDelay: 5000,
  });
}

export function useGetInfiniteQuery<T, Q = undefined>(
  queryKey: string[],
  apiClient: AxiosInstance,
  endpoint: string,
  pageSize?: number,
  query?: Q,
  staleTime?: number
) {
  return useInfiniteQuery<InfiniteSuccessResponse<T>, AxiosError<ErrorResponse>>({
    queryKey: [...queryKey, ...(query ? Object.values(query) : [])],
    queryFn: async ({ pageParam }) => {
      const response = await apiClient.get(`/${endpoint}`, {
        params: { ...query, pageSize: pageSize || 12, page: pageParam },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: staleTime || 1000 * 60 * 60 * 10, // default 10 min
    retry: 2,
    retryDelay: 5000,
  });
}

export function usePostQuery<T, W = undefined>(
  apiClient: AxiosInstance,
  endpoint: string,
  queryKeyToInvalidate?: string[] | Array<string[]>,
  formDataConversion?: boolean,
  redirectPath?: string,
  onSuccesExtraTasksWithData?: (data: W) => void,
  onSuccesExtraTasksWithoutData?: () => void
) {
  const navigate = useNavigate();
  const showToast = useShowToast();

  return useMutation<SuccessResponse<W>, AxiosError<ErrorResponse>, T | undefined>({
    mutationFn: async (data) => {
      const payload = formDataConversion && data ? convertToFormData(data) : data;
      const response = await apiClient.post(`/${endpoint}`, payload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: queryKeyToInvalidate,
        });
      }

      if (onSuccesExtraTasksWithData) onSuccesExtraTasksWithData(data.body);
      if (onSuccesExtraTasksWithoutData) onSuccesExtraTasksWithoutData();

      //DNN means Do not navigate
      if (!redirectPath) navigate(-1);
      else if (redirectPath && redirectPath !== "DNN") navigate(redirectPath);

      showToast("success", data.message || "Item Creation Successful.");
    },
    onError: (err) => {
      const errorMessage = err.response?.data.error || err.message || "Error Creating Request!";
      showToast("error", errorMessage);
    },
  });
}

export function usePutQuery<T, W = undefined>(
  apiClient: AxiosInstance,
  endpoint: string,
  queryKeyToInvalidate?: string[],
  formDataConversion?: boolean,
  redirectPath?: string,
  onSuccesExtraTasksWithData?: (data: W) => void,
  onSuccesExtraTasksWithoutData?: () => void
) {
  const navigate = useNavigate();
  const showToast = useShowToast();

  return useMutation<SuccessResponse<W>, AxiosError<ErrorResponse>, { id?: string; data: T | undefined }>({
    mutationFn: async ({ id, data }) => {
      if (!id) throw new Error("ID not provided!");

      const payload = formDataConversion && data ? convertToFormData(data) : data;
      const response = await apiClient.put(`/${endpoint}/${id}`, payload, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: queryKeyToInvalidate,
        });
      }

      if (onSuccesExtraTasksWithData) onSuccesExtraTasksWithData(data.body);
      if (onSuccesExtraTasksWithoutData) onSuccesExtraTasksWithoutData();

      //Handle Navigation on success - DNN means Do not Navigate
      if (!redirectPath) navigate(-1);
      else if (redirectPath && redirectPath !== "DNN") navigate(redirectPath);

      showToast("success", data.message || "Item Updation Successful.");
    },
    onError: (err) => {
      const errorMessage = err.response?.data.error || err.message || "Error Updating Item!";
      showToast("error", errorMessage);
    },
  });
}

export function useDeleteQuery(
  apiClient: AxiosInstance,
  endpoint: string,
  queryKeyToInvalidate?: string[],
  redirectPath?: string // Allow null to skip navigation
) {
  const navigate = useNavigate();
  const showToast = useShowToast();

  return useMutation<SuccessResponse<undefined>, AxiosError<ErrorResponse>, { id?: string }>({
    mutationFn: async ({ id }) => {
      const response = await apiClient.delete(`/${endpoint}${id ? `/${id}` : ""}`);
      return response.data;
    },
    onSuccess: (data) => {
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({
          queryKey: queryKeyToInvalidate,
        });
      }

      //DNN means Do Not Navigate
      if (!redirectPath) navigate(-1);
      else if (redirectPath && redirectPath !== "DNN") navigate(redirectPath);

      showToast("success", data.message || "Item Deletion Successful.");
    },
    onError: (err) => {
      const errorMessage = err.response?.data.error || err.message || "Error Deleting Item!";
      showToast("error", errorMessage);
    },
  });
}
