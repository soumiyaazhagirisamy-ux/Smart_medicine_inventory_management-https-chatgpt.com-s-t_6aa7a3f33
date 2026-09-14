// Smart Medicine Inventory Management

let medicines = JSON.parse(localStorage.getItem("medicines")) || [];

function saveMedicines() {
    localStorage.setItem("medicines", JSON.stringify(medicines));
}

function addMedicine() {
    const name = document.getElementById("medicineName").value.trim();
    const quantity = Number(document.getElementById("quantity").value);
    const expiry = document.getElementById("expiryDate").value;
    const type = document.getElementById("medicineType").value;

    if (!name || !quantity || !expiry) {
        alert("Please fill all medicine details.");
        return;
    }

    const medicine = {
        id: Date.now(),
        name: name,
        quantity: quantity,
        expiry: expiry,
        type: type
    };

    medicines.push(medicine);
    saveMedicines();

    document.getElementById("medicineName").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("expiryDate").value = "";

    displayMedicines();
    updateDashboard();

    alert("Medicine added successfully!");
}

function deleteMedicine(id) {
    medicines = medicines.filter(medicine => medicine.id !== id);

    saveMedicines();
    displayMedicines();
    updateDashboard();
}

function searchMedicine() {
    const search = document
        .getElementById("searchMedicine")
        .value
        .toLowerCase();

    const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(search)
    );

    displayMedicines(filtered);
}

function displayMedicines(list = medicines) {
    const container = document.getElementById("medicineList");

    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML =
            "<p class='no-medicine'>No medicines found.</p>";
        return;
    }

    list.forEach(medicine => {

        const today = new Date();
        const expiryDate = new Date(medicine.expiry);

        let status = "In Stock";

        if (expiryDate < today) {
            status = "Expired";
        } else if (medicine.quantity <= 10) {
            status = "Low Stock";
        }

        const card = document.createElement("div");
        card.className = "medicine-card";

        card.innerHTML = `
            <div>
                <h3>💊 ${medicine.name}</h3>
                <p>Quantity: ${medicine.quantity}</p>
                <p>Type: ${medicine.type}</p>
                <p>Expiry: ${medicine.expiry}</p>
                <span class="status">${status}</span>
            </div>

            <button onclick="deleteMedicine(${medicine.id})">
                🗑 Delete
            </button>
        `;

        container.appendChild(card);
    });
}

function updateDashboard() {

    const total = medicines.length;

    const expired = medicines.filter(medicine =>
        new Date(medicine.expiry) < new Date()
    ).length;

    const lowStock = medicines.filter(medicine =>
        medicine.quantity > 0 &&
        medicine.quantity <= 10 &&
        new Date(medicine.expiry) >= new Date()
    ).length;

    const inStock = medicines.filter(medicine =>
        medicine.quantity > 10 &&
        new Date(medicine.expiry) >= new Date()
    ).length;

    if (document.getElementById("totalMedicines"))
        document.getElementById("totalMedicines").textContent = total;

    if (document.getElementById("inStock"))
        document.getElementById("inStock").textContent = inStock;

    if (document.getElementById("lowStock"))
        document.getElementById("lowStock").textContent = lowStock;

    if (document.getElementById("expired"))
        document.getElementById("expired").textContent = expired;
}

document.addEventListener("DOMContentLoaded", function () {
    displayMedicines();
    updateDashboard();
});
