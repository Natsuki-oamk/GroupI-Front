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
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            onLogin(); 
        });
    }
});

//user authorization
async function onLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await authorize(email, password)
    .then(data => {
        //store user details and access token in local storage 
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.userEmail);
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('accessToken', data.accessToken);
        window.location.replace('/index.html');
    })
    .catch(error => {
        showToast(error.message, 'info');
    });

};

//api call
async function authorize(userEmail, password) {
    const authUrl = 'http://localhost:5050/api/v1/auth'
      
    //post request
    const postData = {
        userEmail: userEmail,
        password: password
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
