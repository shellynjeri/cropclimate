
// ==========================================
// 1. SAMPLE AGRICULTURAL DATA
// ==========================================

const sampleData = {
    "Kiambu": {
        rainfall: 650,
        temperature: 24,
        moisture: 65,
        vegetation: 0.72
    },
    "Nakuru": {
        rainfall: 480,
        temperature: 27,
        moisture: 48,
        vegetation: 0.58
    },
    "Machakos": {
        rainfall: 350,
        temperature: 32,
        moisture: 30,
        vegetation: 0.38
    },
    "Meru": {
        rainfall: 720,
        temperature: 23,
        moisture: 70,
        vegetation: 0.78
    },
    "Makueni": {
        rainfall: 400,
        temperature: 31,
        moisture: 38,
        vegetation: 0.44
    },
    "Uasin Gishu": {
        rainfall: 800,
        temperature: 22,
        moisture: 75,
        vegetation: 0.82
    },
    "Kisumu": {
        rainfall: 900,
        temperature: 30,
        moisture: 68,
        vegetation: 0.70
    },
    "Kitui": {
        rainfall: 320,
        temperature: 33,
        moisture: 25,
        vegetation: 0.31
    }
};

const crops = [
    "Maize",
    "Beans",
    "Wheat",
    "Sorghum",
    "Rice",
    "Green grams",
    "Potatoes"
];

const counties = Object.keys(sampleData);


// ==========================================
// 2. POPULATE DROPDOWNS
// ==========================================

function populateDropdown() {
    const countyDropdowns = [
        document.getElementById("county"),
        document.getElementById("quickCounty")
    ];

    const cropDropdowns = [
        document.getElementById("crop"),
        document.getElementById("quickCrop")
    ];

    countyDropdowns.forEach(dropdown => {
        if (!dropdown) return;

        dropdown.innerHTML = '<option value="">Select County</option>';

        counties.forEach(county => {
            dropdown.innerHTML += `
                <option value="${county}">${county}</option>
            `;
        });
    });

    cropDropdowns.forEach(dropdown => {
        if (!dropdown) return;

        dropdown.innerHTML = '<option value="">Select Crop</option>';

        crops.forEach(crop => {
            dropdown.innerHTML += `
                <option value="${crop}">${crop}</option>
            `;
        });
    });
}


// ==========================================
// 3. NAVIGATION
// ==========================================

function openPage(pageName) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    const navButtons = document.querySelectorAll(".nav-btn");

    navButtons.forEach(button => {
        button.classList.remove("active");

        if (button.dataset.page === pageName) {
            button.classList.add("active");
        }
    });

    if (pageName === "history") {
        displayHistory();
    }

    if (pageName === "dashboard") {
        updateDashboard();
    }
}

document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", function() {
        openPage(this.dataset.page);
    });
});


// ==========================================
// 4. QUICK ASSESSMENT FORM
// ==========================================

document.getElementById("quickForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const county = document.getElementById("quickCounty").value;
    const crop = document.getElementById("quickCrop").value;
    const season = document.getElementById("quickSeason").value;

    if (!county || !crop || !season) {
        alert("Please fill in all the fields.");
        return;
    }

    document.getElementById("county").value = county;
    document.getElementById("crop").value = crop;
    document.getElementById("season").value = season;

    openPage("analyse");

    const button = this.querySelector("button[type='submit']");

    analyseCrop(county, crop, season, button);
});


// ==========================================
// 5. MAIN ANALYSIS FORM
// ==========================================

document.getElementById("analysisForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const county = document.getElementById("county").value;
    const crop = document.getElementById("crop").value;
    const season = document.getElementById("season").value;

    if (!county || !crop || !season) {
        alert("Please select a county, crop and season.");
        return;
    }

    const button = this.querySelector("button[type='submit']");

    analyseCrop(county, crop, season, button);
});


// ==========================================
// 6. CROP VULNERABILITY ANALYSIS
// ==========================================

async function analyseCrop(county, crop, season, button) {

    if (!button || button.disabled) return;

    const originalText = button.innerHTML;

    button.disabled = true;
    button.classList.add("loading");

    button.innerHTML = `
        <span class="spinner"></span>
        Analysing...
    `;

    try {

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const data = sampleData[county];

        if (!data) {
            throw new Error("Please select a valid county.");
        }

        // Calculate rainfall risk
        let rainfallRisk =
            data.rainfall < 400 ? 30 :
            data.rainfall < 500 ? 20 :
            data.rainfall > 850 ? 18 : 8;

        // Calculate temperature risk
        let temperatureRisk =
            data.temperature >= 32 ? 25 :
            data.temperature >= 29 ? 15 :
            data.temperature >= 27 ? 8 : 3;

        // Calculate soil moisture risk
        let moistureRisk =
            data.moisture < 30 ? 25 :
            data.moisture < 40 ? 19 :
            data.moisture < 50 ? 12 : 5;

        // Calculate vegetation risk
        let vegetationRisk =
            data.vegetation < 0.4 ? 15 :
            data.vegetation < 0.5 ? 10 :
            data.vegetation < 0.65 ? 6 : 2;

        // Calculate final vulnerability score
        const score = Math.min(
            100,
            rainfallRisk +
            temperatureRisk +
            moistureRisk +
            vegetationRisk
        );

        // Determine risk level
        let riskLevel;

        if (score >= 70) {
            riskLevel = "Very High";
        } else if (score >= 50) {
            riskLevel = "High";
        } else if (score >= 30) {
            riskLevel = "Moderate";
        } else {
            riskLevel = "Low";
        }

        // Identify vulnerability factors
        let factors = [];

        if (data.rainfall < 450) {
            factors.push("Low rainfall may affect crop water availability.");
        }

        if (data.rainfall > 850) {
            factors.push("High rainfall may increase waterlogging risk.");
        }

        if (data.temperature >= 30) {
            factors.push("High temperatures may cause heat stress.");
        }

        if (data.moisture < 40) {
            factors.push("Low soil moisture may affect crop growth.");
        }

        if (data.vegetation < 0.5) {
            factors.push("Low vegetation indicator suggests weaker crop condition.");
        }

        if (factors.length === 0) {
            factors.push("Sample climate indicators are generally favourable.");
        }

        // Generate recommendations
        let recommendations = [];

        if (data.rainfall < 450 || data.moisture < 40) {
            recommendations.push("Consider water harvesting and mulching.");
        }

        if (data.temperature >= 30) {
            recommendations.push("Consider heat-tolerant crop varieties.");
        }

        if (data.rainfall > 850) {
            recommendations.push("Improve field drainage to reduce waterlogging.");
        }

        if (data.vegetation < 0.5) {
            recommendations.push("Monitor crop condition regularly.");
        }

        if (recommendations.length === 0) {
            recommendations.push("Continue monitoring soil moisture and rainfall.");
        }

        // Store the analysis result
        const result = {
            county,
            crop,
            season,
            score,
            riskLevel,
            data,
            factors,
            recommendations,
            date: new Date().toLocaleString()
        };

        displayResults(result);

    } catch (error) {

        alert(error.message);

    } finally {

        button.disabled = false;
        button.classList.remove("loading");
        button.innerHTML = originalText;

    }
}


// ==========================================
// 7. DISPLAY ANALYSIS RESULTS
// ==========================================

function displayResults(result) {

    const resultsContainer = document.getElementById("results");

    let riskClass = result.riskLevel
        .toLowerCase()
        .replace(" ", "-");

    resultsContainer.innerHTML = `
        <div class="result-card">

            <h2>Crop Vulnerability Results</h2>

            <p><strong>County:</strong> ${result.county}</p>

            <p><strong>Crop:</strong> ${result.crop}</p>

            <p><strong>Season:</strong> ${result.season}</p>

            <p><strong>Date:</strong> ${result.date}</p>

            <hr>

            <h3>Climate Indicators</h3>

            <p>Rainfall: ${result.data.rainfall} mm</p>

            <p>Temperature: ${result.data.temperature} °C</p>

            <p>Soil Moisture: ${result.data.moisture}%</p>

            <p>Vegetation Indicator: ${result.data.vegetation}</p>

            <hr>

            <h2>Vulnerability Score</h2>

            <div class="risk-score">${result.score}/100</div>

            <div class="risk-level ${riskClass}">
                ${result.riskLevel} Risk
            </div>

            <hr>

            <h3>Factors Affecting Vulnerability</h3>

            <ul>
                ${result.factors.map(factor => `<li>${factor}</li>`).join("")}
            </ul>

            <h3>Recommended Adaptation Measures</h3>

            <ul>
                ${result.recommendations.map(item => `<li>${item}</li>`).join("")}
            </ul>

            <p class="prototype-note">
                Note: This is an illustrative result calculated using
                sample data. It is not an official agricultural forecast.
            </p>

            <button class="primary-btn" id="downloadReport">
                Download Report
            </button>

        </div>
    `;

    // Save result to browser history
    saveAssessment(result);

    // Download report button
    document.getElementById("downloadReport")
    .addEventListener("click", function() {
        downloadReport(result, this);
    });

    resultsContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================
// 8. SAVE ASSESSMENT TO LOCAL STORAGE
// ==========================================

function saveAssessment(result) {

    let history = JSON.parse(
        localStorage.getItem("cropClimateHistory")
    ) || [];

    history.unshift(result);

    localStorage.setItem(
        "cropClimateHistory",
        JSON.stringify(history)
    );

    displayHistory();
    updateDashboard();
}


// ==========================================
// 9. DISPLAY ASSESSMENT HISTORY
// ==========================================

function displayHistory() {

    const historyList = document.getElementById("historyList");

    if (!historyList) return;

    let history = JSON.parse(
        localStorage.getItem("cropClimateHistory")
    ) || [];

    if (history.length === 0) {

        historyList.innerHTML = `
            <p>No assessments have been recorded yet.</p>
        `;

        return;
    }

    historyList.innerHTML = history.map((item, index) => {

        let riskClass = item.riskLevel
            .toLowerCase()
            .replace(" ", "-");

        return `
            <div class="history-card">

                <h3>${item.county} - ${item.crop}</h3>

                <p>Season: ${item.season}</p>

                <p>Date: ${item.date}</p>

                <p>Score: ${item.score}/100</p>

                <span class="risk-level ${riskClass}">
                    ${item.riskLevel} Risk
                </span>

            </div>
        `;

    }).join("");
}


// ==========================================
// 10. UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    let history = JSON.parse(
        localStorage.getItem("cropClimateHistory")
    ) || [];

    const totalAssessments = document.getElementById("totalAssessments");
    const latestRisk = document.getElementById("latestRisk");
    const recentAssessments = document.getElementById("recentAssessments");

    if (totalAssessments) {
        totalAssessments.textContent = history.length;
    }

    if (latestRisk) {
        latestRisk.textContent = history.length > 0
            ? history[0].riskLevel
            : "No Data";
    }

    if (recentAssessments) {

        if (history.length === 0) {

            recentAssessments.innerHTML = `
                <p>No recent assessments available.</p>
            `;

        } else {

            recentAssessments.innerHTML = history
                .slice(0, 5)
                .map(item => `
                    <div class="recent-item">
                        <strong>${item.county}</strong>
                        - ${item.crop}
                        <span>${item.riskLevel} Risk</span>
                    </div>
                `).join("");

        }
    }
}


// ==========================================
// 11. CLEAR ASSESSMENT HISTORY
// ==========================================

const clearHistoryButton = document.getElementById("clearHistory");

if (clearHistoryButton) {

    clearHistoryButton.addEventListener("click", async function() {

        let history = JSON.parse(
            localStorage.getItem("cropClimateHistory")
        ) || [];

        if (history.length === 0) {
            alert("There is no history to clear.");
            return;
        }

        const confirmClear = confirm(
            "Are you sure you want to clear all assessment history?"
        );

        if (!confirmClear) return;

        const originalText = this.innerHTML;

        this.disabled = true;
        this.innerHTML = `
            <span class="spinner"></span>
            Clearing...
        `;

        try {

            await new Promise(resolve => setTimeout(resolve, 1000));

            localStorage.removeItem("cropClimateHistory");

            displayHistory();
            updateDashboard();

            alert("Assessment history cleared successfully.");

        } finally {

            this.disabled = false;
            this.innerHTML = originalText;

        }
    });
}


// ==========================================
// 12. DOWNLOAD ASSESSMENT REPORT
// ==========================================

async function downloadReport(result, button) {

    if (button.disabled) return;

    const originalText = button.innerHTML;

    button.disabled = true;

    button.innerHTML = `
        <span class="spinner"></span>
        Preparing Report...
    `;

    try {

        await new Promise(resolve => setTimeout(resolve, 1200));

        const report = `
CROPCLIMATE
AGRICULTURAL VULNERABILITY ASSESSMENT REPORT

----------------------------------------

County: ${result.county}
Crop: ${result.crop}
Season: ${result.season}
Assessment Date: ${result.date}

----------------------------------------

CLIMATE INDICATORS

Rainfall: ${result.data.rainfall} mm
Temperature: ${result.data.temperature} °C
Soil Moisture: ${result.data.moisture}%
Vegetation Indicator: ${result.data.vegetation}

----------------------------------------

VULNERABILITY RESULTS

Score: ${result.score}/100
Risk Level: ${result.riskLevel}

----------------------------------------

VULNERABILITY FACTORS

${result.factors.map(item => "- " + item).join("\n")}

----------------------------------------

ADAPTATION RECOMMENDATIONS

${result.recommendations.map(item => "- " + item).join("\n")}

----------------------------------------

DISCLAIMER

This report uses illustrative sample data.
It is not an official agricultural forecast.

CROPCLIMATE PROJECT
        `;

        const blob = new Blob(
            [report],
            { type: "text/plain" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `CropClimate_${result.county}_Report.txt`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    } catch (error) {

        alert("Unable to download the report.");

    } finally {

        button.disabled = false;
        button.innerHTML = originalText;

    }
}


// ==========================================
// 13. RESET ANALYSIS FORM
// ==========================================

const resetButton = document.querySelector("#analysisForm .reset-btn");

if (resetButton) {

    resetButton.addEventListener("click", function() {

        document.getElementById("analysisForm").reset();

        document.getElementById("results").innerHTML = "";

    });
}


// ==========================================
// 14. INITIALISE THE APPLICATION
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    populateDropdown();

    displayHistory();

    updateDashboard();

});
