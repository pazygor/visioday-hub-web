/**
 * Constantes de cores do VisionDay Hub - Identidade Visual
 */

export const colors = {
  // Cores VisionDay
  visionday: {
    redPrimary: '#9B0310', // Vermelho primário/base
    redDark: '#7A0209',    // Vermelho hover/ativo
    redLight: '#C30414',   // Vermelho mais claro
  },
  interface: {
    background: '#F9FAFB',
    textPrimary: '#1D2530',
    textSecondary: '#65758B',
    active: '#F0EFEE',
    sidebar: '#9B0310', // Vermelho VisionDay
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#9B0310', // Vermelho VisionDay
  },
  funil: {
    prospeccao: '#9B0310', // Vermelho VisionDay
    contabilidade: '#9B0310', // Vermelho VisionDay
    analiseIF: '#F59E0B', // Amarelo
    preAprovado: '#A855F7', // Roxo
    iaComercial: '#7A0209', // Vermelho escuro VisionDay
    gestao: '#7A0209', // Vermelho escuro VisionDay
    aberturaConta: '#F59E0B', // Laranja
    concluido: '#10B981', // Verde
  },
} as const

export type FunilEtapa =
  | 'prospeccao'
  | 'analise_if'
  | 'pre_aprovado'
  | 'ia_comercial'
  | 'abertura_conta'
  | 'concluido'

export const FUNIL_COLORS: Record<FunilEtapa, string> = {
  prospeccao: colors.funil.prospeccao,
  analise_if: colors.funil.analiseIF,
  pre_aprovado: colors.funil.preAprovado,
  ia_comercial: colors.funil.iaComercial,
  abertura_conta: colors.funil.aberturaConta,
  concluido: colors.funil.concluido,
}
