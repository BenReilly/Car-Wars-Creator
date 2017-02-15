const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema,
    sodium = require('sodium').api;
//    aes = cryptoJs.aes,
//    sha = cryptoJs.sha256;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: { unique: true }
    },
    salt: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cars: [ObjectId]
});

UserSchema.pre('save', function(next) {
    let user = this,
        buf,
        passwordBuf,
        hash;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    buf = new Buffer(sodium.crypto_pwhash_STRBYTES);
    sodium.randombytes_buf(buf, sodium.crypto_pwhash_STRBYTES);
    // add salt to the password
    passwordBuf = Buffer.from(user.password + buf.toString());
    // hash them
    hash = sodium.crypto_pwhash_str(passwordBuf, sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE);
    // assign to the model
    user.salt = salt;
    user.password = hash;
    next();
});

UserSchema.methods.comparePassword = function(candidatePassword, targetUser) {
    let saltedCandidate = candidatePassword + targetUser.salt;
    if (sodium.crypto_pwhash_str_verify(saltedCandidate, targetUser.password)) {
        return true;
    };
    return false;
};

module.exports = mongoose.model('User', UserSchema);