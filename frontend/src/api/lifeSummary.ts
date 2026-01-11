import { api } from "./client";

export type LifeSummaryResponse = {
  level1: {
    remaining_years: number;
    sleep_years: number;
    work_years: number;
    commute_years: number;
    routine_years: number;
    free_years: number;
  };
  maintenance_years: number;
  leakage_years: number;
  category2: { label: string; years: number }[]; 
  category3: {label: string; years: number}[];
  

  adjusted: {
    remaining_years: number;
    sleep_years: number;
    work_years: number;
    commute_years: number;
    routine_years: number;
    free_years: number;
  };
};

export const fetchLifeSummary = async (userId: number) => {
  const res = await api.get<LifeSummaryResponse>(`life-summary/${userId}/`);
  return res.data;
};
