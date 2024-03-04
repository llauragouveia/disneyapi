document.addEventListener("DOMContentLoaded", function() {
    const charactersDiv = document.getElementById("characters");
    const previousPageButton = document.getElementById("previous-page");
    const nextPageButton = document.getElementById("next-page");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    let currentPage = 1;

    // Função para buscar e exibir os personagens
    async function fetchCharacters(page, query) {
        try {
            let url = `https://api.disneyapi.dev/character?page=${page}`;
            if (query) {
                url += `&name=${query}`;
            }
            const response = await fetch(url);
            const data = await response.json();

            // Limpa o conteúdo anterior
            charactersDiv.innerHTML = "";

            // Loop através dos personagens
            data.data.forEach(character => {
                const characterElement = document.createElement("div");
                characterElement.classList.add("character");

                // Cria elementos de imagem e informações
                const img = document.createElement("img");
                img.src = character.imageUrl;
                const characterInfo = document.createElement("div");
                characterInfo.classList.add("character-info");
                characterInfo.innerHTML = `
                    <h2>${character.name}</h2>
                    <p>Films: ${character.films.join(", ")}</p>
                    <p>TV Shows: ${character.tvShows.join(", ")}</p>
                    <p>Video Games: ${character.videoGames.join(", ")}</p>
                    <a href="${character.url}" target="_blank">More Info</a>
                `;

                // Adiciona elementos à div de personagens
                characterElement.appendChild(img);
                characterElement.appendChild(characterInfo);
                charactersDiv.appendChild(characterElement);
            });

            // Atualiza o número da página atual
            currentPage = page;

            // Habilita ou desabilita os botões de página anterior e próxima
            previousPageButton.disabled = !data.info.previousPage;
            nextPageButton.disabled = !data.info.nextPage;
        } catch (error) {
            console.error("Error fetching characters:", error);
        }
    }

    // Event listener para o botão de página anterior
    previousPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            fetchCharacters(currentPage - 1, searchInput.value);
        }
    });

    // Event listener para o botão de próxima página
    nextPageButton.addEventListener("click", () => {
        fetchCharacters(currentPage + 1, searchInput.value);
    });

    // Event listener para o botão de pesquisa
    searchButton.addEventListener("click", () => {
        fetchCharacters(1, searchInput.value);
    });

    // Chama a função para buscar e exibir os personagens ao carregar a página
    fetchCharacters(currentPage);
});
