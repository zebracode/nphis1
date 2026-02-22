import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getExamination } from '@/app/(dashboard)/examinations/actions'
import { getStudents, getExaminationsWithoutTeachingCase, assignCaseFromForm } from '../actions'
import AssignCaseForm from '../AssignCaseForm'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Props = { searchParams: Promise<{ examinationId?: string }> }

export default async function AssignCasePage({ searchParams }: Props) {
  const { examinationId: raw } = await searchParams
  const examinationId = raw ? parseInt(raw, 10) : null
  const [students, examinations, examination] = await Promise.all([
    getStudents(),
    getExaminationsWithoutTeachingCase(),
    examinationId ? getExamination(examinationId) : Promise.resolve(null)
  ])

  if (examinationId && !examination) notFound()
  if (students.length === 0) {
    return (
      <>
        <Typography variant='h4' className='mb-6'>
          มอบเคสให้นักศึกษา
        </Typography>
        <Typography color='text.secondary'>
          ยังไม่มีผู้ใช้บทบาทนักศึกษา กรุณารัน npm run db:seed เพื่อสร้างข้อมูลตัวอย่าง
        </Typography>
        <Button component={Link} href='/teaching' className='mt-4'>
          กลับ
        </Button>
      </>
    )
  }

  return (
    <>
      <div className='mb-6'>
        <Button component={Link} href='/teaching' variant='text' startIcon={<i className='tabler-arrow-left' />}>
          กลับ
        </Button>
      </div>
      <Typography variant='h4' className='mb-6'>
        มอบเคสให้นักศึกษา
      </Typography>
      <AssignCaseForm
        examination={examination}
        examinations={examinations}
        students={students}
        assignCaseFromForm={assignCaseFromForm}
      />
    </>
  )
}
