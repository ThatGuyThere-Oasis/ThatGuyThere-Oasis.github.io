document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchCreature");
    const resultsContainer = document.getElementById("results");
    const levelInput = document.getElementById("level");
    const maxLevelCheckbox = document.getElementById("maxLevel");
    const tamedCheckbox = document.getElementById("tamed");
    const cryopodCheckbox = document.getElementById("cryopod");
    const spawnX = document.getElementById("spawnX");
    const spawnY = document.getElementById("spawnY");
    const spawnZ = document.getElementById("spawnZ");
    const creatureCodeBox = document.getElementById("creatureCode");
    const saddleDropdown = document.getElementById("saddleDropdown");
    const saddleCodeBox = document.getElementById("saddleCode");
    const creatureCodeWithSaddleBox = document.getElementById("creatureCodeWithSaddle");

    let creatureData = [];

    // Load Creature.json
    fetch("Creature.json")
        .then(response => response.json())
        .then(data => {
            creatureData = data.creatures;
        });

    // Search for creatures
    searchInput.addEventListener("input", function () {
        const searchValue = searchInput.value.toLowerCase();
        resultsContainer.innerHTML = "";

        if (searchValue) {
            const filteredCreatures = creatureData.filter(creature => creature.name.toLowerCase().includes(searchValue));

            filteredCreatures.forEach(creature => {
                const div = document.createElement("div");
                div.textContent = creature.name;
                div.classList.add("search-result");
                div.addEventListener("click", function () {
                    searchInput.value = creature.name;
                    resultsContainer.innerHTML = "";
                    selectCreature(creature);
                });
                resultsContainer.appendChild(div);
            });
        }
    });

    // Select creature and update relevant fields
    function selectCreature(creature) {
        if (!creature) return;

        // Set max level if checked
        if (maxLevelCheckbox.checked) {
            levelInput.value = creature.maxLevel;
            levelInput.disabled = true;
        } else {
            levelInput.disabled = false;
        }

        updateSaddleDropdown(creature);
        updateCreatureCode();
    }

    // Update Saddle Dropdown dynamically
    function updateSaddleDropdown(creature) {
        saddleDropdown.innerHTML = "";

        // Always include "None"
        const noneOption = document.createElement("option");
        noneOption.value = "None";
        noneOption.textContent = "None";
        saddleDropdown.appendChild(noneOption);

        const saddleTypes = ["saddle", "platformSaddle", "tekSaddle"];
        saddleTypes.forEach(type => {
            if (creature[type] && creature[type] !== "NA") {
                const option = document.createElement("option");
                option.value = creature[type];
                option.textContent = type.replace("Saddle", " Saddle");
                saddleDropdown.appendChild(option);
            }
        });

        saddleDropdown.value = "None";
        updateSaddleCode();
    }

    // Update Creature Code dynamically
    function updateCreatureCode() {
        const selectedCreature = creatureData.find(creature => creature.name === searchInput.value);
        if (!selectedCreature) return;

        let creatureCode = "";

        if (tamedCheckbox.checked) {
            creatureCode = selectedCreature.tameSummon + levelInput.value;
            cryopodCheckbox.disabled = false; // Allow toggling Cryopod when tamed
        } else {
            creatureCode = `${selectedCreature.wildSummon} ${spawnX.value} ${spawnY.value} ${spawnZ.value} ${levelInput.value}`;
            cryopodCheckbox.checked = false;
            cryopodCheckbox.disabled = true; // Disable Cryopod when not tamed
        }

        if (tamedCheckbox.checked && cryopodCheckbox.checked) {
            creatureCode += "|cheat gfi cryopod_mod 1 0 0";
        }

        creatureCodeBox.value = creatureCode;
        updateCreatureCodeWithSaddle();
    }

    // Update Saddle Code dynamically
    function updateSaddleCode() {
        if (saddleDropdown.value === "None") {
            saddleCodeBox.value = "";
        } else {
            saddleCodeBox.value = saddleDropdown.value;
        }

        updateCreatureCodeWithSaddle();
    }

    // Update combined Creature Code With Saddle
    function updateCreatureCodeWithSaddle() {
        const creatureCode = creatureCodeBox.value;
        const saddleCode = saddleCodeBox.value;
        creatureCodeWithSaddleBox.value = saddleCode ? `${creatureCode}|${saddleCode}` : creatureCode;
    }

    // Event Listeners for dynamic updates
    maxLevelCheckbox.addEventListener("change", function () {
        const selectedCreature = creatureData.find(creature => creature.name === searchInput.value);
        if (!selectedCreature) return;

        if (maxLevelCheckbox.checked) {
            levelInput.value = selectedCreature.maxLevel;
            levelInput.disabled = true;
        } else {
            levelInput.disabled = false;
        }
        updateCreatureCode();
    });

    levelInput.addEventListener("input", updateCreatureCode);
    spawnX.addEventListener("input", updateCreatureCode);
    spawnY.addEventListener("input", updateCreatureCode);
    spawnZ.addEventListener("input", updateCreatureCode);
    tamedCheckbox.addEventListener("change", function () {
        if (tamedCheckbox.checked) {
            spawnX.disabled = spawnY.disabled = spawnZ.disabled = true;
            cryopodCheckbox.disabled = false;
        } else {
            spawnX.disabled = spawnY.disabled = spawnZ.disabled = false;
            cryopodCheckbox.checked = false;
            cryopodCheckbox.disabled = true;
        }
        updateCreatureCode();
    });
    cryopodCheckbox.addEventListener("change", updateCreatureCode);
    saddleDropdown.addEventListener("change", updateSaddleCode);
});

// Copy buttons
function copyToClipboard(elementId) {
    const copyText = document.getElementById(elementId);
    copyText.select();
    document.execCommand("copy");
}
