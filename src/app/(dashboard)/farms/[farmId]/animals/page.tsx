import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFarm } from '@/app/(dashboard)/farms/actions'
import { getAnimalsByFarm } from './actions'
import AnimalsTable from './AnimalsTable'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

type Props = { params: Promise<{ farmId: string }> }

export default async function FarmAnimalsPage({ params }: Props) {
  const { farmId } = await params
  const id = parseInt(farmId, 10)
  if (isNaN(id)) notFound()
  const [farm, animals] = await Promise.all([getFarm(id), getAnimalsByFarm(id)])
  if (!farm) notFound()

  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <Button component={Link} href='/farms' variant='text' startIcon={<i className='tabler-arrow-left' />} className='mb-2'>
            กลับรายการฟาร์ม
          </Button>
          <Typography variant='h4'>สัตว์ในฟาร์ม: {farm.name}</Typography>
        </div>
        <Button
          component={Link}
          href={`/farms/${id}/animals/new`}
          variant='contained'
          startIcon={<i className='tabler-plus' />}
        >
          เพิ่มสัตว์
        </Button>
      </div>
      <Card className='mt-6'>
        <CardContent>
          <AnimalsTable farmId={id} animals={animals} />
        </CardContent>
      </Card>
    </>
  )
}
