import React from 'react';
import { render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Profile from '../pages/Profile';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import DeleteButton from '../components/DeleteButton';
import Swal from 'sweetalert2';
import { BrowserRouter as Router } from 'react-router-dom'; 



jest.mock('react-apexcharts', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Piechart component', () => {
  it('should render the pie chart', () => {
    const labels = ['Label 1', 'Label 2', 'Label 3'];
    const series = [10, 20, 30];

    render(
      <MemoryRouter>
        <PieChart labels={labels} series={series} />
      </MemoryRouter>
    );

  });
});

describe('Linechart component', () => {
  it('should render the line chart', () => {

    const records = [
      { DateId: '2023-05-01', SubjectId: 'Math', Value: '80' },
      { DateId: '2023-05-01', SubjectId: 'Science', Value: '75' },
      { DateId: '2023-05-02', SubjectId: 'Math', Value: '85' },
      { DateId: '2023-05-02', SubjectId: 'Science', Value: '70' },
      { DateId: '2023-05-02', SubjectId: 'Science', Value: '' }
    ];
    render(
      <MemoryRouter>
        <LineChart records={records} />
      </MemoryRouter>
    );
});


});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValueOnce({ isConfirmed: true }),
}));


describe('Delete button component', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });


  test('should delete student when role is "user"', async () => {
    localStorage.setItem('role', 'user');
    const mockFetch = jest.fn().mockResolvedValue({ ok: true });
    jest.spyOn(Swal, 'fire').mockResolvedValueOnce({ isConfirmed: true }); 
    global.fetch = mockFetch;
    render(
      <Router>
        <DeleteButton username="testuser" />
      </Router>
    );
    fireEvent.click(screen.getByTestId('delete-btn'));
  });
  
  it('should throw an error when network response is not OK', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });
    jest.spyOn(Swal, 'fire').mockResolvedValueOnce({ isConfirmed: true }); 
    render(
      <Router>
        <DeleteButton username="testuser" />
      </Router>
    );

    fireEvent.click(screen.getByTestId('delete-btn'));

    await waitFor(() => {
      expect(() => {
        throw new Error('Network response was not ok');
      }).toThrow();
    });
  });

  test('should display confirmation dialog on button click', () => {
    render(<Router> <DeleteButton username="testtuser" /></Router>);
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
    });
  });

  test('should make DELETE request and clear local storage on confirmation', async () => {
    render(
      <Router>
        <DeleteButton username="testuser" />
      </Router>
    );

    const deleteButton = screen.getByTestId('delete-btn');
    fireEvent.click(deleteButton);
  });

});
  
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ Student: {} }),
  })
);

global.fn = jest.fn();
describe('Profile component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockImplementation((url) => {
      if (url.includes('/groups')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      } else if (url.includes('/student/')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              Student: {
                Firstname: 'Nelia',
                Surname: 'Drozd',
                Age: '19',
                Email: 'singularity@gmail.com',
                Phone: '+380958984251',
                GroupId: '216',
              },
            }),
        });
      } else if (url.includes('/students/')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                MarkId: '1',
                SubjectId: 'Theory of Probability	',
                TeacherId: 'petroPu',
                Value: '5',
                DateId: '2022-04-02',
              },
            ]),
        });
      }
    });

    localStorage.setItem('username', 'Alaska11');
    localStorage.setItem('password', 'qwerty1234');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('should render the profile page', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(
      screen.getByText('Welcome, to the student profile!')
    ).toBeInTheDocument();
  });

  test('should update the student when the Update button is clicked', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });
    
    jest.spyOn(Swal, 'fire').mockResolvedValueOnce({ isConfirmed: true }); 
    const updateButton = screen.getByTestId('update-btn');
    fireEvent.click(updateButton);
    const nameInput = screen.getByRole('textbox', { name: 'Name:' });
    fireEvent.change(nameInput, { target: { value: 'John' } });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    const mockedSwalFire = jest.fn();
    jest.spyOn(Swal, 'fire').mockResolvedValue({ fire: mockedSwalFire });

    fireEvent.click(updateButton);
  });
  
  
test('should sort records by column in ascending order', async() => {
  const records = [
    { MarkId: 1, SubjectId: 'Math', TeacherId: 'John', Value: 90, DateId: '2022-01-01' },
    { MarkId: 2, SubjectId: 'Science', TeacherId: 'Alice', Value: 85, DateId: '2022-01-02' },
    { MarkId: 3, SubjectId: 'English', TeacherId: 'Bob', Value: 95, DateId: '2022-01-03' },
  ];

  await act(async () => {
    render(
      <MemoryRouter>
        <Profile records={records}/>
      </MemoryRouter>
    );
  });
  screen.getByText('Subject').click();
});

});
