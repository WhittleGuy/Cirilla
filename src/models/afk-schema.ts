import { model, models, Schema } from 'mongoose'

const afkSchema = new Schema({
  // Member Id
  _id: { type: String, required: true },
  text: { type: String, required: true },
  afk: { type: Boolean, required: true },
})

const name = 'afk'
export default models[name] || model(name, afkSchema, name)
