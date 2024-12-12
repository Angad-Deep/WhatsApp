document.addEventListener("DOMContentLoaded", () => {
    insertHeaderAndMenu();
    insertFooter();
    initializeMenuToggle();
});

function insertHeaderAndMenu() {
    const headerPlaceholder = document.getElementById("header");
    const inHeaderPlaceholder = document.getElementById("in-header");

    // Check if header placeholder exists
    if (headerPlaceholder) {
        fetch("header.html") // Load the universal header
            .then(response => response.text())
            .then(headerData => {
                headerPlaceholder.innerHTML = headerData;

                // After header is set, insert the menu
                const menuPlaceholder = document.getElementById("main-menu");
                if (menuPlaceholder) {
                    fetch("menu.html") // Load the universal menu
                        .then(response => response.text())
                        .then(menuData => {
                            menuPlaceholder.innerHTML = menuData;

                            // After loading the menu, initialize listeners
                            initializeMenuListeners();
                            setupCameraListener();
                            updateHeaderVisibility();
                        })
                        .catch(error => console.error("Error loading menu:", error));
                } else {
                    console.error("Menu placeholder not found");
                }
            })
            .catch(error => console.error("Error loading header:", error));
    }

    // Check if in-header placeholder exists
    if (inHeaderPlaceholder) {
        fetch("in-chat-header.html") // Load the chat header
            .then(response => response.text())
            .then(headerData => {
                inHeaderPlaceholder.innerHTML = headerData;

                // After in-chat header is set, insert the chat menu
                const menuPlaceholder = document.getElementById("in-chat-menu");
                if (menuPlaceholder) {
                    fetch("chat-menu.html") // Load the chat menu
                        .then(response => response.text())
                        .then(menuData => {
                            menuPlaceholder.innerHTML = menuData;

                            // After loading the chat menu, initialize listeners
                            initializeMenuListeners();
                            setupCameraListener();
                        })
                        .catch(error => console.error("Error loading chat menu:", error));
                } else {
                    console.error("Chat menu placeholder not found");
                }
            })
            .catch(error => console.error("Error loading in-chat-header:", error));
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
    const currentPage = window.location.pathname.split("/").pop(); // Get the current page name
    if (currentPage === "james.html") {
        const chatMenuButton = document.getElementById("chat-menu");
        const inMenuContent = document.getElementById("in-menu-content");
        if (!chatMenuButton) {
            console.warn("Chat menu button not found.");
            return;
        }
        if (!inMenuContent) {
            console.warn("Menu content not found.");
            return;
        }
        chatMenuButton.addEventListener("click", toggleMenuMob);
    } else {
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
}

function toggleMenuMob() {
    const currentPage = window.location.pathname.split("/").pop(); // Get the current page name
    if (currentPage === "james.html") {
        const inMenuContent = document.getElementById("in-menu-content");
        if (!inMenuContent) {
            console.warn("Menu content not found.");
            return;
        }
        if (inMenuContent.style.display === 'block') {
            inMenuContent.style.display = 'none';
        } else {
            inMenuContent.style.display ='block';
        }

    } else {
        const menuContent = document.getElementById("menu-content");
        if (!menuContent) {
            console.warn("Menu content not found.");
            return;
        }
        if (menuContent.style.display === "block") {
            menuContent.style.display = "none";
        } else {
            menuContent.style.display = "block";
        }
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
let isCostume1 = true; // Variable to track the current costume

function changeCostume() {
    if (isCostume1) {
        document.getElementById("sprite").style.backgroundImage = "url('sprite2.png')";
    } else {
        document.getElementById("sprite").style.backgroundImage = "url('sprite1.png')";
    }
    isCostume1 = !isCostume1; // Toggle the costume
}

function initializeMenuToggle() {
    const observer = new MutationObserver(() => {
        const inMenuContent = document.getElementById("in-menu-content");
        const chatMenu = document.getElementById("chat-menu");

        if (inMenuContent && chatMenu) {
            console.log("#in-menu-content and #chat-menu found. Setting up event listener.");
            observer.disconnect(); // Stop observing once elements are found

            // Add the click listener to the body
            document.body.addEventListener("click", (event) => {
                if (
                    inMenuContent.style.display === "block" && // Menu is visible
                    !inMenuContent.contains(event.target) && // Click is outside #in-menu-content
                    !chatMenu.contains(event.target) // Click is outside #chat-menu
                ) {
                    console.log("Clicked outside #in-menu-content. Triggering #chat-menu click.");
                    chatMenu.click(); // Simulate a click to hide the menu
                }
            });
        } else {
            console.warn("#in-menu-content or #chat-menu not found. Observing DOM for changes.");
        }
    });

    // Observe the document body for dynamic content
    observer.observe(document.body, { childList: true, subtree: true });
}