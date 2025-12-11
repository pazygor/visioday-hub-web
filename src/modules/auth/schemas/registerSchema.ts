import { z } from 'zod'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome muito longo')
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Email inválido')
      .max(100, 'Email muito longo'),
    password: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(
        passwordRegex,
        'Senha deve conter maiúscula, minúscula, número e caractere especial'
      ),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Você deve aceitar os termos'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

export type RegisterFormData = z.infer<typeof registerSchema>
