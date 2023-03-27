const { Sequelize, DataTypes } = require('sequelize');

const { tokenTypes } = require('../config/tokens');
const sequelize = require('../utils/database');

const tokenSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    token: DataTypes.TEXT,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'users',
            key: 'id',
            as: 'user_foreign_key'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
    },
    type: DataTypes.ENUM(tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL),
    expires: DataTypes.DATE,
    blacklisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
};

const Token = sequelize.define('tokens', tokenSchema, { timestamps:false });
module.exports = Token;