document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById('creatureSearch');
    const searchResults = document.getElementById('searchResults');
    const creatureCodeBox = document.getElementById('creatureCode');
    const creatureLevelBox = document.getElementById('creatureLevel');
    const maxLevelCheckbox = document.getElementById('maxLevel');
    const tamedCheckbox = document.getElementById('tamed');
    const cryopodCheckbox = document.getElementById('cryopod');
    const spawnXBox = document.getElementById('spawnX');
    const spawnYBox = document.getElementById('spawnY');
    const spawnZBox = document.getElementById('spawnZ');
    const saddleDropdown = document.getElementById("saddleDropdown");
    const saddleCodeBox = document.getElementById("saddleCode");
    const quantityBox = document.getElementById("quantity");
    const qualityBox = document.getElementById("quality");
    
    let creatureData = [];
    let selectedCreature = null;

    fetch('Creature.json')
        .then(response => response.json())
        .then(data => {
            creatureData = data.creatures;
        })
        .catch(error => console.error('Error loading creature data:', error));

    function filterCreatures(query) {
        return creatureData.filter(creature => 
            creature.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    function displaySuggestions(suggestions) {
        searchResults.innerHTML = '';
        if (suggestions.length > 0) {
            suggestions.forEach(creature => {
                const suggestionItem = document.createElement('button');
                suggestionItem.classList.add('list-group-item', 'list-group-item-action');
                suggestionItem.textContent = creature.name;
                suggestionItem.onclick = () => {
                    searchBox.value = creature.name;
                    searchResults.innerHTML = '';
                    selectedCreature = creature;
                    updateMaxLevel();
                    generateCreatureCode(creature);
                    updateSaddleOptions(creature);
                };
                searchResults.appendChild(suggestionItem);
            });
        } else {
            const noResultsItem = document.createElement('button');
            noResultsItem.classList.add('list-group-item', 'list-group-item-action');
            noResultsItem.textContent = 'No results found';
            searchResults.appendChild(noResultsItem);
        }
    }

    searchBox.addEventListener('input', () => {
        const query = searchBox.value;
        if (query.length > 0) {
            const suggestions = filterCreatures(query);
            displaySuggestions(suggestions);
        } else {
            searchResults.innerHTML = '';
        }
    });

    function generateCreatureCode(creature) {
        let creatureCode = '';
        let level = parseInt(creatureLevelBox.value) || 300;

        if (tamedCheckbox.checked) {
            creatureCode = creature.tameSummon + ` ${level}`;
            if (cryopodCheckbox.checked) {
                creatureCode += `|cheat gfi cryopod_mod 1 0 0`;
            }
        } else {
            const spawnCoords = `${spawnXBox.value} ${spawnYBox.value} ${spawnZBox.value}`;
            creatureCode = creature.wildSummon + ` ${spawnCoords} ${level}`;
        }

        creatureCodeBox.value = creatureCode;
    }

    function updateMaxLevel() {
        if (selectedCreature) {
            creatureLevelBox.value = selectedCreature.maxLevel;
        }
    }

    function handleCheckboxChanges() {
        if (maxLevelCheckbox.checked) {
            creatureLevelBox.disabled = true;
            updateMaxLevel();
        } else {
            creatureLevelBox.disabled = false;
        }
        generateCreatureCodeBasedOnChecks();
    }

    function generateCreatureCodeBasedOnChecks() {
        if (selectedCreature) {
            generateCreatureCode(selectedCreature);
        }
    }

    maxLevelCheckbox.addEventListener('change', handleCheckboxChanges);
    tamedCheckbox.addEventListener('change', generateCreatureCodeBasedOnChecks);
    cryopodCheckbox.addEventListener('change', generateCreatureCodeBasedOnChecks);

    tamedCheckbox.addEventListener('change', () => {
        const isTamed = tamedCheckbox.checked;
        spawnXBox.disabled = isTamed;
        spawnYBox.disabled = isTamed;
        spawnZBox.disabled = isTamed;

        if (isTamed) {
            cryopodCheckbox.disabled = false;
        } else {
            cryopodCheckbox.checked = false;
            cryopodCheckbox.disabled = true;
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchResults.contains(event.target) && event.target !== searchBox) {
            searchResults.innerHTML = '';
        }
    });

    creatureLevelBox.addEventListener('input', () => {
        if (selectedCreature) {
            generateCreatureCode(selectedCreature);
        }
    });

    if (maxLevelCheckbox.checked) {
        creatureLevelBox.disabled = true;
        updateMaxLevel();
    }

    function updateSaddleOptions(creature) {
        saddleDropdown.innerHTML = "";
        saddleDropdown.disabled = false;
        
        const defaultOption = document.createElement("option");
        defaultOption.value = "None";
        defaultOption.textContent = "None";
        saddleDropdown.appendChild(defaultOption);

        creature.saddles.forEach(saddle => {
            if (saddle.code !== "NA") {
                const option = document.createElement("option");
                option.value = saddle.code;
                option.textContent = saddle.name;
                saddleDropdown.appendChild(option);
            }
        });
    }
    
    saddleDropdown.addEventListener("change", updateSaddleCode);
    quantityBox.addEventListener("input", validateFields);
    qualityBox.addEventListener("input", validateFields);

    function updateSaddleCode() {
        const selectedSaddle = saddleDropdown.value;
        const quantity = Math.max(1, parseInt(quantityBox.value) || 1);
        const quality = Math.min(100, Math.max(0, parseInt(qualityBox.value) || 0));
        
        if (selectedSaddle !== "None") {
            saddleCodeBox.value = `${selectedSaddle} ${quantity} ${quality}`;
        } else {
            saddleCodeBox.value = "";
        }
    }

    function validateFields() {
        if (quantityBox.value < 1) quantityBox.value = 1;
        if (qualityBox.value < 0) qualityBox.value = 0;
        if (qualityBox.value > 100) qualityBox.value = 100;
        updateSaddleCode();
    }
});
