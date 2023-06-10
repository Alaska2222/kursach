import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import ErrorPage from '../pages/ErrorPage';


describe('ErrorPage', () => {
    it('should render the error page correctly', () => {
      render(
        <MemoryRouter>
          <ErrorPage />
        </MemoryRouter>
      );
      const headingElement = screen.getByRole('heading', { level: 1, name: /404/i });
      const subheadingElement = screen.getByRole('heading', { level: 3, name: /page not found/i });
      const linkElement = screen.getByRole('link', { name: /home page/i });
      expect(headingElement).toBeInTheDocument();
      expect(subheadingElement).toBeInTheDocument();
      expect(linkElement).toBeInTheDocument();
    });
  
    it('should have a link to the home page', () => {
      render(
        <MemoryRouter>
          <ErrorPage />
        </MemoryRouter>
      )
      const linkElement = screen.getByRole('link', { name: /home page/i });
      expect(linkElement).toHaveAttribute('href', '/');
    });
  });