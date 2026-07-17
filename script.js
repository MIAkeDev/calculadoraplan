// Configuración interna
const TASA_DOLAR = 3.51;
const RECARGO_FIJO = 6.60;
const MAX_PERFUMES = 30;

// Estado de la aplicación
let listaPerfumes = [];
let precioCalculadoActual = 0;

// Referencias del DOM
const inputNombre = document.getElementById('nombre');
const inputPrecioUsd = document.getElementById('precioUsd');
const inputCantidad = document.getElementById('cantidad');
const previewDiv = document.getElementById('previewResult');
const txtResultadoUnitario = document.getElementById('resultadoUnitario');
const contenedorLista = document.getElementById('listaPerfumes');
const txtTotal = document.getElementById('montoTotal');
const txtContador = document.getElementById('contadorItems');

// 1. Función para Calcular (Muestra el botón de agregar)
function calcular() {
    const dolares = parseFloat(inputPrecioUsd.value);
    
    if (isNaN(dolares) || dolares <= 0) {
        alert("Por favor, ingresa un precio en dólares válido.");
        return;
    }

    if (listaPerfumes.length >= MAX_PERFUMES) {
        alert(`Has alcanzado el límite máximo de ${MAX_PERFUMES} perfumes.`);
        return;
    }

    // Fórmula: (USD * 3.50) + 6.25
    precioCalculadoActual = (dolares + RECARGO_FIJO) * TASA_DOLAR;
    
    // Mostrar el resultado y el botón agregar
    txtResultadoUnitario.innerText = `S/ ${precioCalculadoActual.toFixed(2)}`;
    previewDiv.classList.remove('preview-hidden');
    previewDiv.classList.add('preview-visible');
}

// 2. Función para Agregar a la lista
function agregar() {
    let nombre = inputNombre.value.trim();
    let cantidad = parseInt(inputCantidad.value);

    // Valores por defecto si están vacíos
    if (!nombre) {
        nombre = `Perfume ${listaPerfumes.length + 1}`;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
        cantidad = 1;
    }

    // Crear el objeto perfume
    const nuevoPerfume = {
        id: Date.now(), // ID único para poder eliminar
        nombre: nombre,
        precioSoles: precioCalculadoActual,
        cantidad: cantidad
    };

    listaPerfumes.push(nuevoPerfume);

    // Resetear la interfaz
    inputNombre.value = '';
    inputPrecioUsd.value = '';
    inputCantidad.value = '';
    previewDiv.classList.remove('preview-visible');
    previewDiv.classList.add('preview-hidden');
    inputNombre.focus();

    actualizarInterfaz();
}

// 3. Función para Eliminar un ítem
function eliminar(id) {
    listaPerfumes = listaPerfumes.filter(perfume => perfume.id !== id);
    actualizarInterfaz();
}

// 4. Actualizar toda la interfaz (Lista y Total)
function actualizarInterfaz() {
    contenedorLista.innerHTML = ''; // Limpiar lista
    let sumaTotal = 0;
    let totalItems = 0;

    listaPerfumes.forEach((perfume) => {
        // Calcular subtotal por ítem
        const subtotal = perfume.precioSoles * perfume.cantidad;
        sumaTotal += subtotal;
        totalItems += perfume.cantidad;

        // Crear la tarjeta visual del ítem
        const divCard = document.createElement('div');
        divCard.className = 'item-card';
        divCard.innerHTML = `
            <div class="item-info">
                <span class="item-name">${perfume.nombre}</span>
                <span class="item-details">${perfume.cantidad} x S/ ${perfume.precioSoles.toFixed(2)} = <b>S/ ${subtotal.toFixed(2)}</b></span>
            </div>
            <button class="btn-delete" onclick="eliminar(${perfume.id})">✕</button>
        `;
        contenedorLista.appendChild(divCard);
    });

    // Actualizar contadores y sumas
    txtTotal.innerText = `S/ ${sumaTotal.toFixed(2)}`;
    txtContador.innerText = listaPerfumes.length; // Cuenta registros distintos
}