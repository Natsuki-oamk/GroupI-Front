import { Pet } from "./pet.js";

class Pets {
  #pets = [];

  registratePet = (formData) => {
    return new Promise(async (resolve, reject) => {
      fetch(CONFIG.API_BASE_URL + "/pet-registration", {
        method: "post",
        //headers: { "Content-Type": "application/form-data" },
        body: formData,
      })
        .then((response) => response.json())
        .then((json) => {
          resolve(
            this.#addToPetArray(
              json.id_pet,
              formData.id_pet_category,
              formData.breed,
              formData.colour,
              formData.weight,
              formData.ageyear,
              formData.agemonth,
              formData.vaccination,
              formData.vaccination_date,
              formData.vaccination_hospital_name,
              formData.description
            )
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  #addToPetArray = (formData) => {
    const {
      id_pet_category,
      breed,
      colour,
      weight,
      ageyear,
      agemonth,
      vaccination,
      vaccination_date,
      vaccination_hospital_name,
      description,
    } = formData;
    const pet = new Pet(
      id_pet_category,
      breed,
      colour,
      weight,
      ageyear,
      agemonth,
      vaccination,
      vaccination_date,
      vaccination_hospital_name,
      description
    );
    this.#pets.push(pet);
    return pet;
  };
}

export { Pets };
