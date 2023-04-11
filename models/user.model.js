const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const validator = require('validator');

const sequelize = require('../utils/database');
const { roles } = require('../config/roles');

const userSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validator(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid Email');
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        mainLength: 8,
        allowNull: false,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        }
    },
    role: {
        type: DataTypes.ENUM(roles),
        defaultValue: 'user'
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
};

const User = sequelize.define('users', userSchema, {
    hooks: {
        beforeCreate: async function(user) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async function(user) {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    delete values.password;
    return values;
}

User.IsEmailTaken = async function(email) {
    const user = await this.findOne({
                        where: { email: email },
                    });
    return !!user;
}

User.isPasswordMatch = async function(password, currentPassword) {
    return bcrypt.compare(password, currentPassword);
}

module.exports = User;
