'use strict';

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema,
    sodium = require('sodium').api;

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

UserSchema.pre('save', (next) => {
    let user = this,
        passwordBuf = Buffer.from(user.password, 'ascii'),
        hash = sodium.crypto_pwhash_str(passwordBuf, sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE);
    user.password = hash;
    user.createDate = new Date();
    next();
});

UserSchema.methods.comparePassword = (candidatePassword) => {
    console.log(candidatePassword);
    console.log(this);
    console.log(typeof this.password);
    console.log(this.password);
    let candidateBuf = Buffer.from(candidatePassword, 'ascii');
    if (sodium.crypto_pwhash_str_verify(this.password, candidateBuf)) {
        return true;
    };
    return false;
};

UserSchema.methods.isAdmin = () => {
    if (this.admin === true) {
        return true;
    };
    return false;
};

module.exports = mongoose.model('User', UserSchema);