import React from 'react';
import { render, screen, fireEvent, act} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Register from '../pages/Register';
import DropdownItem from '../components/DropdownItem';
import FloatLabel from '../components/FloatLabel';


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

  describe('Register component', () => {
    beforeEach(() => {
      jest.spyOn(window, "fetch");
    });
  
    afterEach(() => {
      window.fetch.mockRestore();
    });
  
    it('renders register form', async () => {
      render(<Register />, { wrapper: MemoryRouter });
      const { container } =  render(<FloatLabel/>) 
      expect(container).toBeDefined();
    });

      it('clicking role buttons toggles openStudent/openTeacher state and opens dropdown menu', async () => {
        const mockData = [{ SubjectId: "OOP" }];
          const mockResponse = { json: () => Promise.resolve(mockData) };
          window.fetch.mockImplementation(() => Promise.resolve(mockResponse));

          await act(async () => {
            render(
              <MemoryRouter>
                <Register />
              </MemoryRouter>
            )})
        const teacherButton = screen.getByText('I am Teacher');    
        fireEvent.click(teacherButton);
        expect(screen.getByText('Choose your subject:')).toBeInTheDocument();
      }); 
      
      it('fills out form and submits successfully', async () => {
        
        const mockData = [{ GroupId: "214" }];
          const mockResponse = { json: () => Promise.resolve(mockData) };
          window.fetch.mockImplementation(() => Promise.resolve(mockResponse));
          await act(async () => {
            render(
              <MemoryRouter>
                <Register />
              </MemoryRouter>
            );
        
            })

        fireEvent.change(screen.getByTestId('name'), {
          target: { value: 'John' },
        });

        fireEvent.change(screen.getByTestId('surname'), {
          target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByTestId('username'), {
          target: { value: 'johndoe' },
        });
        fireEvent.change(screen.getByTestId('email'), {
          target: { value: 'johndoe@gamil.com' },
        });
        fireEvent.change(screen.getByTestId('age'), {
          target: { value: '30' },
        });
        fireEvent.change(screen.getByTestId('phone'), {
          target: { value: '+380907865742' },
        });
        fireEvent.change(screen.getByTestId('password'), {
          target: { value: 'password' },
        });
        fireEvent.change(screen.getByTestId('cpassword'), {
          target: { value: 'password' },
        })
    
        fireEvent.click(screen.getByText('I am Student'));
        expect(screen.getByText('Choose your group:')).toBeInTheDocument();
        fireEvent.click(screen.getByText("214"));
        jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true });     
      });

      it("handles item  user click correctly", () => {
        const mockHandleItemClick = jest.fn();
    
        render(
          <DropdownItem
            text="Item Text"
            Role="user"
            key="item-id"
            id="item-id"
            handleItemClick={mockHandleItemClick} 
          />
        );
    
        fireEvent.click(screen.getByTestId("item-id"));
    
        expect(mockHandleItemClick).toHaveBeenCalledTimes(1); 
        expect(mockHandleItemClick).toHaveBeenCalledWith("Item Text", "user", "item-id"); 
      });

      it('logs error to console',  () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const errorMessage = 'Error fetching groups';
        const error = new Error(errorMessage);
      
        jest.spyOn(window, 'fetch').mockRejectedValueOnce(error);
        render(<Register />);
        consoleSpy.mockRestore();
      });

      it('throws error when network response is not ok',  () => {
        jest.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('Network response was not ok'))
        render(<Register />);
        fireEvent.click(screen.getByTestId('registrate-btn'));
      });

      it('closes dropdown menu when clicking outside', () => {
        render(<Register />);
        HTMLElement.prototype.contains = jest.fn(() => false);
        fireEvent.mouseDown(document);
        expect(screen.getByTestId('dropdown-menu')).toHaveClass('inactive');
      });
    });
       
    
       
       




