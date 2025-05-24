const form = document.getElementById('feedbackForm');
const advertenciaRadios = document.getElementsByName('advertencia');
const motivoField = document.getElementById('motivoAdvertencia');


advertenciaRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if(radio.value === "true" && radio.checked) {
            motivoField.disabled = false
        } else if (radio.value === "false" && radio.checked) {
            motivoField.disabled = true
            motivoField.value =""
        }
    })
})

async function carregarUsuarios() {
    try{

        const res = await fetch("https://backend-resultados.onrender.com/usuarios")
        const usuarios = await res.json()
        
        const select = document.getElementById('usuarioId')
        usuarios.forEach(usuario => {
            const option = document.createElement('option')
            option.value = usuario.id
            option.textContent = usuario.nome
            select.appendChild(option)
        })
    } catch(err) {
        alert("Erro ao carregar usuários!")
    }
    
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = {
    promotorId: Number(formData.get("promotorId")),
    usuarioId: Number(formData.get("usuarioId")),
    abordou: formData.get("abordou") === "true",
    uniformizado: formData.get("uniformizado") === "true",
    dominaProduto: formData.get("dominaProduto") === "true",
    advertencia: formData.get("advertencia") === "true",
    motivoAdvertencia: formData.get("advertencia") === "true" ? formData.get("motivoAdvertencia") || null : null,
    observacoes: formData.get("observacoes") || null,
  };

  try {
    const res = await fetch('https://backend-resultados.onrender.com/feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("Feedback enviado com sucesso!");
      form.reset();
    } else {
      alert("Erro ao enviar feedback.");
    }
  } catch (err) {
    alert("Erro na comunicação com o servidor.");
  }
});

carregarUsuarios();

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const promotorId = params.get("promotorId");


    if (promotorId) {
    document.getElementById("promotorId").value = promotorId;
  }

  const cancelarBtn = document.getElementById("cancelarBtn");

  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      if (promotorId) {
        window.location.href = `../detalhe/detalhe.html?id=${promotorId}`;
      } else {
        window.history.back();
      }
    });
  }
});