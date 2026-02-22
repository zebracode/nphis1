'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { AssignCaseFormState } from '@/app/(dashboard)/teaching/actions'
import CustomTextField from '@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

type Examination = {
  id: number
  examDate: Date
  appointment?: { farm?: { name: string }; animal?: { species: string } | null } | null
}

type Student = { id: number; name: string }

type Props = {
  examination: Examination | null
  examinations: Examination[]
  students: Student[]
  assignCaseFromForm: (prev: AssignCaseFormState, formData: FormData) => Promise<AssignCaseFormState>
}

export default function AssignCaseForm({
  examination,
  examinations,
  students,
  assignCaseFromForm
}: Props) {
  const [state, formAction] = useActionState(assignCaseFromForm, {} as AssignCaseFormState)

  const list = examination ? [examination] : examinations

  return (
    <Card>
      <CardContent>
        <form action={formAction} className='flex max-w-md flex-col gap-4'>
          {state?.error && (
            <Typography component='p' color='error' className='text-sm'>
              {state.error}
            </Typography>
          )}
          <CustomTextField select name='examinationId' label='การตรวจรักษา' required fullWidth defaultValue={examination?.id ?? ''}>
            <MenuItem value=''>-- เลือกเคส --</MenuItem>
            {list.map(e => (
              <MenuItem key={e.id} value={e.id}>
                {new Date(e.examDate).toLocaleDateString('th-TH')} — {e.appointment?.farm?.name || '-'} / {e.appointment?.animal?.species || '-'}
              </MenuItem>
            ))}
          </CustomTextField>
          <CustomTextField select name='studentId' label='นักศึกษา' required fullWidth defaultValue=''>
            <MenuItem value=''>-- เลือกนักศึกษา --</MenuItem>
            {students.map(s => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </CustomTextField>
          <div className='flex gap-2'>
            <Button type='submit' variant='contained'>
              มอบเคส
            </Button>
            <Button component={Link} href='/teaching' variant='outlined'>
              ยกเลิก
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
