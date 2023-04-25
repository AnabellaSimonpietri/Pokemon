const initialState = {
  pokemons: [], //¿ va dos puntos o = ?
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_POKEMONS":
      return {
        ...state, //guarda el estado
        pokemons: action.payload,
      };
  }
}

export default rootReducer;
