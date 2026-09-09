import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isMockAuthenticated } from "./mockAuth";

export function RequireMockAuth({ children }: PropsWithChildren) {
  const location = useLocation();

  if (!isMockAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
