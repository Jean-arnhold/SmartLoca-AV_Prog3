document.addEventListener("DOMContentLoaded", () => {
  const carForm = document.getElementById("carForm");
  const carsList = document.getElementById("carsList");

  let cars = [];

  // Carrega os dados do JSON
  fetch("../data/locadora.json")
    .then(res => res.json())
    .then(data => {
      cars = data.carros;
      renderCars();
    });

  function renderCars() {
    carsList.innerHTML = "";
    cars.forEach(car => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${car.modelo}</td>
        <td class="p-2">${car.marca}</td>
        <td class="p-2">${car.placa}</td>
        <td class="p-2">${car.disponivel ? "Disponível" : "Alugado"}</td>
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

  window.editCar = (id) => {
    const car = cars.find(c => c.id === id);
    if (car) {
      document.getElementById("carId").value = car.id;
      document.getElementById("carBrand").value = car.marca;
      document.getElementById("carModel").value = car.modelo;
      document.getElementById("carYear").value = car.ano;
      document.getElementById("carPlate").value = car.placa;
      document.getElementById("carStatus").value = car.disponivel ? "Disponível" : "Alugado";
      document.getElementById("carFormTitle").textContent = "Editar Veículo";
    }
  };

  window.deleteCar = (id) => {
    cars = cars.filter(c => c.id !== id);
    renderCars();
  };

  carForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("carId").value);
    const marca = document.getElementById("carBrand").value;
    const modelo = document.getElementById("carModel").value;
    const ano = parseInt(document.getElementById("carYear").value);
    const placa = document.getElementById("carPlate").value;
    const status = document.getElementById("carStatus").value;
    const disponivel = status === "Disponível";

    if (id) {
      const car = cars.find(c => c.id === id);
      if (car) {
        car.marca = marca;
        car.modelo = modelo;
        car.ano = ano;
        car.placa = placa;
        car.disponivel = disponivel;
      }
    } else {
      const newId = cars.length ? Math.max(...cars.map(c => c.id)) + 1 : 101;
      cars.push({ id: newId, marca, modelo, ano, placa, disponivel });
    }

    carForm.reset();
    document.getElementById("carFormTitle").textContent = "Adicionar Novo Veículo";
    renderCars();
  });
});
