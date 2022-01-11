import { model, models, Schema } from 'mongoose'

const loggingSchema = new Schema({
  // Guild Id
  _id: { type: String, required: true },
  logChannel: { type: String, required: true },
  enabled: { type: Boolean, required: true },
  inviteCreate: { type: Boolean, required: true },
  inviteDelete: { type: Boolean, required: true },
  msgDelete: { type: Boolean, required: true },
  msgBulkDelete: { type: Boolean, required: true },
  msgUpdate: { type: Boolean, required: true },
  roleCreate: { type: Boolean, required: true },
  roleDelete: { type: Boolean, required: true },
  roleUpdate: { type: Boolean, required: true },
  threadCreate: { type: Boolean, required: true },
  threadDelete: { type: Boolean, required: true },
  threadUpdate: { type: Boolean, required: true },
  voiceUpdate: { type: Boolean, required: true },
  memberRoleUpdate: { type: Boolean, required: true },
  memberNickUpdate: { type: Boolean, required: true },
  memberRemove: { type: Boolean, required: true },
  memberAdd: { type: Boolean, required: true },
  banRemove: { type: Boolean, required: true },
  banAdd: { type: Boolean, required: true },
})

const name = 'logging'
export default models[name] || model(name, loggingSchema, name)
