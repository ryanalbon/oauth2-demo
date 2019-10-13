import { createAction } from 'redux-actions';

export const getNotesDone = createAction('GET_NOTES_DONE');
export const getNotesStart = createAction('GET_NOTES_START');

export const createNoteDone = createAction('CREATE_NOTE_DONE');
export const createNoteStart = createAction('CREATE_NOTE_START');
