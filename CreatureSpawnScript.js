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
    const saddleDropdown = document.getElementById('saddleDropdown');
    const saddleCodeBox = document.getElementById('saddleCode');
    const quantityBox = document.getElementById('quantityBox');
    const qualityBox = document.getElementById('qualityBox');
    
    let creatureData = [];
    let selectedCreature = null;

    fetch('Creature.json')
        .then(response => response.json())
        .then(data => {
            creatureData = data.creatures;
            populateSaddleDropdown();  // Populate the saddle dropdown after data is loaded
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
                    handleTamedState();  // Fix: Apply correct spawn distance behavior when a creature is picked
                    generateCreatureCode(creature);
                    populateSaddleDropdown();  // Repopulate the saddle dropdown when a creature is selected
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
            displaySuggestions(filterCreatures(query));
        } else {
            searchResults.innerHTML = ''; 
        }
    });

    function generateCreatureCode(creature) {
        let creatureCode = '';
        let level = parseInt(creatureLevelBox.value) || 300;

        if (tamedCheckbox.checked) {
            creatureCode = creature.tameSummon + ${level};
            if (cryopodCheckbox.checked) {
                creatureCode += |cheat gfi cryopod_mod 1 0 0;
            }
        } else {
            const spawnCoords = ${spawnXBox.value} ${spawnYBox.value} ${spawnZBox.value};
            creatureCode = creature.wildSummon +  ${spawnCoords} ${level};
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
    tamedCheckbox.addEventListener('change', handleTamedState);
    cryopodCheckbox.addEventListener('change', generateCreatureCodeBasedOnChecks);

    function handleTamedState() {
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

        generateCreatureCodeBasedOnChecks();
    }

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

    if (!tamedCheckbox.checked) {
        cryopodCheckbox.checked = false;
        cryopodCheckbox.disabled = true;
    }

    handleTamedState(); // Fix: Apply correct behavior on page load

    // Saddle Dropdown Population (Updated)
    function populateSaddleDropdown() {
        saddleDropdown.innerHTML = '<option value="none">None</option>';  // Start with "None" as default option

        if (selectedCreature) {
            // Check each saddle field and add them to the dropdown if they're not "NA"
            if (selectedCreature.saddle && selectedCreature.saddle !== "NA") {
                const option = document.createElement('option');
                option.value = selectedCreature.saddle;
                option.textContent = 'Saddle';
                saddleDropdown.appendChild(option);
            }

            if (selectedCreature.platformSaddle && selectedCreature.platformSaddle !== "NA") {
                const option = document.createElement('option');
                option.value = selectedCreature.platformSaddle;
                option.textContent = 'Platform Saddle';
                saddleDropdown.appendChild(option);
            }

            if (selectedCreature.tekSaddle && selectedCreature.tekSaddle !== "NA") {
                const option = document.createElement('option');
                option.value = selectedCreature.tekSaddle;
                option.textContent = 'Tek Saddle';
                saddleDropdown.appendChild(option);
            }
        }
    }

    // Handle Saddle Selection
    saddleDropdown.addEventListener('change', () => {
        const selectedSaddle = saddleDropdown.value;
        if (selectedSaddle !== "none") {
            const quantity = Math.max(1, parseInt(quantityBox.value) || 1);  // Default to 1 if quantity is invalid
            const quality = Math.max(0, Math.min(100, parseInt(qualityBox.value) || 0));  // Validate quality between 0 and 100
            const saddleCode = ${selectedSaddle} ${quantity} ${quality};
            saddleCodeBox.value = saddleCode;
        } else {
            saddleCodeBox.value = '';  // Clear the saddle code if "None" is selected
        }
    });

    // Validate quantity and quality input fields
    quantityBox.addEventListener('input', () => {
        const value = Math.max(1, parseInt(quantityBox.value) || 1);
        quantityBox.value = value;
    });

    qualityBox.addEventListener('input', () => {
        const value = Math.max(0, Math.min(100, parseInt(qualityBox.value) || 0));
        qualityBox.value = value;
    });
});
