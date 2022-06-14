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
                location.reload();

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
                string += `<div class="col"><a type="submit" class="btn btn-outline-primary" href="createjeu.html?IDJeu=${data.data[i].IDJeu}&NomJeu=${data.data[i].NomJeu}" value="${data.data[i].IDJeu}">${data.data[i].NomJeu}</a></div>`
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
    
        window.AffichageJeu = function() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const IDJeu = urlParams.get('IDJeu');
            const NomJeu = urlParams.get('NomJeu');
            axios.get('http://localhost:3000/getDessin/' + IDJeu)
            .then(
                data => {
                    let string = "";
                    string += `<div>${NomJeu}</div>`
                    document.getElementById("titrejeu").innerHTML = string;
                    let img = ``;
                    for (let i = 0; i < data.data.length; i++) {
                        img += `<img src="data:image/png;base64,${data.data[i].img_blob}" class="card-img-top" alt="..." style="width: 250px">`;
                        document.getElementById("img-container").innerHTML += img;
                    }
                }
            )
            .catch(
                err => {
                    console.error(err);
                }
            )
        }



        
        window.sendingDessin = function() {
            const check = document.getElementById("flexSwitchCheckChecked");
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const IDJeu = urlParams.get('IDJeu');
            let formData = new FormData();
            const dessin = document.getElementById('dessin')
            console.log(dessin.files[0]);
            formData.append("dessin", dessin.files[0]);
            formData.append("IDJeu", IDJeu);
            console.log(check.checked);
            if (check.checked == true){
                const indice = document.getElementById('texteQuestion')
                formData.append("texteQuestion", indice);
            }
            else {
                formData.append("texteQuestion", null);
            }
            
            
            axios.post('http://localhost:3000/setDessin', formData, {
                    'Content-Type': 'multipart/form-data'
                })
                .then(
                    data => {
                        console.log(data.data);
                    }
                )
                .catch(
                    err => {
                        console.error(err);
                    }
                )
        }

        window.deleteDessin = function(id) {
            axios.delete(`deleteDessin/${id}`)
                .then(
                    () => {
                        this.getDessin();
                    }
                )
                .catch(
                    err => {
                        console.error(err);
                    }
                )
        }

        window.afficheIndice = function() {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            let string = "";
            if (document.getElementById("indice").innerHTML == "") {
                string += `<div class="row">
            <form class="row g-3">
                <div class="col-auto">
                    <label for="staticEmail2" class="fs-4">Donnez un indice ou une question :</label>
                </div>
                <div class="col-auto">
                    <input class="form-control" id="texteQuestion">
                </div>   
            </form> 
            </div>`
            } else {
                string += "";
            }
            
            
            document.getElementById("indice").innerHTML = string;
                   
               
        }