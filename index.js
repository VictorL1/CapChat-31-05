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

window.SetJeu = function () {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    const name = document.getElementById("nomJeu").value;
    // const indice = document.getElementById("clueJeu").value;
    // const singular = document.getElementById("img_singular").value;
    // const neutral = document.getElementById("img_neutral").value;
    const theme = document.getElementById("listetheme").value;
    console.log(name);
    axios.post('http://localhost:3000/nouveau-jeu', {
        "NomJeu": name,
        "theme": theme,
        // "indice": indice,
        // "ImgSingular" : singular,
        // "ImgNeutral" : neutral
     })
        .then(
            () => {
                console.log("tout va bien");
                alert("Le jeu " + name + " a été créé, vous pouvez le remplir !")
            }
        ).catch(
            (err) => {
                console.log(err);
            }
        );
}

window.Deconnexion = function() {
    
        localStorage.clear();
        location.href = "index.html";
    

}

window.loadListe = function() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    axios.get('http://localhost:3000/theme')
    .then(
        data => {
            console.log(data.data);
            let string = "";
            for (let i = 0; i < data.data.length; i++) {
                string += `<option value="${data.data[i].IDtheme}">${data.data[i].NomTheme}</option>`
            }
            document.getElementById("listetheme").innerHTML = string;
        }
    )
    .catch(
        err => {
            console.error(err);
        }
    )

}

window.loadJeu = function() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    axios.get('http://localhost:3000/jeu')
    .then(
        data => {
            console.log(data.data);
            let string = "";
            for (let i = 0; i < data.data.length; i++) {
                string += `<div class="col"><a type="submit" class="btn btn-outline-primary" href="createjeu.html?IDJeu=${data.data[i].IDJeu}" value="${data.data[i].IdJeu}">${data.data[i].NomJeu}</a></div>`
            }
            document.getElementById("listejeu").innerHTML = string;
        }
    )
    .catch(
        err => {
            console.error(err);
        }
    )

}

window.jeuARemplir = function() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const IDJeu = urlParams.get('IDJeu')
    axios.get('http://localhost:3000/jeu')
    .then(
        data => {
            console.log(data.data);
            let string = "";
            for (let i = 0; i < data.data.length; i++) {
                string += `<div class="col"><a type="submit" class="btn btn-outline-primary" href="createjeu.html?IDJeu=${data.data[i].IDJeu}" value="${data.data[i].IdJeu}">${data.data[i].NomJeu}</a></div>`
            }
            document.getElementById("listejeu").innerHTML = string;
        }
    )
    .catch(
        err => {
            console.error(err);
        }
    )
}

    window.jeu = function() {
        loadListe();
        loadJeu();
        }
    