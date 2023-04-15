const contEditarRest = document.querySelector(".contEditarRest");
const imagenEditarRest = document.querySelector(".imagenEditarRest");
const contTablaRest = document.querySelector(".contTablaRest");
const contenedorChecksCategoriasMenu = document.querySelector(".contenedorChecksCategoriasMenu");
const contPlatillos = document.querySelector(".contPlatillos");
const inpNomEditarRest = document.querySelector(".inpNomEditarRest");
const inpUbiEditarRest = document.querySelector(".inpUbiEditarRest");
const checkActivarEditarRestaurante = document.getElementById("checkActivarEditarRestaurante");
const inpApeEditarRest = document.querySelector(".inpApeEditarRest");
const inpCieEditarRest = document.querySelector(".inpCieEditarRest");
const checkCateEditarRestaurante = document.querySelectorAll(".checkCateEditarRest")
const checkDiasEditarRest = document.querySelectorAll(".checkDiaEditarRest");
const idRest = document.querySelector(".idRestaurante").value;
const urlApi = `http://localhost:3000/api/restaurantes/${idRest}`
const inputEditarImagen = document.querySelector(".inputEditarImagen")


fetch(urlApi)
.then(res => res.json())
.then( data => {
    const restaurante = data[0];
    let estatus = restaurante.status;
    let nombreRest = restaurante.nombre_rest;
    let ubicacionRest= restaurante.ubicacion;
    let aperturaRest = restaurante.apertura;
    let cierreRest = restaurante.cierre;
    let diasRestaurante = restaurante.dias_abierto;
    let dias = diasRestaurante.split(",");
    let categoriasRestaurante = restaurante.categorias;
    let categorias = categoriasRestaurante.split(",");
    let imagen = restaurante.imagen;

    if(estatus === "Activo"){
        checkActivarEditarRestaurante.checked = true;
    }else{
        checkActivarEditarRestaurante.checked = false;
    }

    imagenEditarRest.addEventListener("click", (e)=>{
        inputEditarImagen.click();
    })

    inputEditarImagen.onchange = ()=>{
        mostrarImagen(inputEditarImagen, imagenEditarRest);
    }

    inpNomEditarRest.value = nombreRest
    inpApeEditarRest.value = aperturaRest
    inpCieEditarRest.value = cierreRest
    inpUbiEditarRest.value = ubicacionRest
    imagenEditarRest.src = imagen

    checkDiasEditarRest.forEach(check => {
        let valor = dias.find(dia => dia === check.value);
        if(valor){
            check.checked = true;
        }
    })

    checkCateEditarRestaurante.forEach(check => {
        let valor = categorias.find(categoria => categoria === check.value);
        if(valor){
            check.checked = true;
        }
    })
})

/* --------------------------------------------------- */

const contenedorCategoriasMenuModal = document.querySelector(".contenedorCategoriasMenuModal");

    const listarCategoriasMenuChecks = (datosCategorias, contenedor) => {
        let Html = "";
        datosCategorias.forEach(categoria =>{
            Html += `
                    <input type="radio" class="checkCategoriaMenu btn-check ms-2" id="${categoria.id_categoria}" value="${categoria.id_categoria}">
                    <label for="${categoria.nombre}" class="checkCategoriaMenu btn btn-outline-primary ms-2">${categoria.nombre}</label>`
        })
        contenedor.innerHTML += Html;
    }

    const listarCategoriasMenuModal = (datosCategorias, contenedor) => {
        let Html = "";
        datosCategorias.forEach(categoria =>{
            Html += `
                    <div class="categoriasMenuModal input-group my-3">
                        <span class="input-group-text">${categoria.id_categoria}</span>
                        <input type="text" class="inputNombreCategoriaMenu form-control" value="${categoria.nombre}" aria-describedby="button-addon2">
                        <button class="btnBorrarCategoria btn btn-outline-warning" type="button" id="button-addon2">
                            <img src="./resources/img/icons/trash.png" alt="">
                        </button>
                    </div>
                    `
        })
        contenedor.innerHTML += Html;
    }

    const borrarElementosContenedor = (selector, contenedor) => {
        let elementos = document.querySelectorAll(selector);
        elementos.forEach(elemento =>{
            contenedor.removeChild(elemento);
        })
    }
    

    /* fetch(urlApi+"/menu")
    .then(res => res.json())
    .then(categoriasMenu => {

        listarCategoriasMenuChecks(categoriasMenu, contenedorChecksCategoriasMenu);
        listarCategoriasMenuModal(categoriasMenu, contenedorCategoriasMenuModal);
    }) */

const fetchCategoriasMenu = () => {
    fetch(urlApi+"/menu")
    .then( res => res.json())
    .then(data => {
        listarCategoriasMenuChecks(data, contenedorChecksCategoriasMenu);
        listarCategoriasMenuModal(data, contenedorCategoriasMenuModal);
    })
    .catch(e => console.log(e))
}



fetchCategoriasMenu();


const inputnombreCrearCategoriaMenu = document.querySelector(".inputnombreCrearCategoriaMenu");

//Crear Categoria Menu
formCrearCategoriaMenu.addEventListener("submit", (e)=>{
    e.preventDefault();
    fetch(urlApi+"/menu", {
        method:"POST",
        headers:{
            "Content-Type":"application/json" 
        },
        body:JSON.stringify({
            nombre: inputnombreCrearCategoriaMenu.value
        })
    })
    .then(res => res.json())
    .then(data => {
        borrarElementosContenedor(".checkCategoriaMenu", contenedorChecksCategoriasMenu);
        borrarElementosContenedor(".categoriasMenuModal",contenedorCategoriasMenuModal);
        fetchCategoriasMenu();
    })
})


//Eliminar categoria
on(document, "click", ".btnBorrarCategoria", e => {
    const fila = e.target.closest(".btnBorrarCategoria").parentNode;
    const nombreCategoria = fila.children[1].value;
    const idCategoria = fila.firstElementChild.innerHTML;
    console.log(parseInt(idCategoria));
    
    Swal.fire({
        title: `seguro quieres eliminar la categoria ${nombreCategoria}?`,
        showDenyButton: true,
        confirmButtonText: 'Borrar',
        denyButtonText: `Conservar`,
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                showConfirmButton: false,
                text:'El registro fue eliminado con exito',
                })
            fetch(urlApi+"/menu/"+idCategoria,{
                method: "DELETE"
            })
            .then(res => res.json())
            .then(()=> location.reload())
        } else if (result.isDenied) {
        }
    })
})


/* --------EN CODIFICACION  ------------------*/

//Editar Categoria de Menu
modalEditarCategoriasMenu.addEventListener("submit", (e)=>{
    e.preventDefault();
    const categoriasMenuModal = document.querySelectorAll(".categoriasMenuModal");

    categoriasMenuModal.forEach(categoria => {
        let idCategoria = parseInt(categoria.children[0].innerHTML);
        let nombre = categoria.children[1].value;

        fetch(urlApi+"/menu/"+idCategoria, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json" 
            },
            body:JSON.stringify({
                nombre: nombre
            })
        })
    })
    borrarElementosContenedor(".checkCategoriaMenu", contenedorChecksCategoriasMenu);
    borrarElementosContenedor(".categoriasMenuModal",contenedorCategoriasMenuModal);
    fetchCategoriasMenu();
    /* crear categoria para listar las categorias en el modal editar */
})








