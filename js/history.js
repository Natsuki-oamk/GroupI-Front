const BACKEND_ROOT_URL = `${CONFIG.API_BASE_URL}/history`

const userId = localStorage.getItem('userId'); // TODO: get user id dynamically

const startField = document.getElementById('start-date')
const endField = document.getElementById('end-date')

// Get all histories of the target user
const getHistories = async () => {
    try {
        const options = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type" : "application/json" 
            }
        }
        
        const response = await fetch(BACKEND_ROOT_URL + '/' + userId, options)
        const json = await response.json()
        if (response.ok) {
            console.log(json)
            
            json.forEach(history => {
                createRecord(history)
            })    
        } else {
            showToast(json.error, "warning")
        }
    } catch (error) {
        showToast("Error retrieving history " + error.message, "warning")
    }
}

// Get histories of the target user in the indicated date range
const getHistoriesByRange = async (id, start, end) => {
    const params = `?id=${id}&start=${start}&end=${end}`
    try {
        const options = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
                "Content-Type" : "application/json" 
            }
        }

        const response = await fetch(BACKEND_ROOT_URL + params, options)
        const json = await response.json()
        console.log(json)

        if (response.ok) {
            // Remove records
            const tbody = document.getElementById('history-body')
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            json.forEach(history => {
                createRecord(history)
            })
        } else {
            showToast(json.error, "warning")
        }
    } catch (error) {
        showToast("Error retrieving history " + error.message, "warning")
    }
}

// Create table record
const createRecord = (history) => {
    const table = document.getElementById('history-body')
    const tr = document.createElement('tr')
    tr.setAttribute('name', 'data')
    const td1 = document.createElement('td')
    td1.innerHTML = formatDate(history.publishing_date)
    const td2 = document.createElement('td')
    td2.innerHTML = history.description
    const td3 = document.createElement('td')
    td3.innerHTML = history.breed
    const td4 = document.createElement('td')
    td4.innerHTML = history.adopted_on? formatDate(history.adopted_on): ""
    const td5 = document.createElement('td')
    td5.innerHTML = `${history.first_name || ""} ${history.last_name || ""}`
    const td6 = document.createElement('td')
    td6.innerHTML = history.adoption_remarks
    console.log(td1)
    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    tr.appendChild(td5)
    tr.appendChild(td6)
    table.appendChild(tr)
}

// Form dates to dd/mm/yyyy
const formatDate = (date) => {
    const originDate = new Date(date)
    const year = originDate.getFullYear()
    const month = ("00" + (originDate.getMonth()+1)).slice(-2)
    const day = ("00" + (originDate.getDate())).slice(-2)
    const result = `${day}/${month}/${year}`
    return result
}

// Executed when date is changed
function changeDate() {
    const start = document.getElementById('start-date').value
    const end = document.getElementById('end-date').value
    console.log(start)
    console.log(end)
    if (start && end) {
        getHistoriesByRange(userId, start, end)
    }
}

startField.addEventListener('input', (event) => {
    changeDate()
})

endField.addEventListener('input', (event) => {
    changeDate()
})


getHistories()