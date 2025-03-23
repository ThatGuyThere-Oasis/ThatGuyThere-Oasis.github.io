document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById('creatureSearch');
    const searchResults = document.getElementById('searchResults');
    let creatureData = [];

    // Fetch the creature data from the JSON file
    fetch('Creature.json')
        .then(response => response.json())
        .then(data => {
            creatureData = data.creatures; // Assuming the JSON has a 'creatures' array
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
        const creatureCodeBox = document.getElementById('creatureCode');
        creatureCodeBox.value = creature.wildSummon; // Default to wildSummon code for now
    }

    // Hide search results when clicking outside
    document.addEventListener('click', (event) => {
        if (!searchResults.contains(event.target) && event.target !== searchBox) {
            searchResults.innerHTML = ''; // Hide suggestions if clicked outside
        }
    });
});
