import { Building2, Square } from 'lucide-vue-next'

import {
  appRegistry,
  colorRegistry,
} from '~/registry'

export function mapFavoriteApps(items: any[] = []) {
  return items.map((item) => {
    const icon = appRegistry[item.icon]
    const color = colorRegistry[item.color]

    return {
      code: item.app_code,
      title: item.title,
      description: item.description,
      href: item.link,
      icon: icon?.icon ?? Building2,
      color: color ? `${color.bg} ${color.text}` : '',
      badge: item.badge,
      favorite: true,
      position: item.position ?? 0,
    }
  })
}

export function mapFavoriteMenus(items: any[] = []) {
  return items.map((item) => {
    const icon = appRegistry[item.icon]
    const color = colorRegistry[item.color]

    return {
      code: item.menu_code,
      title: item.title,
      description: item.description ?? '',
      href: item.link,
      icon: icon?.icon ?? Square,
      color: color ? `${color.bg} ${color.text}` : '',
      badge: item.badge,
      is_visible: item.is_visible,
      position: item.position ?? 0,
    }
  })
}