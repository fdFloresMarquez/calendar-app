import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '../../src/router/AppRouter';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { CalendarPage } from '../../src/calendar';

jest.mock('../../src/hooks/useAuthStore')
jest.mock('../../src/calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}))

describe('Pruebas en <AppRouter />', () => {

    const mockCheckAuthToken = jest.fn();

    beforeEach( () => jest.clearAllMocks());
    
    test('debe de mostrar la pantalla de carga y llamar el checkAuthToken', () => {

        useAuthStore.mockReturnValue({
            status: 'checking',
            checkAuthToken: mockCheckAuthToken
        });
    
        render(<AppRouter />);

        expect(screen.getByText('Cargando...')).toBeTruthy();
        expect(mockCheckAuthToken).toHaveBeenCalled();

    });

    test('debe de mostrar el login en caso de no estar autenticado', () => {

        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        });
    
        const { container } = render(
            <MemoryRouter initialEntries={['/auth2/algo/otracosa']}>
                <AppRouter />
            </MemoryRouter>
        );
        
        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect(container).toMatchSnapshot();
        
    });

    test('debe de mostrar el calendario si el user esta autenticado', () => {

        useAuthStore.mockReturnValue({
            status: 'authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        render(
            <MemoryRouter initialEntries={['/auth2/algo/otracosa']}>
                <AppRouter />
            </MemoryRouter>
        );
        
        expect(screen.getByText('CalendarPage')).toBeTruthy();
        
    });
});