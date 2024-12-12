document.addEventListener("DOMContentLoaded", () => {
    insertHTML("in-chat-header.html", "in-header").then(() => {
        insertHTML("menu.html", "in-chat-menu");
    });
});

function insertHTML(url, elementId) {
    const placeholder = document.getElementById(elementId);
    if (placeholder) {
        return fetch(url)
            .then(response => response.text())
            .then(data => {
                placeholder.innerHTML = data;
            })
            .catch(error => {
                console.error(`Error loading ${url}:`, error);
            });
    } else {
        console.error(`Element with ID ${elementId} not found`);
    }
}