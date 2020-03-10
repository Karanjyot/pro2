module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define("Answer", {
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  // Answer.associate = function(models) {
  //   Answer.belongsTo(models.Question, { foreign_key: { allowNull: false } });
  // };

  return Answer;
};
