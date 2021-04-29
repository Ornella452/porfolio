const express = require("express");
const exphbs = require("express-handlebars");
// const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
require('dotenv').config()
const multer = require('multer')
const cors = require('cors');
const Stat = require('./models/statistique')
const Joi = require('joi');

const storage = multer.diskStorage({//
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        console.log('file multer diskstorage', file);
        cb(null, file.originalname)
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})
const upload = multer({ storage: storage });

const port = process.env.PORT || 3000;


// non utiliser car il faut faire marcher la route get auprès du button concerner 
// mongoose.connect("mongodb://localhost:27017/portfolio",
//     {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true,
//     }
// );


const app = express();
// Express configuration
app.engine("handlebars", exphbs({
    extname: 'handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + "/views/layouts"
}));

app.use(cors())
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use("/bootstrap", express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static('.'));
app.use(express.static('views/images'));

// ces 4 route get est lié au page du site 
app.get("/", (req, res) => {
    res.render("home")
})


app.get("/profil", (req, res) => {
    res.render("profil")
})

app.get("/portfolio", (req, res) => {
    res.render("portfolio")
})


app.get("/contact", (req, res) => {

    res.render("contact")

})

/// cette route qui va me recolter lheure et la date de lordi
// app.get('/cv',async (req, res) => {


//     const d = new Date();
//      const date = d.getDate() + '-' + (d.getMonth()+1) + '-' +d.getFullYear();
//     const hours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
//      const fullDate = date +' '+hours;
//      console.log(fullDate);
//     const result = await Stat.insertMany({
//          jours: this.fullDate
//      })



// })



// route qui fait fonctionner le formulaire pour l'utilisateur me contact
app.post("/sendmail", upload.array(), async (req, res) => {
    const { body } = req;
    const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    text: Joi.string().required(),
    });
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      };
      const { error } = schema.validate(body, options);
    
    if (error) {
        res.render('contact', {
            error: 'Veuillez remplir tout les champs comme il faut svp',
        })
        
    } else {
        const { name, email, text } = req.body
    var mailOptions = {
        host: 'smtp.gmail.com',
        port: process.env.PORT_MAIL,
        secure: false, // use SSL
        auth: {
            user: process.env.EMAIL,
            pass: process.env.MOT_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    }
    mailer = nodemailer.createTransport(mailOptions);
    mailer.sendMail({
        from: "Fred Foo 👻",
        replyTo: email,
        to: "ornella.contact465@gmail.com",
        subject: `Prise de contact de ${name}`,
        text: text,

    });
    res.render("merci", {
        name
    })
    }
})

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

