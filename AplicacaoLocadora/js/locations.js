document.addEventListener("DOMContentLoaded", () => {
  const locationForm = document.getElementById("locationForm");
  const locationsList = document.getElementById("locationsList");
  const locationClientSelect = document.getElementById("locationClient");
  const locationCarSelect = document.getElementById("locationCar");
  const locationIdInput = document.getElementById("locationId");

  const API_URL = 'http://localhost:3000/api';
  let locacoes = [];
  let clientes = [];
  let carros = [];

  function renderLocacoes() {
    locationsList.innerHTML = "";
    locacoes.forEach(loc => {
      const clienteNome = loc.Cliente ? loc.Cliente.nome : "N/A";
      const carroDesc = loc.Carro ? `${loc.Carro.modelo} (${loc.Carro.placa})` : "N/A";
      
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${clienteNome}</td>
        <td class="p-2">${carroDesc}</td>
        <td class="p-2">${loc.data_inicio} até ${loc.data_fim}</td>
        <td class="p-2">R$ ${parseFloat(loc.valor_total).toFixed(2)}</td>
        <td class="p-2">
          <button class="text-blue-600 hover:underline" onclick="editLocation(${loc.id})">Editar</button>
        </td>
        <td class="p-2">
          <button class="text-red-600 hover:underline" onclick="deleteLocation(${loc.id})">Excluir</button>
        </td>
      `;
      locationsList.appendChild(row);
    });
  }

  function populateClientesSelect() {
    locationClientSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    clientes.forEach(cliente => {
      const opt = document.createElement("option");
      opt.value = cliente.id;
      opt.textContent = cliente.nome;
      locationClientSelect.appendChild(opt);
    });
  }

  function populateCarrosSelect() {
    locationCarSelect.innerHTML = '<option value="">Selecione um veículo</option>';
    carros.filter(carro => carro.status === 'Disponível').forEach(carro => {
      const opt = document.createElement("option");
      opt.value = carro.id;
      opt.textContent = `${carro.modelo} (${carro.placa})`;
      locationCarSelect.appendChild(opt);
    });
  }
  
  function fetchLocacoes() {
    return fetch(`${API_URL}/locacoes`).then(res => res.json()).then(data => {
      locacoes = data;
      renderLocacoes();
    });
  }

  function fetchClientes() {
    return fetch(`${API_URL}/clientes`).then(res => res.json()).then(data => {
      clientes = data;
      populateClientesSelect();
    });
  }

  function fetchCarros() {
    return fetch(`${API_URL}/carros`).then(res => res.json()).then(data => {
      carros = data;
      populateCarrosSelect();
    });
  }

  window.editLocation = (id) => {
    const loc = locacoes.find(l => l.id === id);
    if (loc) {
        locationIdInput.value = loc.id;
        locationClientSelect.value = loc.cliente_id;
        
        const carroAtualAlugado = carros.find(c => c.id === loc.carro_id);
        const carroJaNaLista = Array.from(locationCarSelect.options).some(opt => opt.value == loc.carro_id);

        if (carroAtualAlugado && !carroJaNaLista) {
            const opt = document.createElement("option");
            opt.value = carroAtualAlugado.id;
            opt.textContent = `${carroAtualAlugado.modelo} (${carroAtualAlugado.placa})`;
            locationCarSelect.appendChild(opt);
        }

        locationCarSelect.value = loc.carro_id;
        document.getElementById("locationStart").value = loc.data_inicio;
        document.getElementById("locationEnd").value = loc.data_fim;
        document.getElementById("locationValue").value = parseFloat(loc.valor_total);
    }
  };

  window.deleteLocation = (id) => {
    if (confirm("Tem certeza que deseja excluir esta locação?")) {
      fetch(`${API_URL}/locacoes/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao excluir locação.");
        Promise.all([fetchLocacoes(), fetchCarros()]);
      });
    }
  };

  locationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(locationIdInput.value);
    const locationData = {
      cliente_id: parseInt(locationClientSelect.value),
      carro_id: parseInt(locationCarSelect.value),
      data_inicio: document.getElementById("locationStart").value,
      data_fim: document.getElementById("locationEnd").value,
      valor_total: parseFloat(document.getElementById("locationValue").value)
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/locacoes/${id}` : `${API_URL}/locacoes`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData),
    })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.message || "Erro ao salvar") });
      return res.json();
    })
    .then(() => {
      locationForm.reset();
      locationIdInput.value = '';
      Promise.all([fetchLocacoes(), fetchCarros()]);
    })
    .catch(err => alert(`Erro ao salvar locação: ${err.message}`));
  });

  Promise.all([
    fetchClientes(),
    fetchCarros()
  ]).then(() => {
    fetchLocacoes();
  });
});