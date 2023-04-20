const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require("axios");
const { Pokemon, Type } = require("../db");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// Esta función trae la info de la api:
const getApiInfo = async () => {
  const {
    data: { results },
  } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=60");
  const apiInfo = await Promise.all(
    results.map(async (result) => {
      const { data } = await axios.get(result.url);
      return {
        id: data.id,
        name: data.name,
        img: data.sprites.other.home.front_default,
        life: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        speed: data.stats[5].base_stat,
        height: data.height,
        weight: data.weight,
        types: data.types.map((type) => type.type.name),
      };
    })
  );

  return apiInfo;
};

// Esta función trae la data de la Base de Datos:
const getDbInfo = async () => {
  return await Pokemon.findAll({
    // Traeme toda la info
    include: {
      model: Type, // Y traeme los tipos y los nombres
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
};

const getAllPokemons = async () => {
  // Unifico los Pokemons de mi DB y mi API
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = apiInfo.concat(dbInfo);
  return infoTotal;
};

router.get("/pokemons", async (req, res) => {
  // ¿pokemonS o pokemoN?
  const name = req.query.name; // Busca nombre por Query
  let pokemonsTotal = await getAllPokemons();
  if (name) {
    let pokemonName = await pokemonsTotal.filter((el) =>
      el.name.toLowerCase().includes(name.toLowerCase())
    ); // Busqueda mínuscula y mayúscula
    pokemonName.length
      ? res.status(200).send(pokemonName)
      : res.status(404).send("Sorry, that Pokemon does not exist"); // Pokemon no existe
  } else {
    res.status(200).send(pokemonsTotal); // Todos
  }
});

module.exports = router;
