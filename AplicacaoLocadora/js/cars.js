document.addEventListener("DOMContentLoaded", () => {
  const carForm = document.getElementById("carForm");
  const carsList = document.getElementById("carsList");
  const formTitle = document.getElementById("carFormTitle");
  const carIdInput = document.getElementById("carId");

  const API_URL = 'http://localhost:3000/api';
  let cars = [];

  function renderCars() {
    carsList.innerHTML = "";
    cars.forEach(car => {
      const row = document.createElement("tr");
      
      // *** MUDANÇA AQUI: Lendo o 'status' e definindo a cor ***
      let statusClass = '';
      if (car.status === 'Disponível') statusClass = 'text-green-400';
      else if (car.status === 'Alugado') statusClass = 'text-yellow-400';
      else if (car.status === 'Manutenção') statusClass = 'text-orange-400';
      
      row.innerHTML = `
        <td class="p-2">${car.marca}</td>
        <td class="p-2">${car.modelo}</td>
        <td class="p-2">${car.placa}</td>
        <td class="p-2 ${statusClass}">${car.status}</td>
        <td class="p-2">
          <button class="text-blue-600 hover:underline" onclick="editCar(${car.id})">Editar</button>
        </td>
        <td class="p-2">
            <button class="text-red-600 hover:underline" onclick="deleteCar(${car.id})">Excluir</button>
        </td>
      `;
      carsList.appendChild(row);
    });
  }

  function fetchCars() {
    fetch(`${API_URL}/carros`).then(res => res.json()).then(data => {
      cars = data;
      renderCars();
    }).catch(err => console.error("Erro ao buscar carros:", err));
  }

  window.editCar = (id) => {
    const car = cars.find(c => c.id === id);
    if (car) {
      carIdInput.value = car.id;
      document.getElementById("carBrand").value = car.marca;
      document.getElementById("carModel").value = car.modelo;
      document.getElementById("carYear").value = car.ano;
      document.getElementById("carPlate").value = car.placa;
      // *** MUDANÇA AQUI: Usando o campo 'status' diretamente ***
      document.getElementById("carStatus").value = car.status; 
      formTitle.textContent = "Editar Veículo";
    }
  };

  window.deleteCar = (id) => {
    if (confirm("Tem certeza que deseja excluir este veículo?")) {
      fetch(`${API_URL}/carros/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw new Error(err.message) });
        fetchCars();
      })
      .catch(err => alert(`Erro ao excluir veículo: ${err.message}`));
    }
  };

  carForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(carIdInput.value);
    
    // *** MUDANÇA AQUI: Enviando o campo 'status' diretamente ***
    const carData = {
      marca: document.getElementById("carBrand").value,
      modelo: document.getElementById("carModel").value,
      ano: parseInt(document.getElementById("carYear").value),
      placa: document.getElementById("carPlate").value,
      status: document.getElementById("carStatus").value,
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/carros/${id}` : `${API_URL}/carros`;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData),
    })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.message || "Erro ao salvar") });
      return res.json();
    })
    .then(() => {
      carForm.reset();
      carIdInput.value = '';
      formTitle.textContent = "Adicionar Novo Veículo";
      fetchCars();
    })
    .catch(err => alert(`Erro ao salvar veículo: ${err.message}`));
  });

  fetchCars();
});