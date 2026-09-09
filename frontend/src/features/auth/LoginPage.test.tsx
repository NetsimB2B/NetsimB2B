import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("shows an error for invalid credentials", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    await user.type(screen.getByLabelText("E-posta adresi"), "demo@netsim.com");
    await user.type(screen.getByLabelText("Şifre"), "yanlis");
    await user.click(screen.getByRole("button", { name: "Giriş Yap" }));

    expect(screen.getByRole("alert")).toHaveTextContent("E-posta adresi veya şifre hatalı.");
  });
});
