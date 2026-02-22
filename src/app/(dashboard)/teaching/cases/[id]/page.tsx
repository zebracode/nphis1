import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTeachingCase, submitStudentNote, approveCase } from '../../actions'
import StudentNoteForm from '../../StudentNoteForm'
import ApproveCaseForm from '../../ApproveCaseForm'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

type Props = { params: Promise<{ id: string }> }

export default async function TeachingCaseDetailPage({ params }: Props) {
  const { id } = await params
  const caseId = parseInt(id, 10)
  if (isNaN(caseId)) notFound()
  const tc = await getTeachingCase(caseId)
  if (!tc) notFound()

  return (
    <>
      <div className='mb-6'>
        <Button component={Link} href='/teaching' variant='text' startIcon={<i className='tabler-arrow-left' />}>
          กลับ
        </Button>
      </div>
      <Typography variant='h4' className='mb-2'>
        เคสฝึกปฏิบัติ: {tc.student.name}
      </Typography>
      <Chip
        label={tc.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
        size='small'
        color={tc.status === 'APPROVED' ? 'success' : 'default'}
        className='mb-6'
      />

      <Card className='mb-6'>
        <CardContent>
          <Typography variant='h6' className='mb-4'>
            รายละเอียดการตรวจ
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            ฟาร์ม: {tc.examination?.appointment?.farm?.name || '-'} / สัตว์: {tc.examination?.appointment?.animal?.species || '-'}
          </Typography>
          <Typography variant='body2' className='mt-2'>
            สรุป: {tc.examination?.summary || '-'}
          </Typography>
          {tc.examination?.images && tc.examination.images.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              {tc.examination.images.map(img => (
                <div key={img.id} className='relative size-24 overflow-hidden rounded border'>
                  <Image src={img.filePath} alt='ภาพ' fill className='object-cover' sizes='96px' />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardContent>
          <Typography variant='h6' className='mb-4'>
            บันทึกของนักศึกษา
          </Typography>
          {tc.studentNote ? (
            <Typography>{tc.studentNote}</Typography>
          ) : (
            <Typography color='text.secondary'>ยังไม่มีบันทึก</Typography>
          )}
          {tc.status !== 'APPROVED' && (
            <div className='mt-4'>
              <StudentNoteForm action={submitStudentNote} caseId={caseId} defaultNote={tc.studentNote} />
            </div>
          )}
        </CardContent>
      </Card>

      {tc.status !== 'APPROVED' && (
        <Card>
          <CardContent>
            <Typography variant='h6' className='mb-4'>
              อนุมัติเคส (อาจารย์)
            </Typography>
            <ApproveCaseForm action={approveCase} caseId={caseId} defaultCost={tc.actualCost} defaultWaived={tc.costWaivedForTeaching} defaultCostNote={tc.costNote} />
          </CardContent>
        </Card>
      )}

      {tc.status === 'APPROVED' && (
        <Card>
          <CardContent>
            <Typography variant='h6'>ต้นทุนการรักษาจริง</Typography>
            <Typography>
              {tc.actualCost != null ? `฿${tc.actualCost}` : '-'}
              {tc.costWaivedForTeaching && ' (ยกเว้นเพื่อการสอน)'}
            </Typography>
            {tc.costNote && <Typography variant='body2' color='text.secondary'>{tc.costNote}</Typography>}
          </CardContent>
        </Card>
      )}
    </>
  )
}
