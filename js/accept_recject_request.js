const BACKEND_ROOT_URL = `${CONFIG.API_BASE_URL}/`
//get pet ID from query param in url
const qryParams = new URLSearchParams(window.location.search);
const targetPetId = qryParams.get('petid'); //'1' // TODO: get pet id dynamically
const approveButton = document.getElementById('approve');
const rejectButton = document.getElementById('reject');

// Get all histories of the target user
const getPetInfo = async () => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const petId = params.get('id')
    const key = params.get('key')


    try {
        const options = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type" : "application/json" 
            }
        }

        // Get pet info and images
        const response = await fetch(BACKEND_ROOT_URL + 'adopt/' + petId + '?key=' + key, options)
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

    const trReqName = document.getElementById('request_user_name')
    const reqName = document.createElement('td')
    reqName.innerHTML = infos.request_user_name
    trReqName.appendChild(reqName)

    const trReqEmail = document.getElementById('request_email')
    const reqEmail = document.createElement('td')
    reqEmail.innerHTML = infos.request_user_email
    trReqEmail.appendChild(reqEmail)

    const trReqPhone = document.getElementById('request_phone')
    const reqPhone = document.createElement('td')
    reqPhone.innerHTML = infos.phone_number
    trReqPhone.appendChild(reqPhone)

    const message = document.getElementById('message-field')
    message.textContent = infos.message
    


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
approveButton.addEventListener('click', async (event) => {
    event.preventDefault(); 
    const confirmed = window.confirm('Are you sure you want accept the adaptation request?');
    if (confirmed) {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const petId = params.get('id')
        const key = params.get('key')
        approveButton.disabled = true;
        rejectButton.disabled = true;

        approveButton.textContent = "Approving..."

        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json" 
                }
            }

            // Get pet info and images
            const response = await fetch(BACKEND_ROOT_URL + 'accept-request/' + petId + '?key=' + key, options)
            if (response.ok) {
                window.scrollTo(0, 0);
                approveButton.textContent = "Approved"
                showToast(`Adaptation request accepted.`, "success")       
            } else {
                window.scrollTo(0, 0);
                approveButton.textContent = "Approve"
                approveButton.disabled = false
                rejectButton.disabled = false;
                console.log(response)
                showToast(`Error accepting adaptation request.`, "warning")       
            }

        } catch (error) {
            window.scrollTo(0, 0);
            approveButton.textContent = "Approve"
            approveButton.disabled = false
            rejectButton.disabled = false;
            showToast(`Error accepting adaptation request. Exception: ${error.message}`, "warning")
        }
    }
})

rejectButton.addEventListener('click', async (event) => {
    event.preventDefault(); 
    const confirmed = window.confirm('Are you sure you want decline the adaptation request?');
    if (confirmed) {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const petId = params.get('id')
        const key = params.get('key')
        approveButton.disabled = true;
        rejectButton.disabled = true;

        approveButton.textContent = "Approving..."

        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json" 
                }
            }

            // Get pet info and images
            const response = await fetch(BACKEND_ROOT_URL + 'reject-request/' + petId + '?key=' + key, options)
            if (response.ok) {
                window.scrollTo(0, 0);
                approveButton.textContent = "Approved"
                showToast(`Adaptation request declined.`, "success")       
            } else {
                window.scrollTo(0, 0);
                approveButton.textContent = "Approve"
                approveButton.disabled = false
                rejectButton.disabled = false;
                console.log(response)
                showToast(`Error accepting adaptation request.`, "warning")       
            }

        } catch (error) {
            window.scrollTo(0, 0);
            approveButton.textContent = "Approve"
            approveButton.disabled = false
            rejectButton.disabled = false;
            showToast(`Error accepting adaptation request. Exception: ${error.message}`, "warning")
        }
    }
})


getPetInfo()