import { model, models, Schema } from 'mongoose'

const reqString = {
  type: String,
  required: true,
}

const confessionChSchema = new Schema({
  // Guild Id
  _id: reqString,
  channelId: reqString,
})

const name = 'confessionChannels'
export default models[name] || model(name, confessionChSchema, name)
