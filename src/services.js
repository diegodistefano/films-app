const URL = 'http://localhost:3000/films';
const table = document.getElementById('film-table');


// READ: method GET
async function getAllFilms() {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        printFilms(data);
    }
    catch {
        console.log("Error");
    }
}

// PRINT
function printFilms(data) {
    table.innerHTML = "";
    data.forEach(film => {
        const tr = document.createElement('tr');
        tr.id = `row-${String(film.id)}`;

        tr.innerHTML = `
            <td>${film.title}</td>
            <td>${film.year}</td>
            <td>${film.director}</td>
            <td><button class="edit-btn" onclick="updateFilm('${String(film.id)}', '${film.title}', '${film.year}', '${film.director}')">Editar</button></td>
            <td><button class="delete-btn" onclick="deleteFilm('${String(film.id)}')">Eliminar</button></td>
        `;

        table.appendChild(tr);
    });
}

async function printOneFilm(data) {
    const search = document.getElementById('film-search').value;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        // document.getElementById("form-busqueda").reset();

        const filteredFilms = data.filter(movie => movie.title == search || movie.year == search || movie.director == search);

    table.innerHTML = "";

        if (filteredFilms.length === 0){
            console.log("No se encontraron películas con ese año.");
            return;
        }

        filteredFilms.forEach(movie => {
            const tr = document.createElement('tr');
            tr.id = `row-${String(movie.id)}`;

            tr.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.year}</td>
                <td>${movie.director}</td>
                <td><button class="edit-btn" onclick="updateFilm('${String(movie.id)}', '${movie.title}', '${movie.year}', '${movie.director}')">Editar</button></td>
                <td><button class="delete-btn" onclick="deleteFilm('${String(movie.id)}')">Eliminar</button></td>
            `;

            table.appendChild(tr);
        });
    }
    catch (error) {
        console.error("Error al buscar la película:", error);
    }
}

// CREATE: method POST
async function createFilms() {
    const title = document.getElementById('film-title').value;
    const year = document.getElementById('film-year').value;
    const director = document.getElementById('film-director').value;

    if (!title || !year || !director) {
        alert("Todos los datos son obligatorios");
        return;
    }
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, year, director })
        });

        const newFilm = await response.json();
        addFilmToTable(newFilm);
        formulario.reset();
    }
    catch (error) {
        console.error("Error al crear la película:", error);
    }
}

function addFilmToTable(film) {
    const tr = document.createElement("tr");
    tr.id = `${String(film.id)}`;
    tr.innerHTML = `
        <td>${film.title}</td>
        <td>${film.year}</td>
        <td>${film.director}</td>
        <td><button class="edit-btn" onclick="updateFilm(${String(film.id)}, '${film.title}', '${film.year}', '${film.director}')">Editar</button></td>
        <td><button class="delete-btn" onclick="deleteFilm(${String(film.id)})">Eliminar</button></td>
        `;
    table.appendChild(tr);
    getAllFilms();
}

// DELETE: method DELETE
async function deleteFilm(id) {
    if (!confirm("¿Desea confirmar la eliminación?")) return;

    try {
        await fetch(`${URL}/${id}`,
            {
                method: "DELETE"
            });
        document.getElementById(`row-${id}`).remove();
    } catch (error) {
        console.error("Error al eliminar la película:", error);
    }
}


// UPDATE: method PUT
async function updateFilm(id, oldTitle, oldYear, oldDirector) {
    id = String(id);

    
    const newTitle = prompt("Nuevo título:", oldTitle)?.trim();
    const newYear = prompt("Nuevo año:", oldYear)?.trim();
    const newDirector = prompt("Nuevo director:", oldDirector)?.trim();

    if (!newTitle || !newYear || !newDirector) {
        console.log("Datos obligatorios");
        return;
    }

    try {
        let newId = id.replace("-", "");
        await fetch(`${URL}/${newId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newTitle,
                year: newYear,
                director: newDirector
            })
        });
        updateFilmInTable(newId, newTitle, newYear, newDirector);
        getAllFilms();
    } catch (error) {
        console.error("Error al actualizar la película:", error);
    }
}



function updateFilmInTable(id, title, year, director) {
    id = String(id);
    const row = document.getElementById(`row-${String(id)}`);
    if (row) {
        row.innerHTML = `
            <td>${title}</td>
            <td>${year}</td>
            <td>${director}</td>
            <td><button class="edit-btn" onclick="updateFilm(${String(id)}, '${title}', '${year}', '${director}')">Editar</button></td>
            <td><button class="delete-btn" onclick="deleteFilm(${String(id)})">Eliminar</button></td>
        `;
    }
}

getAllFilms();