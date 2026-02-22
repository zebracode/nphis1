import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFarm } from '@/app/(dashboard)/farms/actions'
import { getAnimal, updateAnimal } from '../../actions'
import AnimalForm from '../../AnimalForm'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Props = { params: Promise<{ farmId: string; animalId: string }> }

export default async function EditAnimalPage({ params }: Props) {
  const { farmId, animalId } = await params
  const fId = parseInt(farmId, 10)
  const aId = parseInt(animalId, 10)
  if (isNaN(fId) || isNaN(aId)) notFound()
  const [farm, animal] = await Promise.all([getFarm(fId), getAnimal(aId)])
  if (!farm || !animal || animal.farmId !== fId) notFound()

  return (
    <>
      <div className='mb-6'>
        <Button component={Link} href={`/farms/${fId}/animals`} variant='text' startIcon={<i className='tabler-arrow-left' />}>
          กลับ
        </Button>
      </div>
      <Typography variant='h4' className='mb-6'>
        แก้ไขสัตว์: {animal.species}
      </Typography>
      <AnimalForm action={updateAnimal} defaultValues={animal} farmId={fId} animalId={aId} cancelHref={`/farms/${fId}/animals`} />
    </>
  )
}
