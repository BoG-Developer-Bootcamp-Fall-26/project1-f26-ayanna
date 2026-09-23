const TYPE_COLORS = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD'
};

let currentId = 132;
let currentPokemon = null;
let currentTab = 'info';

const pokemonImg = document.getElementById('pokemon-img');
const imgPlaceholder = document.getElementById('img-placeholder');
const pokemonName = document.getElementById('pokemon-name');
const typesContainer = document.getElementById('types-container');
const contentPanel = document.getElementById('content-panel');
const panelTitle = document.getElementById('panel-title');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const infoTabBtn = document.getElementById('info-tab-btn');
const movesTabBtn = document.getElementById('moves-tab-btn');

async function fetchPokemon(id) {
  try {
    imgPlaceholder.textContent = 'Loading...';
    imgPlaceholder.classList.remove('hidden');
    pokemonImg.classList.add('hidden');
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error('Failed to load');
    currentPokemon = await res.json();
    renderPokemon();
  } catch (error) {
    pokemonName.textContent = 'Error loading';
  }
}

function renderPokemon() {
  if (!currentPokemon) return;
  pokemonName.textContent = currentPokemon.name.toLowerCase();
  if (currentPokemon.sprites.front_default) {
    pokemonImg.src = currentPokemon.sprites.front_default;
    pokemonImg.onload = () => {
      imgPlaceholder.classList.add('hidden');
      pokemonImg.classList.remove('hidden');
    };
  }
  typesContainer.innerHTML = '';
  currentPokemon.types.forEach((slot) => {
    const typeName = slot.type.name.toLowerCase();
    const badge = document.createElement('span');
    badge.textContent = typeName;
    badge.className = 'px-3 py-0.5 rounded text-white text-xs font-medium lowercase shadow-sm';
    badge.style.backgroundColor = TYPE_COLORS[typeName] || '#777777';
    typesContainer.appendChild(badge);
  });
  renderTabContent();
}

function renderTabContent() {
  if (!currentPokemon) return;
  contentPanel.innerHTML = '';
  if (currentTab === 'info') {
    panelTitle.textContent = 'Info';
    const heightInMeters = (currentPokemon.height * 0.1).toFixed(1);
    const weightInKg = (currentPokemon.weight * 0.1).toFixed(1);
    const infoList = [`height: ${heightInMeters}m`, `weight: ${weightInKg}kg`];
    currentPokemon.stats.forEach((s) => infoList.push(`${s.stat.name}: ${s.base_stat}`));
    infoList.forEach((text) => {
      const p = document.createElement('p');
      p.textContent = text;
      p.className = 'leading-relaxed';
      contentPanel.appendChild(p);
    });
  } else {
    panelTitle.textContent = 'Moves';
    currentPokemon.moves.forEach((s) => {
      const p = document.createElement('p');
      p.textContent = s.move.name;
      p.className = 'leading-relaxed';
      contentPanel.appendChild(p);
    });
  }
  updateTabButtonStyles();
}

function updateTabButtonStyles() {
  if (currentTab === 'info') {
    infoTabBtn.className = 'flex-1 py-2 rounded-lg text-base font-medium transition bg-[#86EFAC] text-black';
    movesTabBtn.className = 'flex-1 py-2 rounded-lg text-base font-medium transition bg-[#E5E7EB] text-black hover:bg-gray-300';
  } else {
    infoTabBtn.className = 'flex-1 py-2 rounded-lg text-base font-medium transition bg-[#E5E7EB] text-black hover:bg-gray-300';
    movesTabBtn.className = 'flex-1 py-2 rounded-lg text-base font-medium transition bg-[#86EFAC] text-black';
  }
}

prevBtn.addEventListener('click', () => {
  if (currentId > 1) {
    currentId -= 1;
    fetchPokemon(currentId);
  }
});

nextBtn.addEventListener('click', () => {
  currentId += 1;
  fetchPokemon(currentId);
});

infoTabBtn.addEventListener('click', () => {
  currentTab = 'info';
  renderTabContent();
});

movesTabBtn.addEventListener('click', () => {
  currentTab = 'moves';
  renderTabContent();
});

fetchPokemon(currentId);
