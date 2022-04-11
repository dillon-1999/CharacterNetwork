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

async function uploadCharFile(userID, charID){
    try{
        let form = document.getElementById('uploadCharImage');
        let formData = new FormData(form);
        const response = await fetch(`${window.location.origin}/characters/uploadImage/?charID=${charID}`, {
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

async function updateForm(userID, username, email, bio, password){
    try{
        const response = await fetch(`${window.location.origin}/users/updateUser?userID=${userID}`, {
            "method": "POST",
            "headers":{

                "Content-Type": "application/json"
            },
            "mode": "cors",
            "body": JSON.stringify({username, email, bio, password})
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
async function updateCharForm(userID, charID, updates){
    try{
        const response = await fetch(`${window.location.origin}/characters/updateCharacter?charID=${charID}`, {
            "method": "POST",
            "headers":{

                "Content-Type": "application/json"
            },
            "mode": "cors",
            "body": JSON.stringify(updates)
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

if(document.getElementById('uploadCharAvatar')){
    document.getElementById('uploadCharAvatar').addEventListener('click', (event) => {
        event.preventDefault();
        console.log('in listener')
        if(uploadCharFile(document.getElementById('uploadCharImage').className, document.getElementById('uploadCharAvatar').value)){
            console.log("Yooooo");
        } else {
            console.log("nooooo")
        }
    })
}

if(document.getElementById('updateForm')){
    document.getElementById('updateForm').addEventListener('submit', (event) => {
        event.preventDefault();
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let bio = document.getElementById('bio').value;
        let username = document.getElementById('username').value;
        let userID = document.getElementById('uploadUpdate').value
        
        updateForm(userID, username, email, bio, password);
    })
}

if(document.getElementById('updateCharForm')){
    document.getElementById('updateCharForm').addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('here')
        let name = document.getElementById('name').value;
        let eyeColor = document.getElementById('eyes').value;
        let hairColor = document.getElementById('hair').value;
        let skinColor = document.getElementById('skin').value;
        let feetTall = document.getElementById('feet').value;
        let inchesTall = document.getElementById('inches').value;
        let gender = document.getElementById('gender').value;
        let project = document.getElementById('projects').value;
        let backstory = document.getElementById('backstory').value;
        let traits = document.getElementById('traits').value;
        let userID = document.getElementById('submitEdit').name;
        let charID = document.getElementById('updateCharForm').className;
        const updates = {
            "name": name, 
            "eyeColor": eyeColor,
            "hairColor": hairColor,
            "skinColor": skinColor,
            "feetTall": feetTall,
            "inchesTall": inchesTall,
            "gender": gender,
            "project": project,
            "backstory": backstory,
            "traits": traits
        }
        console.log(userID)
        console.log(charID)
        console.log(updates)
        updateCharForm(userID, charID, updates);
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
    
    let name = "";
    
    //pick first letter
    let choice = Math.floor(Math.random() * 2);
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


async function searchDatabase(search, searchType){
    try{
        const response = await fetch(`${window.location.origin}/search/results`, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({search, searchType})
        });
        if(response.ok){
            if(document.getElementById("searchLink")){
                document.getElementById("searchLink").remove();
            }
            document.querySelector('#error').textContent = "";
            
            let data = await response.json();
            let output = document.getElementById("output");
            
            console.log(data)
            if (data['projectID']){
                // this is a poor way of doing it, 
                // but we need a post request. It's just an easy fix
                let style = 'background: none; border: none;color: #069;text-decoration: underline;cursor: pointer;';
                let form = document.createElement('form');
                let button = document.createElement('button');
                button.type="submit"
                button.innerHTML = data.projectName;
                button.style = style;
                form.id = "searchLink";
                form.action=`/projects/projectPage?projectID=${data['projectID']}`;
                form.method="post"
                form.appendChild(button);
                output.appendChild(form);
            } else {
                let anchor = document.createElement('a');
                anchor.id = "searchLink"
                if(data['charID']){
                    anchor.href = `${window.location.origin}/characters/charPage?charID=${data['charID']}`;
                    anchor.innerText = data['name'];
                } else if(data['userID']){
                    anchor.href = `${window.location.origin}/users/homepage?userID=${data['userID']}`;
                    anchor.innerText = data['username'];
                }
                output.appendChild(anchor);
            }
        } else {
            document.querySelector('#error').textContent = "Search not found. Check your spelling and try again!";
        }
    } catch(err) {
        console.error(err);
    }
}

if (document.getElementById('searchForm')) {
  document.getElementById('searchForm').addEventListener("submit", (event) => {
    event.preventDefault();
    document.getElement
    let userType = document.getElementById('user').checked;
    let charType = document.getElementById('char').checked;
    let projectType = document.getElementById('project').checked;
    let searchData = document.getElementById('search').value;
    let searchType;
    
    if (userType) {
      searchType = 'user';
    }
    else if (charType) {
      searchType = 'char';
    }
    else if (projectType) {
      searchType = 'project';
    }
    else {
      console.log("NOT WORKING");
    }
    searchDatabase(searchData, searchType);
  });

}