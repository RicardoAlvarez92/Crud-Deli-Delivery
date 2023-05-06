//Definicion de variables
const urlApi = "http://localhost:3000/api/restaurantes/";
const contenedorRegistros = document.querySelector(".contenedorRegistros");
/* const formNuevoRest = document.querySelector("#formNuevoRest"); */
const contSubirImg = document.querySelector(".contSubirImg");
const inpImgNuevoRest = document.getElementById("inpImgNuevoRest");
const imgNuevoRest = document.querySelector(".imgNuevoRest");
const inpNombNuevoRest = document.getElementById("inpNombNuevoRest");
const inpUbicNuevoRest = document.getElementById("inpUbicNuevoRest");
const inpAperNuevoRest = document.getElementById("inpAperNuevoRest");
const inpCierNuevoRest = document.getElementById("inpCierNuevoRest");
const checkCateNuevoRest = document.querySelectorAll(".checkCateNuevoRest");
const checkDiaNuevoRest = document.querySelectorAll(".checkDiaNuevoRest");
const btnGuardarNuevoRest = document.getElementById("btnGuardarNuevoRest");

//buscador
const inputBuscador = document.getElementById("inputBuscador");
const btnBuscador = document.getElementById("btnBuscador"); 

/* Limpiar inputs modal nuevo rest */
btnNuevoRest.addEventListener("click", ()=>{
    imgNuevoRest.src = "./resources/img/icons/uploadImg.png";
    inpNombNuevoRest.value = "";
    inpUbicNuevoRest.value = "";
    inpAperNuevoRest.value = "";
    inpCierNuevoRest.value = "";
    limpiarChecks(checkCateNuevoRest);
    limpiarChecks(checkDiaNuevoRest);
});

//Mostrar registros con fectth
fetch(urlApi)
    .then( res => res.json())
    .then(data => {
        data.forEach(restaurante => {
            baseDeDatos.push(restaurante);
        })
        
        renderizar(baseDeDatos);
    })
    .catch(e => console.log(e))

    
//Eliminar Restaurante 
on(document, "click", ".btnBorrarRest", e => {
    const fila = e.target.parentNode.parentNode.parentNode;
    const nomRest = fila.children[2].innerHTML;
    const idRest = fila.firstElementChild.innerHTML;

    Swal.fire({
        title: `seguro quieres eliminar el registro de ${nomRest}?`,
        showDenyButton: true,
        confirmButtonText: 'Borrar',
        denyButtonText: `Conservar`,
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                showConfirmButton: false,
                text:'El registro fue eliminado con exito',
                })
            fetch(urlApi+idRest,{
                method: "DELETE"
            })
            .then(res => res.json())
            .then(()=> location.reload())
        } else if (result.isDenied) {
        }
    })
})

//Redirecciona a la pagina para editar restaurante 
on(document, "click", ".btnEditarRest", e =>{
    const fila = e.target.parentNode.parentNode.parentNode;
    const idRest = fila.firstElementChild.innerHTML;
    location.href=`http://localhost:1000/restaurante/${idRest}`;
});

btnBuscador.addEventListener("click", buscarRest);
inputBuscador.addEventListener("keyup", buscarRest);

contSubirImg.addEventListener("click", (e)=>{
    inpImgNuevoRest.click();
})

//muestra la imagen elegida localmente
inpImgNuevoRest.onchange = ()=>{
    mostrarImagen(inpImgNuevoRest, imgNuevoRest);
}

const btnAtras = document.querySelector("#btnAtras");
const btnSiguiente = document.querySelector("#btnSiguiente");
const informacionPagina = document.querySelector("#informacion-pagina");
const elementosPorPagina = 2;
let paginaActual = 1;
const baseDeDatos = [];
let prueba = baseDeDatos;
/* 

*/
const paginas = document.querySelector(".paginas");

const avanzarPagina = () => {
    paginaActual = paginaActual + 1;
    renderizar(prueba);
}

const retrocederPagina = () => {
    paginaActual = paginaActual - 1;
	renderizar(prueba);
}

const obtenerRebanadaDeBaseDeDatos = (pagina = 1, datos) => {
	const corteDeInicio = (paginaActual - 1) * elementosPorPagina;
	const corteDeFinal = corteDeInicio + elementosPorPagina;
	return datos.slice(corteDeInicio, corteDeFinal);
}

function obtenerPaginasTotales(datos) {
	return Math.ceil(datos.length / elementosPorPagina);
}

function gestionarBotones(datos) {
	// Comprobar que no se pueda retroceder
	if (paginaActual === 1) {
		btnAtras.setAttribute("disabled", true);
	} else {
		btnAtras.removeAttribute("disabled");
	}
	// Comprobar que no se pueda avanzar
	if (paginaActual === obtenerPaginasTotales(datos)) {
		btnSiguiente.setAttribute("disabled", true);
	} else {
		btnSiguiente.removeAttribute("disabled");
	}
}

const renderizar = (datos) => {
	// Limpiamos los artículos anteriores del DOM
	borrarElementosContenedor(".registroRestaurante", contenedorRegistros);
	// Obtenemos los artículos paginados
	const rebanadaDatos = obtenerRebanadaDeBaseDeDatos(paginaActual, datos);
	//// Dibujamos
	// Deshabilitar botones pertinentes (retroceder o avanzar página)
	gestionarBotones(datos);
	// Informar de página actual y páginas disponibles
	informacionPagina.textContent = `${paginaActual}/${obtenerPaginasTotales(datos)}`;
	// Crear un artículo para cada elemento que se encuentre en la página actual
	listarRestaurantes(rebanadaDatos);
}

btnAtras.addEventListener("click", () => {
    retrocederPagina();
});
btnSiguiente.addEventListener("click", () => {
    avanzarPagina();
});





