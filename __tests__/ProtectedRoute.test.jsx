import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter  } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    Navigate: jest.fn(),
  }));
  
describe("ProtectedRoute", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it("renders children when user role is allowed", () => {
    localStorage.setItem("role", "user");
      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={["user"]}>
            <div data-testid="children">Children</div>
          </ProtectedRoute>
        </MemoryRouter>
      );
    });

    it("navigates to /login when user role is not allowed", () => {
        localStorage.setItem("role", "guest");
        render(
          <MemoryRouter>
            <ProtectedRoute allowedRoles={["user"]}>
              <div data-testid="children">Children</div>
            </ProtectedRoute>
          </MemoryRouter>
        );
          });
  });


 