# TW Todos - VanillaJS - AI Course

<a href=" https://denerfngoncalves.github.io/TWTodos-VanillaJS/" target="_blank" rel="noopener">Index TODO</a>

## Overview
This project is a simple web application that demonstrates the basic structure of an HTML page, along with linked CSS for styling and JavaScript for interactivity.

## Project Structure
```
my-html-project
├── src
│   ├── index.html        # Main HTML document
│   ├── css
│   │   └── styles.css    # Styles for the web page
│   └── js
│       └── main.js       # JavaScript for interactivity
├── .gitignore            # Files and directories to ignore in Git
└── README.md             # Project documentation
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Open `src/index.html` in a web browser to view the web page.

## Usage
- Modify `src/css/styles.css` to change the appearance of the web page.
- Update `src/js/main.js` to add or modify interactivity.

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.

# TW Todos

A small client-side Todo web app with multi-language support, drag-reorder, validation and persistence.

---

## Functionalities (EN)
- Add todo (validation: minimum 3 characters, starts with a capital letter) — implemented in [`addTodo`](src/js/main.js).  
- Delete todo — implemented in [`deleteTodo`](src/js/main.js).  
- Reorder todos using drag handle (drag only from the handle) — rendering and drag logic: [`renderTodos`](src/js/main.js), [`onHandleDragStart`](src/js/main.js), [`onDrop`](src/js/main.js).  
- Persistent storage using browser localStorage under key `twTodos.v1` (`saveTodos` / `loadTodos` in [`src/js/main.js`](src/js/main.js)).  
- Language selector (English, Español, Português-BR) and translations via [`setLanguage`](src/js/main.js). Language choice stored at `twTodos.lang`.  
- Storage info modal shown on page load (with "Don't show again" option) and manually via info button (manual open hides the checkbox). Modal logic: [`showStoragePopup`](src/js/main.js). Preference key: `twTodos.hideStoragePopup`.

Files:
- Main page: [src/index.html](src/index.html)  
- Styles: [src/css/styles.css](src/css/styles.css)  
- Logic & translations: [src/js/main.js](src/js/main.js)

Launch:
- Open [src/index.html](src/index.html) in a browser.

---

## Funcionalidades (ES)
- Agregar tarea (validación: mínimo 3 caracteres, comienza con mayúscula). Véase [`addTodo`](src/js/main.js).  
- Eliminar tarea (`deleteTodo` en [`src/js/main.js`](src/js/main.js)).  
- Reordenar arrastrando desde el ícono de arrastre (handle). Véase [`renderTodos`](src/js/main.js) / [`onHandleDragStart`](src/js/main.js).  
- Persistencia en localStorage (`twTodos.v1`) con [`saveTodos`](src/js/main.js) / [`loadTodos`](src/js/main.js).  
- Selector de idioma (English / Español / Português-BR) — [`setLanguage`](src/js/main.js), almacenado en `twTodos.lang`.  
- Modal de información sobre almacenamiento mostrado al cargar (con opción "No mostrar de nuevo") y forzable con el botón de información (al forzar la casilla no aparece). Lógica en [`showStoragePopup`](src/js/main.js). Preferencia en `twTodos.hideStoragePopup`.

Estructura:
- Página: [src/index.html](src/index.html)  
- Estilos: [src/css/styles.css](src/css/styles.css)  
- Lógica: [src/js/main.js](src/js/main.js)

---

## Funcionalidades (PT-BR)
- Adicionar tarefa (validação: mínimo 3 caracteres, inicia com letra maiúscula) — [`addTodo`](src/js/main.js).  
- Remover tarefa — [`deleteTodo`](src/js/main.js).  
- Reordenar arrastando pelo ícone de arraste (handle) — ver [`renderTodos`](src/js/main.js) / [`onHandleDragStart`](src/js/main.js).  
- Persistência via localStorage (`twTodos.v1`) — [`saveTodos`](src/js/main.js) / [`loadTodos`](src/js/main.js).  
- Seletor de idioma (English / Español / Português-BR) — [`setLanguage`](src/js/main.js), persistido em `twTodos.lang`.  
- Modal informativo sobre armazenamento exibido no carregamento (com opção "Não mostrar novamente") e acionável pelo botão de info (quando acionado manualmente, a caixa não aparece). Implementado em [`showStoragePopup`](src/js/main.js). Chave de preferência: `twTodos.hideStoragePopup`.

Estrutura do projeto:
- Página principal: [src/index.html](src/index.html)  
- CSS: [src/css/styles.css](src/css/styles.css)  
- JS: [src/js/main.js](src/js/main.js)

---
