import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteButton from '../components/DeleteButton';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Swal from 'sweetalert2';


jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
  }));

describe('Delete button component', () => {
    beforeEach(() => {
    localStorage.clear();
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
      });
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    })

    it('should display confirmation dialog on button click', () => {
      render(<MemoryRouter> <DeleteButton username="testtuser" /></MemoryRouter>);
      jest.spyOn(Swal, 'fire').mockResolvedValueOnce({ isConfirmed: true }); 
      const deleteButton = screen.getByTestId("delete-btn");
      fireEvent.click(deleteButton);
      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Are you sure you want to delete this account?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#32CD32',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      })
    })

    it('handles error if network response is not ok', async () => {
        const username = 'testuser';
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<MemoryRouter><DeleteButton username={username} /></MemoryRouter>);
        mockConsoleError.mockRestore(); 
      });
});


  