import { Button } from '@/components/ui/Button'
import { Chrome } from 'lucide-react'

export const SocialLogin = () => {
  const handleGoogleLogin = () => {
    // TODO: Implementar login social quando disponível
    console.log('Google login')
  }

  const handleMicrosoftLogin = () => {
    // TODO: Implementar login social quando disponível
    console.log('Microsoft login')
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={handleGoogleLogin}
        className="gap-2"
      >
        <Chrome className="h-5 w-5" />
        Continuar com Google
      </Button>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={handleMicrosoftLogin}
        className="gap-2"
      >
        <svg className="h-5 w-5" viewBox="0 0 23 23" fill="none">
          <path fill="#f35325" d="M0 0h11v11H0z" />
          <path fill="#81bc06" d="M12 0h11v11H12z" />
          <path fill="#05a6f0" d="M0 12h11v11H0z" />
          <path fill="#ffba08" d="M12 12h11v11H12z" />
        </svg>
        Continuar com Microsoft
      </Button>
    </div>
  )
}
