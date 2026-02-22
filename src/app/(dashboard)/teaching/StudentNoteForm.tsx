'use client'

import { useActionState } from 'react'
import type { StudentNoteState } from '@/app/(dashboard)/teaching/actions'
import CustomTextField from '@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Props = {
  action: (prev: StudentNoteState, formData: FormData) => Promise<StudentNoteState>
  caseId: number
  defaultNote: string | null
}

export default function StudentNoteForm({ action, caseId, defaultNote }: Props) {
  const [state, formAction] = useActionState(action, {} as StudentNoteState)

  return (
    <form action={formAction} className='flex max-w-md flex-col gap-4'>
      <input type='hidden' name='caseId' value={caseId} />
      {state?.error && (
        <Typography component='p' color='error' className='text-sm'>
          {state.error}
        </Typography>
      )}
      <CustomTextField name='studentNote' label='บันทึกผลปฏิบัติ' multiline rows={4} defaultValue={defaultNote ?? ''} fullWidth placeholder='นักศึกษาบันทึกผลการตรวจและวินิจฉัย' />
      <Button type='submit' variant='contained' size='small'>
        ส่งให้อาจารย์ตรวจ
      </Button>
    </form>
  )
}
