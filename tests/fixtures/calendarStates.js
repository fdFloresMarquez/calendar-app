
export const events = [
    {
        id: '1',
        start: new Date('2022-10-21 13:00:00'),
        end: new Date('2022-10-21 15:00:00'),
        title: 'Cumpleaños de Facundo',
        notes: 'Alguna nota'
    },
    {
        id: '2',
        start: new Date('2022-10-21 13:00:00'),
        end: new Date('2022-10-21 15:00:00'),
        title: 'Cumpleaños de Alfred',
        notes: 'Alguna nota de Alfred'
    },
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
};

export const calendarWithEventsState = {
    isLoadingEvents: true,
    events: [ ...events ],
    activeEvent: null,
};

export const calendarWithActiveEventState = {
    isLoadingEvents: true,
    events: [ ...events ],
    activeEvent: {...events[0]},
};

