import Mongoose from 'mongoose'

const testSchema = new Mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
})

export default Mongoose.model('testing', testSchema)
