var userTable = [0];
const tableBody = document.getElementById('table-body');

function handleInputChange(value) {
    const myElement = document.getElementById("userError");
    const input = document.getElementById('user');

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

async function getData() {
    const url = 'http://localhost:3000/api/profile/getAllUser';
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    await performHttpRequest(url, options).then(response => {
        if (!response.error) {
            response.message.forEach(function (rowData) {
                const row = document.createElement('tr');
                const valueCell = document.createElement('td');
                const nameInput = document.createElement('input');
                const nameError = document.createElement('div');

                nameInput.type = 'text';
                nameInput.id = 'user';
                nameInput.dataset.object = JSON.stringify(rowData);
                nameInput.value = rowData.user;

                nameError.id = 'userError';
                nameError.classList.add('invalid-feedback');
                nameError.innerText = 'Please enter a valid email or phone number';

                nameInput.addEventListener('keyup', async event => {
                    const input = event.target;
                    const obj = JSON.parse(input.dataset.object);
                    if (handleInputChange(event.target.value)) {
                        let param = {
                            id: obj.id,
                            user: event.target.value
                        }
                        await updateUser(param);

                    };
                });

                valueCell.appendChild(nameInput);
                row.appendChild(valueCell);
                valueCell.appendChild(nameError)
                const buttonCell = document.createElement('td');
                const button = document.createElement('button');

                button.classList.add('btn', 'btn-primary');
                button.textContent = 'Delete';

                buttonCell.appendChild(button);
                row.appendChild(buttonCell);

                tableBody.appendChild(row);
                userTable.push(rowData.user);

                button.addEventListener('click', (e) => {
                    const user = e.target.closest('tr').querySelector('td:nth-child(1)').innerText;

                    const url = 'http://localhost:3000/api/profile/deleteUser';
                    let obj = {
                        user: user
                    }
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(obj)
                    };
                    performHttpRequest(url, options).then(response => {
                        if (!response.error) {
                            deleteRow(user)
                        }
                        else {
                            console.log(response.message)
                        }
                    }).catch(error => {
                        console.error(error);
                    })
                });

            });
        } else {
            console.log(response);
        }
    }).catch(error => {
        console.error(error);
    });

}

getData();

function deleteRow(value) {
    let index = userTable.indexOf(value);
    let table = document.getElementById("userTable");
    table.deleteRow(index);
    userTable.splice(index, 1);
}

function performHttpRequest(url, options) {
    return fetch(url, options)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .catch(error => {

            console.error(error);
        });
}


async function updateUser(data) {
    const url = 'http://localhost:3000/api/profile/updateUser';
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
                console.log(response);
            } else {
                let myElement = document.getElementById("userError");
                const input = document.getElementById('user');
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


