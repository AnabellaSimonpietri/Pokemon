import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPokemon } from ".../actions";
import { Link } from "react-router-dom";
import Card from "./Card";

export default function Home() {
  const dispatch = useDispatch(); //Uso esa constancia y despacho mis acciones
  const allPokemon = useSelector((state) => state.pokemon); //Hooks, es lo mismo que map solo más fácil. Trae todo lo que está en caracters.

  useEffect(() => {
    dispatch(getPokemon());
  }, []);

  function handleClick(e) {
    e.preventDefault(); //previene reset, no recarga página, siempre que creo botones hago un handle arriba.
    dispatch(getPokemon());
  }

  return (
    //ESTO SE PUEDE MODULARIZAR EN NAV PARA Q NO ESTÉ TODO EN HOME.
    <div>
      <Link to="/pokemon">Create Pokemon</Link>
      <h1>Love Pokemon!</h1>
      <button
        onClick={(e) => {
          handleClick(e); //me resetea personajes
        }}
      >
        Loading Pokemon
      </button>
      <div>
        //* ---------------------------------- Filtros ------------------------
        <select>
          {" "}
          //*ordena
          <option value="asc">A - Z</option>
          <option value="desc">Z - A</option>
          //* Acá ordenar por ataque:
        </select>
        <select>
          {" "}
          //*filtra
          <option value="All">All</option>
          <option value="Type">Type</option>
          <option value="Api">Api</option>
          <option value="Created">Created</option>
        </select>
        {allPokemon && //Esto me trae los personajes (Card)
          allPokemon.map((el) => {
            <Card name={el.name} type={el.type} img={el.img} />;
          })}
      </div>
    </div>
  );
}

//El value me permite acceder al valor que tiene asc o dec para que la acción me entienda.
