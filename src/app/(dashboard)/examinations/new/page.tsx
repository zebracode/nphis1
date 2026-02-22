import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAppointment } from '@/app/(dashboard)/portal/appointments/actions'
import { createExaminationFromAppointment } from '../actions'
import ExaminationCaseForm from '../ExaminationCaseForm'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Props = { searchParams: Promise<{ appointmentId?: string }> }

export default async function NewExaminationPage({ searchParams }: Props) {
  const { appointmentId: raw } = await searchParams
  const appointmentId = raw ? parseInt(raw, 10) : null
  if (!appointmentId) notFound()
  const appointment = await getAppointment(appointmentId)
  if (!appointment) notFound()
  if (appointment.examination) notFound()

  return (
    <>
      <div className='mb-6'>
        <Button component={Link} href='/examinations' variant='text' startIcon={<i className='tabler-arrow-left' />}>
          กลับ
        </Button>
      </div>
      <Typography variant='h4' className='mb-2'>
        เปิดเคสตรวจรักษา
      </Typography>
      <Typography color='text.secondary' className='mb-6'>
        นัด: {new Date(appointment.appointmentDate).toLocaleDateString('th-TH')} — {appointment.farm.name}
        {appointment.animal ? ` / ${appointment.animal.species}` : ''}
      </Typography>
      <ExaminationCaseForm action={createExaminationFromAppointment} appointmentId={appointmentId} />
    </>
  )
}
