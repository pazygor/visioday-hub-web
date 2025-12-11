/**
 * Constantes de cores do VisionDay Hub - Identidade Visual
 */

export const colors = {
  // Cores VisionDay
  visionday: {
    blueLight: '#0066B1', // Azul primário/base
    blueDark: '#002358',  // Azul hover/ativo
  },
  interface: {
    background: '#F9FAFB',
    textPrimary: '#1D2530',
    textSecondary: '#65758B',
    active: '#F0EFEE',
    sidebar: '#002358', // Azul escuro VisionDay
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0066B1', // Azul VisionDay
  },
  funil: {
    contabilidade: '#0066B1', // Azul VisionDay
    analiseIF: '#F59E0B', // Amarelo
    preAprovado: '#A855F7', // Roxo
    gestao: '#002358', // Azul escuro VisionDay
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
  prospeccao: COLORS.funil.prospeccao,
  analise_if: COLORS.funil.analiseIF,
  pre_aprovado: COLORS.funil.preAprovado,
  ia_comercial: COLORS.funil.iaComercial,
  abertura_conta: COLORS.funil.aberturaConta,
  concluido: COLORS.funil.concluido,
}
