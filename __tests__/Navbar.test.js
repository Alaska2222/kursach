import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from '../components/Navbar';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar', () => {
    it('renders the navbar with login link when user is not logged in', () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  
    it('renders the navbar with logout and user profile links when user is logged in', () => {
      jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('user');
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.getByText('User Profile')).toBeInTheDocument();
      const logoutLink = screen.getByText('Logout');
      fireEvent.click(logoutLink);
    });

    it('show responseve navbar', () => {
    global.innerWidth = 600;
    render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
    const navBtn = screen.getByTestId('nav-btn')
    expect(navBtn).toBeInTheDocument();
    fireEvent.click(navBtn);
    });
  });


  