const BACKEND_ROOT_URL = `${CONFIG.API_BASE_URL}`;
// The proper values for petId and userId are still needed!
const qryParams = new URLSearchParams(window.location.search);
const petId = qryParams.get('petid'); //'1' // TODO: get pet id dynamically
const userId = localStorage.getItem('userId'); 

//const petId = 1;
// const userId = 3; 
/* the value for userId should be a number if the user is logged in, and
   null if the user isn't logged in. The edit and delete functions are only
   visible for logged in users, so that only their own comments can be removed or edited by themselves.
*/


const comment_submit_button = document.querySelector('button.comment-submission-button'); 
const comments_container = document.querySelector('div#comment-container'); 
const comment_to_submit = document.querySelector('textarea.written-comment-textbox'); 


// fetch all comments to and use function to display them. 
// use functions to display the amount of comments and the replies.
function fetchComments (petId) {
fetch(`${BACKEND_ROOT_URL}/comments/${petId}`) 
    .then(response => response.json()) 
    .then(data => {            

        const comments = data.comments;

        comments.forEach(comment => {
            if (comment.review_details.trim() !== '') {
            createCommentElement(comment);
            }
        });

        // display the amount of comments
        getAmountOfComments(petId);
        // display the replies of the comments
        fetchReplies();

    }).catch(error => {                 
        alert('Failed to fetch comments.');
    });
}


// get and display amount of comments (comment count)
function getAmountOfComments(petId) {
    fetch(`${BACKEND_ROOT_URL}/comments/amount/${petId}`) 
    .then(response => response.json()) 
    .then(data => {                   
        // display the amount of comments
        document.getElementById('commentAmount').textContent = data;
        console.log(data);
    }).catch(error => {                 
        alert('Failed to display amount of comments.');
    });
}
    
// function to create a comment element
function createCommentElement(comment) {
    // create a new div for the comment
    const commentContainer = document.getElementById('comment-container');
    const areaDiv = document.createElement('div');
    areaDiv.setAttribute('class', 'singular-comment-area');
    const commentDiv = document.createElement('div');
    commentDiv.setAttribute('id', 'singular-comment');
    commentDiv.setAttribute('data-comment-id', comment.id_pet_review);
    
    console.log("review details: " + comment.review_details);

    // create elements for username, comment text, delete button, reply button and edit button
    const usernameSpan = document.createElement('span');
    const commentText = document.createElement('p');

    const replyButton = document.createElement('button');
    replyButton.setAttribute('class', 'Reply');
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'Delete');
    const editButton = document.createElement('button');
    editButton.setAttribute('class', 'Edit'); 
    
    // (new) create elements for icons in the buttons
    const trashIconI = document.createElement('i');
    const editIconI = document.createElement('i'); 
    const replyIconI = document.createElement('i');

    // new of adding a div for the buttons
    const buttonDiv = document.createElement('div'); 

    // set content and attributes for username, comment text, and buttons
    usernameSpan.textContent = comment.review_username; 
    commentText.textContent = comment.review_details;

    trashIconI.setAttribute('class', 'fa-solid fa-trash');
    editIconI.setAttribute('class', 'fa-solid fa-pen');
    replyIconI.setAttribute('class', 'fa-solid fa-reply');

    commentDiv.appendChild(usernameSpan);
    commentDiv.appendChild(commentText);

    // new button div changes
    deleteButton.appendChild(trashIconI);
    editButton.appendChild(editIconI);
    replyButton.appendChild(replyIconI);

    if (comment.id_user === userId && userId != null) { 
    buttonDiv.appendChild(deleteButton);
    buttonDiv.appendChild(editButton); 
    }

    buttonDiv.appendChild(replyButton);
    commentDiv.appendChild(buttonDiv); 
    areaDiv.appendChild(commentDiv);

    commentContainer.appendChild(areaDiv);

    return commentContainer;
}


// event listener for the submit button
comment_submit_button.addEventListener('click', function(event) {
  event.preventDefault(); // no full page reload

  const comment_to_submit = document.querySelector('textarea.written-comment-textbox').value;
  console.log('Submitted comment:', comment_to_submit);
  const username_to_submit = document.querySelector('textarea.commenter-name').value;
  console.log('Submitted username: ' + username_to_submit);

  // post request to send the comment to the server
  fetch(`${BACKEND_ROOT_URL}/comments`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: username_to_submit,
        content: comment_to_submit,
        userId: userId,
        petId: petId
    })
  }) 
    .then(response => response.json()) // converts response to json format
    .then(json => {                   // logs the json data to console
      console.log(json);

      const reviewDetails = json.comments;
      createCommentElement(reviewDetails);

      // update the comment count
      getAmountOfComments(petId)

    }).catch(error => {                 
        alert(error);
    });

  document.querySelector('textarea.written-comment-textbox').value = '';
  document.querySelector('textarea.commenter-name').value = '';
}); 


// event listener for the delete button
comments_container.addEventListener('click', function(event) {
    // if we click on the icon with the class fa-trash
    if (event.target.tagName === 'I' && event.target.classList.contains('fa-trash')) {
        console.log("clicking on delete button worked!");
        // then we get the whole comment closest to that button and the id of that comment
        const commentDiv = event.target.closest('#singular-comment');
        console.log(commentDiv);
        const commentId = commentDiv.dataset.commentId;
        console.log(commentId);

        deleteComment(commentId);
    }    
}); 


function deleteComment(commentId) {
    fetch(`${BACKEND_ROOT_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }, 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }

        const commentDiv = document.querySelector(`#singular-comment[data-comment-id="${commentId}"]`);

        if (commentDiv) {
            const areaDiv = commentDiv.parentElement;

            commentDiv.remove();

            const singularReplyDivs = areaDiv.querySelectorAll('#singular-reply');
            singularReplyDivs.forEach(replyDiv => {
                replyDiv.remove();
            });

            if (areaDiv.childElementCount === 0) {
                areaDiv.remove(); 
            }

            getAmountOfComments(petId);
        }

    })
    .catch(error => {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment.');
    });
} 


function editComment(commentId, details) {
    fetch(`${BACKEND_ROOT_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
            content: details
        }), 
    })
    .then(response => {
        if (!response.ok) {
            console.log("Failed to edit comment (got here!)");
            throw new Error('Failed to delete comment');
        }
        
        // get the comment we're editing
        const commentDiv = document.querySelector(`#singular-comment[data-comment-id="${commentId}"]`);

        // restore the original form of the comment
        const textElement = document.createElement('p');
        textElement.textContent = details; 
        const textarea = commentDiv.querySelector('textarea');
        textarea.replaceWith(textElement);
        textElement.readOnly = true;

        // restore the edit and delete buttons
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');
        const replyButton = document.createElement('button');
        deleteButton.setAttribute('class', 'Delete');
        editButton.setAttribute('class', 'Edit');
        replyButton.setAttribute('class', 'Reply');
        const trashIconI = document.createElement('i');
        const editIconI = document.createElement('i');
        const replyIconI = document.createElement('i');
        trashIconI.setAttribute('class', 'fa-solid fa-trash');
        editIconI.setAttribute('class', 'fa-solid fa-pen');
        replyIconI.setAttribute('class', 'fa-solid fa-reply');
        deleteButton.appendChild(trashIconI);
        editButton.appendChild(editIconI);
        replyButton.appendChild(replyIconI);
        
        const buttonDiv = commentDiv.querySelector('div');
        buttonDiv.appendChild(deleteButton);
        buttonDiv.appendChild(editButton);
        buttonDiv.appendChild(replyButton);
    })
    .catch(error => {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment');
    });
} 

// event listener for the edit button
comments_container.addEventListener('click', function(event) {
    if (event.target.tagName === 'I' && event.target.classList.contains('fa-pen')) {
       
        const commentDiv = event.target.closest('#singular-comment');
        console.log(commentDiv);
        const commentId = commentDiv.dataset.commentId;

        // get the text of the existing comment
        const commentTextElement = commentDiv.querySelector('p');
        const existingCommentText = commentTextElement.textContent;

        // replace the existing comment text with a textarea
        const textarea = document.createElement('textarea');
        textarea.value = existingCommentText;
        textarea.classList.add('editable-comment-text'); 
        textarea.readOnly = false; 
        commentTextElement.replaceWith(textarea);

        // remove the existing edit and delete buttons
        const buttonsDiv = commentDiv.querySelector('div');
        const allButtons = buttonsDiv.querySelectorAll('button');
        const deleteButton = allButtons[0]; 
        const editButton = allButtons[1]
        const replyButton = allButtons[2];
        
        deleteButton.remove();
        editButton.remove();
        replyButton.remove();

        // new submit button
        const confirmButton = document.createElement('button');
        confirmButton.setAttribute('class', 'Confirm');
        const confirmIconI = document.createElement('i');
        confirmIconI.setAttribute('class', 'fa-solid fa-check');

        // new cancel button
        const cancelButton = document.createElement('button');
        cancelButton.setAttribute('class', 'Cancel');
        const cancelIconI = document.createElement('i');
        cancelIconI.setAttribute('class', 'fa-solid fa-xmark');

        confirmButton.appendChild(confirmIconI);
        cancelButton.appendChild(cancelIconI);
        buttonsDiv.appendChild(confirmButton);
        buttonsDiv.appendChild(cancelButton);
        commentDiv.appendChild(buttonsDiv);

        // event listener for confirm
        confirmButton.addEventListener('click', () => {
            const newCommentText = textarea.value;
            editComment(commentId, newCommentText);
            
            confirmButton.remove();
            cancelButton.remove();
        });
        
        // event listener for cancel button
        cancelButton.addEventListener('click', () => {
            // original comment text
            const textElement = document.createElement('p');
            textElement.textContent = existingCommentText; // might cause issue
            textarea.replaceWith(textElement);
            textElement.readOnly = true;
            
            confirmButton.remove();
            cancelButton.remove();

            // new edit and delete buttons
            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('class', 'Delete');
            const editButton = document.createElement('button');
            editButton.setAttribute('class', 'Edit');
            const replyButton = document.createElement('button');
            replyButton.setAttribute('class', 'Reply');
        
            // create icons for the buttons
            const trashIconI = document.createElement('i');
            const editIconI = document.createElement('i');
            const replyIconI = document.createElement('i');
            trashIconI.setAttribute('class', 'fa-solid fa-trash');
            editIconI.setAttribute('class', 'fa-solid fa-pen');
            replyIconI.setAttribute('class', 'fa-solid fa-reply');
        
            deleteButton.appendChild(trashIconI);
            editButton.appendChild(editIconI);
            replyButton.appendChild(replyIconI);
            buttonsDiv.appendChild(deleteButton);
            buttonsDiv.appendChild(editButton);
            buttonsDiv.appendChild(replyButton);

            confirmButton.remove();
            cancelButton.remove();
        });
    }    
});


/* new for the reply button */

// event listener for the reply button
comments_container.addEventListener('click', function(event) {
    if (event.target.tagName === 'I' && event.target.parentElement.classList.contains('Reply')) {
        
        const commentDiv = event.target.closest('#singular-comment');
        const commentId = commentDiv.dataset.commentId;
        const areaDiv = event.target.closest('.singular-comment-area');
        console.log(commentDiv);

        // create the reply div
        const replyDiv = document.createElement('div');
        replyDiv.setAttribute('id', 'singular-reply');
        replyDiv.setAttribute('data-comment-id', 'review.details');

        // create elements for the reply content
        const usernameText = document.createElement('textarea');
        usernameText.placeholder = 'Display name...'; 
        usernameText.classList.add('small-textarea');
        const reviewDetails = document.createElement('textarea');

        // existing comment text
        const commentUsernameElement = commentDiv.querySelector('span');
        const replyUsername = commentUsernameElement.textContent;
        reviewDetails.placeholder = `Write a public comment replying to ${replyUsername}...`; 
        reviewDetails.classList.add('large-textarea');

        // div for buttons
        const buttonsDiv = document.createElement('div');

        // new submit button
        const confirmButton = document.createElement('button');
        confirmButton.setAttribute('class', 'Confirm');
        const confirmIconI = document.createElement('i');
        confirmIconI.setAttribute('class', 'fa-solid fa-check');

        // new cancel button
        const cancelButton = document.createElement('button');
        cancelButton.setAttribute('class', 'Cancel');
        const cancelIconI = document.createElement('i');
        cancelIconI.setAttribute('class', 'fa-solid fa-xmark');

        // event listener for confirm button
        confirmButton.addEventListener('click', () => {
            
            if (reviewDetails.value.trim().length > 0 && usernameText.value.trim().length > 0) {
                const textElement = document.createElement('p');
                const usernameElement = document.createElement('span');
                textElement.textContent = reviewDetails.value; 
                ogCommenterName = commentDiv.querySelector('span').textContent;
                usernameElement.textContent = usernameText.value + " replying to " + ogCommenterName;
                reviewDetails.replaceWith(textElement);
                usernameText.replaceWith(usernameElement);
                textElement.readOnly = true;
                usernameElement.readOnly = true;

                // add reply to database
                addReplyToDatabase(usernameElement.textContent, textElement.textContent, commentId);

                confirmButton.remove();
                cancelButton.remove();
            } else {
                alert('Please input something in the reply and username fields before confirming.');
            }
        
        });

        // event listener for cancel button
        cancelButton.addEventListener('click', () => {
            replyDiv.remove();
        });

        confirmButton.appendChild(confirmIconI);
        cancelButton.appendChild(cancelIconI);
        buttonsDiv.appendChild(confirmButton);
        buttonsDiv.appendChild(cancelButton);
        replyDiv.appendChild(usernameText);
        replyDiv.appendChild(reviewDetails);
        replyDiv.appendChild(buttonsDiv);

        areaDiv.appendChild(replyDiv);
    }
});


function addReplyToDatabase(username, replyContent, parentId) {
    fetch(`${BACKEND_ROOT_URL}/comments/replies/new/${parentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            replyContent: replyContent,
            parentId: parentId 
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add reply to the database');
        }
        console.log('Reply added to the database successfully');
    })
    .catch(error => {
        console.error('Error adding reply to the database:', error);
        alert('Failed to add reply to the database');
    });
}

function fetchReplies(petId) {
    fetch(`${BACKEND_ROOT_URL}/comments/replies/${petId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch replies');
            }
            return response.json();
        })
        .then(data => {   
           const replies = data;
            
           replies.forEach(reply => {
            // get parent comment element using the parent comment ID
            const aparentCommentId = reply.id_pet_review;
            console.log(aparentCommentId);
            const aparentCommentElement = document.querySelector(`#singular-comment[data-comment-id="${aparentCommentId}"]`);
            console.log(aparentCommentElement);

            if (aparentCommentElement) {
                const replyDiv = document.createElement('div');
                replyDiv.setAttribute('id', 'singular-reply');
                replyDiv.setAttribute('data-comment-id', 'review.details');

                const textElement = document.createElement('p');
                const usernameElement = document.createElement('span');
                textElement.textContent = reply.reply_details; 
                usernameElement.textContent = reply.reply_username;
                textElement.readOnly = true;
                usernameElement.readOnly = true;

                replyDiv.appendChild(usernameElement);
                replyDiv.appendChild(textElement);

                const closestSingularCommentArea = aparentCommentElement.closest('.singular-comment-area');
                closestSingularCommentArea.appendChild(replyDiv);
            }
        });

        })
        .catch(error => {
            console.error('Error fetching replies:', error);
            alert('Failed to fetch replies. Please try again later.');
        });
}


function getPetImage(petId) {
    fetch(`${BACKEND_ROOT_URL}/comments/image/${petId}`) 
    .then(response => response.json()) 
    .then(data => { 
        const imagePath = data[0].image_path; 
        console.log(imagePath);
        const imageDiv = document.getElementById('comment-pet-image');
        const imageElement = document.createElement('img');
        imageElement.setAttribute('src', 'http://localhost:5050/images/' + imagePath);
        imageElement.width = 500
        imageElement.height = 350
        imageDiv.appendChild(imageElement)
    })
}


// below is Natsuki's code that is used for the post above the comment section!

// Get info of the target pet
// const getPetInfo = async () => {
//     const targetPetId = petId;
//     try {
//         // Get pet info and images
//         const response = await fetch(`${BACKEND_ROOT_URL}/comments/request/${targetPetId}`)
//         const json = await response.json()

//         if (json.length > 0) {
//             // Set pet detail to table
//             setInfos(json[0])
//         }

//     } catch (error) {
//         alert("Error retrieving tasks " + error.message)
//     }
// }

// // Set values to table
// const setInfos = (infos) => {
//     const trPetId = document.getElementById('pet-id')
//     const petId = document.createElement('td')
//     petId.innerHTML = targetPetId
//     petId.setAttribute('id', 'pet-id-value')
//     trPetId.appendChild(petId)

//     const trBreed = document.getElementById('breed')
//     const breed = document.createElement('td')
//     breed.innerHTML = infos.breed
//     trBreed.appendChild(breed)

//     const trAge = document.getElementById('age')
//     const age = document.createElement('td')
//     age.innerHTML = `${infos.ageyear} years ${infos.agemonth} months`
//     trAge.appendChild(age)

//     const trColour = document.getElementById('colour')
//     const colour = document.createElement('td')
//     colour.innerHTML = infos.colour
//     trColour.appendChild(colour)

//     const trWeight = document.getElementById('weight')
//     const weight = document.createElement('td')
//     weight.innerHTML = `${infos.weight} kg`
//     trWeight.appendChild(weight)

//     const trDescription = document.getElementById('description')
//     const description = document.createElement('td')
//     description.innerHTML = infos.description
//     trDescription.appendChild(description)
// }


const getPetDetails = async () => {
    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type" : "application/json" 
            }
        }

        // Get pet info and images
        const response = await fetch(`${BACKEND_ROOT_URL}/request/${petId}`, options)
        const json = await response.json()
        if (response.ok) {
            if (json.length > 0) {
                // Set pet detail to table
                setPetDetails(json[0])
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
const setPetDetails = (infos) => {
    const trPetId = document.getElementById('pet-id')
    const petIdEle = document.createElement('td')
    petIdEle.innerHTML = petId
    petIdEle.setAttribute('id', 'pet-id-value')
    trPetId.appendChild(petIdEle)
    petIdEle.hidden =true;

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

getPetImage(petId);
fetchComments(petId);
getPetDetails();