// Boton para subir la página
window.onscroll = function() {
    if(document.documentElement.scrollTop > 100){
        document.querySelector('.go-top-container').classList.add('show');
    } else{
        document.querySelector('.go-top-container').classList.remove('show');
    }
}

document.querySelector('.go-top-container').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

//--------------------------------MÓDULO CLIENTES--------------------------------//

//1. Crear variables
var listaClientes = []; //Arreglo vacio
var editando = false; //Para el condicional de validar
var idElementoClickeado = ""; //Para guardar el id

//2. Crear constantes para los elementos de formulario, inputs y botones
    //Formulario
const formulario = document.querySelector("#form-clientes"); 
    //Inputs
const inputNit = document.querySelector("#nit");
const inputNombres = document.querySelector("#nombres");
const inputApellidos = document.querySelector("#apellidos");
const inputTelefono = document.querySelector("#telefono");
const inputEmail = document.querySelector("#email");
const inputPlaca = document.querySelector("#placa");
const inputTipo = document.querySelector("#tipo");

//3. Crear evento tipo submit sobre el elemento formulario
    //Listener para el elemento
formulario.addEventListener('submit',validarFormulario);

//4. Crear función "validarFormulario" que recibe el evento
    //Valida la info del formulario
function validarFormulario(e){
    e.preventDefault();

//5. Verificar si los campos estan vacios
    if(inputNit.value === "" || inputNombres.value === ""|| inputApellidos.value === ""|| inputTelefono.value === ""||
    inputEmail.value === ""|| inputPlaca.value === "" || inputTipo.value === ""){
        alert("Todos los campos son obligatorios!");
        return; //Salir de la funcion y que no revise los demás if
    }

//6. Revisar si la variable "editar" esta en "true" o "false"
    if(editando){
        editarCliente();
        editando = false;
//...si es "true", lo agrega
    } else{
        const objCliente = objCreator(Date.now(),inputNit.value,inputNombres.value,
        inputApellidos.value,inputTelefono.value,inputEmail.value,inputPlaca.value,inputTipo.value,0);

        agregarCliente(objCliente); //Pasa el objeto a la función
    }
}

//7. Funcion para agregar cliente a la lista y lo muestra en el html
function agregarCliente(objCliente){ //Crea una copia del objeto
    listaClientes.push(objCliente);
    mostrarClientes(listaClientes); //Envia la lista al html
    formulario.reset(); //Reinicia los inputs del formulario
    listarClientesSelect();
}

//8. Función para mostrar empleados
function mostrarClientes(listaClientes){
    limpiarHTML(); //para que no se repitan los empleados en el html cuando se recorre la lista
    const tbodyClientes = document.querySelector("#tbody-clientes");
    //recorrer lista de empleados
    listaClientes.forEach((cliente) =>{
        //desesctructuacion - para acceder mas facilmente
        const {id,nit,nombres,apellidos,telefono,email,placa,tipo,puntos} = cliente;

        const trBody = document.createElement("tr"); //etiqueta que muestra cada empleado en el div
        trBody.setAttribute("id",id); //para poder identificar luego el elemento parrafo que voy a borrar
        trBody.innerHTML = `<th scope="row">${id}</th>
                            <td>${nit}</td>
                            <td>${nombres}</td>
                            <td>${apellidos}</td>
                            <td>${telefono}</td>
                            <td>${email}</td>
                            <td>${placa}</td>
                            <td>${tipo}</td>`;

        //Botones de cada uno de los elementos para poder editar y borrar
        //editar
        const editarBoton = document.createElement("button");
        editarBoton.onclick = () => cargarClientes(cliente); //Guarda el cliente al cual yo le de click al btn editar
        editarBoton.textContent = "Editar";
        editarBoton.classList.add("btn","btn-secondary");
        trBody.append(editarBoton);

        //eliminar
        const eliminarBoton = document.createElement("button");
        eliminarBoton.onclick = () => eliminarCliente(id);
        eliminarBoton.textContent = "Eliminar";
        eliminarBoton.classList.add("btn","btn-danger");
        trBody.append(eliminarBoton);
        tbodyClientes.appendChild(trBody);
    });
};

//cargarCliente() guarda el elemento segun el cual yo le haya dado click
//cada btn tiene un unico cliente
function cargarClientes(cliente){
    const {id,nit,nombres,apellidos,telefono,email,placa,tipo} = cliente;

    inputNit.value = nit;
    inputNombres.value = nombres;
    inputApellidos.value = apellidos;
    inputTelefono.value = telefono;
    inputEmail.value = email;
    inputPlaca.value = placa;
    inputTipo.value = tipo;

    //guardo el id para poder editar el elemento de la lista
    //para seguir manteniendo el identificador del empleado que seleccionamos para editar
    // objEmpleado.id = id;
    idElementoClickeado = id;

    //cambio el text del btn a actulizar
    formulario.querySelector('button[type="submit"]').textContent = "Actualizar";

    editando = true; //cambio la flag para entrar a editar

};

function editarCliente(){
    listaClientes.map(cliente=>{
        if(cliente.id === idElementoClickeado){
            cliente.id = idElementoClickeado;
            cliente.nit = inputNit.value;
            cliente.nombres = inputNombres.value;
            cliente.apellidos = inputApellidos.value;
            cliente.telefono = inputTelefono.value;
            cliente.email = inputEmail.value;
            cliente.placa = inputPlaca.value;
            cliente.tipo = inputTipo.value;
        }
    });

    limpiarHTML();
    mostrarClientes(listaClientes);

    formulario.reset();

    formulario.querySelector("button[type='submit']").textContent = "Agregar";

    editando = false;

    listarClientesSelect();

}

function eliminarCliente(id){
    //reasigna a la lista todos los clientes diferentes al cliente
    //al cual le doy click al btn eliminar, asi lo saca de la lista
    listaClientes = listaClientes.filter( cliente=> cliente.id !== id);

    limpiarHTML();
    mostrarClientes(listaClientes);

    listarClientesSelect();
}

//funcion para crear objetos
const objCreator = (id,nit,nombres,apellidos,telefono,email,placa,tipo,puntos)=>({id,nit,nombres,apellidos,telefono,email,placa,tipo,puntos})

//funcion para limpiar el body de clientes en el html
function limpiarHTML(){
    const tbodyClientes = document.querySelector("#tbody-clientes");
    tbodyClientes.innerHTML = "";
};

//buscar
const searchInput = document.querySelector("#search-input");
const btnBuscar = document.querySelector("#btnBuscar");

//crea una nueva lista con los clientes que cumplen dicha condicion de busqueda
btnBuscar.addEventListener('click', function(e){
    e.preventDefault();

    let nuevaListaClientes = [];
    listaClientes.forEach((cliente)=>{
        if(cliente.nit === searchInput.value || cliente.nombres === searchInput.value|| cliente.apellidos === searchInput.value){  
            nuevaListaClientes.push(cliente);
        }
    });
    console.log(nuevaListaClientes);
    limpiarHTML();
    mostrarClientes(nuevaListaClientes);

})

//muestra nuevamente la lista completa cuando borro los caracteres del input buscar
searchInput.addEventListener('input',function(e){
    e.preventDefault()
    if(e.target.value === ""){
        limpiarHTML();
        mostrarClientes(listaClientes);
    }
})


//--------------------------------MÓDULO SERVICIOS--------------------------------//

//1. Crear variables
var listaServicios = [];
var idServicioClikeado = "";

//2. Crear constantes para los elementos de formulario, inputs y botones
    //Formulario

const formularioGestionSrv = document.querySelector("#form-gestion-srv");
    //Inputs
const inputNombreSrv = document.querySelector("#nombre-srv");
const inputGestionSrv = document.querySelector("#gestion-srv");
const inputValorLicenciaSrv = document.querySelector("#valor-licencia-srv");
const inputPuntosSrv = document.querySelector("#puntos-srv");

//3. Crear evento tipo submit sobre el elemento formulario
    //Listener para el elemento
formularioGestionSrv.addEventListener('submit',validarFormularioSrv);

//4. Crear función "validarFormulario" que recibe el evento
    //Valida la info del formulario
function validarFormularioSrv(e){
    e.preventDefault();

//5. Verificar si los campos estan vacios
    if(inputNombreSrv.value === "" || inputGestionSrv.value === "" 
    || inputValorLicenciaSrv.value === "" || inputPuntosSrv.value === ""){
        alert("Todos los campos son obligatorios!");
        return; //Salir de la funcion y que no revise los demás if
    }else{
        const objServicio = srvCreator(Date.now(),inputNombreSrv.value,inputGestionSrv.value,
        inputValorLicenciaSrv.value,inputPuntosSrv.value);

        agregarServicio(objServicio);

    }

};

//6. Funcion para agregar servicio a la lista y lo muestra en el html
function agregarServicio(objServicio){ //Crea una copia del objeto
    listaServicios.push(objServicio);

    mostrarServicios(listaServicios);

    formularioGestionSrv.reset();

    listarServiciosSelect();
}



//7. Funcion para agregar cliente a la lista y lo muestra en el html
function agregarCliente(objCliente){ //Crea una copia del objeto
listaClientes.push(objCliente);
mostrarClientes(listaClientes); //Envia la lista al html
formulario.reset(); //Reinicia los inputs del formulario
listarClientesSelect();
}



function mostrarservicios(listaservicios){

    limpiarHTMLservicios();

    const tbodySrv = document.querySelector("#tbody-gestion-srv");

    listaservicios.forEach((servicio)=>{
        //desesctructuro
        const {idSrv,nombreSrv,gestionSrv,valorLicenciaSrv,puntosSrv} = servicio;

        const trBodySrv = document.createElement("tr");
        trBodySrv.setAttribute("id",idSrv);
        trBodySrv.innerHTML =`<th scope="row">${idSrv}</th>
                            <td>${nombreSrv}</td>
                            <td>${gestionSrv}</td>
                            <td>${valorLicenciaSrv}</td>
                            <td>${puntosSrv}</td>`;

        //botones
        //eliminar
        const eliminarBotonSrv = document.createElement("button");
        eliminarBotonSrv.onclick = () => eliminarServicio(idSrv);
        eliminarBotonSrv.textContent = "Eliminar";
        eliminarBotonSrv.classList.add("btn","btn-danger");
        trBodySrv.append(eliminarBotonSrv);

        tbodySrv.appendChild(trBodySrv);
    });
}

function eliminarServicio(idSrv){
    listaServicios = listaServicios.filter(servicio => servicio.idSrv !== idSrv);

    limpiarHTMLServicios();
    mostrarServicios(listaServicios);

    listarServiciosSelect();
}

//funcion para crear obj 
const srvCreator = (idSrv,nombreSrv,gestionSrv,valorLicenciaSrv,puntosSrv) =>({idSrv,nombreSrv,gestionSrv,valorLicenciaSrv,puntosSrv});

//funcion para limpiar tbody de gestion Srv
function limpiarHTMLServicios(){
    const tbodySrv = document.querySelector("#tbody-gestion-srv");
    tbodySrv.innerHTML = "";
}


//--------------------------------MÓDULO GESTIÓN--------------------------------//

//guarda los puntos del servicio
var puntosServicio ="";

//lleno dinamicamente el select clientes
function listarClientesSelect(){

    limpiarOptionsSelectClientes();
    listaClientes.forEach((cliente)=>{
        const option = document.createElement("option");
        option.value = cliente.nombres+ " "+cliente.apellidos;
        option.textContent = cliente.nombres+" "+cliente.apellidos;
        document.querySelector("#nombreCliente").appendChild(option);
    })
}

//lleno dinamicamente el select de servicios
function listarServiciosSelect(){
    limpiarOptionsSelectServicios();
    listaservicios.forEach((servicio)=>{
        const option = document.createElement("option");
        option.value = servicio.nombreSrv;
        option.textContent = servicio.nombreSrv;
        document.querySelector("#nombreServicio").appendChild(option);
    })
}


function limpiarOptionsSelectClientes(){
    const selectNombres = document.querySelector("#nombreCliente");
    selectNombres.innerHTML = "";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Clientes";
    selectNombres.appendChild(option);
}


function limpiarOptionsSelectServicios(){
    const selectservicios = document.querySelector("#nombreservicio");
    selectservicios.innerHTML ="";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Servicios";
    selectservicios.appendChild(option);
}



const formularioCompraSrv = document.querySelector("#form-compra-srv");
const nombreServicio = document.querySelector("#nombreServicio");
const containerCards = document.querySelector("#cardsContainer");

//evento que llena el input del valor cada vez que selecciono un option
nombreservicio.addEventListener('input',function(e){
    console.log(e.target.value);

    if(e.target.value !== ""){
        listaServicios.forEach((servicio)=>{
            if(servicio.nombresrv === e.target.value){
                const inputValor = document.querySelector("#valorsrv");
                inputValor.value = parseFloat(servicio.valorLicenciasrv) +
                servicio.valorLicenciasrv*0.14 + (0.06*servicio.valorLicenciasrv);
                
                puntosServicio = servicio.puntossrv; //asigno los puntos del servicio clickeado a una var 
                console.log(puntosServicio);
            }
        })
    }
});

formularioComprasrv.addEventListener('submit',function(e){
    e.preventDefault();
    
    const optionCliente = document.querySelector("#nombreCliente").value;
    const optionservicio = document.querySelector("#nombreservicio").value;
    const valorservicio = document.querySelector("#valorsrv").value;
    //console.log(optionCliente);
    const card = document.createElement("div");
    card.classList.add('card','text-bg-info','mb-3');
    card.style = 'max-width:18rem';
    card.style = 'margin:5px';

    card.innerHTML = `<div class="card-header">
                                    <h5 class="card-title">${optionservicio}</h5>
                                </div>
                                <div class="card-body">
                                    <ul>
                                        <li>${optionCliente}</li>
                                        <li>${valorservicio}</li>
                                    </ul>
                                </div>`;

    containerCards.appendChild(card);

    formularioComprasrv.reset();

    asignarPuntos(optionCliente);

})

//asigna los puntos al cliente respectivamente
function asignarPuntos(optionCliente){
    listaClientes.forEach((cliente)=>{
        if(cliente.nombres+" "+cliente.apellidos === optionCliente){
            cliente.puntos += parseFloat(puntosservicio);
        }
    })

    mostrarPuntos(listaClientes);
}


//--------------------------------MÓDULO FIDELIZACIÓN--------------------------------//
function mostrarPuntos(listaClientes){

    limpiarTablaFidelizacion();

    const tbodyFidelizacion = document.querySelector("#tbody-fidelizacion");

    listaClientes.forEach((cliente)=>{
        const {id,nombres,apellidos,puntos} = cliente;

        const trFidelizacion = document.createElement("tr");
        trFidelizacion.setAttribute("id",id);
        trFidelizacion.innerHTML = `<th scope="row">${id}</th>
                                    <td>${nombres}</td>
                                    <td>${apellidos}</td>
                                    <td>${puntos}</td>`;
        tbodyFidelizacion.appendChild(trFidelizacion);
    });
}

function limpiarTablaFidelizacion(){
    const tbodyFidelizacion = document.querySelector("#tbody-fidelizacion");
    tbodyFidelizacion.innerHTML ="";
}

//

