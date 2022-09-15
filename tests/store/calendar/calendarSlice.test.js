import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from '../../../src/store/calendar/calendarSlice';
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from '../../fixtures/calendarStates';

describe('Pruebas en calendarSlice', () => {
    
    test('debe de regresar el estado por defecto', () => {
        
        const state = calendarSlice.getInitialState();
        expect( state ).toEqual( initialState );

    });

    test('onSetActiveEvent debe de actibar el evento', () => {

        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0]) );
        expect(state.activeEvent).toEqual(events[0]);

    });

    test('onAddNewEvent debe de agregar el evento', () => {
        
        const newEvent = {
            id: '3',
            start: new Date('2022-10-22 13:00:00'),
            end: new Date('2022-10-22 15:00:00'),
            title: 'Cumpleaños de Facundo!!',
            notes: 'Alguna nota!!'
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ));
        expect(state.events.length).toEqual(3);
        expect(state.events).toContain(newEvent);
        
    });

    test('onUpdateEvent debe de actualizar el evento', () => {
        
        const updatedEvent = {
            id: '1',
            start: new Date('2022-10-25 11:00:00'),
            end: new Date('2022-10-25 18:00:00'),
            title: 'Fiesta de Facundo!!',
            notes: 'Esta es una nota!!'
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ));
        expect(state.events).toContain(updatedEvent);

    });

    test('onDeleteEvent debe de borrar el evento activo', () => {

        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent());
        expect(state.activeEvent).toBe(null);
        expect(state.events).not.toContain(events[0]);

    });

    test('onLoadEvents debe de establecer los eventos', () => {
        
        const state = calendarSlice.reducer( initialState, onLoadEvents(events));
        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events.length).toBeGreaterThan(0);

    });

    test('onLogoutCalendar debe de limpiar el estado', () => {
        
        const state = calendarSlice.reducer( calendarWithEventsState, onLogoutCalendar());
        expect(state).toEqual(initialState);

    });
});