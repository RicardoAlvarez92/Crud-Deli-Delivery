
//Funcion para mostrar restaurantes
const listarRestaurantes = (restaurantes)=>{
    restaurantes.forEach(restaurante => {
        ContenedorRegistros.innerHTML += 
                        `<div class="registroRestaurante row shadow mt-3 position-relative">
                            <p class="col-2 col-md-1 my-0 py-3">${restaurante.id_restaurante}</p>
                            <div class="imagenRestaurante col-2 col-lg-1 my-0 py-1 d-flex align-items-center ">
                                <img class="img-fluid" src="${restaurante.imagen}" alt="">
                            </div>
                            <p class="col-5 col-md-4 col-lg-3 my-0 py-1 py-3">${restaurante.nombre_rest}</p>
                            <p class="d-none d-md-block col-md-3 col-lg-3 my-0 py-1 py-3">${restaurante.ubicacion}</p>
                            <p class="d-none d-lg-block col-lg-2 my-0 py-1 py-3">${restaurante.apertura} - ${restaurante.cierre}</p> 
                            <p class="d-none d-lg-block col-lg-1 my-0 py-1 py-3"><strong class="">${restaurante.status}</strong></p>
                            <div class="col-3 col-md-2 col-lg-1 my-0 py-1 d-flex align-items-center justify-content-between">
                                <a class=" flex-fill d-flex justify-content-center">
                                    <img class="btnEditarRest" src="./resources/img/icons/pencil.png" alt="Editar">
                                </a>
                                <a class=" flex-fill d-flex justify-content-center">
                                    <img class="btnBorrarRest" src="./resources/img/icons/trash.png" alt="Borrar">
                                </a>
                            </div>
                        </div>`
    })
}

//funcion para limpiar cheks
const limpiarChecks = (checks) =>{
    checks.forEach(check => {
        check.checked = false;
    });
}

//funcion para Agregar el valor del check selecionado a un array 
/* const agregarValorDecheck = (variable, checks) =>{
    checks.forEach(check => {
        if(check.checked){
            variable.push(check.value);
        }
    });
} */
// mostrar una previa de la imagen al selecionar archivo local
const mostrarImagen = (input, srcImage)=>{
    let file = input.files[0];
    let urlFile = URL.createObjectURL(file);
    srcImage.src = urlFile;
}
//funcion on para delgar click
const on = (element, event, selector, handler) =>{
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

// Funcion para el buscador
const buscarRest = () => {
    const textoInput = inputBuscador.value.toLowerCase();
    const registroRestaurante = document.querySelectorAll(".registroRestaurante");

    registroRestaurante.forEach(registro =>{
        ContenedorRegistros.removeChild(registro);
    })

    fetch(urlApi)
    .then( res => res.json())
    .then(data => {
        const dataFilter = data.filter(rest => rest.nombre_rest.toLowerCase().indexOf(textoInput) != -1 )
        listarRestaurantes(dataFilter);
    })
    .catch(e => console.log(e))
    }