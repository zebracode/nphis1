import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFarm, updateFarm } from '../../actions'
import FarmForm from '../../FarmForm'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Props = { params: Promise<{ farmId: string }> }

export default async function EditFarmPage({ params }: Props) {
  const { farmId } = await params
  const farm = await getFarm(Number(farmId))
  if (!farm) notFound()

  const updateWithId = updateFarm.bind(null, farm.id)

  return (
    <>
      <div className='mb-6 flex items-center gap-2'>
        <Button component={Link} href='/farms' variant='text' startIcon={<i className='tabler-arrow-left' />}>
          กลับ
        </Button>
      </div>
      <Typography variant='h4' className='mb-6'>
        แก้ไขฟาร์ม
      </Typography>
      <FarmForm action={updateWithId} defaultValues={farm} />
    </>
  )
}
