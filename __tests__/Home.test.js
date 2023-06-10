import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../pages/Home';
import React from 'react';

describe('Home component', () => {
  it('renders the title correctly', () => {
    render(<Home />);
    expect(screen.getByText('GradeMaster')).toBeInTheDocument();
  });

  it('renders the welcome message', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to GradeMaster, the ultimate website for managing and rating your academic progress!')).toBeInTheDocument();
  });
});

