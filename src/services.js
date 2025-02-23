const URL = 'http://localhost:3000/films';
const table = document.getElementById('film-table');

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
    }
    catch (error) {
        console.error("Error al crear la película:", error);
    }
}

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
        await fetch(`${URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: newTitle,
                year: newYear,
                director: newDirector
            })
        });
        updateFilmInTable(id, newTitle, newYear, newDirector);
    } catch (error) {
        console.error("Error al actualizar la película:", error);
    }
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

// PRINT
function printFilms(data) {
    table.innerHTML = "";
    data.forEach(element => {
        const tr = document.createElement('tr');
        tr.id = `row-${element.id}`;
        
        tr.innerHTML = `
            <td>${element.id}</td>
            <td>${element.title}</td>
            <td>${element.year}</td>
            <td>${element.director}</td>
            <td><button class="edit-btn" onclick="updateFilm('${String(element.id)}', '${element.title}', '${element.year}', '${element.director}')">Editar</button></td>
            <td><button class="delete-btn" onclick="deleteFilm('${String(element.id)}')">Eliminar</button></td>
        `;

        table.appendChild(tr);
    });
}

function addFilmToTable(film) {
    const tr = document.createElement("tr");
    tr.id = `${film.id}`;
    tr.innerHTML = `
        <td>${film.id}</td>
        <td>${film.title}</td>
        <td>${film.year}</td>
        <td>${film.director}</td>
        <td><button class="edit-btn" onclick="updateFilm(${String(film.id)}, '${film.title}', '${film.year}', '${film.director}')">Editar</button></td>
        <td><button class="delete-btn" onclick="deleteFilm(${film.id})">Eliminar</button></td>
    `;
    table.appendChild(tr);
}

function updateFilmInTable(id, title, year, director) {
    id = String(id);
    const row = document.getElementById(`row-${id}`);
    if (row) {
        row.innerHTML = `
            <td>${id}</td>
            <td>${title}</td>
            <td>${year}</td>
            <td>${director}</td>
            <td><button class="edit-btn" onclick="updateFilm(${String(id)}, '${title}', '${year}', '${director}')">Editar</button></td>
            <td><button class="delete-btn" onclick="deleteFilm(${String(id)})">Eliminar</button></td>
        `;
    }
}

getAllFilms();

