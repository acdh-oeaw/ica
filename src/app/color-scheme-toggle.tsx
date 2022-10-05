import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@stefanprobst/next-theme'

import { useI18n } from '@/app/i18n/use-i18n'

export function ColorSchemeToggle(): JSX.Element | null {
  const { t } = useI18n<'common'>()
  const { theme, toggleTheme } = useTheme()

  if (theme == null) return null

  function onToggleColorScheme() {
    toggleTheme()
  }

  const icons = {
    light: SunIcon,
    dark: MoonIcon,
  }

  const Icon = icons[theme]

  return (
    <button aria-label={t(['common', 'app', 'toggle-color-scheme'])} onClick={onToggleColorScheme}>
      <Icon width="1em" />
    </button>
  )
}
