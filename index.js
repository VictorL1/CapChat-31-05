const axios = require("axios");


window.Connexion = function() {
    console.log(document.getElementById("exampleInputEmail1").value);
    axios.post('http://localhost:3000/connexion', {
       "username": document.getElementById("exampleInputEmail1").value,
       "password": document.getElementById("exampleInputPassword1").value
    })
    .then(
        data => {
            console.log(data.data);
            localStorage.setItem("token", data.data.token);
            location.href = "capchat.html";
        }
    )
    .catch(
        err => {
            console.error(err);
        }
    )
}

window.Inscription = function() {
    console.log(document.getElementById("exampleInputEmail2").value);
    axios.post('http://localhost:3000/inscription', {
       "username": document.getElementById("exampleInputEmail2").value,
       "password": document.getElementById("exampleInputPassword2").value
    })
    .then(
        data => {
            console.log(data.data);
            localStorage.setItem("token", data.data.token);
            user = document.getElementById("exampleInputEmail2").value;
            alert("Le compte " + user + " a été créé, vous pouvez vous connecter !")
        }
    )
    .catch(
        err => {
            alert(err.response.data.message)
        }
    )
}

window.Deconnexion = function() {
    
        localStorage.clear();
        location.href = "index.html";
    

}