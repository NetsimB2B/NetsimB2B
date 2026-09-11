import { apiRequest } from "@/shared/api/httpClient";

export type ApiShipmentEvent = {
  title: string;
  date: string;
  location: string | null;
  completed: boolean;
};

export type ApiShipment = {
  id: string;
  cariNo: number;
  orderId: string | null;
  date: string;
  status: "Hazırlanıyor" | "Yolda" | "Teslim Edildi";
  carrier: string | null;
  trackingNo: string | null;
  estimatedDelivery: string;
  deliveredAt: string | null;
  origin: string | null;
  destination: string | null;
  vehiclePlate: string | null;
  driverName: string | null;
  events: ApiShipmentEvent[];
};

export function fetchShipments(cariNo: number): Promise<ApiShipment[]> {
  return apiRequest<ApiShipment[]>("/shipments", { headers: { "X-Cari-No": String(cariNo) } });
}
