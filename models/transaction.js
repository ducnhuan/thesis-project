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
  Total: {
    type: Number,
    default:0

  },
},
{
  collection: 'Transaction',
  timestamps: true,
});
module.exports=mongoose.model('Transaction',transactionSchema);