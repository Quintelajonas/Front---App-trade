let currentPage = 1;
const limit = 6;
const token = localStorage.getItem("token")

if(!token){
  window.location.href = "../Login/login.html"
}



async function fetchPromotores(page = 1) {
  try {
    const query = document.getElementById("searchInput")?.value?.trim();
    let url = `http://localhost:3000/promotores?page=${page}&limit=${limit}`;

    if (query) {
      const isMatricula = !isNaN(query);
      const param = isMatricula ? "matricula" : "nome";
      url += `&${param}=${encodeURIComponent(query)}`;
    }

    const res = await fetch(url, {
      headers: {'Athorization': `Bearer $${token}`}
    });
    const json = await res.json();

    const container = document.getElementById("promotores-container");
    const pageInfo = document.getElementById("pageInfo");

    container.innerHTML = "";

    json.data.forEach(promotor => {
      const card = document.createElement("div");
      card.classList.add("card");

      let desempenhoHTML = "";

      if (promotor.desempenho.length > 0) {
        desempenhoHTML = promotor.desempenho.map(d => {
          return `<div>
            <strong>${d.mes}/${d.ano}</strong>: 
            ${d.vendas} vendas | 
            ${d.faltas ?? 0} faltas
          </div>`;
        }).join("");
      } else {
        desempenhoHTML = "<div>Sem dados</div>";
      }

      card.innerHTML = `
        <div class="topo-card"> 
          <h3>${promotor.nome}</h3>  
          <button class="detalhar-btn" data-id="${promotor.id}">Detalhar</button>
        </div>
        <p><strong>Matrícula:</strong> ${promotor.matricula}</p>
        <div class="desempenho">
          <strong>Dados de contato:</strong><br>
              <p><strong>Email:</strong> ${promotor.email ?? "exemplo@email.com"}</p>
              <p><strong>Telefone:</strong> ${promotor.telefone ?? "11 99999-9999"}</p>
        </div>
      `;

      container.appendChild(card);
    });

    // Adiciona os eventos após renderizar os cards
    const detalharButtons = document.querySelectorAll(".detalhar-btn");
    detalharButtons.forEach(button => {
      button.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        window.location.href = `../detalhe/detalhe.html?id=${id}`;
      });
    });

    pageInfo.textContent = `Página ${json.currentPage} de ${json.totalPage}`;
    currentPage = json.currentPage;

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === json.totalPage;
  } catch (err) {
    console.error("Erro ao buscar promotores:", err);
  }
}

document.getElementById("searchBtn").addEventListener("click", () => {
  fetchPromotores(1); // reinicia a paginação na busca
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    fetchPromotores(currentPage - 1);
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  fetchPromotores(currentPage + 1);
});

fetchPromotores();


