const imagenEditarPlatillo = document.querySelector(".imagenEditarPlatillo");
const inputImagenPlatillo = document.querySelector(".inputImagenPlatillo");


imagenEditarPlatillo.addEventListener("click", (e)=>{
    inputImagenPlatillo.click();
});

inputImagenPlatillo.onchange = ()=>{
    mostrarImagen(inputImagenPlatillo, imagenEditarPlatillo);
}

