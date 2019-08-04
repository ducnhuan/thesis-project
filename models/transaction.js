const mongoose = require('mongoose');
const schema = mongoose.Schema;
const transactionSchema = new schema({
  orderId: {
    type: String,
    required: true,
    default:''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    default:undefined
  },
  contractAddress: {
    type: String,
    default:''

  },
},
{
  collection: 'Transaction',
  timestamps: true,
});
module.exports=mongoose.model('Transaction',transactionSchema);