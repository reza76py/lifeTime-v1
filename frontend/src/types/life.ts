export type LifeResult = {
  sleep_years: number;
  work_years: number;
  commute_years: number;
  routine_years: number;
  free_years: number;

  // future-proof
  maintenance_years?: number;
};
