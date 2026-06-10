import { Link } from 'react-router-dom'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  to,
  type = 'button',
  disabled = false,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-sora font-semibold rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon/60 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none'

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const variants = {
    primary:
      'bg-neon text-dark hover:bg-neon-hover hover:scale-105 active:scale-95 animate-glow-pulse shadow-[0_0_20px_rgba(195,255,81,0.35)]',
    outline:
      'border border-neon/50 text-neon hover:bg-neon/10 hover:border-neon hover:shadow-[0_0_20px_rgba(195,255,81,0.2)] active:scale-95',
    ghost:
      'text-white/70 hover:text-neon hover:bg-white/5 active:scale-95',
  }

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

export default Button
