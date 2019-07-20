const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;
const userSchema = new schema({
  fname: {
    type: String,
    required: false,
    unique: false,
    default:''
  },
  lname: {
    type: String,
    required: false,
    unique: false,
    default:''
  },
  password: {
    type: String,
    default:bcrypt.hashSync("admin123", bcrypt.genSaltSync(10)),
    required: true,
  },
  email: {
    type: String,
    unique: true,
    require: true
  },
  userType: {
    type: String,
    default: 'user',
    enum: [
      'admin',
      'mod',
      'user',
    ],
  },
  loginGoogle:{
    type:String,
    default:''
  }
});
userSchema.methods.hashPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function(password,hash){
    return bcrypt.compareSync(password,hash)
}
module.exports=mongoose.model('user',userSchema, 'user');
