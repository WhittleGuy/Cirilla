import mongoose, { Schema, models } from 'mongoose'

const warnSchema = new Schema(
  {
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    reason: { type: String, required: true },
    staffId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const name = 'warn'

export default models[name] || mongoose.model(name, warnSchema)
