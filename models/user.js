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
    }
});

UserSchema.pre('save', function(next) {
    let user = this,
        passwordBuf = Buffer.from(user.password, 'ascii'),
        hash = sodium.crypto_pwhash_str(passwordBuf, sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE);
    user.password = hash;
    next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    let candidateBuf = Buffer.from(candidatePassword, 'ascii');
    if (sodium.crypto_pwhash_str_verify(this.password, candidateBuf)) {
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