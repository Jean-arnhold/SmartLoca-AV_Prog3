module.exports = (sequelize, DataTypes) => {
  const Carro = sequelize.define('Carro', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    placa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
   
    status: {
      type: DataTypes.ENUM('Disponível', 'Alugado', 'Manutenção'),
      defaultValue: 'Disponível',
      allowNull: false
    }
  }, {
    tableName: 'carros',
    timestamps: false
  });

  return Carro;
};