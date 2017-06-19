'use strict';

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema,
    config = require('../config'),
    bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: Buffer,
        required: true
    },
    cars: [ObjectId],
    admin: {
        type: Boolean,
        required: false
    },
    createDate: {
        type: Date,
        required: false
    },
    editDate: {
        type: Date,
        required: false
    }
});

UserSchema.pre('save', function(next) {
    let user = this,
        salt = bcrypt.genSaltSync(10),
        hash = bcrypt.hashSync(this.password, salt);
    user.password = hash;
    user.createDate = new Date();
    next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    if (bcrypt.compareSync(candidatePassword, this.password)) {
        return true;
    };
    return false;
};

UserSchema.methods.isAdmin = function() {
    if (this.admin === true) {
        return true;
    };
    return false;
};

module.exports = mongoose.model('User', UserSchema);