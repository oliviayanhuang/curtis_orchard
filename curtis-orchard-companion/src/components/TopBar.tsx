import { useNavigate } from 'react-router-dom'
import { AppleMark, ChevronLeft, MenuIcon } from './Icons'

interface Props {
  title?: string
  brand?: boolean
  back?: boolean
  action?: React.ReactNode
}

export function TopBar({ title, brand, back, action }: Props) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 flex h-[52px] shrink-0 items-center gap-2 border-b border-line bg-surface px-3">
      {back && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="-ml-1 flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-page"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {brand ? (
        <div className="flex items-center gap-2 pl-1">
          <AppleMark className="h-[26px] w-[26px]" />
          <span className="text-[19px] font-bold tracking-[-0.02em]">Curtis Orchard</span>
        </div>
      ) : (
        <h1 className="flex-1 text-center text-[19px] font-bold">{title}</h1>
      )}

      <div className="ml-auto flex items-center">
        {action ?? (brand ? <MenuButton /> : back ? <span className="w-11" /> : null)}
      </div>
    </header>
  )
}

function MenuButton() {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate('/help')}
      aria-label="Help and contact"
      className="flex h-11 w-11 items-center justify-center rounded-full text-ink active:bg-page"
    >
      <MenuIcon className="h-6 w-6" />
    </button>
  )
}
