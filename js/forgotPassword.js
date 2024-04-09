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

//user authorization
async function onForgetPassword() {
    const email = document.getElementById("email").value;
    await forgotPassword(email)
    .then(data => {
        console.log(data);
        showToast(`Link to reset password successfully sent to ${email}`, 'success');
    })
    .catch(error => {
        console.log(data);
        showToast(error.message, 'info');  
    });

};

//api call
async function forgotPassword(userEmail) {
    const authUrl = 'http://localhost:5050/api/v1/forgot-password'
    
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
        const response = await fetch(authUrl, options);
      
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
