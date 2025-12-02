"use strict";

// DOM elements
const submitButton = document.getElementById("submit-button");
const pokemonContainer = document.getElementById("pokemon-container");

// Fetch Pokemon from API
const fetchPokemon = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // data.results = Array mit 10 Pokémon Objekten (name, url)
    renderPokemonCards(data.results);

  } catch (error) {
    console.log("Error fetching Pokémon:", error);
  }
};

// Render Cards
const renderPokemonCards = (pokemonList) => {
  pokemonContainer.innerHTML = ""; // clear grid

  pokemonList.forEach((pokemon, index) => {
    const id = index + 1;

    // Official artwork URL basiert auf ID
    const imageUrl =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
      id +
      ".png";

    // Card element
    const card = document.createElement("article");
    card.className =
      "bg-white rounded-xl shadow p-4 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition cursor-pointer";

    // Card content
    card.innerHTML = `
      <span class="text-xs text-slate-400 mb-1">#${id}</span>
      <img src="${imageUrl}" alt="${pokemon.name}" class="w-24 h-24 object-contain mb-3" />
      <h2 class="font-semibold text-slate-800 text-lg capitalize">${pokemon.name}</h2>
    `;

    // Optionale Detailanzeige bei Klick
    card.addEventListener("click", () => {
      alert("You clicked on " + pokemon.name);
    });

    pokemonContainer.appendChild(card);
  });
};

// Load Pokémon when button is clicked
submitButton.addEventListener("click", () => {
  fetchPokemon("https://pokeapi.co/api/v2/pokemon?limit=10");
});
