const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
{
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
    },

    photo: {
        type: String,
        default:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },

    collegeId: {
        type: String,
        unique: true,
        sparse: true,
    },

    department: {
        type: String,
    },

    branch: {
        type: String,
    },

    year: {
        type: String,
    },

    course: {
        type: String,
    },
},
{
    timestamps: true,
}
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);