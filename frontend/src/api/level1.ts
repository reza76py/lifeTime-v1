import { api } from "./client";

export type Level1Payload = {
  sleep_hours_per_day: number;
  work_hours_per_day: number;
  work_days_per_week: number;
  commute_hours_per_workday: number;
  daily_routine_hours: number;
};

export type Level1Result = {
  remaining_years?: number; // optional, backend may include later
  sleep_years: number;
  work_years: number;
  commute_years: number;
  routine_years: number;
  free_years: number;
};

export type UserProfileResponse = {
  id: number;
  age: number;
  life_expectancy: number;
};

export const createUserProfile = async (
  age: number,
  life_expectancy: number = 80
): Promise<UserProfileResponse> => {
  const res = await api.post<UserProfileResponse>("user-profile/", {
    age,
    life_expectancy,
  });
  return res.data;
};

export const submitLevel1 = async (
  userId: number,
  payload: Level1Payload
): Promise<Level1Result> => {
  const res = await api.post<Level1Result>(`level1/${userId}/`, payload);
  return res.data;
};
