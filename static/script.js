// ===============================
// Get HTML Elements
// ===============================

const textarea = document.getElementById("inputText");

const summarizeBtn = document.getElementById("summarizeBtn");

const loading = document.getElementById("loading");

const resultCard = document.getElementById("resultCard");

const summaryResult = document.getElementById("summaryResult");

const errorBox = document.getElementById("errorBox");

const copyBtn = document.getElementById("copyBtn");

const clearBtn = document.getElementById("clearBtn");

const charCount = document.getElementById("charCount");

// ===============================
// Character Counter
// ===============================

const MAX_CHARACTERS = 5000;

textarea.addEventListener("input", () => {

    const count = textarea.value.length;

    charCount.innerText = `${count} / ${MAX_CHARACTERS} characters`;

});

// ===============================
// Generate Summary
// ===============================

summarizeBtn.addEventListener("click", generateSummary);

async function generateSummary() {

    const text = textarea.value.trim();

    // Hide previous messages

    errorBox.classList.add("hidden");

    resultCard.classList.add("hidden");

    // Validation

    if (text.length === 0) {

        showError("Please enter some text.");

        return;

    }

    if (text.length > MAX_CHARACTERS) {

        showError("Maximum 5000 characters allowed.");

        return;

    }

    // Show loading

    loading.classList.remove("hidden");

    summarizeBtn.disabled = true;

    summarizeBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Generating...
    `;

    try {

        const response = await fetch("/summarize", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                text: text

            })

        });

        const data = await response.json();

        loading.classList.add("hidden");

        summarizeBtn.disabled = false;

        summarizeBtn.innerHTML = `
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Generate Summary
        `;

        if (data.success) {

            summaryResult.innerText = data.summary;

            resultCard.classList.remove("hidden");

        } else {

            showError(data.error);

        }

    } catch (error) {

        loading.classList.add("hidden");

        summarizeBtn.disabled = false;

        summarizeBtn.innerHTML = `
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Generate Summary
        `;

        showError("Unable to connect to the server.");

    }

}

// ===============================
// Show Error
// ===============================

function showError(message) {

    errorBox.innerText = message;

    errorBox.classList.remove("hidden");

}

// ===============================
// Copy Summary
// ===============================

copyBtn.addEventListener("click", () => {

    navigator.clipboard.writeText(summaryResult.innerText);

    copyBtn.innerHTML = `
        <i class="fa-solid fa-check"></i>
        Copied!
    `;

    setTimeout(() => {

        copyBtn.innerHTML = `
            <i class="fa-regular fa-copy"></i>
            Copy Summary
        `;

    }, 2000);

});

// ===============================
// Clear Text
// ===============================

clearBtn.addEventListener("click", () => {

    textarea.value = "";

    summaryResult.innerHTML = `
        <div class="placeholder">

            <i class="fa-regular fa-file-lines"></i>

            <h3>Your summary will appear here</h3>

            <p>
                Paste your text above and click
                <strong>Generate Summary</strong>
            </p>

        </div>
    `;

    resultCard.classList.add("hidden");

    errorBox.classList.add("hidden");

    charCount.innerText = `0 / ${MAX_CHARACTERS} characters`;

});

// ===============================
// Ctrl + Enter Shortcut
// ===============================

textarea.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key === "Enter") {

        generateSummary();

    }

});