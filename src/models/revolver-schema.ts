import { model, models, Schema } from 'mongoose'

const revolverSchema = new Schema({
  // Guild Id
  _id: { type: String, required: true },
  chambers: [{ type: Number, required: true }],
})

const name = 'revolver'
export default models[name] || model(name, revolverSchema)
