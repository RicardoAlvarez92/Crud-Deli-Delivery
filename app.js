//1 - we invoke express
const express = require("express");
const app = express();
const multer = require("multer");
const path = require('path');
const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const methodOverride = require("method-override");

/* const multer = require("./multer/multer");
const cloudinary  = require("./cloudinary/cloudinary"); */

//2 - we set urlencoded to capture the form data
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//method override
app.use(methodOverride("_method"));


//3 - we inoke dotenv
const dotenv = require("dotenv");
dotenv.config({path:"./env/.env"});

//4 - public directory
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

//5 - template engine
app.set("view engine", "ejs");

//6 - we invoke bcryptjs
const bcryptjs = require("bcryptjs");

//7 - variable session
const session = require("express-session")
app.use(session({
    secret:"secret",
    resave: true,
    saveUninitialized: true
}));

//8 - we invoke the connection module
const connection = require("./database/db");
const { name } = require("ejs");
const { Console } = require("console");

//multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
})
app.use(multer({storage}).single("imagen"));

// - Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

//10 - we establish the routes
app.get("/login", (req, res)=>{
    res.render("login");
}) 

app.get("/register", (req, res) =>{
    res.render("register");
})

//10 - Register
app.post("/register", async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const pass = req.body.pass;
    let passhash = await bcryptjs.hash(pass, 8);
    connection.query("INSERT INTO usuarios SET ?", {usuario:user, nombre:name, pass:passhash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render("register",{
                alert: true,
                alertTitle: "Registration",
                alertMessage:"Successful Registration!",
                alertIcon:"success",
                showConfirmButton:false,
                timer:1500,
                ruta:""
            })
        }
    })

})

//11 - Autentication
app.post("/auth", async (req, res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passHash =await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query("SELECT * FROM usuarios WHERE usuario = ?", [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render("login",{
                    alert: true,
                    alertTitle: "Error",
                    alertMessage:"Usuario y/o contraseña incorrectas!",
                    alertIcon:"error",
                    showConfirmButton:true,
                    timer:false,
                    ruta:"login"
                })
            }else{
                req.session.loggedin = true;
                req.session.name = results[0].usuario
                res.render("login",{
                    alert: true,
                    alertTitle: "Conexion Exitosa",
                    alertMessage:"Login Correcto!",
                    alertIcon:"success", 
                    showConfirmButton:false,
                    timer:1500,
                    ruta:""
                    }) 
            }
        })
    }
})

//12 - Auth pages
app.get("/", (req, res)=>{
    if(req.session.loggedin){
        res.render("index",{
            login:true,
            name: req.session.name
        });
    }else{
        res.render("index",{
            login:false,
            name:"Debe iniciar sesion"
        })
    }
})

// - New Rest
app.post("/", async (req, res) => {

    let imagenRestaurant = "";
    if(req.file){
        const uploadImage = await cloudinary.v2.uploader.upload(req.file.path);
        imagenRestaurant = `${uploadImage.url}`;
    }else{
        imagenRestaurant = "https://res.cloudinary.com/dlgkssswu/image/upload/v1680589895/kwzmtj1sevnwhmguvly9.png"
    }

    const categorias = [req.body.mexicana, req.body.americana, req.body.asiatica, req.body.pizza, req.body.postres, req.body.panaderia, req.body.pollo, req.body.todo]

    const dias = [req.body.lunes, req.body.martes, req.body.miercoles, req.body.jueves, req.body.viernes, req.body.sabado, req.body.domingo]

    const categoriasFilter = categorias.filter(categoria => categoria !== undefined);
    const diasFilter = dias.filter(dia => dia !== undefined);

    const data = {
        nombre_rest: req.body.nombre,
        ubicacion: req.body.ubicacion,
        imagen: imagenRestaurant,
        apertura: req.body.apertura,
        cierre: req.body.cierre,
        status: "Inactivo",
        dias_abierto: `${diasFilter}`,
        categorias: `${categoriasFilter}`
    }
    let sql = "INSERT INTO restaurantes SET ?";
    connection.query(sql, data, (e, results) =>{
        if(e){
            throw e;
        }else{
            Object.assign(data, {id: results.insertId})//agregamos el id al objeto data
        }
    });

    if(req.file){
        await fs.unlink(req.file.path);
    }
    res.redirect("/");
})

app.get("/restaurante/:id", (req, res) =>{
    const id= req.params.id;
    const sentenceSql = `SELECT * FROM restaurantes WHERE id_restaurante = ${id}`
    connection.query(sentenceSql, async(error, results)=>{
        if(results.length != 0){
            res.render("edit", {
                estatus: results[0].status,
                imagen: results[0].imagen,
                apertura: results[0].apertura,
                cierre: results[0].cierre,
                id: results[0].id_restaurante,
                nombre: results[0].nombre_rest,
                ubicacion: results[0].ubicacion,
                categorias: results[0].categorias,
                dias: results[0].dias_abierto
                
                });
        }else{
            res.send("pagina no existe");
        }
    })
})

//Actualizar restaurante
app.put("/restaurante/:id", async (req, res) =>{

    let id = req.params.id;
    let imagenRestaurant = "";
    if(req.file){
        const uploadImage = await cloudinary.v2.uploader.upload(req.file.path);
        imagenRestaurant = `${uploadImage.url}`;
    }else{
        imagenRestaurant = `${req.body.url}`;
    }

    const categorias = [req.body.mexicana, req.body.americana, req.body.asiatica, req.body.pizza, req.body.postres, req.body.panaderia, req.body.pollo, req.body.todo]

    const dias = [req.body.lunes, req.body.martes, req.body.miercoles, req.body.jueves, req.body.viernes, req.body.sabado, req.body.domingo]

    const categoriasFilter = categorias.filter(categoria => categoria !== undefined);
    const diasFilter = dias.filter(dia => dia !== undefined);

    const {nombre, ubicacion, apertura, cierre} = req.body;


    let sql = "UPDATE restaurantes SET nombre_rest = ?, ubicacion = ?, imagen = ?, apertura = ?, cierre = ?, dias_abierto = ?, categorias = ? WHERE id_restaurante = ?";
    connection.query(sql, [nombre, ubicacion, imagenRestaurant, apertura, cierre, `${diasFilter}`, `${categoriasFilter}`, id ], (e, results) =>{
        if(e){
            throw e;
        }
    })  

    if(req.file){
        await fs.unlink(req.file.path);
    }
    res.redirect(`/restaurante/${id}`);
})

//Editar platillos 
app.get("/editar/platillo:id", (req, res)=> {
    const id= req.params.id;
    const sentenceSql = `SELECT * FROM platillos WHERE id_platillo = ${id}`
    connection.query(sentenceSql, async(error, results)=>{
        if(results.length != 0){
            res.render("platillo", {
                id: results[0].id_platillo,
                nombre: results[0].nombre_plati,
                precio: results[0].precio,
                descripcion: results[0].descripcion,
                imagen: results[0].imagen,
                estatus: results[0].estatus
                });
        }else{
            res.send("pagina no existe");
        }
    })
})

app.put("/editar/platillo:id", async (req, res)=> {
    let id = req.params.id;
    let imagen = "";
    let estatus= "";
    if(req.file){
        const uploadImage = await cloudinary.v2.uploader.upload(req.file.path);
        imagen = `${uploadImage.url}`;
    }else{
        imagen = `${req.body.url}`;
    }

    if(req.body.estatus == "on"){
        estatus = "Activo"
    }else{
        estatus = "Inactivo"
    }

    const {nombre, descripcion, precio} = req.body;


    let sql = "UPDATE platillos SET nombre_plati = ?, precio = ?, descripcion = ?, imagen = ?, estatus = ? WHERE id_platillo = ?";
    connection.query(sql, [nombre, precio, descripcion, imagen, estatus, id ], (e, results) =>{
        if(e){
            throw e;
        }
    })  

    if(req.file){
        await fs.unlink(req.file.path);
    }
    res.redirect(`/editar/platillo${id}`);
});

//Nuevo Platillo 
app.get("/restaurante/:id/categoria:id_categoria", async (req, res) => {
    res.render("createPlatillo")
})

app.post("/restaurante/:id/categoria:id_categoria", async (req, res) => {
    const id = req.params.id;
    const idCategoria = req.params.id_categoria;

    let imagen = "";
    if(req.file){
        const uploadImage = await cloudinary.v2.uploader.upload(req.file.path);
        imagen = `${uploadImage.url}`;
    }else{
        imagen = "https://res.cloudinary.com/dlgkssswu/image/upload/v1680589895/kwzmtj1sevnwhmguvly9.png"
    }

    const data = {
        nombre_plati: req.body.nombre,
        id_categoria: idCategoria,
        id_restaurante: id,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        imagen: imagen,
        estatus: "Inactivo",
    }

    let sql = "INSERT INTO platillos SET ?";
    connection.query(sql, data, (e, results) =>{
        if(e){
            throw e;
        }else{
            Object.assign(data, {id: results.insertId})//agregamos el id al objeto data
        }
    });

    if(req.file){
        await fs.unlink(req.file.path);
    }
    res.redirect(`/restaurante/${id}`);
})


//13 - Logout
app.get("/logout", (req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/")
    })
})

app.listen(1000, (req, res)=>{
    console.log("server on local host 1000");
})


/* revisar poque al logear no esta dando el valor logedin */

