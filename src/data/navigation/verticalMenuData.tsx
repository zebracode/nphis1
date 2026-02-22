// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'รายการฟาร์มzz',
    href: '/farms',
    icon: 'tabler-stethoscope'
  },
  {
    label: 'การตรวจรักษา',
    href: '/examinations',
    icon: 'tabler-stethoscope'
  }
]

export default verticalMenuData
