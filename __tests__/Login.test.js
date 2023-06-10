import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Login from '../pages/Login';


describe('Login component', () => {
    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ Username: 'Alaska11', Password:"qwerty1234", Status: 'user' }),
        })
      );
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it('renders login form', () => {
      render(<Login />, { wrapper: MemoryRouter });
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByTestId('login-btn')).toBeInTheDocument();
    });
  
    it('submits login form successfully', async () => {
      render(<Login />, { wrapper: MemoryRouter });
      fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'Alaska11' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'qwerty1234' } });
      fireEvent.click(screen.getByTestId('login-btn'));
      await screen.findByText(/login successful/i);
    });
  
    it('displays error message on failed login', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({ ok: false })
      );
      render(<Login />, { wrapper: MemoryRouter });
      fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testPassword' } });
      fireEvent.click(screen.getByTestId('login-btn'));
      await screen.findByText(/invalid username or password/i);
    });
  });