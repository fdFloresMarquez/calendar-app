import { authSlice, clearErrorMessage, onChecking, onLogin, onLogout } from "../../../src/store/auth/authSlice";
import { authenticatedState, initialState, notAuthenticatedState } from "../../fixtures/authStates";
import { testUserCredentials } from "../../fixtures/testUser";

describe('Pruebas en authSlice', () => {
    
    test('debe de regresar el estado inicial', () => {
        
        expect(authSlice.getInitialState()).toEqual(initialState);

    });

    test('debe de realizar un login', () => {
        
        const state = authSlice.reducer( initialState, onLogin(testUserCredentials));
        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined,
        })
        
    });

    test('debe de realizar el logout', () => {
        
        const state = authSlice.reducer( authenticatedState, onLogout());
        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined,
        })

    });

    test('debe de limpiar el mensaje de error', () => {
        
        const errorMessage = 'Crendenciales no validas';
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage));
        const newState = authSlice.reducer( state, clearErrorMessage());

        expect(newState.errorMessage).toBe(undefined);

    });

    test('debe de cambiar el status a checking', () => {
        
        const state = authSlice.reducer( notAuthenticatedState, onChecking());
        expect(state.status).toBe('checking');

    });

});