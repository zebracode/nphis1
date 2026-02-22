'use client'

import { useActionState } from 'react'
import type { ApproveCaseState } from '@/app/(dashboard)/teaching/actions'
import CustomTextField from '@core/components/mui/TextField'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

type Props = {
  action: (prev: ApproveCaseState, formData: FormData) => Promise<ApproveCaseState>
  caseId: number
  defaultCost: unknown
  defaultWaived: boolean
  defaultCostNote: string | null
}

export default function ApproveCaseForm({ action, caseId, defaultCost, defaultWaived, defaultCostNote }: Props) {
  const [state, formAction] = useActionState(action, {} as ApproveCaseState)
  const costStr = defaultCost != null ? String(defaultCost) : ''

  return (
    <form action={formAction} className='flex max-w-md flex-col gap-4'>
      <input type='hidden' name='caseId' value={caseId} />
      {state?.error && (
        <Typography component='p' color='error' className='text-sm'>
          {state.error}
        </Typography>
      )}
      <CustomTextField name='actualCost' label='ต้นทุนการรักษาจริง (บาท)' type='number' defaultValue={costStr} fullWidth slotProps={{ input: { inputProps: { step: 0.01 } } }} />
      <FormControlLabel control={<Checkbox name='costWaivedForTeaching' value='true' defaultChecked={defaultWaived} />} label='ยกเว้นค่าใช้จ่ายเพื่อการสอน' />
      <CustomTextField name='costNote' label='หมายเหตุต้นทุน' defaultValue={defaultCostNote ?? ''} fullWidth placeholder='เช่น ยกเว้นเพื่อการสอน' />
      <Button type='submit' variant='contained' color='success'>
        อนุมัติเคส
      </Button>
    </form>
  )
}
