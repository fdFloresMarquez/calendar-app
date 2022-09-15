import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store';
import { authenticatedState, initialState, notAuthenticatedState } from '../fixtures/authStates'
import { act } from 'react-dom/test-utils';
import { testUserCredentials } from '../fixtures/testUser';
import { calendarApi } from '../../src/api';

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}

describe('Pruebas en useAuthStore', () => {

    beforeEach( () => localStorage.clear());

    test('debe de regresar los valores por defecto', () => {

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });
        
        expect(result.current).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            checkAuthToken: expect.any(Function), 
            startLogin: expect.any(Function),
            startLogout: expect.any(Function), 
            startRegister: expect.any(Function),
        })

    });

    test('debe de realizar el login correctamente', async() => {
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act( () =>  result.current.startLogin( testUserCredentials ));

        expect(result.current).toEqual({
            status: 'authenticated',
            user: { name: 'Test User', uid: '6321e3fca870130978961c90' },
            errorMessage: undefined,
            checkAuthToken: expect.any(Function), 
            startLogin: expect.any(Function),
            startLogout: expect.any(Function), 
            startRegister: expect.any(Function),
        })

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));

    });

    test('startLogin debe de fallar la autenticación', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act( 
            () =>  result.current.startLogin( {email: 'noexiste@noexiste.com', password: 'noexiste'} 
        ));

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'Credenciales incorrectas',
        })
        expect(localStorage.getItem('token')).toBeNull();

        await waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        );

    });

    test('startRegister debe de crear usuario', async() => {
        
        const newUser = {email: 'algo@google.com', password: 'noexiste', name: 'Test User2'};

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                msg: 'Logged in',
                uid: '1098237409182734',
                name: 'Test User',
                token: 'TOKEN'
            }
        });

        await act( () =>  result.current.startRegister( newUser ));

        const { errorMessage, status, user } = result.current; 
        expect({ errorMessage, status, user } ).toEqual({
            status: 'authenticated',
            user: { name: 'Test User', uid: '1098237409182734' },
            errorMessage: undefined,
        })

        spy.mockRestore(); 

    });

    test('startRegister debe de fallar la creación', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        //debe fallar porque Test User ya existe
        await act( () =>  result.current.startRegister( testUserCredentials ));
        const { errorMessage, status, user } = result.current; 
        expect({ errorMessage, status, user } ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: 'Un usuario ya existe con ese correo',
        })

    });

    test('checkAuthToken debe de fallar si no hay token', async() => {
        
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        //antes de cada prueba no hay token ( beforeEach clearLocalStorage)
        await act( () =>  result.current.checkAuthToken());
        const { errorMessage, status, user } = result.current; 
        expect({ errorMessage, status, user } ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined,
        })
    });

    test('checkAuthToken debe de autenticar user si hay token', async() => {
        
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);
        
        
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act( () =>  result.current.checkAuthToken());
        const { errorMessage, status, user } = result.current; 
        expect({ errorMessage, status, user } ).toEqual({
            status: 'authenticated',
            user: { name: 'Test User', uid: '6321e3fca870130978961c90',},
            errorMessage: undefined,
        })
    });

});