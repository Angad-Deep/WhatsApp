document.addEventListener("DOMContentLoaded", () => {
    insertHeaderAndMenu();
    insertFooter();
});

function insertHeaderAndMenu() {
    const headerPlaceholder = document.getElementById("header");

    if (headerPlaceholder) {
        fetch("header.html")
            .then(response => response.text())
            .then(headerData => {
                headerPlaceholder.innerHTML = headerData;

                // After header is set, wait and execute logic
                setTimeout(() => {
                    updateHeaderVisibility();
                }, 100); // Small delay to ensure DOM is ready

                const menuPlaceholder = document.getElementById("main-menu");
                if (menuPlaceholder) {
                    fetch("menu.html")
                        .then(response => response.text())
                        .then(menuData => {
                            menuPlaceholder.innerHTML = menuData;
                            initializeMenuListeners();
                            setupCameraListener();
                        })
                        .catch(error => console.error("Error loading menu:", error));
                }
            })
            .catch(error => console.error("Error loading header:", error));
    }
}

function updateHeaderVisibility() {

    const whatsappHeading = document.querySelector(".whatsapp");
    const statusPgHeading = document.querySelector(".status-pg");
    const commPgHeading = document.querySelector(".comm-pg");
    const callPgHeading = document.querySelector(".call-pg");
    const settingsPgHeading = document.querySelector(".settings-pg");


    if (!whatsappHeading || !statusPgHeading || !commPgHeading || !callPgHeading) {
        console.error("Failed to find header elements.");
        return;
    }

    const pageName = window.location.pathname.split("/").pop().toLowerCase();

    // Hide all headings by default
    const headings = [whatsappHeading, statusPgHeading, commPgHeading, callPgHeading];
    headings.forEach(heading => {
        heading.style.display = "none";
    });

    // Show the relevant heading only based on the current page
    if (pageName === "calls.html") {
        callPgHeading.style.display = "block";
    } else if (pageName === "updates.html") {
        statusPgHeading.style.display = "block";
    } else if (pageName === "community.html") {
        commPgHeading.style.display = "block";
    } else if (pageName === "settings.html") {
        settingsPgHeading.style.display = "block";
    } else if (pageName === "" || pageName === "index.html") {
        whatsappHeading.style.display = "block";
    } else {
        console.warn("No matching page found.");
    }
}

function setupCameraListener() {
    const camButton = document.querySelector(".cam");
    const videoElement = document.getElementById("video");
    const captureButton = document.getElementById("capture-circle");

    if (camButton) {
        camButton.addEventListener("click", async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoElement.srcObject = stream;
                videoElement.style.display = "block";

                if (captureButton) {
                    captureButton.style.display = "block";

                    captureButton.onclick = async () => {
                        copyImageToClipboard(videoElement);
                    };
                }
            } catch (error) {
                console.error("Camera access error:", error);
                alert("Unable to access the camera. Please allow camera permissions.");
            }
        });
    }
}

async function copyImageToClipboard(videoElement) {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    
    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob
            })
        ]);
        alert("Image successfully copied to clipboard!");
    } catch (error) {
        console.error("Failed to copy image to clipboard", error);
        alert("Unable to copy image to clipboard.");
    }
}

function insertFooter() {
    const footerPlaceholder = document.getElementById("footer");

    if (footerPlaceholder) {
        fetch("footer.html")
            .then(response => response.text())
            .then(footerData => {
                footerPlaceholder.innerHTML = footerData;
            })
            .catch(error => console.error("Error loading footer:", error));
    }
}

// Menu toggle logic
let menuVisible = false;

function initializeMenuListeners() {
    const menuButton = document.getElementById("menu");
    const menuContent = document.getElementById("menu-content");

    if (!menuButton) {
        console.warn("Menu button not found.");
        return;
    }

    if (!menuContent) {
        console.warn("Menu content not found.");
        return;
    }

    menuButton.addEventListener("click", toggleMenuMob);
}

function toggleMenuMob() {
    const menuContent = document.getElementById("menu-content");

    if (!menuContent) {
        console.error("Menu content not found.");
        return;
    }

    if (menuContent.style.display === "block") {
        menuContent.style.display = "none";
    } else {
        menuContent.style.display = "block";
    }
}
let no_chats = true; // Global variable

// Common event listener for new-chat, new-call, and back-btn
document.addEventListener('click', function(event) {
    // If the clicked element is .new-chat or .new-call
    if (event.target.closest('.new-chat') || event.target.closest('.new-call')) {
        // Hide all elements except footer and the search container
        document.querySelectorAll('body > *:not(#footer):not(#search)').forEach(el => {
            el.classList.add('hidden'); // Add 'hidden' to other elements
        });

        const newContent = document.getElementById('search');
        const contentFile = event.target.closest('.new-call') 
            ? 'search-page.html' // For .new-call, use calls.html
            : 'search-page.html'; // For .new-chat, use search-page.html

        // Fetch and insert the content into #search
        fetch(contentFile)
            .then(response => {
                if (!response.ok) throw new Error('Failed to load the content');
                return response.text();
            })
            .then(html => {
                newContent.innerHTML = html; // Insert fetched HTML content into #search
                newContent.classList.remove('hidden'); // Remove 'hidden' class
                newContent.style.display = 'block'; // Explicitly set display to 'block'
            })
            .catch(error => {
                console.error(`Error loading ${contentFile}:`, error);
            });
    }

    // If the clicked element is #back-btn
    if (event.target.closest('#back-btn')) {
        if (no_chats) {
            // Hide the search/new-content div
            const newContent = document.querySelector('.new-content');
            newContent.classList.add('hidden');
            newContent.style.display = 'none';

            // Show everything else in the body
            document.querySelectorAll('body > *:not(#search)').forEach(el => {
                el.classList.remove('hidden');
                el.style.display = ''; // Reset to default display
            });
        }
    }
});
