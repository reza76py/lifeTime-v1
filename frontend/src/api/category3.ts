import { api } from "./client";

export async function addCategory3(
  userId: number,
  name: string,
  hours: number
) {
  return api.post(`/category3/${userId}/`, {
    name,                 // ✅ REQUIRED
    hours_per_week: hours // ✅ REQUIRED
  });
}
