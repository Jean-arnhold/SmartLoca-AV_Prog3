document.addEventListener("DOMContentLoaded", () => {
  const clientForm = document.getElementById("clientForm");
  const clientsList = document.getElementById("clientsList");

  let clients = [];


  fetch("../data/locadora.json")
    .then(res => res.json())
    .then(data => {
      clients = data.clientes;
      renderClients();
    });

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

  window.editClient = (id) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      document.getElementById("clientId").value = client.id;
      document.getElementById("clientName").value = client.nome;
      document.getElementById("clientCpf").value = client.cpf;
      document.getElementById("clientPhone").value = client.telefone;
      document.getElementById("clientEmail").value = client.email;
      document.getElementById("formTitle").textContent = "Editar Cliente";
    }
  };

  window.deleteClient = (id) => {
    clients = clients.filter(c => c.id !== id);
    renderClients();
  };

  clientForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("clientId").value);
    const nome = document.getElementById("clientName").value;
    const cpf = document.getElementById("clientCpf").value;
    const telefone = document.getElementById("clientPhone").value;
    const email = document.getElementById("clientEmail").value;

    if (id) {
      const client = clients.find(c => c.id === id);
      if (client) {
        client.nome = nome;
        client.cpf = cpf;
        client.telefone = telefone;
        client.email = email;
      }
    } else {
      const newId = clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1;
      clients.push({ id: newId, nome, cpf, telefone, email });
    }

    clientForm.reset();
    document.getElementById("formTitle").textContent = "Adicionar Novo Cliente";
    renderClients();
  });
});
