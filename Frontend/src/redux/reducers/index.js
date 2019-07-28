import { combineReducers } from "redux";

const initialState = {
  notes: {
    all: [],
    filtered: [],
    unsynced: [],
    deleted: [],
    editor: {
      open: false,
      note: null
    },
    synced: true,
  },
  user: {
    isLoggedIn: false,
    syncInterval: 5
  }
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_NOTE":
    case "DELETE_NOTE":
    case "UPDATE_NOTE":
    case "LOAD_NOTES":
    case "FILTER_NOTES":
    case "SYNC_WITH_BACKEND":
    case "EDITOR_LOAD_NEW":
    case "EDITOR_LOAD_EXISTING":
    case "SYNC_DELETE":
    case "SYNC_ADD_UPDATE":
    case "CLOSE_EDITOR":
      return Object.assign({}, state, {
        notes: notesReducer(state.notes, action)
      });
    case "LOGIN":
    case "LOGOUT":
    case "RETRIEVE_ACCOUNT_DATA":
    case "MODIFY_SYNC_INTERVAL":
      return Object.assign({}, state, {
        user: userReducer(state.user, action)
      });
    default:
      return state;
  }
};

const notesReducer = (state = initialState.notes, action) => {
  switch (action.type) {
    case "ADD_NOTE":
      return {
        ...state,
        all: [...state.all, { ...action.payload }],
        unsynced: [...state.unsynced, { ...action.payload }],
        synced: false
      };

    case "DELETE_NOTE":
      return {
        ...state,
        all: state.all.filter(d => d.id !== action.payload),
        deleted: [...state.deleted, action.payload],
        synced: false
      };

    case "UPDATE_NOTE":
      return {
        ...state,
        all: state.all.map(d => {
          if (d.id === action.payload.id) return { ...action.payload };
          return d;
        }),
        unsynced: [...state.unsynced, { ...action.payload }],
        synced: false,
        filtered: []
      };

    case "EDITOR_LOAD_EXISTING":
      return {
        ...state,
        editor: {
          ...state.editor,
          open: true,
          note: {
            ...state.all.filter(d => {
              if (d.id === action.payload) return d;
            })[0]
          }
        }
      };

    case "EDITOR_LOAD_NEW":
      return { ...state, editor: { open: true, note: action.payload } };
    case "CLOSE_EDITOR":
      return { ...state, editor: { open: false, note: null } };
    case "FILTER_NOTES":
      return {
        ...state,
        filtered: state.all.filter(d => {
          if (
            d.title.toLowerCase().includes(action.payload) ||
            d.body.toLowerCase().includes(action.payload)
          )
            return d;
          return null;
        })
      };
    case "LOAD_NOTES":
      return { ...state, all: action.payload };
    case "SYNC_ADD_UPDATE":
      return {
        ...state,
        unsynced: state.unsynced.filter(d => d.id !== action.payload)
      };
    case "SYNC_DELETE":
      return {
        ...state,
        deleted: state.deleted.filter(d => d.id !== action.payload)
      };
    case "SYNC_COMPLETED_SUCCESSFULY":
      return {
        ...state,
        synced: true
      };
    default:
      return state;
  }
};

const userReducer = (state = initialState.user, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true, ...action.payload };
    case "LOGOUT":
      return { isLoggedIn: false, info: {} };
    case "RETRIEVE_ACCOUNT_DATA":
      return { ...state, info: action.payload };
    case "MODIFY_SYNC_INTERVAL":
      return { ...state, syncInterval: action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  rootReducer
});
