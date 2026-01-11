import { api } from "./client";

/* =========================
   Types
========================= */
export type Category2Activity = {
  id: number;
  name: string;
  hours_per_week: number;
  source: string;
  is_active: boolean;
};

/* =========================
   Fetch all Category 2 activities
========================= */
export const fetchCategory2 = async (userId: number) => {
  const res = await api.get<Category2Activity[]>(`category2/${userId}/`);
  return res.data;
};

/* =========================
   Add a Category 2 activity
   🔴 REQUIRED FIELDS:
   - name
   - hours_per_week
========================= */
export const addCategory2 = async (
  userId: number,
  name: string,
  hoursPerWeek: number
) => {
  const res = await api.post<Category2Activity>(`category2/${userId}/`, {
    name,
    hours_per_week: hoursPerWeek,
  });
  return res.data;
};

/* =========================
   Update Category 2 activity (hours, active flag)
========================= */
export const updateCategory2 = async (
  userId: number,
  activityId: number,
  payload: Partial<Pick<Category2Activity, "hours_per_week" | "is_active">>
) => {
  const res = await api.patch<Category2Activity>(
    `category2/${userId}/${activityId}/`,
    payload
  );
  return res.data;
};
