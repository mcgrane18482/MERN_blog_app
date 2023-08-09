const { Schema, model, Types } = require('mongoose');
const {hash, compare} = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: val => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)
        }
    },
    password: {
        type: String,
        required: true,
        min: [6, 'Password must contain at least 6 characters']
    },
    notes: [{
        type: Types.ObjectId,
        ref: 'Note'
    }]
}, {
    timestamps: true,
    methods: {
       async validatePass(formPassword){
        const isValid = compare(formPassword, this.password);

        return isValid;
        }
    },
    toJSON: {
        transform(_, user){
            delete user.password;
            return user;
        }
    }
});

userSchema.pre('save', async function(next) {
    this.password = await hash(this.password, 10);
    next();
})

const User = model('User', userSchema);

module.exports = User;