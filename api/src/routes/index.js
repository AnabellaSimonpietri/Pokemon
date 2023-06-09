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

const getAllPokemon = async () => {
  // Unifico los Pokemons de mi DB y mi API
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = apiInfo.concat(dbInfo);
  return infoTotal;
};

router.get("/pokemon", async (req, res) => {
  const name = req.query.name; // Busca nombre por Query
  let pokemonTotal = await getAllPokemon();
  if (name) {
    let pokemonName = await pokemonTotal.filter((el) =>
      el.name.toLowerCase().includes(name.toLowerCase())
    ); // Busqueda mínuscula y mayúscula
    pokemonName.length
      ? res.status(200).send(pokemonName)
      : res.status(404).send("Sorry, that Pokemon does not exist"); // Pokemon no existe
  } else {
    res.status(200).send(pokemonTotal); // Todos
  }
});

// ---------------------------------------- Types -----------------------------
// Ruta para obtener todos los tipos
router.get("/types", async (req, res) => {
  try {
    let types = await Type.findAll();

    // Si no hay tipos en la base de datos, obtenerlos de la API
    if (types.length === 0) {
      const response = await axios.get("https://pokeapi.co/api/v2/type");
      console.log(response.data.results); // Ver si la respuesta se guarda correctamente
      const apiTypes = response.data.results;
      apiTypes.forEach(async (type) => {
        const newType = new Type({ name: type.name });
        await newType.save();
        console.log(`Se ha guardado el tipo ${type.name} en la base de datos`); // Ver si el registro se guarda correctamente
      });
      types = await Type.findAll();
    }
    res.json(types);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error" });
  }
});

// ---------------------------------------- POST -----------------------------

router.post("/pokemon", async (req, res) => {
  let { name, img, life, attack, defense, speed, height, weight, types } =
    req.body;

  let pokemonCreated = await Pokemon.create({
    name,
    img,
    life,
    attack,
    defense,
    speed,
    height,
    weight,
    createBD,
  });

  let typesDb = await Type.findAll({
    where: { name: types },
  });

  pokemonCreated.addType(typesDb);
  res.json("Successfully created Pokemon"); //Pokemon creado con éxito
});

//Se puede pasar por set pero siento que esta es más optima para mí.

//Le puedo agregar un mensaje de error.

router.get("/pokemon/:id", async (req, res) => {
  const id = req.params.id;
  const allPokemon = await getAllPokemon();
  if (id) {
    let pokemonID = await allPokemon.filter((el) => el.id == id);
    pokemonID
      ? res.status(200).json(pokemonID)
      : res.status(404).send("Sorry, that Pokemon does not exist.");
  }
});

module.exports = router;
