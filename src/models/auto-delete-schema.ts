import { model, models, Schema } from 'mongoose'

const autoDeleteSchema = new Schema({
  // Guild Id
  _id: { type: String, required: true },
  channelId: { type: String, required: true },
  timeout: { type: Number, required: true },
})

const name = 'auto-delete'
export default models[name] || model(name, autoDeleteSchema, name)
