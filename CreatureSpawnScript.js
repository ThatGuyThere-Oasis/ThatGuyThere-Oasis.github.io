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
    const quantityBox = document.getElementById('quantity');
    const qualityBox = document.getElementById('quality');
    const creatureCodeWithSaddleBox = document.getElementById('creatureCodeWithSaddle');

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
                    handleTamedState();
                    generateCreatureCode();
                    updateSaddleDropdown(); // NEW: Update Saddle dropdown on creature select
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

    function generateCreatureCode() {
        if (!selectedCreature) return;

        let creatureCode = '';
        let level = parseInt(creatureLevelBox.value) || selectedCreature.maxLevel;

        if (tamedCheckbox.checked) {
            creatureCode = selectedCreature.tameSummon + `${level}`;
            if (cryopodCheckbox.checked) {
                creatureCode += `|cheat gfi cryopod_mod 1 0 0`;
            }
        } else {
            const spawnCoords = `${spawnXBox.value} ${spawnYBox.value} ${spawnZBox.value}`;
            creatureCode = selectedCreature.wildSummon + ` ${spawnCoords} ${level}`;
        }

        creatureCodeBox.value = creatureCode;
        generateCreatureCodeWithSaddle(); // NEW: Update full command
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
        generateCreatureCode();
    }

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

        generateCreatureCode();
    }

    function updateSaddleDropdown() {
        if (!selectedCreature) return;

        saddleDropdown.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = 'None';
        defaultOption.textContent = 'None';
        saddleDropdown.appendChild(defaultOption);

        ['saddle', 'platformSaddle', 'tekSaddle'].forEach(saddleType => {
            if (selectedCreature[saddleType] && selectedCreature[saddleType] !== 'NA') {
                const option = document.createElement('option');
                option.value = saddleType;
                option.textContent = saddleType.replace('Saddle', ' Saddle');
                saddleDropdown.appendChild(option);
            }
        });

        saddleDropdown.value = 'None';
        saddleCodeBox.value = '';
        generateCreatureCodeWithSaddle();
    }

    function generateSaddleCode() {
        if (!selectedCreature) return '';

        let saddleType = saddleDropdown.value;
        if (saddleType === 'None') return '';

        let quantity = Math.max(1, parseInt(quantityBox.value) || 1);
        let quality = Math.min(100, Math.max(0, parseInt(qualityBox.value) || 0));

        return `${selectedCreature[saddleType]} ${quantity} ${quality} 0`;
    }

    function generateCreatureCodeWithSaddle() {
        let creatureCode = creatureCodeBox.value;
        let saddleCode = generateSaddleCode();

        if (saddleCode) {
            creatureCode += `|${saddleCode}`;
        }

        creatureCodeWithSaddleBox.value = creatureCode;
    }

    maxLevelCheckbox.addEventListener('change', handleCheckboxChanges);
    tamedCheckbox.addEventListener('change', handleTamedState);
    cryopodCheckbox.addEventListener('change', generateCreatureCode);
    creatureLevelBox.addEventListener('input', generateCreatureCode);
    saddleDropdown.addEventListener('change', generateCreatureCodeWithSaddle);
    quantityBox.addEventListener('input', generateCreatureCodeWithSaddle);
    qualityBox.addEventListener('input', generateCreatureCodeWithSaddle);

    if (maxLevelCheckbox.checked) {
        creatureLevelBox.disabled = true;
        updateMaxLevel();
    }

    handleTamedState();
});
