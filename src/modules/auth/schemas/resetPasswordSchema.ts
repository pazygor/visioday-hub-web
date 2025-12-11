import { z } from 'zod'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(
        passwordRegex,
        'Senha deve conter maiúscula, minúscula, número e caractere especial'
      ),
    confirmPassword: z.string().min(1, 'Confirmação é obrigatória')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
