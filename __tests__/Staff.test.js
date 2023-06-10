import React from 'react';
import { render, screen, act} from '@testing-library/react';
import Staff from '../pages/Staff';
import Teacher from '../components/Teacher';
import '@testing-library/jest-dom/extend-expect';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          TeacherId: "bPahalok",
          Firstname: 'Bogdan',
          Surname: 'Pahalok',
          Age: 60,
          SubjectId: 'Theory of Probability',
          Phone: '+380958984251',
          Email: 'pahalok@gmail.com',
        },
      ]),
  })
);

describe('Staff', () => {
  it('fetch and render teacher records', async () => {
    render(<Staff />);
    const { container } =  render(<Teacher/>)
    expect(container).toBeDefined();
  });

  it('calls setRecord with fetched data', async() => {
    const mockData = [
      {
        TeacherId: "bPahalok",
        Firstname: 'Bogdan',
        Surname: 'Pahalok',
        Age: 60,
        SubjectId: 'Theory of Probability',
        Phone: '+380958984251',
        Email: 'pahalok@gmail.com',
      },
      {
        TeacherId: "petroPu",
        Firstname: 'Petro',
        Surname: 'Pukach',
        Age: 55,
        SubjectId: 'MMDO',
        Phone: '+380958984253',
        Email: 'petroPu2@gmail.com',
      },
      
    ];
  
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    };
  
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve(mockResponse)
    );
  
    render(<Staff />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText('bPahalok')).toBeInTheDocument();
  });
});
