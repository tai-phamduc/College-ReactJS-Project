import { createContext, useReducer } from "react";

const ScreeningContext = createContext();

const initialState = {
  screenings: [],
  screening: null,
  theater: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ""
};

function screeningReducer(state, action) {
  switch (action.type) {
    case "FETCH_SCREENINGS_PENDING":
      return { ...state, isLoading: true, isError: false, isSuccess: false };
    case "FETCH_SCREENINGS_SUCCESS":
      return {
        ...state,
        screenings: action.payload,
        isSuccess: true,
        isLoading: false,
        isError: false
      };
    case "FETCH_SCREENINGS_FAILURE":
      return {
        ...state,
        isError: true,
        isLoading: false,
        message: action.payload || "Failed to fetch screenings"
      };
    case "FETCH_SCREENING_PENDING":
      return { ...state, isLoading: true, isError: false, isSuccess: false };
    case "FETCH_SCREENING_SUCCESS":
      return {
        ...state,
        screening: action.payload,
        isSuccess: true,
        isLoading: false,
        isError: false
      };
    case "FETCH_SCREENING_FAILURE":
      return {
        ...state,
        isError: true,
        isLoading: false,
        message: action.payload || "Failed to fetch screening"
      };
    case "SET_SCREENING":
      return { ...state, screening: action.payload };
    case "SET_THEATER":
      return { ...state, theater: action.payload };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

const ScreeningProvider = ({ children }) => {
  const [screeningsState, dispatchScreenings] = useReducer(
    screeningReducer,
    initialState
  );

  return (
    <ScreeningContext.Provider value={{ screeningsState, dispatchScreenings }}>
      {children}
    </ScreeningContext.Provider>
  );
};

export { ScreeningProvider };
export default ScreeningContext;
