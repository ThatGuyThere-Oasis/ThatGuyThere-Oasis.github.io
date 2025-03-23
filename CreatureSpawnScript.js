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
    
    let creatureData = [];

    // Fetch the creature data from the JSON file
    fetch('Creature.json')
        .then(response => response.json())
        .then(data => {
            creatureData = data.creatures;
        })
        .catch(error => console.error('Error loading creature data:', error));

    // Function to filter creatures based on the input query
    function filterCreatures(query) {
        const filtered = creatureData.filter(creature => 
            creature.name.toLowerCase().includes(query.toLowerCase())
        );
        return filtered;
    }

    // Function to display suggestions below the search box
    function displaySuggestions(suggestions) {
        searchResults.innerHTML = ''; // Clear previous results
        if (suggestions.length > 0) {
            suggestions.forEach(creature => {
                const suggestionItem = document.createElement('button');
                suggestionItem.classList.add('list-group-item', 'list-group-item-action');
                suggestionItem.textContent = creature.name;
                suggestionItem.onclick = () => {
                    searchBox.value = creature.name;  // Autofill the search box with the selected name
                    searchResults.innerHTML = '';     // Clear suggestions after selection
                    generateCreatureCode(creature);  // Generate creature code
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

    // Event listener to handle input and filter the creatures
    searchBox.addEventListener('input', () => {
        const query = searchBox.value;
        if (query.length > 0) {
            const suggestions = filterCreatures(query);
            displaySuggestions(suggestions);
        } else {
            searchResults.innerHTML = ''; // Hide suggestions if input is empty
        }
    });

    // Function to generate creature code based on input options
    function generateCreatureCode(creature) {
        let creatureCode = '';
        let level = parseInt(creatureLevelBox.value) || 300;

        if (tamedCheckbox.checked) {
            creatureCode = creature.tameSummon + ` ${level}`;
            if (cryopodCheckbox.checked) {
                creatureCode += ' |cheat gfi cryopod_mod 1 0 0';
            }
        } else {
            const spawnCoords = `${spawnXBox.value} ${spawnYBox.value} ${spawnZBox.value}`;
            creatureCode = creature.wildSummon + ` ${spawnCoords} ${level}`;
        }

        creatureCodeBox.value = creatureCode;
    }

    // Handle checkbox changes (Max Level, Tamed, Cryopod)
    function handleCheckboxChanges() {
        if (maxLevelCheckbox.checked) {
            creatureLevelBox.disabled = true;
            creatureLevelBox.value = 300; // Use the maxLevel from creature data
        } else {
            creatureLevelBox.disabled = false;
        }
        generateCreatureCodeBasedOnChecks();
    }

    function generateCreatureCodeBasedOnChecks() {
        const selectedCreatureName = searchBox.value;
        const selectedCreature = creatureData.find(creature => creature.name === selectedCreatureName);
        if (selectedCreature) {
            generateCreatureCode(selectedCreature);
        }
    }

    maxLevelCheckbox.addEventListener('change', handleCheckboxChanges);
    tamedCheckbox.addEventListener('change', generateCreatureCodeBasedOnChecks);
    cryopodCheckbox.addEventListener('change', generateCreatureCodeBasedOnChecks);

    // Disable spawn distance when Tamed is checked
    tamedCheckbox.addEventListener('change', () => {
        const isTamed = tamedCheckbox.checked;
        spawnXBox.disabled = isTamed;
        spawnYBox.disabled = isTamed;
        spawnZBox.disabled = isTamed;
        cryopodCheckbox.disabled = isTamed; // Cryopod should be disabled when Tamed is unchecked
    });

    // Hide search results when clicking outside
    document.addEventListener('click', (event) => {
        if (!searchResults.contains(event.target) && event.target !== searchBox) {
            searchResults.innerHTML = ''; // Hide suggestions if clicked outside
        }
    });
});
