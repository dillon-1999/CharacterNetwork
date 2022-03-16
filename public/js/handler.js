async function newUser(email, password, username) {
    try {
        const response = await fetch(`${window.location.origin}/newUser/attemptRegister`, {
            "method": "POST",
            "headers": {
            "Content-Type": "application/json"
            },
            "body": JSON.stringify({email, password, username})
        });
        if(response.ok){
            window.location.replace(`${window.location.origin}/login`);
        } else if(response.status >= 400 && response.status < 500) {
            document.querySelector('.error').textContent = "Invalid inputs";
        } 
    } catch (err) {
        document.querySelector('.error').textContent = "Server Error..."
    }
}

async function login(email, password){
    try{
        const response = await fetch (`${window.location.origin}/login`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({email, password})
        });
        if(response.redirected){ // not sending back status, so if redirect then ok
            window.location.replace(response.url);
        } else if(response.status >= 400 && response.status < 500){
            document.querySelector('.error').textContent = "Invalid Username or Password";
        }
    } catch (e){
        document.querySelector('.error').textContent = "Server error...";
    }
}

async function uploadFile(userID){
    try{
        let form = document.getElementById('uploadForm');
        let formData = new FormData(form);
        const response = await fetch(`${window.location.origin}/users/uploadImage/${userID}`, {
            "method": "POST",
            "body": formData
        });
        if(response.ok){
            console.log('upload success');
            window.location.replace(`${window.location.origin}/users/homepage`);
        } else {
            document.querySelector('.error').textContent = "An error has occurred...";
        }
    } catch(err) {
        console.error(err)
    }
}
if(document.getElementById('uploadAvatar')){
    document.getElementById('uploadAvatar').addEventListener('click', (event) => {
        event.preventDefault();
        if(uploadFile(document.getElementById('uploadAvatar').value)){
            console.log("Yooooo");
        } else {
            console.log("nooooo")
        }
    })
}

if(document.getElementById('registerForm')){
    document.getElementById('registerForm').addEventListener('submit', (event) => {
        event.preventDefault();
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let confirmPassword = document.getElementById('confirmPassword').value;
        let username = document.getElementById('username').value;
        if(password === confirmPassword){
            newUser(email, password, username);
            console.log(email)
            console.log(password)
            console.log(username)
        } else {
            document.querySelector('.error').textContent = "Passwords do not match!";
        }
        
    });
}

if(document.getElementById('loginForm')){
    document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    login(email, password);
});
}

if(document.getElementById('anchor')){
    document.getElementById('anchor').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.replace(`${window.location.origin}/createUser`);
});
}