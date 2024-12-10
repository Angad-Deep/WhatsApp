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
    console.log("Running updateHeaderVisibility");

    const whatsappHeading = document.querySelector(".whatsapp");
    const statusPgHeading = document.querySelector(".status-pg");
    const commPgHeading = document.querySelector(".comm-pg");
    const callPgHeading = document.querySelector(".call-pg");

    console.log("Header Elements Found:", { whatsappHeading, statusPgHeading, commPgHeading, callPgHeading });

    if (!whatsappHeading || !statusPgHeading || !commPgHeading || !callPgHeading) {
        console.error("Failed to find header elements.");
        return;
    }

    const pageName = window.location.pathname.split("/").pop().toLowerCase();
    console.log("Current Page:", pageName);

    // Hide all headings by default
    const headings = [whatsappHeading, statusPgHeading, commPgHeading, callPgHeading];
    headings.forEach(heading => {
        heading.style.display = "none";
    });

    // Show the relevant heading only based on the current page
    if (pageName === "calls.html") {
        console.log("Showing Calls Heading");
        callPgHeading.style.display = "block";
    } else if (pageName === "updates.html") {
        console.log("Showing Updates Heading");
        statusPgHeading.style.display = "block";
    } else if (pageName === "community.html") {
        console.log("Showing Communities Heading");
        commPgHeading.style.display = "block";
    } else if (pageName === "" || pageName === "index.html") {
        console.log("Showing WhatsApp Heading");
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
