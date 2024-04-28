const category = document.getElementById("category");
const cardGrid = document.getElementById("cardGrid");

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
        const petSearchForm = document.getElementById("petSearchForm");
        if (petSearchForm) {
            petSearchForm.addEventListener("submit", function(event) {
                event.preventDefault(); 
                onResetPassword(); 
            });

            category.addEventListener("change", function(event) {
                onCategoryChange(); 
            });
        }
});

const onCategoryChange = async () => {
    if (!category.value){
        showToast('No pet category selected.', 'warning');
        return;
    }

    category.disabled = true;
    //clear existing cards
    cardGrid.innerHTML = ''
    await categoryChange(category.value)
    .then(data => {
        createCards(data)
    })
    .catch(error => {
        showToast(error.message, 'info');  
    })
    .finally(category.disabled = false);
} 

const onFormLoad = async () => {
    //get all pet categories
    await getPetCategory()
    .then(data => {
        //bind categories
        let html = "";
        data.map((item) => html += `"<option value="${item.petCategoryId}"> ${item.description} </option>"`);
        category.innerHTML = html;

        onCategoryChange();
    })
    .catch(error => {
        showToast(error.message, 'info');  
    });
};

//api call
async function categoryChange(category) {
    const petSearchUrl = `${CONFIG.API_BASE_URL}/pet-search-by-category/${category}`

    // Option for post request for authorization
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' 
        }
    };

    try {
        const response = await fetch(petSearchUrl, options);
      
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


const createCards = (data) => {
    // Loop through the card data and generate cards
    let i =0;
    data.map((item) => {
        // Check to create a new row - only 3 cards displayed in a row
        if (i % 3 === 0) {
            // Create a row
            var newRow = document.createElement("div");
            newRow.classList.add("row");
            cardGrid.appendChild(newRow);
        }

        const col = document.createElement("div");
        col.classList.add("col-md-4", "mb-3");

        const likeButton = document.createElement("button");
        likeButton.classList.add("btn", "btn-link");
        likeButton.id=item.petId
        likeButton.innerHTML = '<i class="fa fa-heart-o" style="font-size:22px"></i>';

        const likeCounter = document.createElement("span");
        likeCounter.classList.add("like-counter");
        likeCounter.textContent = item.likes>1000?`${(item.likes/1000).toFixed(1)}K+`:item.likes;

        const card = document.createElement("div");
        card.classList.add("card");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = item.breed;

        const cardContent = document.createElement("p");
        cardContent.classList.add("card-text");
        cardContent.textContent = `Age : ${item.age}`;

        const commentButton = document.createElement("a");
        commentButton.classList.add("btn", "btn-link");
        commentButton.textContent = "Comments"
        commentButton.href = `/pages/comment.html?petid=${item.petId}`

        const adaptationButton = document.createElement("a");
        adaptationButton.classList.add("btn", "btn-link");
        adaptationButton.textContent = "Adopt"
        adaptationButton.href = `/pages/request.html?petid=${item.petId}`

        cardBody.appendChild(likeButton);
        cardBody.appendChild(likeCounter);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardContent);
        cardBody.appendChild(commentButton);
        cardBody.appendChild(adaptationButton);
        
        card.appendChild(cardBody);
  
        col.appendChild(card);
  
        const currentRow = cardGrid.lastElementChild;
        currentRow.appendChild(col);

        // // Create an img element
        const img = new Image();
        img.classList.add("card-img-top");

        // Set the src attribute and alt text
        img.onload = function() {
            // Once the image is loaded, append it to the card
            card.insertBefore(img, cardBody);
        };

        img.src = `${CONFIG.IMAGE_BASE_URL}${item.imagePath}`;
        img.alt = "Pet Image";

        likeButton.addEventListener("click", async function() {
            event.preventDefault(); 
            let like
            if (likeButton.innerHTML === '<i class="fa fa-heart-o" style="font-size:22px"></i>') {
                likeButton.innerHTML = '<i class="fas fa-heart" style="font-size: 20px; color: red;"></i>';
                like = 1
            } else {
                likeButton.innerHTML = '<i class="fa fa-heart-o" style="font-size:22px"></i>';
                like = -1
            }

            //call api to update in the database
            await petLike(likeButton.id, like)
                .then(data => {
                    //bind likes
                    likeCounter.textContent = data.likes>1000?`${(data.likes/1000).toFixed(1)}K+`:data.likes;
                    likeButton.tooltip = data.likes
                })
                .catch(error => {
                    showToast(error.message, 'info');  
                });
        });

        i++;
    })


    


}

async function petLike(id, likes) {
    const petLikeUrl = `${CONFIG.API_BASE_URL}/pet-like/${id}`

    postData ={
        likes: likes
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
        const response = await fetch(petLikeUrl, options);
      
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