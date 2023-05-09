//Definicion de variables
/* check pagina abierta */
const checkPaginaAbierta = document.querySelector(".checkPaginaAbierta");
const urlEstatusPagina = "http://localhost:3000/api/estatusPagina"

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

/* Estatus de pagina*/
fetch(urlEstatusPagina)
.then(res => res.json())
.then(data => {
    let estatus = data[0].estatus;
    if(estatus === "Activa"){
        checkPaginaAbierta.children[0].checked = true;
    }
})

const habilitarPagina = (estatus) => {
    fetch(urlEstatusPagina, {
        method:"PUT",
        headers:{
            "Content-Type":"application/json" 
        },
        body:JSON.stringify({
            estatus:estatus
        })
    })
}

checkPaginaAbierta.onchange = () => {
    let activa = checkPaginaAbierta.children[0].checked;
    if(activa){
        habilitarPagina("Activa");
    }else{
        Swal.fire({
            title: 'Quieres Desactivar la pagina?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Desactivar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Terminamos por hoy',
                    cancelButtonText: 'Tomar un pequeño descanso'
                }).then((result) => {
                    if (result.isConfirmed) {
                        habilitarPagina("Inactiva");
                    }else{
                        habilitarPagina("Descanso");
                    }
                })
            }else{
                checkPaginaAbierta.children[0].checked = true;
            }
        })
    }
}

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

//Mostrar registros Restaurantes con fecth
const fetchRestaurantes = () =>{
    fetch(urlApi)
    .then( res => res.json())
    .then(data => {
        data.forEach(restaurante => {
            baseDeDatos.push(restaurante);
        })
        console.log(baseDeDatos)
        renderizarRestaurantes(baseDeDatos);
    })
    .catch(e => console.log(e))
}

fetchRestaurantes();

//Eliminar Restaurante 
on(document, "click", ".btnBorrarRest", e => {
    const fila = e.target.parentNode.parentNode.parentNode;
    const nomRest = fila.children[2].innerHTML;
    const idRest = fila.firstElementChild.innerHTML;
    fetch(urlApi+idRest+"/menu")
    .then(res => res.json())
    .then(data => {
        if(data.length != 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No puedes Eliminar este Registro. Aun tiene categorias de menu vinculadas',
            })
        }else{
            Swal.fire({
                title: `Eliminar registro de <strong> ${nomRest}? </strong>`,
                text: "No pueder revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Borrar!'
                }).then((result) => {
                if (result.isConfirmed) {
                    fetch(urlApi+idRest,{
                        method: "DELETE"
                    })
                    .then(res => res.json())
                    .then(()=>{
                        Swal.fire({
                            title:'Borrado!',
                            text:'El regristro se borro con exito',
                            icon:'success',
                            timer:1500
                        })
                        baseDeDatos = [];
                        fetchRestaurantes();
                        prueba = baseDeDatos;
                    } 
                    )
                    
                }else if (result.isDenied) {
                }
                })
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
let baseDeDatos = [];
let prueba = baseDeDatos;

const paginas = document.querySelector(".paginas");

const avanzarPagina = () => {
    paginaActual = paginaActual + 1;
    renderizarRestaurantes(prueba);
}

const retrocederPagina = () => {
    paginaActual = paginaActual - 1;
	renderizarRestaurantes(prueba);
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

const renderizarRestaurantes = (datos) => {
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





