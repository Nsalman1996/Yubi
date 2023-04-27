
const validateInput = function () {
    const myElement = document.getElementById("inputEmailPhoneError");
    const input = document.getElementById('inputEmailPhone');
    const value = input.value.trim();

    // Check if the value is either a valid email or a valid phone number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        myElement.innerText = "Please enter a valid email or phone number";
        input.classList.add('is-invalid');
        return false;
    } else {
        input.classList.remove('is-invalid');
        return true;
    }
}

// Add an event listener to the form to validate the input field on submit
const form = document.querySelector('form');
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const userDetails = document.getElementById('inputEmailPhone').value.trim();
    if (validateInput()) {
       
        const data = {
            user: userDetails,
        };

        await updateUser(data);
        // form.submit();
    }
});

async function updateUser(data) {
    const url = 'http://localhost:3000/api/profile/createUser';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, options)
        .then(response => {
            return response.json();
        }).then(response => {

            if (!response.error) {
                window.location.href = './otp.html';
                console.log(response);
            } else {
                let myElement = document.getElementById("inputEmailPhoneError");
                const input = document.getElementById('inputEmailPhone');
                input.classList.add('is-invalid');
                myElement.innerText = response.message;
                input.classList.add('is-invalid');
                console.log(response);
            }
        })
        .catch(error => {
            console.error(error);
        });
}
