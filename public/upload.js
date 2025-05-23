const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const cancelFileBtn = document.getElementById("cancelFileBtn");
const messageDiv = document.getElementById("message");

const token = localStorage.getItem("token");

if(!token){
  window.location.href = "../public/Login/login.html"
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  messageDiv.textContent = "";
  messageDiv.className = "message";

  const file = fileInput.files[0];

  if (!file) {
    messageDiv.textContent = "Selecione um arquivo, Formato Xlsx ";
    messageDiv.classList.add("error");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer${token}`
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Erro ao fazer upload");
    }

    messageDiv.textContent = result.message || "Arquivo enviado com sucesso!";
    
    // Limpa o input de arquivo
    fileInput.value = "";
    cancelFileBtn.style.display = "none";

  } catch (error) {
    messageDiv.textContent = error.message;
    messageDiv.classList.add("error");
  }
});

// Exibe botão de cancelar quando um arquivo é selecionado
fileInput.addEventListener("change", () => {
  cancelFileBtn.style.display = fileInput.files.length > 0 ? "inline" : "none";
});

// Lógica para cancelar o arquivo
cancelFileBtn.addEventListener("click", () => {
  fileInput.value = "";
  cancelFileBtn.style.display = "none";
});
