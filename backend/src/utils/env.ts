import 'dotenv/config'
import * as z from 'zod'
const EnvSchema = z.object({
    PORT: z.string().default("5000").transform(val => Number(val)),
    GOOGLE_API_KEY: z.string().min(1, 'Google Gemini API key is required.'),
    MONGODB_ATLAS_URI: z.string().min(1, 'Mongo Atlas uri is required.'),
    MONGODB_DB_NAME: z.string().min(1, 'MongoDB name is required.')
});

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
    console.log('Invalid environment variables.')

    process.exit(1)
}

export const env = Object.freeze(parsed)