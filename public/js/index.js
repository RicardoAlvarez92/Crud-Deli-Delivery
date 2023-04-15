//Definicion de variables
const urlApi = "http://localhost:3000/api/restaurantes/";
const ContenedorRegistros = document.querySelector(".ContenedorRegistros");
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
        listarRestaurantes(data);
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
    location.href=`http://localhost:1000/edit${idRest}`;
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



