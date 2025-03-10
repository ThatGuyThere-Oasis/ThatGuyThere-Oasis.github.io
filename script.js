let creaturesData = {};

async function loadCreatureData() {
    try {
        const response = await fetch('creatures.json');
        creaturesData = await response.json();
    } catch (error) {
        console.error("Error loading creature data:", error);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadCreatureData();

    document.getElementById('spawnTamedCheckbox').addEventListener('change', updateCheatCommand);
    document.getElementById('searchCreature').addEventListener('input', updateCreatureList);
    document.getElementById('searchCreature').addEventListener('change', () => {
        updateCheatCommand();
        document.getElementById('creatureList').innerHTML = '';
    });

    document.getElementById('level').addEventListener('input', updateCheatCommand);
    document.getElementById('spawnX').addEventListener('input', updateCheatCommand);
    document.getElementById('spawnY').addEventListener('input', updateCheatCommand);
    document.getElementById('spawnZ').addEventListener('input', updateCheatCommand);
});

function updateCreatureList() {
    const query = document.getElementById('searchCreature').value.toLowerCase();
    const filteredCreatures = creaturesData.creatures.filter(creature =>
        creature.name.toLowerCase().includes(query)
    );
    document.getElementById('creatureList').innerHTML = filteredCreatures
        .map(creature => `<option value="${creature.name}">${creature.name}</option>`).join('');
}

function updateCheatCommand() {
    const creatureName = document.getElementById('searchCreature').value;
    const spawnX = document.getElementById('spawnX').value;
    const spawnY = document.getElementById('spawnY').value;
    const spawnZ = document.getElementById('spawnZ').value;
    const level = document.getElementById('level').value;
    const spawnAsTamed = document.getElementById('spawnTamedCheckbox').checked;

    const creature = creaturesData.creatures.find(creature => creature.name.toLowerCase() === creatureName.toLowerCase());
    if (creature) {
        let cheatCommand = spawnAsTamed
            ? `${creature.tameSummon} ${level}`
            : `${creature.wildSummon} ${spawnX} ${spawnY} ${spawnZ} ${level}`;
        
        document.getElementById('dinoCode').value = cheatCommand;
    }
}

function copyText(elementId) {
    const textBox = document.getElementById(elementId);
    textBox.select();
    document.execCommand("copy");
}
