let digimons;
document.addEventListener('DOMContentLoaded', () => {
    const listaDigimon = document.getElementById('listaDigimon');
    const cantidadDigimons = document.getElementById('cantidadDigimons');
    const cantidadNiveles = document.getElementById('cantidadNiveles');
    const digimonsPorNivel = document.getElementById('digimonsPorNivel');
    const digimonContainer = document.getElementById('digimonContainer');
    const urlParams = new URLSearchParams(window.location.search);
    const nivelSeleccionado = urlParams.get('nivel');
    const cantidadDigimonsNivel = document.getElementById('cantidadDigimonsLVL');
    const detalleDigimonContainer = document.getElementById('detalleDigimonContainer');
    const digimonesMismoNivelContainer = document.getElementById('digimonesMismoNivel');
    const nombreDigimon = urlParams.get('name');

    fetch('http://localhost:3000/api/digimons')
    .then(response => response.json())
    .then(data => {

        digimons = data;
        const digimonsOrdenados = digimons.sort((a,b) => a.name.localeCompare(b.name));
        cantidadDigimons.textContent = digimons.length;
        const nivelesDigimons = new Set(digimons.map(digimon => digimon.level));
        cantidadNiveles.textContent = nivelesDigimons.size

        const filtroNivelSelect = document.getElementById('filtroNivel');
        nivelesDigimons.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            filtroNivelSelect.appendChild(option);
        });

        const nivelesCountObj = {};
        digimons.forEach(digimon => {
            const nivel = digimon.level;
            nivelesCountObj[nivel] = (nivelesCountObj[nivel] || 0) +1;
        });

        for (const nivel in nivelesCountObj) {
            digimonsPorNivel.textContent += `${nivel} (${nivelesCountObj[nivel]})`;
        }

        digimonsOrdenados.forEach(digimon =>{
            const itemLista = document.createElement('list-group-item');
            const card = createDigimonCard(digimon);
            itemLista.appendChild(card);
            listaDigimon.appendChild(itemLista);
        });
    })
    if (nivelSeleccionado) {
        fetch('http://localhost:3000/api/digimons')
        .then(response => response.json())
        .then(digimons => {
            const digimonesFiltrados = digimons.filter(digimon => digimon.level === nivelSeleccionado);
            cantidadDigimonsNivel.textContent = `Cantidad de Digimons del nivel seleccionado ${digimonesFiltrados.length}`;

            digimonesFiltrados.forEach(digimon => {
                const card = createDigimonCard(digimon);
                digimonContainer.appendChild(card);
            });
        })
    }

    if (nombreDigimon) {
        fetch('http://localhost:3000/api/digimons')
        .then(response => response.json())
        .then(digimons => {
            const digimonSeleccionado = digimons.find(digimon => digimon.name === nombreDigimon);

            if (digimonSeleccionado) {
                //Mostrar tarjeta del Digimon seleccionado en grande
                const detalleCard = createDigimonCard(digimonSeleccionado);
                detalleDigimonContainer.appendChild(detalleCard);

                //Filtrar Digimon del mismo nivel
                const digimonesMismoNivel = digimons.filter(digimon => digimon.level === digimonSeleccionado.level);

                //Mostrar lista de Digimon del mismo nivel
                digimonesMismoNivel.forEach(digimon => {
                    const card = createDigimonCard(digimon);
                    digimonesMismoNivelContainer.appendChild(card);
                });
            }
        })
    }
});

//Generar un digimon random con listener click
const randomDigimonBtn = document.getElementById('randomDigimonBtn');
const generarOtroDigimon = document.getElementById('generarOtroDigimon');
[randomDigimonBtn, generarOtroDigimon].forEach(btn => {
    btn.addEventListener('click', () => {
        mostrarDigimonRandom();
    });
});

//Filtro por niveles
const filtrarPorNivel = (level) => {
    if (level !=="default") {
        window.location.href = `filtroPorNivel.html?nivel=${level}`;
    }
};

// Crear card para un digimon
function createDigimonCard(digimon) {
    const card = document.createElement('div');
    card.classList.add('card', 'm-3');
    card.style.width = '18rem';
    
    card.id = `digimonCard_${digimon.name}`;
    const img = document.createElement('img');
    img.src = digimon.img;
    img.alt = digimon.name;
    img.classList.add('card-img-top');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = digimon.name;

    const text = document.createElement('p');
    text.classList.add('card-text');
    text.textContent = `Nivel: ${digimon.level}`;

    cardBody.appendChild(title);
    cardBody.appendChild(text);

    card.addEventListener('click',() => {
        window.location.href = `detalleDigimon.html?name=${digimon.name}`;
    })

    card.appendChild(img);
    card.appendChild(cardBody);

    return card;
}

// digimon aleatorio
function getRandomDigimon(){
    const randomIndex = Math.floor(Math.random() * digimons.length);
    return digimons[randomIndex]
}

// mostrar digimon en modal
function mostrarDigimonRandom(){
    const randomDigimonContainer = document.getElementById('digimonAleatorioContent');
    const digimonAleatorio = getRandomDigimon();
    const modalContent = createDigimonCard(digimonAleatorio);
    randomDigimonContainer.innerHTML = '';
    randomDigimonContainer.appendChild(modalContent);

}
