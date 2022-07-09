import { model, models, Schema } from 'mongoose'

const twitchNotifySchema = new Schema({
  // Guild Id
  _id: { type: String, required: true },
  channel: { type: String, required: true },
  streamers: [
    {
      channel: String,
      live: Boolean,
    },
  ],
})

const name = 'twitchNotify'
export default models[name] || model(name, twitchNotifySchema)
