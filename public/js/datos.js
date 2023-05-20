const urlRestaurantes = 'http://localhost:3000/api/restaurantes/'
const urlCategoriasMenu = 'http://localhost:3000/api/categoriasMenu'
const urlPlatillos = 'http://localhost:3000/api/platillos'
let restaurantes = [];
let categoriasMenu = [];
let platillos = [];

const GuardarDatosEnVariables = (url, array) => {
    fetch(url)
.then(res => res.json())
.then(datos => {
    console.log(datos);
    datos.forEach(dato => {
        let obj = new Object(dato);
        array.push(obj);
        
    });
})
}

GuardarDatosEnVariables(urlRestaurantes, restaurantes);
GuardarDatosEnVariables(urlCategoriasMenu, categoriasMenu);
GuardarDatosEnVariables(urlPlatillos, platillos);
