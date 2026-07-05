import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ConfirmProvider } from "./context/ConfirmContext";

export const TEST_USER = {
  _id: "u1",
  name: "Dana",
  email: "dana@example.com",
  avatar: "https://gravatar.com/avatar/x",
  gaia_points: 15,
  planet_consuption: "2.10"
};

// Render with the full provider stack; `path` lets pages read useParams()
export const renderWithProviders = (ui, { route = "/", path = "*" } = {}) =>
  render(
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path={path} element={ui} />
              <Route path="*" element={<div data-testid="other-route" />} />
            </Routes>
          </MemoryRouter>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
