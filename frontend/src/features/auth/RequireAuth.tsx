import type { PropsWithChildren } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router-dom";
import { fetchMe } from "./authApi";

export function RequireAuth({ children }: PropsWithChildren) {
  const location = useLocation();
  const { isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    retry: false,
  });

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
