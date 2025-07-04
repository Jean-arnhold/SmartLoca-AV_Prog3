document.addEventListener("DOMContentLoaded", () => {
  const clientForm = document.getElementById("clientForm");
  const clientsList = document.getElementById("clientsList");
  const formTitle = document.getElementById("formTitle");
  const clientIdInput = document.getElementById("clientId");

  const API_URL = 'http://localhost:3000/api';
  let clients = [];


  function renderClients() {
    clientsList.innerHTML = "";
    clients.forEach(client => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${client.nome}</td>
        <td class="p-2">${client.cpf}</td>
        <td class="p-2">${client.telefone}</td>
        <td class="p-2">
          <button class="text-blue-600 hover:underline" onclick="editClient(${client.id})">Editar</button>
        </td>
        <td class="p-2">
            <button class="text-red-600 hover:underline" onclick="deleteClient(${client.id})">Excluir</button>
        </td>
      `;
      clientsList.appendChild(row);
    });
  }


  function fetchClients() {
    fetch(`${API_URL}/clientes`)
      .then(res => res.json())
      .then(data => {
        clients = data;
        renderClients();
      })
      .catch(err => console.error("Erro ao buscar clientes:", err));
  }

  
  window.editClient = (id) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      clientIdInput.value = client.id;
      document.getElementById("clientName").value = client.nome;
      document.getElementById("clientCpf").value = client.cpf;
      document.getElementById("clientPhone").value = client.telefone;
      document.getElementById("clientEmail").value = client.email;
      formTitle.textContent = "Editar Cliente";
    }
  };


  window.deleteClient = (id) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      fetch(`${API_URL}/clientes/${id}`, {
        method: 'DELETE',
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message) });
        }
        fetchClients(); 
      })
      .catch(err => alert(`Erro ao excluir cliente: ${err.message}`));
    }
  };

  
  clientForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(clientIdInput.value);
    const clientData = {
      nome: document.getElementById("clientName").value,
      cpf: document.getElementById("clientCpf").value,
      telefone: document.getElementById("clientPhone").value,
      email: document.getElementById("clientEmail").value,
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/clientes/${id}` : `${API_URL}/clientes`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => { throw new Error(err.message || "Erro ao salvar") });
      }
      return res.json();
    })
    .then(() => {
      clientForm.reset();
      clientIdInput.value = '';
      formTitle.textContent = "Adicionar Novo Cliente";
      fetchClients(); 
    })
    .catch(err => alert(`Erro ao salvar cliente: ${err.message}`));
  });

  
  fetchClients();
});