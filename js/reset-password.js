const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const btnReset = document.getElementById('btnResetPassword');
const memberName =  document.getElementById('memberName');


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
                onResetPassword(); 
            });
        }
});

async function onFormLoad() {
    //get reset key from query string
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const resetKey = params.get('key')
    if (!resetKey){
        btnReset.disabled = true;
        newPassword.disabled = true;
        confirmPassword.disabled = true;
        showToast('Invalid request, missing token.', 'warning');
        return;
    }
    
    await getMemberByKey(resetKey)
    .then(data => {
        memberName.value = `${data.firstName} ${data.lastName}`;
    })
    .catch(error => {
        btnReset.disabled = true;
        newPassword.disabled = true;
        confirmPassword.disabled = true;
        showToast(error.message, 'info');  
    });

};

//reset password

async function onResetPassword() {
    if (newPassword.value !== confirmPassword.value){
        showToast('New and confirm passwords are not matching.', 'warning');
        return;
    }

    btnReset.disabled = true;
    newPassword.disabled = true;
    confirmPassword.disabled = true;

    //get reset key from query string
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const resetKey = params.get('key')
    if (!resetKey){
        showToast('Invalid request, missing token.', 'warning');
        return;
    }

    await resetPassword(newPassword.value, resetKey)
    .then(data => {
        showToast(`Password reset successful, please login`, 'success');
    })
    .catch(error => {
        btnReset.disabled = false;
        newPassword.disabled = false;
        confirmPassword.disabled = false;
        showToast(error.message, 'info');  
    });

};

//api call
async function resetPassword(newPassword, resetToken) {
    const resetPasswordUrl = `${CONFIG.API_BASE_URL}/reset-password/${resetToken}`
    
    //post request
    const postData = {
        newPassword: newPassword
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
