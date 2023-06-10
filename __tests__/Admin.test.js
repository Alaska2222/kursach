import React from 'react';
import { render, act } from '@testing-library/react';
import Admin from '../pages/Admin';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter} from 'react-router-dom';

const mockFetch = jest.spyOn(global, 'fetch');
mockFetch.mockImplementation(() =>
  Promise.reject(new Error('Network response was not ok'))
);

describe('Admin', () => {
  it('render the profile page', async () => {
      render(
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  let originalError;
  let mockFetch;
  beforeEach(() => {
    originalError = console.error;
    console.error = jest.fn();
    mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            Teacher: {
              Firstname: 'John',
              Surname: 'Doe',
              Age: 30,
              Email: 'johndoe@example.com',
              Phone: '123456789',
            },
          }),
      })
    );
  });

  afterEach(() => {
    console.error = originalError;
    mockFetch.mockClear();
  });

  afterAll(() => {
    mockFetch.mockRestore(
    );
  });

  it('test branch and funcs', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          Teacher: {
            Firstname: 'John',
            Surname: 'Doe',
            Age: 30,
            Email: 'johndoe@example.com',
            Phone: '123456789',
          },
        }),
    });
      render(
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      )
    });

  it('test error 400', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });
      render(
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      );
    });
  });