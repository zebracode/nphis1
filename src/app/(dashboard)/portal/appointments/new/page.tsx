import Link from 'next/link'
import { createAppointment, getFarmsWithAnimals } from '../actions'
import AppointmentForm from '../AppointmentForm'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default async function NewAppointmentPage() {
  const farms = await getFarmsWithAnimals()
  return (
    <>
      <div className='mb-6'>
        <Button component={Link} href='/portal/appointments' variant='text' startIcon={<i className='tabler-arrow-left' />}>
          กลับ
        </Button>
      </div>
      <Typography variant='h4' className='mb-6'>
        ขอนัดตรวจ
      </Typography>
      <AppointmentForm action={createAppointment} farms={farms} />
    </>
  )
}
