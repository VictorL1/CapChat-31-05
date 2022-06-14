var express = require('express');
const cors = require('cors')
const port = 3000
var mysql = require('mysql');
const fs = require('fs');
const crypto = require('crypto');
const fileUpload = require('express-fileupload')
const jwt = require('jsonwebtoken');
var app = express();
require('dotenv').config();
app.use(cors())
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({
  extended: true
}));

var sql = mysql.createPool({
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock', //Desactiver sous Windows
  host: "localhost",
  user: "root",
  password: "root",//Pas de mdp sous Windows --> root sous Mac
  database: "CapChat"
});

if (!fs.existsSync('.env')) {
  fs.appendFile('.env', `SECRET_TOKEN=${crypto.randomBytes(64).toString('hex')}\nSECRET_TOKEN_MDP=${crypto.randomBytes(64).toString('hex')}`, function (err) {
    if (err) throw err;
  });
}

// Connexion & inscription

app.post('/connexion', async function (req, res) {
  const users = await getUsers();
  const user = users.find(u => u.NomArtiste == req.body.username && u.MDP == hash(req.body.password.toString()));
  if (!user) {
    return res.status(400).json({
      message: `le nom d'utilisateur ou le mot de passe sont incorrect`
    })
  }
  
  const token = jwt.sign({
    id: user.IDartiste,
    username: req.body.username
  }, process.env.SECRET_TOKEN, {
    expiresIn: '12h'
  });
  return res.send({
    token: token
  })
})

app.post('/inscription', async function (req, res) {
  const users = await getUsers();
  const user = users.find(u => u.NomArtiste == req.body.username);
  if (user) {
    return res.status(400).json({
      message: `L'utilisateur ${req.body.username} existe déjà`
    })
  }

  await setUser(req.body.username, req.body.password)
    .then(
      data => {
        const token = jwt.sign({
          id: data.insertId,
          username: req.body.username
        }, process.env.SECRET_TOKEN, {
          expiresIn: '12h'
        });
        res.send({
          message: `Le compte ${req.body.username} a été créé avec succès`,
          token: token
        });
      }
    )
    .catch(
      err => {
        return res.status(400).json({
          message: `erreur : ${err}`
        });
      }
    );
})

// test postman token

app.get('/', authenticateToken, function (req, res) {
  res.json('token');
});

app.get('/artiste', function (req, res) {


  sql.query('SELECT * from artiste', function (err, rows) {
    if (err) {
      res.status(400).json(err);
    }
    res.json(rows);
  });

})

app.get('/artiste/:userId', function (req, res) {


  sql.query(`SELECT * from artiste WHERE IDartiste = ${req.params.userId}`, function (err, rows) {
    if (err) {
      res.status(400).json(err);
    }
    res.json(rows);
  });

})

app.post('/artiste/', function (req, res) {

  sql.query(`INSERT INTO artiste (NomArtiste, MDP) VALUES ('${req.body.Nom}','${req.body.Mdp}')`, function (err) {
    if (err) {
      res.status(400).json(err);
    }
    res.status(200).end();
  })
})

app.put('/artiste', function (req, res) {

  sql.query(`UPDATE artiste SET NomArtiste = '${req.body.Nom}' , MDP = '${req.body.Mdp}' WHERE IDartiste = '${req.body.id}'`, function (err) {
    if (err) {
      res.status(400).json(err);
    }
    res.status(200).end();
  })
})

app.delete('/artiste', function (req, res) {
  sql.query(`DELETE FROM artiste WHERE IDartiste = '${req.body.id}'`, function (err) {
    if (err) {
      res.status(400).json(err);
    }
    res.status(200).end();
  })
})

app.get('/theme',authenticateToken, function (req, res) {


  sql.query('SELECT * from theme', function (err, rows) {
    if (err) {
      res.status(400).json(err);
    }
    res.json(rows);
  });

})

app.get('/jeu', authenticateToken, function (req, res) {


  sql.query('SELECT * from jeu', function (err, rows) {
    if (err) {
      res.status(400).json(err);
    }
    res.json(rows);
  });

})

app.post('/jeu/', authenticateToken, function (req, res) {
  const Iduser = getIdUser(req);
  console.log(Iduser);
  sql.query(`INSERT INTO jeu (NomJeu, IdArtiste) VALUES ('${req.body.Nom}','${Iduser.id}')`, function (err) {
    if (err) {
      res.status(400).json(err);
    }
    res.status(200).end();
  })
})

app.put('/jeu/:id',authenticateToken, function (req, res) {

  sql.query(`UPDATE jeu SET NomJeu = '${req.body.Nom}' , urlJeu = '${req.body.url}' WHERE IDJeu = '${req.params.id}'`, function (err) {
    if (err) {
      res.status(400).json(err);
    }
    res.status(200).end();
  })
})

app.delete('/jeu',authenticateToken, function (req, res) {
  sql.query(`DELETE FROM jeu WHERE IDJeu = '${req.body.id}'`, function (err) {
    if (err) {
      res.status(400).json(err);
    }
    res.status(200).end();
  })
})

app.get('/jeu/:Idartist',authenticateToken, function (req, res) {


  sql.query(`SELECT * from jeu WHERE IdArtiste='${req.params.Idartist}'`, function (err, rows) {
    if (err) {
      res.status(400).json(err);
    }
    res.json(rows);
  });

})

app.get('/jeu/:Idtheme',authenticateToken, function (req, res) {


  sql.query(`SELECT * from jeu WHERE IdTheme='${req.params.Idtheme}'`, function (err, rows) {
    if (err) {
      res.status(400).json(err);
    }
    res.json(rows);
  });

})

app.put('/image/:id',authenticateToken, function (req, res) {

  sql.query(`UPDATE image SET TexteQuestion = '${req.body.txt}' WHERE IDimage = '${req.params.id}'`, function (err) {
    if (err) {
      res.status(400).json(err);
    }
    res.status(200).end();
  })
})


// Fonctions


function getUsers() {
  return new Promise((resolve, reject) => {
    sql.query('SELECT IDartiste, NomArtiste, MDP FROM artiste', function (err, rows) {
      if (err) return reject(err)
      return resolve(rows);
    })
  })
}

function setUser(nom, mdp) {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO artiste(NomArtiste, MDP) VALUES ('${nom}','${hash(mdp.toString())}')`, function (err, rows) {
      if (err) return reject(err);
      return resolve(rows);
    })
  })
}

function hash(mdp) {
  return crypto.createHmac('sha512', process.env.SECRET_TOKEN_MDP).update(mdp).digest('hex').toString();
}


// verifie le token de l'utilisateur
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).json({
    message: 'Erreur : token manquant'
  })

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) return res.status(403).json({
      message: `Erreur : ${err}`
    })
    req.user = user
    next()
  })
}


app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

function getIdUser(req) {
  const token = req.headers.authorization && extractBearerToken(req.headers.authorization)
  const decoded = jwt.decode(token, {
      complete: false
  })
  return decoded
}
function extractBearerToken(headerValue) {
  if (typeof headerValue !== 'string') {
      return false
  }

  const matches = headerValue.match(/(bearer)\s+(\S+)/i)
  return matches && matches[2]
}

app.post('/nouveau-jeu', async function (req, res) {
const iduser = getIdUser(req);
console.log(req.body.NomJeu, iduser.id, req.body.theme);
  await setJeu(req.body.NomJeu, iduser.id, req.body.theme)
    .then(
      data => {
      res.end();
      }
    )
    .catch(
      err => {
        return res.status(400).json({
          message: `erreur : ${err}`
        });
      }
    );
})

function setJeu(NomJeu, IdArtiste, IdTheme) {
  return new Promise((resolve, reject) => {
    sql.query(`INSERT INTO jeu(NomJeu, IdArtiste, IdTheme) VALUES ('${NomJeu}','${IdArtiste}','${IdTheme}')`, function (err, rows) {
      if (err) return reject(err);
      return resolve(rows);
    })
  })
}

app.get('/getDessin/:idJeu', authenticateToken, async function(req, res) {
  await getDessin(req.params.idJeu)
  .then(
      data => {
          const reponse = convertBuffObjectToString(data);
          res.json(reponse);
      }
  )
  .catch(
      err => {
          return res.status(400).json(err);
      }
  )
})

function getDessin(idJeu) {
  return new Promise((resolve, reject) => {
      sql.query(`
          SELECT image.IDimage AS id, img_blob, TexteQuestion, ImageSinguliere, image.IdJeu FROM image 
          INNER JOIN jeu ON image.IdJeu = jeu.IDJeu
          AND image.IdJeu = ${idJeu}
          ORDER BY image.IDimage DESC`, 
          function(err, rows) {
          if (err) return reject(err);
          return resolve(rows);
      })
  })
}

app.post('/setDessin', authenticateToken, async function(req, res) {
  const dessin = req.files.dessin.data.toString('base64');
  console.log(req.body.IDJeu);
  sql.query(`INSERT INTO image(img_blob, TexteQuestion, IdJeu) VALUES ('${dessin}','${req.body.indice}','${req.body.IDJeu}')`, function (err, rows) {
  if (err) {
      return res.status(400).json(err);
  }
  res.json("coucou");
})
})

function convertBuffObjectToString(data) {
  for (let i = 0; i < data.length; i++) {
      data[i].img_blob = data[i].img_blob.toString();
  }
  return data
}