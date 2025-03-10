fetch('data/creatures.json')
    .then(response => response.json())
    .then(data => {
        const creaturesData = data.creatures;
        const searchBox = document.getElementById('searchCreature');
        const dataList = document.getElementById('creatureList');

        searchBox.addEventListener('input', function() {
            let query = this.value.toLowerCase();
            let filteredCreatures = creaturesData.filter(creature =>
                creature.name.toLowerCase().includes(query)
            );
            dataList.innerHTML = filteredCreatures.map(creature => 
                `<option value="${creature.name}">${creature.name}</option>`
            ).join('');
        });

        searchBox.addEventListener('change', function() {
            let creature = creaturesData.find(c => c.name.toLowerCase() === this.value.toLowerCase());
            if (creature) {
                document.getElementById('dinoCode').value = creature.wildSummon;
            }
        });
    })
    .catch(error => console.error("Error loading creature data:", error));

function copyText(elementId) {
    let inputElement = document.getElementById(elementId);
    inputElement.select();
    document.execCommand("copy");
    alert(`${elementId} copied to clipboard!`);
}
