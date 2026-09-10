import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";
import { ApiError } from "@/shared/api/httpClient";
import * as authApi from "./authApi";

function renderLoginPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("LoginPage", () => {
  it("shows an error for invalid credentials", async () => {
    vi.spyOn(authApi, "login").mockRejectedValueOnce(new ApiError(401, ""));
    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText("E-posta adresi"), "demo@netsim.com");
    await user.type(screen.getByLabelText("Şifre"), "yanlis");
    await user.click(screen.getByRole("button", { name: "Giriş Yap" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("E-posta adresi veya şifre hatalı.");
  });
});
