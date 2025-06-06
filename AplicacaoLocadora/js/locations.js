document.addEventListener("DOMContentLoaded", () => {
  const locationForm = document.getElementById("locationForm");
  const locationsList = document.getElementById("locationsList");

  const locationClient = document.getElementById("locationClient");
  const locationCar = document.getElementById("locationCar");

  let clientes = [];
  let carros = [];
  let locacoes = [];
  let editandoId = null; 

  fetch("../data/locadora.json")
    .then(res => res.json())
    .then(data => {
      clientes = data.clientes;
      carros = data.carros;
      locacoes = data.locacoes;

      preencherSelectClientes();
      preencherSelectCarros();
      renderLocacoes();
    });

  function preencherSelectClientes() {
    locationClient.innerHTML = '<option value="">Selecione um cliente</option>';
    clientes.forEach(cliente => {
      const opt = document.createElement("option");
      opt.value = cliente.id;
      opt.textContent = cliente.nome;
      locationClient.appendChild(opt);
    });
  }

  function preencherSelectCarros() {
    locationCar.innerHTML = '<option value="">Selecione um veículo</option>';
    carros
      .filter(carro => carro.disponivel)
      .forEach(carro => {
        const opt = document.createElement("option");
        opt.value = carro.id;
        opt.textContent = `${carro.modelo} (${carro.placa})`;
        locationCar.appendChild(opt);
      });
  }

  function renderLocacoes() {
    locationsList.innerHTML = "";
    locacoes.forEach(loc => {
      const cliente = clientes.find(c => c.id === loc.cliente_id);
      const carro = carros.find(c => c.id === loc.carro_id);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${cliente?.nome || "N/A"}</td>
        <td class="p-2">${carro ? `${carro.modelo} (${carro.placa})` : "N/A"}</td>
        <td class="p-2">${loc.data_inicio} até ${loc.data_fim}</td>
        <td class="p-2">R$ ${loc.valor_total.toFixed(2)}</td>
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

  window.deleteLocation = (id) => {
    const locacao = locacoes.find(l => l.id === id);
    if (locacao) {
      // Marca o carro como disponível novamente
      const carro = carros.find(c => c.id === locacao.carro_id);
      if (carro) carro.disponivel = true;
    }
    locacoes = locacoes.filter(l => l.id !== id);
    renderLocacoes();

  
    preencherSelectCarros();
  };

  window.editLocation = (id) => {
    const loc = locacoes.find(l => l.id === id);
    if (!loc) return;

    editandoId = id;

    locationClient.value = loc.cliente_id;


    locationCar.innerHTML = '<option value="">Selecione um veículo</option>';
    carros.forEach(carro => {
      const opt = document.createElement("option");
      opt.value = carro.id;
      opt.textContent = `${carro.modelo} (${carro.placa})`;
      locationCar.appendChild(opt);
    });

    locationCar.value = loc.carro_id;
    document.getElementById("locationStart").value = loc.data_inicio;
    document.getElementById("locationEnd").value = loc.data_fim;

    if (!document.getElementById("locationValue")) {
      const valorInput = document.createElement("input");
      valorInput.type = "number";
      valorInput.id = "locationValue";
      valorInput.className = "w-full p-2 border rounded mt-2";
      valorInput.placeholder = "Valor Total (R$)";
      locationForm.insertBefore(valorInput, locationForm.lastElementChild);
    }
    document.getElementById("locationValue").value = loc.valor_total;
  };

  locationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cliente_id = parseInt(locationClient.value);
    const carro_id = parseInt(locationCar.value);
    const data_inicio = document.getElementById("locationStart").value;
    const data_fim = document.getElementById("locationEnd").value;
    const valor_total = parseFloat(document.getElementById("locationValue")?.value) || 0;

    if (data_inicio > data_fim) {
      alert("Data de devolução deve ser após a data de retirada!");
      return;
    }

    if (editandoId) {
      const loc = locacoes.find(l => l.id === editandoId);
      if (loc) {
        // Libera o carro antigo, se foi trocado
        if (loc.carro_id !== carro_id) {
          const carroAntigo = carros.find(c => c.id === loc.carro_id);
          if (carroAntigo) carroAntigo.disponivel = true;
        }
        loc.cliente_id = cliente_id;
        loc.carro_id = carro_id;
        loc.data_inicio = data_inicio;
        loc.data_fim = data_fim;
        loc.valor_total = valor_total;
      }
      editandoId = null;
    } else {
      const novoId = locacoes.length ? Math.max(...locacoes.map(l => l.id)) + 1 : 1001;
      locacoes.push({
        id: novoId,
        cliente_id,
        carro_id,
        data_inicio,
        data_fim,
        valor_total
      });
    }

    // Marca carro como indisponível
    const carro = carros.find(c => c.id === carro_id);
    if (carro) carro.disponivel = false;

    locationForm.reset();
    if (document.getElementById("locationValue")) {
      document.getElementById("locationValue").value = "";
    }
    preencherSelectCarros();
    renderLocacoes();
  });

  // Inicialização da interface
  locationForm.reset();
  preencherSelectCarros();
  renderLocacoes();
});
