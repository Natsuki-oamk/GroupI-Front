const BACKEND_ROOT_URL = `${CONFIG.API_BASE_URL}/`

//get pet ID from query param in url
const qryParams = new URLSearchParams(window.location.search);
const targetPetId = qryParams.get('petid'); //'1' // TODO: get pet id dynamically
const submit = document.getElementById('request-form');
const sendRequestButton = document.getElementById('send-request');

// Get all histories of the target user
const getPetInfo = async () => {
    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type" : "application/json" 
            }
        }

        // Get pet info and images
        const response = await fetch(BACKEND_ROOT_URL + 'request/' + targetPetId, options)
        const json = await response.json()
        if (response.ok) {
            if (json.length > 0) {
                // Set pet detail to table
                setInfos(json[0])
                //Set pet image
                setImage(json[0])
            }
        } else {
            showToast(`Error send request ${json.error}`, "warning")       
        }

    } catch (error) {
        showToast(`Error retrieving tasks ${json.message}`, "warning")
        //alert("Error retrieving tasks " + error.message)
    }
}

// Set values to table
const setInfos = (infos) => {
    const trPetId = document.getElementById('pet-id')
    const petId = document.createElement('td')
    petId.innerHTML = targetPetId
    petId.setAttribute('id', 'pet-id-value')
    trPetId.appendChild(petId)
    petId.hidden = true

    const trBreed = document.getElementById('breed')
    const breed = document.createElement('td')
    breed.innerHTML = infos.breed
    breed.setAttribute('id', 'breed-value')
    trBreed.appendChild(breed)

    const trAge = document.getElementById('age')
    const age = document.createElement('td')
    age.innerHTML = `${infos.ageyear} year(s) ${infos.agemonth} month(s)`
    age.setAttribute('id', 'age-value')
    trAge.appendChild(age)

    const trColour = document.getElementById('colour')
    const colour = document.createElement('td')
    colour.innerHTML = infos.colour
    colour.setAttribute('id', 'colour-value')
    trColour.appendChild(colour)

    const trWeight = document.getElementById('weight')
    const weight = document.createElement('td')
    weight.innerHTML = `${infos.weight} kg`
    weight.setAttribute('id', 'weight-value')
    trWeight.appendChild(weight)

    const trDescription = document.getElementById('description')
    const description = document.createElement('td')
    description.innerHTML = infos.description
    description.setAttribute('id', 'description-value')
    trDescription.appendChild(description)

    const trEmail = document.getElementById('email')
    const email = document.createElement('td')
    email.innerHTML = infos.email_address
    email.setAttribute('id', 'email-value')
    email.setAttribute('hidden', 'true')
    trEmail.appendChild(email)
}

// Set image to image field
const setImage = (image) => {
    const div = document.getElementById('pet-image')
    const img = document.createElement('img')
    img.setAttribute('id', 'imgPet')
    img.setAttribute('name', image.image_path)
    img.setAttribute('src', 'http://localhost:5050/images/' + image.image_path)
    img.width = 500
    img.height = 350
    div.appendChild(img)
}

// Send request with message
const sendRequest = async(petRequest) => {
    sendRequestButton.disabled = true;
    sendRequestButton.textContent = "Sending..";
    try {
        const json = JSON.stringify(petRequest)

        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type" : "application/json" 
            },
            body: json
        }        
        const response = await fetch(BACKEND_ROOT_URL + 'request', options)
        if (response.ok){
            const json = await response.json()
            window.scrollTo(0, 0);
            sendRequestButton.textContent = "Sent";
            showToast(json.message, "success");
        } else {
            sendRequestButton.disabled = false;
            sendRequestButton.textContent = "Request";
            
            window.scrollTo(0, 0);
            showToast(`Error send request ${response}`, "warning")  
        }
    
    } catch (error) {
        window.scrollTo(0, 0);
        sendRequestButton.disabled = false;
        sendRequestButton.textContent = "Request";
        showToast(`Error send request ${error.message}`, "warning")        
    }
}

// Executed when request button is clicked
submit.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    //get image name
    const imgName = document.getElementById('imgPet').name;

    const petRequest = {
        petId: document.getElementById('pet-id-value').textContent,
        breed: document.getElementById('breed-value').textContent,
        age: document.getElementById('age-value').textContent,
        colour: document.getElementById('colour-value').textContent,
        weight: document.getElementById('weight-value').textContent,
        description: document.getElementById('description-value').textContent,
        ownerEmail: document.getElementById('email-value').textContent,
        requestMessage: document.getElementById('message-field').value,
        petImage: imgName,
        acceptKey: ""
    }
    // Send request
    sendRequest(petRequest)
})


getPetInfo()