// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'รายการฟาร์ม',
    href: '/farms',
    icon: 'tabler-stethoscope'
  },
  {
    label: 'การตรวจรักษา',
    href: '/examinations',
    icon: 'tabler-stethoscope'
  }
]

export default horizontalMenuData
