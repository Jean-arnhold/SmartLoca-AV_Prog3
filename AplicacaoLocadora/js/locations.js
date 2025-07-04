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

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => {
      el.classList.remove('error');
    });
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  function renderLocacoes() {
    locationsList.innerHTML = "";
    locacoes.forEach(loc => {
      const clienteNome = loc.Cliente ? loc.Cliente.nome : "N/A";
      const carroDesc = loc.Carro ? `${loc.Carro.modelo} (${loc.Carro.placa})` : "N/A";
      
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${clienteNome}</td>
        <td class="p-2">${carroDesc}</td>
        <td class="p-2">${new Date(loc.data_inicio).toLocaleDateString()} até ${new Date(loc.data_fim).toLocaleDateString()}</td>
        <td class="p-2">R$ ${parseFloat(loc.valor_total).toFixed(2)}</td>
        <td class="p-2">
          <button class="text-blue-600 hover:underline" onclick="editLocation(${loc.id})">Editar</button>
        </td>
        <td class="p-2">
          <button class="text-green-600 hover:underline" onclick="finalizeLocation(${loc.id})" ${loc.finalizada ? 'disabled class="text-gray-400"' : ''}>
            ${loc.finalizada ? 'Finalizada' : 'Finalizar'}
          </button>
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


  async function fetchData() {
    try {
      const [clientesRes, carrosRes, locacoesRes] = await Promise.all([
        fetch(`${API_URL}/clientes`),
        fetch(`${API_URL}/carros`),
        fetch(`${API_URL}/locacoes`)
      ]);

      if (!clientesRes.ok) throw await clientesRes.json();
      if (!carrosRes.ok) throw await carrosRes.json();
      if (!locacoesRes.ok) throw await locacoesRes.json();

      clientes = await clientesRes.json();
      carros = await carrosRes.json();
      locacoes = await locacoesRes.json();

      populateClientesSelect();
      populateCarrosSelect();
      renderLocacoes();
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert(error.message || 'Erro ao carregar dados');
    }
  }

 
  function validateForm() {
    let isValid = true;
    clearErrors();

   
    ['locationClient', 'locationCar', 'locationStart', 'locationEnd', 'locationValue'].forEach(id => {
      if (!document.getElementById(id).value) {
        showError(id, 'Este campo é obrigatório');
        isValid = false;
      }
    });

  
    const dataInicio = new Date(document.getElementById("locationStart").value);
    const dataFim = new Date(document.getElementById("locationEnd").value);
    
    if (dataInicio && dataFim && dataFim <= dataInicio) {
      showError('locationEnd', 'Data de término deve ser após a data de início');
      isValid = false;
    }

  
    const valor = parseFloat(document.getElementById("locationValue").value);
    if (isNaN(valor)) {
      showError('locationValue', 'Valor deve ser um número');
      isValid = false;
    } else if (valor <= 0) {
      showError('locationValue', 'Valor deve ser positivo');
      isValid = false;
    }

    return isValid;
  }


  window.editLocation = (id) => {
    const loc = locacoes.find(l => l.id === id);
    if (loc) {
      clearErrors();
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
      document.getElementById("locationStart").value = loc.data_inicio.split('T')[0];
      document.getElementById("locationEnd").value = loc.data_fim.split('T')[0];
      document.getElementById("locationValue").value = parseFloat(loc.valor_total);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  
  window.deleteLocation = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta locação?")) {
      try {
        const response = await fetch(`${API_URL}/locacoes/${id}`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) {
          throw await response.json();
        }
        
        await fetchData();
      } catch (error) {
        console.error('Erro ao excluir locação:', error);
        alert(error.message || 'Erro ao excluir locação');
      }
    }
  };

  window.finalizeLocation = async (id) => {
    if (confirm("Tem certeza que deseja finalizar esta locação?")) {
      try {
        const response = await fetch(`${API_URL}/locacoes/${id}/finalizar`, { 
          method: 'PUT' 
        });
        
        if (!response.ok) {
          throw await response.json();
        }
        
        alert("Locação finalizada com sucesso!");
        await fetchData();
      } catch (error) {
        console.error('Erro ao finalizar locação:', error);
        alert(error.message || 'Erro ao finalizar locação');
      }
    }
  };

 
  locationForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    if (!validateForm()) return;

    try {
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

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        throw await response.json();
      }

     
      locationForm.reset();
      locationIdInput.value = '';
      await fetchData();
      
    } catch (error) {
      console.error('Erro ao salvar locação:', error);
      if (error.type === 'validation') {
        
        error.errors.forEach(err => {
          const fieldId = `location${err.field.split('_').map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)).join('')}`;
          showError(fieldId, err.message);
        });
      } else {
        alert(error.message || 'Erro ao processar a locação');
      }
    }
  });

  
  fetchData();
});