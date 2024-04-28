const email = document.getElementById("email")
const firstName = document.getElementById("firstName")
const lastName = document.getElementById("lastName")
const address = document.getElementById("address")
const postalCode = document.getElementById("postalCode")
const city = document.getElementById("city")
const phoneNumber = document.getElementById("phoneNumber")
const password = document.getElementById("password")
const confirmPassword = document.getElementById("confirmPassword")
const btnRegister = document.getElementById('btnRegister');

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    // Custom Bootstrap validations
    const forms = document.querySelectorAll('.needs-validation');

    // check all the validations in a loop
    Array.prototype.slice.call(forms)
        .forEach(function(form) {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        });

    // Attach onLogin method to form submission
    const registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
        registrationForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            onRegister(); 
        });
    }
});

//Forgot password request
const onRegister = async() => {
    controlFields(true);
    //check for password and confirmation
    if (password.value !== confirmPassword.value){
        showToast('Password and confirmation password does not match', 'warning');
        controlFields(false);
        return;
    }
    btnRegister.textContent = "Registering...";  

    await register(email.value)
    .then(data => {
        btnRegister.textContent = "Registered";
        showToast(`Member registration successful and profile activation link sent to ${email.value}`, 'success');
    })
    .catch(error => {
        controlFields(fa)
        btnRegister.textContent = "Register";
        showToast(error.message, 'info');  
    });
};

//api call
async function register() {
    const registrationUrl = `${CONFIG.API_BASE_URL}/users`
    
    //post request
    const postData = {
        userEmail: email.value ,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        postalCode: postalCode.value,
        city: city.value,
        phoneNumber: phoneNumber.value
    }

    // Option for post request for authorization
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(postData) 
    };


    try {
        const response = await fetch(registrationUrl, options);
      
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


const controlFields = (isDisabled) => {
    email.disabled = isDisabled
    firstName.disabled = isDisabled
    lastName.disabled = isDisabled
    address.disabled = isDisabled
    postalCode.disabled = isDisabled
    city.disabled = isDisabled
    phoneNumber.disabled = isDisabled
    password.disabled = isDisabled
    confirmPassword.disabled = isDisabled
    btnRegister.disabled = isDisabled
}