
function getOtp() {
    const url = 'http://localhost:3000/api/profile/getOtp';
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(url, options)
        .then(response => {
            return response.json();
        }).then(response => {

            if (!response.error) {
                console.log(response);
            } else {
                console.log(response);
            }
        })
        .catch(error => {
            console.error(error);
        });
}
getOtp();

async function handleInputChange(object) {

    if (object.value.length > object.maxLength) {
        object.value = object.value.slice(0, object.maxLength);
    } 
    else {
        let myElement = document.getElementById("otpError");
        const input = document.getElementById('otpInput');
        myElement.innerText = "Enter 4-digit Otp";
        input.classList.add('is-invalid');
    }
    if (object.value.length == 4) {
        let myElement = document.getElementById("otpError");
        const input = document.getElementById('otpInput');
        myElement.innerText = "Loading...";
        input.classList.remove('is-invalid');
        await verifyOtp({ "otp": object.value });
    }

}

async function verifyOtp(data) {
    const url = 'http://localhost:3000/api/profile/verifyOtp';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url, options)
        .then(response => {
            console.log(response);
            return response.json();
        }).then(response => {

            if (!response.error) {
                window.location.href = './landing.html';
                console.log(response);
            } else {
                let myElement = document.getElementById("otpError");
                const input = document.getElementById('otpInput');
                myElement.innerText = "Wrong Otp";
                input.classList.add('is-invalid');
                console.log(response);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

