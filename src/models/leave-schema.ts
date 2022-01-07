import { model, models, Schema } from 'mongoose'

const reqString = {
  type: String,
  required: true,
}

const leaveSchema = new Schema({
  // Guild Id
  _id: reqString,
  channelId: reqString,
})

const name = 'leave'
export default models[name] || model(name, leaveSchema, name)
