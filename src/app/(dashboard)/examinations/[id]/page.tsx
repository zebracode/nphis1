import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getExamination } from '../actions'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

type Props = { params: Promise<{ id: string }> }

export default async function ExaminationDetailPage({ params }: Props) {
  const { id } = await params
  const examId = parseInt(id, 10)
  if (isNaN(examId)) notFound()
  const exam = await getExamination(examId)
  if (!exam) notFound()

  const clinicLabel = exam.clinicType === 'HORSE' ? 'ม้า' : exam.clinicType === 'OTHER' ? 'อื่นๆ' : 'ปศุสัตว์'

  return (
    <>
      <div className='mb-6'>
        <Button component={Link} href='/examinations' variant='text' startIcon={<i className='tabler-arrow-left' />}>
          กลับ
        </Button>
      </div>
      <Typography variant='h4' className='mb-6'>
        รายละเอียดการตรวจ
      </Typography>

      <Card className='mb-6'>
        <CardContent>
          <Typography variant='subtitle2' color='text.secondary'>
            วันที่ตรวจ
          </Typography>
          <Typography className='mb-4'>{new Date(exam.examDate).toLocaleString('th-TH')}</Typography>
          <Typography variant='subtitle2' color='text.secondary'>
            ฟาร์ม / สัตว์
          </Typography>
          <Typography className='mb-4'>
            {exam.appointment?.farm?.name || '-'} / {exam.appointment?.animal ? `${exam.appointment.animal.species} ${exam.appointment.animal.name || ''}`.trim() : '-'}
          </Typography>
          <Typography variant='subtitle2' color='text.secondary'>
            ประเภทคลินิก
          </Typography>
          <Typography className='mb-4'>{clinicLabel} {exam.isFarmVisit ? '(ลงพื้นที่ฟาร์ม)' : ''}</Typography>
          <Typography variant='subtitle2' color='text.secondary'>
            สรุปการตรวจ
          </Typography>
          <Typography className='mb-4'>{exam.summary || '-'}</Typography>
          <Typography variant='subtitle2' color='text.secondary'>
            สถานะ
          </Typography>
          <Typography>{exam.status === 'APPROVED' ? 'อนุมัติแล้ว' : exam.status === 'PENDING_APPROVAL' ? 'รออนุมัติ' : 'แบบร่าง'}</Typography>
        </CardContent>
      </Card>

      {exam.images.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant='h6' className='mb-4'>
              ภาพประกอบ
            </Typography>
            <div className='flex flex-wrap gap-4'>
              {exam.images.map(img => (
                <div key={img.id} className='relative size-48 overflow-hidden rounded border'>
                  <Image src={img.filePath} alt='ภาพการตรวจ' fill className='object-cover' sizes='192px' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!exam.teachingCase && (
        <div className='mt-6'>
          <Button component={Link} href={`/teaching/assign?examinationId=${exam.id}`} variant='outlined'>
            มอบเคสให้นักศึกษา
          </Button>
        </div>
      )}
    </>
  )
}
