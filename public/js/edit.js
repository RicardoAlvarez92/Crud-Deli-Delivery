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
const urlRestauranteEnEdicion = `http://localhost:3000/api/restaurantes/${idRest}`
const inputEditarImagen = document.querySelector(".inputEditarImagen")
let idCategoriaMenuSelecionada = "";
const urlPlatillos = 'http://localhost:3000/api/platillos'
const cambiarCategoriaMenu = document.querySelector(".cambiarCategoriaMenu");


fetch(urlRestauranteEnEdicion)
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
            <button id="${categoria.id_categoria}" class="checkCategoriaMenu btn btn-outline-primary me-3 mt-3 mb-2" type="button">
                ${categoria.nombre}   
            </button>
        `
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
                            <img src="../resources/img/icons/trash.png" alt="">
                        </button>
                    </div>
                    `
        })
        contenedor.innerHTML += Html;
    }

const btnEditarCategoriasMenu = document.querySelector(".btnEditarCategoriasMenu");

const fetchCategoriasMenu = () => {
    fetch(urlRestauranteEnEdicion+"/menu")
    .then( res => res.json())
    .then(data => {
        if(data.length != 0){
            btnEditarCategoriasMenu.classList.remove("d-none");
            borrarElementosContenedor(".sinResultadosChecks", contenedorChecksCategoriasMenu);
            borrarElementosContenedor(".checkCategoriaMenu", contenedorChecksCategoriasMenu);
            borrarElementosContenedor(".categoriasMenuModal", contenedorCategoriasMenuModal);
            listarCategoriasMenuChecks(data, contenedorChecksCategoriasMenu);
            listarCategoriasMenuModal(data, contenedorCategoriasMenuModal);
        }else{
            btnEditarCategoriasMenu.classList.add("d-none");
            borrarElementosContenedor(".checkCategoriaMenu", contenedorChecksCategoriasMenu);
            borrarElementosContenedor(".categoriasMenuModal", contenedorCategoriasMenuModal);
            borrarElementosContenedor(".sinResultadosChecks", contenedorChecksCategoriasMenu);
            mensajeSinCategorias(contenedorChecksCategoriasMenu, "sinResultadosChecks");
        }
    })
    .catch(e => console.log(e))
}
fetchCategoriasMenu();


const inputnombreCrearCategoriaMenu = document.querySelector(".inputnombreCrearCategoriaMenu");
let modalCrearCategoriaMenu = new bootstrap.Modal(document.getElementById("modalCrearCategoriaMenu"));

//Crear Categoria Menu
formCrearCategoriaMenu.addEventListener("submit", (e)=>{
    e.preventDefault();
    fetch(urlRestauranteEnEdicion+"/menu", {
        method:"POST",
        headers:{
            "Content-Type":"application/json" 
        },
        body:JSON.stringify({
            nombre: inputnombreCrearCategoriaMenu.value
        })
    })
    .then(res => res.json())
    .then(() => {
        fetchCategoriasMenu();
        inputnombreCrearCategoriaMenu.value = "";
        modalCrearCategoriaMenu.hide();
    })
})


//Eliminar categoria
on(document, "click", ".btnBorrarCategoria", e => {
    const fila = e.target.closest(".btnBorrarCategoria").parentNode;
    const nombreCategoria = fila.children[1].value;
    const idCategoria = fila.firstElementChild.innerHTML;
    console.log(parseInt(idCategoria));
    
    fetch(urlPlatillos)
    .then(res => res.json())
    .then(data => {
        const filtro = data.filter(dato => dato.id_categoria == idCategoria);
        if(filtro.length != 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No puedes Eliminar este Registro. Aun tiene platillos vinculadas',
            })
        }else{
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
                        timer:1500
                        })
                    fetch(urlRestauranteEnEdicion+"/menu/"+idCategoria,{
                        method: "DELETE"
                    })
                    .then(res => res.json())
                    .then(()=> {
                        fetchCategoriasMenu();
                        cambiarCategoriaMenu.innerHTML = "";
                        btnNuevoPlatillo.classList.add("d-none");
                        borrarElementosContenedor(".registroPlatillo", contenedorPlatillos);
                        modalEditarCategoriasMenu.hide();
                        
                    })
                }
            })
        }
    })
})


/* --------EN CODIFICACION  ------------------*/
let modalEditarCategoriasMenu = new bootstrap.Modal(document.getElementById('modalEditarCategoriasMenu'));

//Editar Categoria de Menu
formEditarCategoriasMenu.addEventListener("submit", (e)=>{
    e.preventDefault();
    const categoriasMenuModal = document.querySelectorAll(".categoriasMenuModal");

    categoriasMenuModal.forEach(categoria => {
        let idCategoria = parseInt(categoria.children[0].innerHTML);
        let nombre = categoria.children[1].value;

        fetch(urlRestauranteEnEdicion+"/menu/"+idCategoria, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json" 
            },
            body:JSON.stringify({
                nombre: nombre
            })
        })
    })
    btnNuevoPlatillo.classList.add("d-none");
    borrarElementosContenedor(".checkCategoriaMenu", contenedorChecksCategoriasMenu);
    borrarElementosContenedor(".categoriasMenuModal",contenedorCategoriasMenuModal);
    fetchCategoriasMenu();
    cambiarCategoriaMenu.innerHTML = "";
    borrarElementosContenedor(".registroPlatillo", contenedorPlatillos);
    modalEditarCategoriasMenu.hide();   
})

const contenedorPlatillos = document.querySelector(".contenedorPlatillos");

const listarPlatillos = (platillos)=>{
    platillos.forEach(platillo => {
        contenedorPlatillos.innerHTML += 
                        `<div class="registroPlatillo row shadow mt-3 position-relative">
                            <p class="d-none d-lg-block col-lg-1 my-0 py-3">${platillo.id_platillo}</p>
                            <div class="imagenRestaurante col-3 col-md-2 col-lg-1 my-0 py-1 d-flex align-items-center ">
                                <img class="img-fluid" src="${platillo.imagen}" alt="">
                            </div>
                            <p class="col-6 col-md-4 col-lg-3 my-0 py-1 py-3">${platillo.nombre_plati}</p>
                            <p class="d-none d-lg-block col-lg-4 my-0 py-1 py-3">${platillo.descripcion}</p>
                            <p class="d-none d-md-block col-md-2 col-lg-1 my-0 py-1 py-3">$${platillo.precio}</p> 
                            <p class="d-none d-md-block col-md-2 col-lg-1 my-0 py-1 py-3"><strong class="">${platillo.estatus}</strong></p>
                            <div class="col-3 col-md-2 col-lg-1 my-0 py-1 d-flex align-items-center justify-content-between">
                                <a class="btnEditarPlatillo flex-fill d-flex justify-content-center">
                                    <img class="" src="../resources/img/icons/pencil.png" alt="Editar">
                                </a>
                                <a class=" flex-fill d-flex justify-content-center">
                                    <img class="btnBorrarPlatillo" src="../resources/img/icons/trash.png" alt="Borrar">
                                </a>
                            </div>
                        </div>`
    })
}


on(document, "click", ".checkCategoriaMenu", e => {
    e.preventDefault();
    let id = e.target.id;
    let nombre = e.target.innerHTML;
    let urlPlatillos = `${urlRestauranteEnEdicion}/menu/${id}/platillos`
    idCategoriaMenuSelecionada = id;
    btnNuevoPlatillo.classList.remove("d-none");

    cambiarCategoriaMenu.innerHTML= nombre;

    fetch(urlPlatillos)
    .then( res => res.json())
    .then(data => {
        borrarElementosContenedor(".registroPlatillo", contenedorPlatillos);
        listarPlatillos(data);
    })
    .catch(e => console.log(e))
})

const btnNuevoPlatillo = document.getElementById("btnNuevoPlatillo");

btnNuevoPlatillo.addEventListener("click", () =>{
    window.open(`http://localhost:1000/restaurante/${idRest}/categoria${idCategoriaMenuSelecionada}`);
})

/* seguir con el codigo hacer una especie de validacion para que no se pueda acceder a la ruta cuando los parametros de id no exiten en la base de datos  */
on(document, "click", ".btnEditarPlatillo", e => {
    e.preventDefault();
    const idPlatillo = e.target.parentNode.parentNode.parentNode.children[0].innerHTML;
    window.open(`http://localhost:1000/editar/platillo${idPlatillo}`);
})


on(document, "click", ".btnBorrarPlatillo", e => {
    e.preventDefault();
    const idPlatillo = e.target.parentNode.parentNode.parentNode.children[0].innerHTML;
    const nombrePlatillo = e.target.parentNode.parentNode.parentNode.children[2].innerHTML;
    const url =`${urlRestauranteEnEdicion}/menu/${idCategoriaMenuSelecionada}/platillos/`;

    Swal.fire({
        title: `seguro quieres eliminar el registro de ${nombrePlatillo}?`,
        showDenyButton: true,
        confirmButtonText: 'Borrar',
        denyButtonText: `Conservar`,
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                showConfirmButton: false,
                text:'El registro fue eliminado con exito',
                timer: 1500
                })
            fetch(url+idPlatillo,{
                method: "DELETE"
            })
            .then(res => res.json())
            .then(() => {
                
                fetch(url)
            .then( res => res.json())
            .then(data => {
            borrarElementosContenedor(".registroPlatillo", contenedorPlatillos);
            listarPlatillos(data);
        })
        .catch(e => console.log(e))  
            }
            )
        } else if (result.isDenied) {
        }

        
    })
    

})

