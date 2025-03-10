function loadTab(tabName) {
    fetch(`sections/${tabName}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('tabContent').innerHTML = data;
            loadScript(`js/${tabName}.js`);
        })
        .catch(error => console.error("Error loading the tab:", error));
}

function loadScript(scriptPath) {
    let script = document.createElement("script");
    script.src = scriptPath;
    script.defer = true;
    document.body.appendChild(script);
}

// Load default tab on page load
document.addEventListener("DOMContentLoaded", () => {
    loadTab("creatureSpawn");
});
