const email = document.getElementById("email")
const btnResetRequest = document.getElementById('btnResetRequest');

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
    const forgetPasswordForm = document.getElementById("forgotPasswordForm");
    if (forgetPasswordForm) {
        forgetPasswordForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            onForgetPassword(); 
        });
    }
});

//Forgot password request
async function onForgetPassword() {
    btnResetRequest.disabled = true;
    email.disabled = true;
    btnResetRequest.textContent= "Requesting password reset link";

    await forgotPassword(email.value)
    .then(data => {        
        btnResetRequest.textContent= "Reset link sent";
        showToast(`Link to reset password successfully sent to ${email.value}`, 'success');
    })
    .catch(error => {
        btnResetRequest.disabled = false;
        email.disabled = false;
        btnResetRequest.textContent= "Request password reset link";
        showToast(error.message, 'info');  
    });
};

//api call
async function forgotPassword(userEmail) {
    const forgotPasswordUrl = `${CONFIG.API_BASE_URL}/forgot-password`
    
    //post request
    const postData = {
        userEmail: userEmail
    }

    // Option for post request for authorization
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(postData) 
    };


    try {
        const response = await fetch(forgotPasswordUrl, options);
      
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
