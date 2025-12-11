import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido')
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
