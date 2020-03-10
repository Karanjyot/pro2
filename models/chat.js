module.exports = function(sequelize, DataTypes) {
  var Chat = sequelize.define("Chat", {

    sender: DataTypes.STRING,
    reciever: DataTypes.STRING,
    chats: DataTypes.STRING,
      });

// Chat.associate = function(models) {

//   Chat.belongsTo(models.User, {
//     foreignKey: {
//       allowNull: false
//     }
//   });
// };
  return Chat;
};
