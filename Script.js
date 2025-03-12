document.addEventListener('DOMContentLoaded', () => {
    // Cache elements for better performance
    const searchCreature = document.getElementById('searchCreature');
    const datalist = document.getElementById('creatureList');
    const levelInput = document.getElementById('level');
    const spawnTamedCheckbox = document.getElementById('spawnTamedCheckbox');
    const spawnCoords = ['spawnX', 'spawnY', 'spawnZ'].map(id => document.getElementById(id));
    const saddleType = document.getElementById('saddleType');
    const dinoCode = document.getElementById('dinoCode');
    const saddleCode = document.getElementById('saddleCode');

    let creaturesData = { creatures: [] }; // Stores creature data from JSON

    // 📥 Load Creature Data from External JSON File
    async function loadCreatureData() {
        try {
            const response = await fetch('Creature.json'); // Fetch JSON file
            creaturesData = await response.json(); // Convert response to JSON
            populateCreatureList(); // Populate dropdown with creature names
        } catch (error) {
            console.error("Error loading data:", error); // Log any errors
        }
    }

    // 📝 Populate the Creature Dropdown List for Autocomplete
    function populateCreatureList() {
        datalist.innerHTML = creaturesData.creatures
            .map(creature => `<option value="${creature.name}">${creature.name}</option>`)
            .join('');
    }

    // 🦖 Update Creature Spawn Command Based on Selection
    function updateCreatureCode() {
        const creature = creaturesData.creatures.find(c => c.name.toLowerCase() === searchCreature.value.toLowerCase());
        if (!creature) return; // Exit if no creature is found

        // Generate the correct spawn command
        dinoCode.value = spawnTamedCheckbox.checked
            ? `${creature.tameSummon} ${levelInput.value}` // Spawn tamed
            : `${creature.wildSummon} ${spawnCoords.map(i => i.value).join(' ')} ${levelInput.value}`; // Spawn wild
    }

    // 📋 Copy text to clipboard for commands
    function copyText(elementId) {
        const input = document.getElementById(elementId);
        navigator.clipboard.writeText(input.value);
        alert(`${elementId} copied!`);
    }

    // 🔄 Switch Tabs for Different Sections
    function openTab(evt, tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active')); // Hide all tabs
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active')); // Remove active state from all buttons
        document.getElementById(tabName).classList.add('active'); // Show selected tab
        evt.currentTarget.classList.add('active'); // Highlight selected button
    }

    // 📌 Event Listeners (Triggers on User Input)
    searchCreature.addEventListener('change', updateCreatureCode); // Update code when a creature is selected
    levelInput.addEventListener('input', updateCreatureCode); // Update code when level is changed
    spawnCoords.forEach(input => input.addEventListener('input', updateCreatureCode)); // Update when spawn coordinates change
    spawnTamedCheckbox.addEventListener('change', updateCreatureCode); // Update when Tamed checkbox is toggled

    loadCreatureData(); // Load data when the page is ready
});
