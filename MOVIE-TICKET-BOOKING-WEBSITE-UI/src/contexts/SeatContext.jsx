import React, { createContext, useReducer } from 'react';

// Create the context
const SeatProductContext = createContext();

// Initial state
const initialState = {
  seats: [],
  products: [],
  chosenProducts: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

function seatProductReducer(state, action) {
  switch (action.type) {
    case 'SET_SEATS':
      return { ...state, seats: action.payload };
    case 'FETCH_PRODUCTS_PENDING':
      return { ...state, isLoading: true };
    case 'FETCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        products: action.payload,
        isLoading: false,
        isSuccess: true,
      };
    case 'FETCH_PRODUCTS_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
        message: 'Failed to fetch products',
      };
    case 'SET_CHOSEN_PRODUCTS':
      return { ...state, chosenProducts: action.payload };
    case 'RESET':
      return {
        ...state,
        seats: [],
        chosenProducts: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
      };
    default:
      return state;
  }
}

export const SeatProductProvider = ({ children }) => {
  const [seatProduct, dispatchSeatProduct] = useReducer(seatProductReducer, initialState);

  return (
    <SeatProductContext.Provider value={{ seatProduct, dispatchSeatProduct }}>
      {children}
    </SeatProductContext.Provider>
  );
};

export default SeatProductContext;
