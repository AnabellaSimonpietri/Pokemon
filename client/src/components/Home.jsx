import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPokemons } from ".../actions";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch(); //Uso esa constancia y despacho mis acciones
  const allPokemons = useSelector((state) => state.pokemons); //Hooks, es lo mismo que map solo más fácil. Trae todo lo que está en caracters.

  useEffect(() => {
    dispatch(getPokemons());
  }, []);

  function handleClick(e) {
    e.preventDefault(); //previene reset, no recarga página
    dispatch(getPokemons());
  }

  return (
    <div>
      <Link to="/pokemons">Create Pokemon</Link>
      <h1>Love Pokemon!</h1>
      <button
        onClick={(e) => {
          handleClick(e); //me resetea personajes
        }}
      >
        Loading Pokemons
      </button>
    </div>
  );
}
