"use strict";

// DOM elements
const submitButton = document.getElementById("submit-button");
const pokemonContainer = document.getElementById("pokemon-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchDialog = document.getElementById("search-dialog");
const closeDialogBtn = document.getElementById("close-dialog");
const dialogContent = document.getElementById("dialog-content");

// Paging variables
let offset = 0;
const limit = 10;

// Get caught Pokemon from localStorage
const getCaughtPokemon = () => {
  const caught = localStorage.getItem("caughtPokemon");
  return caught ? JSON.parse(caught) : [];
};

// Save Pokemon to localStorage
const catchPokemon = (pokemon) => {
  const caught = getCaughtPokemon();
  // Check if already caught
  if (caught.some((p) => p.id === pokemon.id)) {
    alert(`${pokemon.name} is already in your Pokédex!`);
    return false;
  }
  caught.push({ ...pokemon, notes: "" });
  localStorage.setItem("caughtPokemon", JSON.stringify(caught));
  alert(`${pokemon.name} was added to your Pokédex!`);
  return true;
};

// Check if Pokemon is already caught
const isPokemonCaught = (id) => {
  const caught = getCaughtPokemon();
  return caught.some((p) => p.id === id);
};

// Fetch Pokemon list from API
const fetchPokemon = async () => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Fetch detailed data for each Pokemon
    const detailedPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        return res.json();
      })
    );

    // Append new cards
    appendPokemonCards(detailedPokemon);

    // Increase offset for next load
    offset += limit;
  } catch (error) {
    console.log("Error fetching Pokémon:", error);
  }
};

// Search Pokemon by name or ID
const searchPokemon = async (query) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) {
    dialogContent.innerHTML = `<p class="text-slate-500">Please enter a name or ID to search.</p>`;
    return;
  }

  dialogContent.innerHTML = `<p class="text-slate-500">Searching...</p>`;

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
    );

    if (!response.ok) {
      throw new Error("Pokemon not found");
    }

    const pokemon = await response.json();
    renderDialogPokemon(pokemon);
  } catch (error) {
    dialogContent.innerHTML = `
      <div class="text-center py-8">
        <p class="text-red-500 font-semibold">Pokemon not found!</p>
        <p class="text-slate-500 mt-2">Try searching by exact name or Pokédex number (1-1025).</p>
      </div>
    `;
  }
};

// Render Pokemon in dialog
const renderDialogPokemon = (pokemon) => {
  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  const types = pokemon.types.map((t) => t.type.name).join(", ");
  const isCaught = isPokemonCaught(pokemon.id);

  dialogContent.innerHTML = `
    <div class="flex flex-col items-center">
      <span class="text-sm text-slate-400 mb-1">#${pokemon.id}</span>
      <img src="${imageUrl}" alt="${pokemon.name}" class="w-32 h-32 object-contain mb-3" />
      <h4 class="font-bold text-xl text-slate-800 capitalize mb-2">${pokemon.name}</h4>
      <p class="text-slate-600 mb-1"><strong>Types:</strong> ${types}</p>
      <p class="text-slate-600 mb-1"><strong>Height:</strong> ${pokemon.height / 10}m</p>
      <p class="text-slate-600 mb-3"><strong>Weight:</strong> ${pokemon.weight / 10}kg</p>
      <button
        id="dialog-catch-btn"
        class="px-6 py-2 rounded-md font-bold text-white ${
          isCaught
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }"
        ${isCaught ? "disabled" : ""}
      >
        ${isCaught ? "Already Caught!" : "Catch!"}
      </button>
    </div>
  `;

  // Add catch button event listener
  if (!isCaught) {
    const catchBtn = document.getElementById("dialog-catch-btn");
    catchBtn.addEventListener("click", () => {
      const pokemonData = {
        id: pokemon.id,
        name: pokemon.name,
        image: imageUrl,
        types: types,
        height: pokemon.height,
        weight: pokemon.weight,
      };
      if (catchPokemon(pokemonData)) {
        catchBtn.textContent = "Already Caught!";
        catchBtn.disabled = true;
        catchBtn.classList.remove("bg-green-500", "hover:bg-green-600");
        catchBtn.classList.add("bg-gray-400", "cursor-not-allowed");
      }
    });
  }
};

// Append cards to the container
const appendPokemonCards = (pokemonList) => {
  pokemonList.forEach((pokemon) => {
    const imageUrl =
      pokemon.sprites.other["official-artwork"].front_default ||
      pokemon.sprites.front_default;

    const types = pokemon.types.map((t) => t.type.name).join(", ");
    const isCaught = isPokemonCaught(pokemon.id);

    const card = document.createElement("article");
    card.className =
      "bg-white rounded-2xl shadow p-6 flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition";

    card.innerHTML = `
      <span class="text-xs text-slate-400 mb-1">#${pokemon.id}</span>
      <img src="${imageUrl}" alt="${pokemon.name}" class="w-24 h-24 object-contain mb-3" />
      <h2 class="font-semibold text-slate-800 text-lg capitalize mb-1">${pokemon.name}</h2>
      <p class="text-xs text-slate-500 mb-3">${types}</p>
      <button
        class="catch-btn px-4 py-2 rounded-md font-bold text-white text-sm ${
          isCaught
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }"
        data-id="${pokemon.id}"
        ${isCaught ? "disabled" : ""}
      >
        ${isCaught ? "Caught!" : "Catch!"}
      </button>
    `;

    // Add catch button event listener
    const catchBtn = card.querySelector(".catch-btn");
    if (!isCaught) {
      catchBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const pokemonData = {
          id: pokemon.id,
          name: pokemon.name,
          image: imageUrl,
          types: types,
          height: pokemon.height,
          weight: pokemon.weight,
        };
        if (catchPokemon(pokemonData)) {
          catchBtn.textContent = "Caught!";
          catchBtn.disabled = true;
          catchBtn.classList.remove("bg-green-500", "hover:bg-green-600");
          catchBtn.classList.add("bg-gray-400", "cursor-not-allowed");
        }
      });
    }

    pokemonContainer.appendChild(card);
  });
};

// Event Listeners

// Load more Pokemon
submitButton.addEventListener("click", () => {
  fetchPokemon();
});

// Search form submit
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value;
  searchPokemon(query);
  searchDialog.showModal();
});

// Close dialog
closeDialogBtn.addEventListener("click", () => {
  searchDialog.close();
});

// Close dialog when clicking outside
searchDialog.addEventListener("click", (e) => {
  if (e.target === searchDialog) {
    searchDialog.close();
  }
});
