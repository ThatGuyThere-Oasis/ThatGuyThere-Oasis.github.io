	<script>
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("creatureSearch");
    const searchResults = document.getElementById("searchResults");
    const creatureCode = document.getElementById("creatureCode");
    const saddleCode = document.getElementById("saddleCode");
    const creatureSaddleCode = document.getElementById("creatureSaddleCode");
    const levelInput = document.getElementById("creatureLevel");
    const maxLevel = document.getElementById("maxLevel");
    const tamed = document.getElementById("tamed");
    const cryopod = document.getElementById("cryopod");
    const spawnX = document.getElementById("spawnX");
    const spawnY = document.getElementById("spawnY");
    const spawnZ = document.getElementById("spawnZ");
    const saddleDropdown = document.getElementById("saddleDropdown");
    const saddleQuantity = document.getElementById("saddleQuantity");
    const saddleQuality = document.getElementById("saddleQuality");
    
    let creatures = [];
    
    fetch("Creature.json")
        .then(response => response.json())
        .then(data => creatures = data);

    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        searchResults.innerHTML = "";
        if (query.length > 0) {
            creatures.filter(creature => creature.name.toLowerCase().includes(query))
                .forEach(creature => {
                    const item = document.createElement("div");
                    item.classList.add("list-group-item", "list-group-item-action");
                    item.textContent = creature.name;
                    item.addEventListener("click", function () {
                        searchInput.value = creature.name;
                        updateCreatureCode(creature);
                        searchResults.innerHTML = "";
                    });
                    searchResults.appendChild(item);
                });
        }
    });

    function updateCreatureCode(creature) {
        let code = tamed.checked ? creature.tameSummon : creature.wildSummon;
        code +=  ${levelInput.value};
        if (!tamed.checked) {
            code +=  ${spawnX.value} ${spawnY.value} ${spawnZ.value};
        }
        if (cryopod.checked && tamed.checked) {
            code += " |cheat gfi cryopod_mod 1 0 0";
        }
        creatureCode.value = code;
        updateSaddleCode(creature);
    }

    function updateSaddleCode(creature) {
        const selectedSaddle = saddleDropdown.value;
        if (selectedSaddle !== "None" && creature.saddles[selectedSaddle]) {
            let code = creature.saddles[selectedSaddle];
            code +=  ${saddleQuantity.value} ${saddleQuality.value};
            saddleCode.value = code;
        } else {
            saddleCode.value = "";
        }
        creatureSaddleCode.value = creatureCode.value + (saddleCode.value ?  | ${saddleCode.value} : "");
    }
    
    maxLevel.addEventListener("change", function () {
        levelInput.disabled = this.checked;
        if (this.checked) {
            fetch("Creature.json")
                .then(response => response.json())
                .then(data => {
                    const creature = data.find(c => c.name === searchInput.value);
                    if (creature) levelInput.value = creature.maxLevel;
                    updateCreatureCode(creature);
                });
        }
    });

    tamed.addEventListener("change", function () {
        cryopod.disabled = !this.checked;
        spawnX.disabled = spawnY.disabled = spawnZ.disabled = this.checked;
        const creature = creatures.find(c => c.name === searchInput.value);
        if (creature) updateCreatureCode(creature);
    });
    
    saddleDropdown.addEventListener("change", function () {
        const creature = creatures.find(c => c.name === searchInput.value);
        if (creature) updateSaddleCode(creature);
    });
    
    saddleQuantity.addEventListener("input", function () {
        const creature = creatures.find(c => c.name === searchInput.value);
        if (creature) updateSaddleCode(creature);
    });
    
    saddleQuality.addEventListener("input", function () {
        const creature = creatures.find(c => c.name === searchInput.value);
        if (creature) updateSaddleCode(creature);
    });

    function copyText(id) {
        const copyText = document.getElementById(id);
        copyText.select();
        document.execCommand("copy");
    }
});

	<script>

</body>
</html>
