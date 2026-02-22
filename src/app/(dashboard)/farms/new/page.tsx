import Link from 'next/link'
import { createFarm } from '../actions'
import FarmForm from '../FarmForm'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function NewFarmPage() {
  return (
    <>
      <div className='mb-6 flex items-center gap-2'>
        <Button component={Link} href='/farms' variant='text' startIcon={<i className='tabler-arrow-left' />}>
          กลับ
        </Button>
      </div>
      <Typography variant='h4' className='mb-6'>
        เพิ่มฟาร์ม
      </Typography>
      <FarmForm action={createFarm} />
    </>
  )
}
