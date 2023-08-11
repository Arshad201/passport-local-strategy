const mongoose = require('mongoose');

const connectToDB = async()=>{
    
    try {

        const {connection} = await mongoose.connect('mongodb://127.0.0.1:27017', {});
        console.log(`Connect to Database with ${connection.host} Successfully!`); 

    } catch (error) {
        console.log(error);
    } 

}

const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String
})

const User = mongoose.model('User', userSchema);

module.exports = {connectToDB, User};