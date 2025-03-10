<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oasis Gaming Admin Commands</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #2a3b44;
            color: white;
            text-align: center;
        }

        .navbar {
            background-color: #1c2a30;
            padding: 5px;
            font-size: 14px;
        }

        .button-group {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin: 5px 0;
        }
        .button {
            padding: 5px;
            background: #3e4e58;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            font-size: 12px;
        }

        .tabs {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin-top: 5px;
        }
        .tab-button {
            padding: 5px;
            background: #3e4e58;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 12px;
            border-radius: 4px 4px 0 0;
        }
        .tab-button.active {
            background: #1c2a30;
        }

        .tab-content {
            display: none;
            background: #1c2a30;
            padding: 8px;
            border-radius: 0 0 8px 8px;
            font-size: 14px;
        }
        .tab-content.active {
            display: block;
        }

        .input-group {
            display: flex;
            justify-content: center;
            gap: 4px;
            margin: 5px 0;
        }
        .input-box {
            width: 60%;
            max-width: 220px;
            padding: 5px;
            font-size: 12px;
        }

        .copy-btn {
            padding: 5px;
            font-size: 12px;
            background: #3e4e58;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }

        .highlight-box {
            background: #3e4e58;
            padding: 5px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .highlight-box input, .highlight-box select {
            padding: 4px;
            font-size: 12px;
            border-radius: 4px;
            border: none;
            width: 50px;
        }

        .spawn-distance-group {
            display: flex;
            justify-content: center;
            gap: 10px;
        }

        .order-btn {
            margin-top: 8px;
            padding: 6px 10px;
            font-size: 12px;
            background: #4caf50;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }

        .spawn-distance-group input {
            width: 40px;
        }

        .search-creature-box {
            width: 80%;
            max-width: 240px;
            padding: 5px;
            font-size: 12px;
        }
    </style>
</head>
<body>

    <div class="button-group">
        <button class="button">Creature Data</button>
        <button class="button" disabled>Item Data</button>
        <button class="button" disabled>Admin Commands</button>
    </div>

    <div class="navbar">
        <h2>Oasis Gaming Admin Commands</h2>
    </div>

    <div class="tabs">
        <button class="tab-button active" onclick="openTab(event, 'creatureSpawn')">Creature Spawn</button>
        <button class="tab-button" onclick="openTab(event, 'itemSpawns')">Item Spawns</button>
        <button class="tab-button" onclick="openTab(event, 'adminCommands')">Admin Commands</button>
        <button class="tab-button" onclick="openTab(event, 'showOrder')">Show Order</button>
    </div>

    <div id="creatureSpawn" class="tab-content active">
        <input type="text" class="search-creature-box" id="searchCreature" placeholder="Type to search for creatures..." list="creatureList">

        <!-- Create a list for the datalist options dynamically -->
        <datalist id="creatureList"></datalist>

        <div class="input-group">
            <input type="text" class="input-box" id="dinoCode" placeholder="Dino Code" readonly>
            <button class="copy-btn" onclick="copyText('dinoCode')">Copy Creature Code</button>
        </div>

        <div class="input-group">
            <input type="text" class="input-box" id="saddleCode" placeholder="Saddle Code" readonly>
            <button class="copy-btn" onclick="copyText('saddleCode')">Copy Saddle Code</button>
        </div>

        <!-- Spawn as Tamed checkbox -->
        <div class="highlight-box">
            <label>
                <input type="checkbox" id="spawnTamedCheckbox" checked> Spawn as Tamed
            </label>
        </div>

        <!-- Level section -->
        <div class="highlight-box">
            <label>Level:
                <input type="number" id="level" value="60">
            </label>
        </div>

        <!-- Spawn Distance section -->
        <div class="highlight-box">
            <label>Spawn Distance:</label>
            <div class="spawn-distance-group">
                <label>X: <input type="number" id="spawnX" value="500"></label>
                <label>Y: <input type="number" id="spawnY" value="0"></label>
                <label>Z: <input type="number" id="spawnZ" value="0"></label>
            </div>
        </div>

        <!-- Button to add to order -->
        <button class="order-btn">Add To Order</button>
    </div>

    <div id="itemSpawns" class="tab-content">
        <h3>Item Spawns</h3>
        <p>Item spawn configuration goes here.</p>
    </div>

    <div id="adminCommands" class="tab-content">
        <h3>Admin Commands</h3>
        <p>Admin command settings go here.</p>
    </div>

    <div id="showOrder" class="tab-content">
        <h3>Show Order</h3>
        <p>Orders will be displayed here.</p>
    </div>

<script>
// Creature data (JSON)
const creaturesData = {
    "creatures": [
        {
            "name": "Achatina",
            "wildSummon": "cheat SpawnDino \"Blueprint'/Game/PrimalEarth/Dinos/Achatina/Achatina_Character_BP.Achatina_Character_BP'\"",
            "tameSummon": "cheat gmsummon \"Achatina_Character_BP_C\"",
            "saddle": "NA",
            "platformSaddle": "NA"
        },
        {
            "name": "Rex",
            "wildSummon": "cheat SpawnDino \"Blueprint'/Game/PrimalEarth/Dinos/Rex/Rex_Character_BP.Rex_Character_BP'\"",
            "tameSummon": "cheat gmsummon \"Rex_Character_BP_C\"",
            "saddle": "NA",
            "platformSaddle": "NA"
        }
    ]
};

// Event listener for the "Spawn as Tamed" checkbox
document.getElementById('spawnTamedCheckbox').addEventListener('change', updateCheatCommand);

// Function to update the cheat command based on the selection and input values
function updateCheatCommand() {
    const creatureName = document.getElementById('searchCreature').value;
    const spawnX = document.getElementById('spawnX').value;
    const spawnY = document.getElementById('spawnY').value;
    const spawnZ = document.getElementById('spawnZ').value;
    const level = document.getElementById('level').value;
    const spawnAsTamed = document.getElementById('spawnTamedCheckbox').checked;

    // Find the selected creature
    const creature = creaturesData.creatures.find(creature => creature.name.toLowerCase() === creatureName.toLowerCase());

    if (creature) {
        let cheatCommand = '';
        if (spawnAsTamed) {
            cheatCommand = creature.tameSummon + ' ' + level;
        } else {
            cheatCommand = `${creature.wildSummon} ${spawnX} ${spawnY} ${spawnZ} ${level}`;
        }

        document.getElementById('dinoCode').value = cheatCommand; // Display in Dino Code box
    }
}

// Creature search functionality
document.getElementById('searchCreature').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const filteredCreatures = creaturesData.creatures.filter(creature =>
        creature.name.toLowerCase().includes(query)
    );
    const options = filteredCreatures.map(creature => `<option value="${creature.name}">${creature.name}</option>`);
    const datalist = document.getElementById('creatureList');
    datalist.innerHTML = options.join('');
});

// Close the datalist when a creature is selected
document.getElementById('searchCreature').addEventListener('change', function() {
    const datalist = document.getElementById('creatureList');
    datalist.innerHTML = ''; // Clear datalist after selection
    updateCheatCommand(); // Generate the code immediately
});

// Automatically update code on level or spawn coordinate change
document.getElementById('level').addEventListener('input', updateCheatCommand);
document.getElementById('spawnX').addEventListener('input', updateCheatCommand);
document.getElementById('spawnY').addEventListener('input', updateCheatCommand);
document.getElementById('spawnZ').addEventListener('input', updateCheatCommand);

// Function to copy text to clipboard
function copyText(elementId) {
    const inputElement = document.getElementById(elementId);
    inputElement.select();
    inputElement.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    alert(`${elementId} copied to clipboard!`);
}

// Tab functionality
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

</script>

</body>
</html>
