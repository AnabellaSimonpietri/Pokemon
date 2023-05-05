import axios from "axios";

export function getPokemon() {
  return async function (dispatch) {
    var json = await axios.get("http://localhost:3001/pokemon");
    return dispatch({
      type: "GET_POKEMON",
      payload: json.data,
    });
  };
}
