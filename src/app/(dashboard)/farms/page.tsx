import Link from 'next/link'
import { getFarms } from './actions'
import FarmsTable from './FarmsTable'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

export default async function FarmsPage() {
  const farms = await getFarms()

  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <Typography variant='h4' className='flex items-center gap-2'>
          <i className='tabler-building-farm text-3xl' />
          รายการฟาร์ม
        </Typography>
        <Button component={Link} href='/farms/new' variant='contained' startIcon={<i className='tabler-plus' />}>
          เพิ่มฟาร์ม
        </Button>
      </div>
      <Card className='mt-6'>
        <CardContent>
          <FarmsTable farms={farms} />
        </CardContent>
      </Card>
    </>
  )
}
