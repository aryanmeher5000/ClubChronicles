import axios from "axios";

const apiUrl = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL;

export const departmentApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/department`,
  withCredentials: true,
});

export const profileApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/profile`,
  withCredentials: true,
});

export const authApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/authentication`,
  withCredentials: true,
});

export const pointTableApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/pointsTable`,
  withCredentials: true,
});

export const gcApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/gc`,
  withCredentials: true,
});

export const applicationServices = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/application`,
  withCredentials: true,
});

export const teamApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/team`,
  withCredentials: true,
});

export const anncApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/announcement`,
  withCredentials: true,
});

export const matchApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/match`,
  withCredentials: true,
});
