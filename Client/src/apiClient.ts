import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const departmentApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/department`,
});

export const profileApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/profile`,
});

export const authApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/authentication`,
});

export const pointTableApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/pointsTable`,
});

export const gcApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/gc`,
});

export const applicationServices = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/application`,
});

export const teamApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/team`,
});

export const anncApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/announcement`,
});

export const matchApiClient = axios.create({
  baseURL: `${apiUrl}/api/ClubChronicles/match`,
});
