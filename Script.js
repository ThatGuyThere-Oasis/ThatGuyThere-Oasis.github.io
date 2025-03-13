document.addEventListener("DOMContentLoaded", () => {
    loadCreatures();
});

// Tab Switching Logic
function switchTab(evt, tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Load Creature Data
let creatureData = [];
async function loadCreatures() {
    const response = await fetch("Creature.json");
    creatureData = await response.json();
}

// Live Search
document.getElementById("search-creature").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const results = creatureData.filter(creature => creature.name.toLowerCase().includes(searchValue));
    
    let resultsDiv = document.getElementById("search-results");
    resultsDiv.innerHTML = "";
    results.forEach(creature => {
        let div = document.createElement("div");
        div.textContent = creature.name;
        div.onclick = () => selectCreature(creature);
        resultsDiv.appendChild(div);
    });
});

// Select Creature
function selectCreature(creature) {
    document.getElementById("creature-code").value = creature.tameSummon;
    let saddleDropdown = document.getElementById("saddle-dropdown");
    saddleDropdown.innerHTML = "<option value='None'>None</option>";

    if (creature.saddle !== "NA") saddleDropdown.innerHTML += `<option value="${creature.saddle}">${creature.saddle}</option>`;
    if (creature.platformSaddle !== "NA") saddleDropdown.innerHTML += `<option value="${creature.platformSaddle}">${creature.platformSaddle}</option>`;
    if (creature.tekSaddle !== "NA") saddleDropdown.innerHTML += `<option value="${creature.tekSaddle}">${creature.tekSaddle}</option>`;
}

// Copy to Clipboard
function copyToClipboard(id) {
    let copyText = document.getElementById(id);
    copyText.select();
    document.execCommand("copy");
}
