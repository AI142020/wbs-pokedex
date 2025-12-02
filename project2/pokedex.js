"use strict";

// DOM elements
const pokedexContainer = document.getElementById("pokedex-container");
const emptyState = document.getElementById("empty-state");
const pokemonCount = document.getElementById("pokemon-count");

// Get caught Pokemon from localStorage
const getCaughtPokemon = () => {
  const caught = localStorage.getItem("caughtPokemon");
  return caught ? JSON.parse(caught) : [];
};

// Save caught Pokemon to localStorage
const saveCaughtPokemon = (pokemonList) => {
  localStorage.setItem("caughtPokemon", JSON.stringify(pokemonList));
};

// Update notes for a Pokemon
const updateNotes = (id, notes) => {
  const caught = getCaughtPokemon();
  const index = caught.findIndex((p) => p.id === id);
  if (index !== -1) {
    caught[index].notes = notes;
    saveCaughtPokemon(caught);
  }
};

// Release (remove) a Pokemon from the Pokedex
const releasePokemon = (id) => {
  const caught = getCaughtPokemon();
  const updated = caught.filter((p) => p.id !== id);
  saveCaughtPokemon(updated);
  renderPokedex();
};

// Render all caught Pokemon
const renderPokedex = () => {
  const caught = getCaughtPokemon();

  // Clear container
  pokedexContainer.innerHTML = "";

  // Show empty state or pokemon count
  if (caught.length === 0) {
    emptyState.classList.remove("hidden");
    pokemonCount.textContent = "";
    return;
  }

  emptyState.classList.add("hidden");
  pokemonCount.textContent = `${caught.length} Pokémon caught`;

  // Render each Pokemon card
  caught.forEach((pokemon) => {
    const card = document.createElement("article");
    card.className =
      "bg-white rounded-2xl shadow p-6 flex flex-col items-center hover:shadow-xl transition";

    card.innerHTML = `
      <span class="text-xs text-slate-400 mb-1">#${pokemon.id}</span>
      <img src="${pokemon.image}" alt="${pokemon.name}" class="w-24 h-24 object-contain mb-3" />
      <h2 class="font-semibold text-slate-800 text-lg capitalize mb-1">${pokemon.name}</h2>
      <p class="text-xs text-slate-500 mb-2">${pokemon.types}</p>
      <p class="text-xs text-slate-400 mb-3">
        ${pokemon.height / 10}m · ${pokemon.weight / 10}kg
      </p>

      <!-- Notes Section -->
      <div class="w-full mt-2">
        <label class="text-xs text-slate-500 block mb-1">Personal Notes:</label>
        <textarea
          class="notes-input w-full px-3 py-2 text-sm border border-slate-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="2"
          placeholder="Add notes about this Pokémon..."
          data-id="${pokemon.id}"
        >${pokemon.notes || ""}</textarea>
      </div>

      <!-- Release Button -->
      <button
        class="release-btn mt-3 px-4 py-1 text-sm rounded-md font-semibold text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition"
        data-id="${pokemon.id}"
        data-name="${pokemon.name}"
      >
        Release
      </button>
    `;

    // Add event listeners
    const notesInput = card.querySelector(".notes-input");
    notesInput.addEventListener("input", (e) => {
      updateNotes(pokemon.id, e.target.value);
    });

    const releaseBtn = card.querySelector(".release-btn");
    releaseBtn.addEventListener("click", (e) => {
      const name = e.target.dataset.name;
      if (confirm(`Are you sure you want to release ${name}?`)) {
        releasePokemon(pokemon.id);
      }
    });

    pokedexContainer.appendChild(card);
  });
};

// Initialize on page load
renderPokedex();
