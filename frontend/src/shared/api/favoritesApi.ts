import { apiRequest } from "@/shared/api/httpClient";

export function fetchFavorites(): Promise<number[]> {
  return apiRequest<number[]>("/favorites");
}

export function addFavorite(productId: number): Promise<void> {
  return apiRequest<void>(`/favorites/${productId}`, { method: "POST" });
}

export function removeFavorite(productId: number): Promise<void> {
  return apiRequest<void>(`/favorites/${productId}`, { method: "DELETE" });
}
