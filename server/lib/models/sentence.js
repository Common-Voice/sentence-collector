'use strict';

module.exports = (sequelize, DataTypes) => {
  const Sentence = sequelize.define('Sentence', {
    sentence: DataTypes.STRING,
    user: DataTypes.STRING,
    source: DataTypes.STRING,
    batch: DataTypes.STRING,
    localeId: DataTypes.STRING,
  }, {});

  Sentence.associate = (models) => {
    Sentence.hasMany(models.Vote, { as: 'Vote', foreignKey: 'sentenceId' });
  };

  return Sentence;
};