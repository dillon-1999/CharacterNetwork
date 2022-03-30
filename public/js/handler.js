document.addEventListener('readystatechange', () => {    
  if (document.readyState == 'complete'){
    if(document.getElementById('profilePhotoContainer')){
        let photo = document.getElementById('profilePhotoContainer');
        let avatarAddress = photo.getAttribute('name');
        let child = photo.firstChild.nextElementSibling;
        console.log(child);
        child.src = `${window.location.origin}/userAvatars/${avatarAddress}`;
    }
  }
});
                                                        

document.addEventListener('readystatechange', () => {    
    if (document.readyState == 'complete'){
        if(document.getElementById('charPhotoContainer')){
            let photo = document.getElementById('charPhotoContainer');
            let avatarAddress = photo.getAttribute('name');
            let child = photo.firstChild.nextElementSibling;
            console.log(child);
            child.src = `${window.location.origin}/charAvatars/${avatarAddress}`;
        }
    }
});

document.addEventListener('readystatechange', () => {    
    if (document.readyState == 'complete'){
        if(document.getElementById('profilePhotoContainer')){
            let photo = document.getElementById('searchPhotoContainer');
            let avatarAddress = photo.getAttribute('name');
            let child = photo.firstChild.nextElementSibling;
            console.log(child);
            child.src = `${window.location.origin}/systemImages/search.png`;
        }
    }
});


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
            window.location.replace(`${window.location.origin}/users/homepage?userID=${userID}`);
        } else {
            document.querySelector('.error').textContent = "An error has occurred...";
        }
    } catch(err) {
        console.error(err)
    }
}

async function createProject(projectName, projectType, genre, projectDescription){
    try{
        const response = await fetch (`${window.location.origin}/projects/createProject`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({projectName, projectType, genre, projectDescription})
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

async function changeVisibility(visibility, projectID){
    try{
        const response = await fetch (`${window.location.origin}/projects/changeVisibility`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({visibility, projectID})
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

if(document.getElementById('createProjectForm')){
    document.getElementById('createProjectForm').addEventListener('submit', (event) => {
    event.preventDefault();
    let name = document.getElementById('name').value;
    let type = document.getElementById('type').value;
    let genre = document.getElementById('genre').value;
    let description = document.getElementById('description').value;
    createProject(name, type, genre, description);
});
}

if(document.getElementById('anchor')){
    document.getElementById('anchor').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.replace(`${window.location.origin}/createUser`);
});
}

//Aly Nichols random generation
//name stuff
function pick_cons(name)
{
    const cons = ['b', 'b', 'c', 'c', 'd', 'd', 'd', 'f', 'f', 'g', 'h', 'j', 'k', 'l', 'l', 'l', 'm', 'm',
                  'n', 'n', 'n', 'p', 'p', 'q', 'r', 'r', 'r', 's', 's', 's', 't', 't', 't', 'v', 'v', 'w', 'x', 'z'];
    num = Math.floor(Math.random() * cons.length);
    name = name + cons[num];
    
    return name;
}

function pick_vowel(name)
{
    const vowels = ['a', 'a', 'a', 'e', 'e', 'e', 'i', 'i', 'o', 'o', 'o', 'u', 'u', 'y'];
    num = Math.floor(Math.random() * vowels.length);
    name = name + vowels[num];
    
    return name;
}


function makeName()
{
    rand_length = Math.floor(Math.random() * 6 + 3);
    vowel_count = 0;    //number of vowels used in a row
    cons_count = 0;     //number of consonants used in a row
    
    name = "";
    
    //pick first letter
    choice = Math.floor(Math.random() * 2);
    if (choice == 0) {
      name = pick_cons(name).toUpperCase();
      cons_count = 2;
    }
    else {
      name = pick_vowel(name).toUpperCase();
      vowel_count = 1;
    }
    
    //pick middle letters
    for(i = 1; i < rand_length; i++) {
        if (cons_count == 2) {
            name = pick_vowel(name);
            vowel_count++;
            cons_count = 0;
        }
        else if (vowel_count == 2) {
            name = pick_cons(name);
            cons_count++;
            vowel_count = 0;
        }
        else {
            choice = Math.floor(Math.random() * 2);
            if (choice == 0)
            {
                name = pick_cons(name);
                cons_count++;
                vowel_count = 0;
            }
            else
            {
                name = pick_vowel(name);
                vowel_count++;
                cons_count = 0;
            }
        }
        
    

    }
    
    return name;
}

//random output
if(document.getElementById('randomButton')){
document.getElementById('randomButton').addEventListener("click", () => {
  //name
    document.getElementById('name').value = makeName();
  
  //eyes
    const eyeColor = ["green", "hazel", "brown", "grey", "blue", "purple"];
    index = Math.floor(Math.random() * eyeColor.length);
    document.getElementById('eyes').value = eyeColor[index];
  
  //hair
    const hairColor = ["brown", "black", "blonde", "red", "silver"];
    index = Math.floor(Math.random() * hairColor.length);
    document.getElementById('hair').value = hairColor[index];
    
    //skin
    const skinColor = ["olive", "dark", "tan" , "pale"];
    index = Math.floor(Math.random() * skinColor.length);
    document.getElementById('skin').value = skinColor[index];
    
    //feet
    feet = Math.floor(Math.random() * 4 + 4);
    document.getElementById('feet').value = feet;
    
    //inches
    inches = Math.floor(Math.random() * 12);
    document.getElementById('inches').value = inches;
    
    //gender
    const gender = ["Male", "Female"];
    index = Math.floor(Math.random() * gender.length);
    document.getElementById('gender').value = gender[index];
    
});
}



//Aly Nichols
if(document.getElementById('test')){
  console.log("Hey");
  document.getElementById("test").addEventListener("click", () => {
    document.getElementById("test").innerHTML = "Boo";
  });
    //window.location.replace(`${window.location.origin}/users/homepage?userID=${req.session.userID}`);
}
 
 //if(document.getElementById('header')){
    //document.getElementById('header').addEventListener('click', (event) => {
    //    event.preventDefault();
  //      window.location.replace(`${window.location.origin}/users/homepage?userID=${userID}`);
        
//});}

// if(document.getElementById('private-button')){
//     document.getElementById('private-button').addEventListener('click', (event) => {
//         event.preventDefault();
//         const id = document.getElementById('private-button').name;
//         changeVisibility(0, id);
//     });
// }

// if(document.getElementById('public-button')){
//     document.getElementById('public-button').addEventListener('click', (event) => {
//         event.preventDefault();
//         const id = document.getElementById('public-button').name;
//         changeVisibility(0, id);
//     });
// }



