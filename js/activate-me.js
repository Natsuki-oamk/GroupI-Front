const btnActivate = document.getElementById('btnActivate');

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

        onFormLoad(); 

        // Attach onLogin method to form submission
        const resetPasswordForm = document.getElementById("resetPasswordForm");
        if (resetPasswordForm) {
            resetPasswordForm.addEventListener("submit", function(event) {
                event.preventDefault(); 
                onActivateMe(); 
            });
        }
});


//activate profile
async function onFormLoad() {
    //get reset key from query string
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const activationKey = params.get('key')
    if (!activationKey){
        const btnActivate = document.getElementById('btnActivate');
        btnActivate.disabled = true
        showToast('Invalid request, missing token.', 'warning');
        return;
    }

    await getMemberByKey(activationKey)
    .then(data => {
        const memberName =  document.getElementById('memberName');
        memberName.value = `${data.firstName} ${data.lastName}`;
    })
    .catch(error => {
        const btnActivate = document.getElementById('btnActivate');
        btnActivate.disabled = true
        showToast(error.message, 'info');  
    });

};

//activate profile
async function onActivateMe() {
    //get reset key from query string
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const activationKey = params.get('key')
    if (!activationKey){
        showToast('Invalid request, missing token.', 'warning');
        return;
    }

    btnActivate.disabled = true;
    btnActivate.textContent = "Activating Profile..."; 

    await activateMe(activationKey)
    .then(data => {
        btnActivate.textContent = "Profile Activated";
        showToast(`Profile activated successfully, please login`, 'success');
    })
    .catch(error => {
        btnActivate.textContent = "Activate My Profile";
        btnActivate.disabled = false;
        showToast(error.message, 'info');  
    });

};

//api call
async function activateMe(activationKey) {
    const resetPasswordUrl = `${CONFIG.API_BASE_URL}/activate-me/${activationKey}`

    // Option for post request for authorization
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json' 
        }
    };

    try {
        const response = await fetch(resetPasswordUrl, options);
      
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


