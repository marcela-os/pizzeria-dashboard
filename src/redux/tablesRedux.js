import Axios from 'axios';
import { api } from '../settings';

/* selectors */
export const getAll = ({tables}) => tables.data;
export const getLoadingState = ({tables}) => tables.loading;

/* action name creator */
const reducerName = 'tables';
const createActionName = name => `app/${reducerName}/${name}`;

/* action types */
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');
const STATUS_UPDATE = createActionName('STATS_UPDATE');

/* action creators */
export const fetchStarted = payload => ({ payload, type: FETCH_START });
export const fetchSuccess = payload => ({ payload, type: FETCH_SUCCESS });
export const fetchError = payload => ({ payload, type: FETCH_ERROR });
export const statusUpdated = payload => ({ payload, type: STATUS_UPDATE});

/* thunk creators */
export const fetchFromAPI = () => {
  return (dispatch, getState) => {
    dispatch(fetchStarted());

    Axios
      .get(`${api.url}/api/${api.tables}`)
      .then(res => {
        dispatch(fetchSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

export const statusFromAPI = (id, status) => {
	return (dispatch, getState) => {
    dispatch(fetchStarted());

    Axios
      .put(`${api.url}/api/${api.tables}/${id}`, {  //.put-uaktalnia/modyfikuje już istniejący wpis w bazie  .post-służy do dodawania nowych danych; musi być dodany parametr /api/ albo w url w settings.js
				status: status,
			}, {headers: {
				'Content-Type': 'application/json',
			}},)
      .then(res => {
        dispatch(statusUpdated(res.data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

/* reducer */
export default function reducer(statePart = [], action = {}) {
  switch (action.type) {
    case FETCH_START: {
      return {
        ...statePart,
        loading: {
          active: true,
          error: false,
        },
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: false,
        },
        data: action.payload,
      };
    }
    case FETCH_ERROR: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload,
        },
      };
    }
		case STATUS_UPDATE: {
			return {
				...statePart,
				data: statePart.data.map (order => order.id === action.payload.id ? {...order, status: action.payload.status} : order), // sprawdzamy czy w tej tablicy jest jakiś element który zawiera id, z elementów które są na serwerze, jeśli jest prawdziwy to aktualizujemy stats jesli nie to zwróć co było
				loading: {
          active: false,
          error: false,
        },
      };
		}
    default:
      return statePart;
  }
}
