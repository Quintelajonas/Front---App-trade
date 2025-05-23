async function carregarDetalhes() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../Login/login.html";
  }

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("detalhesPromotor").innerText = "ID inválido";
    return;
  }

  try {
    const res = await fetch(`https://backend-resultados.onrender.com/promotores/${id}`);
    const data = await res.json();
    const promotor = data.promotor;

    if (!promotor) {
      document.getElementById("detalhesPromotor").innerText =
        "Promotor não encontrado.";
      return;
    }

    const container = document.getElementById("detalhesPromotor");
    let desempenhoHTML = "";

    if (promotor.desempenho.length > 0) {
      desempenhoHTML = promotor.desempenho
        .map((d) => {
          return `<li><strong>${d.mes}/${d.ano}:</strong> ${
            d.vendas
          } vendas | ${d.faltas ?? 0} faltas</li>`;
        })
        .join("");
    } else {
      desempenhoHTML = "<li>Sem dados</li>";
    }

    container.innerHTML = `
    <div class="card-container">
    <div class="top-card-detalhe">
    <h3>Detalhe Promtor</h3>
    <hr>
    <a href="../Promotores/promotores.html">⬅Voltar</a>
    <div class= "dados">
    <p><strong>Nome:</strong> ${promotor.nome}</p>
    <p><strong>Matrícula:</strong> ${promotor.matricula}</p>
    </div>
    <div class= "dados">
    <p><strong>Email:</strong> ${promotor.email ?? "exemplo@email.com"}</p>
    <p><strong>Telefone:</strong> ${promotor.telefone ?? "11 99999-9999"}</p>
    </div>
    </div>
    <div class="desempenho-MoM">
    <h4>Desempenho Mensal</h4>
    <hr>
      <ul>${desempenhoHTML}</ul>
    </div>
    </div>
    `;

    // Adiciona link para aplicar feedback
    const botao = document.getElementById("botaoFeedback");
    if (botao) botao.href = `../Feedback/feedback.html?promotorId=${id}`;

    // Busca os feedbacks desse promotor
    const resFeedback = await fetch(
      `https://backend-resultados.onrender.com/promotores/${id}/feedbacks`
    );
    const dadosFeedback = await resFeedback.json();

    const listaFeedbacks = document.getElementById("listaFeedbacks");
    if (!listaFeedbacks) return;

    if (!dadosFeedback.feedbacks || dadosFeedback.feedbacks.length === 0) {
      listaFeedbacks.innerHTML = "<li>Nenhum feedback aplicado ainda.</li>";
    } else {
      listaFeedbacks.innerHTML = dadosFeedback.feedbacks
        .map(
          (f) => `
        <li>
          <strong>Aplicado em:</strong> ${new Date(
            f.criadoEm
          ).toLocaleDateString()}<br>
          <strong>Por:</strong> ${f.usuario?.nome ?? "Desconhecido"}<br>
        </li>
        
      `
        )
        .join("");
    }
  } catch (err) {
    console.error("Erro ao buscar detalhes:", err);
    document.getElementById("detalhesPromotor").innerText =
      "Erro ao carregar promotor.";
  }
}

// Chama a função quando a página carregar
carregarDetalhes();
