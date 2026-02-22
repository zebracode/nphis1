import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFarm } from '@/app/(dashboard)/farms/actions'
import { createAnimal } from '../actions'
import AnimalForm from '../AnimalForm'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Props = { params: Promise<{ farmId: string }> }

export default async function NewAnimalPage({ params }: Props) {
  const { farmId } = await params
  const id = parseInt(farmId, 10)
  if (isNaN(id)) notFound()
  const farm = await getFarm(id)
  if (!farm) notFound()

  return (
    <>
      <div className='mb-6'>
        <Button component={Link} href={`/farms/${id}/animals`} variant='text' startIcon={<i className='tabler-arrow-left' />}>
          กลับ
        </Button>
      </div>
      <Typography variant='h4' className='mb-6'>
        เพิ่มสัตว์ในฟาร์ม: {farm.name}
      </Typography>
      <AnimalForm action={createAnimal} farmId={id} cancelHref={`/farms/${id}/animals`} />
    </>
  )
}
