async function getMemberByKey(activationKey) {
    const getUserByKeyUrl = `${CONFIG.API_BASE_URL}/user-by-key/${activationKey}`

    // Option for post request for authorization
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' 
        } 
    };

    try {
        const response = await fetch(getUserByKeyUrl, options);
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

async function getPetCategory() {
    const getPetCategoryUrl = `${CONFIG.API_BASE_URL}/pet-category`

    // Option for post request for authorization
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' 
        } 
    };

    try {
        const response = await fetch(getPetCategoryUrl, options);
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