const petCategoryInput = document.querySelector("#inputPetCategory");

// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Call setPetCategories function to populate the pet category dropdown
    await onFormLoad();
  } catch (error) {
    console.error("Error setting pet categories:", error);
  }
});

const onFormLoad = async () => {
  // Get all pet categories
  try {
    const categories = await getPetCategory();
    // Bind categories to the dropdown
    populateDropdown(categories);
  } catch (error) {
    showToast(error.message, "info");
  }
};

// API call
async function getPetCategory() {
  const petSearchUrl = `${CONFIG.API_BASE_URL}/pet-category`;

  // Option for post request for authorization
  const options = {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(petSearchUrl, options);

    // Response data
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// Function to populate the dropdown with categories
function populateDropdown(categories) {
  let html = "";
  categories.forEach((item) => {
    html += `<option value="${item.petCategoryId}"> ${item.description} </option>`;
  });
  petCategoryInput.innerHTML = html;

  // Set default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Choose...";
  defaultOption.selected = true;
  petCategoryInput.prepend(defaultOption);

  // Refresh value of window.petCategoryId
  petCategoryInput.addEventListener("change", function () {
    window.petCategoryId = this.value;
  });
}
