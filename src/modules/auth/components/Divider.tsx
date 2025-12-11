export const Divider = ({ text = 'ou' }: { text?: string }) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-card text-muted-foreground">{text}</span>
      </div>
    </div>
  )
}
