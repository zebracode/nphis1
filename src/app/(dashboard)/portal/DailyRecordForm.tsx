'use client'

import { useActionState } from 'react'
import type { DailyRecordFormState } from './daily-records/actions'
import CustomTextField from '@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

type Props = {
  action: (prev: DailyRecordFormState, formData: FormData) => Promise<DailyRecordFormState>
  animalId: number
}

export default function DailyRecordForm({ action, animalId }: Props) {
  const [state, formAction] = useActionState(action, {} as DailyRecordFormState)

  return (
    <form action={formAction} className='flex max-w-md flex-col gap-4'>
      <input type='hidden' name='animalId' value={animalId} />
      {state?.error && (
        <Typography component='p' color='error' className='text-sm'>
          {state.error}
        </Typography>
      )}
      <CustomTextField name='recordDate' label='วันที่' type='date' required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
      <CustomTextField name='feedAmount' label='ปริมาณอาหาร' placeholder='เช่น 5 kg' fullWidth />
      <CustomTextField name='weightKg' label='น้ำหนัก (กก.)' type='number' fullWidth slotProps={{ input: { inputProps: { step: 0.01 } } }} />
      <CustomTextField name='milkAmount' label='ปริมาณน้ำนม (ถ้าโคนม)' placeholder='เช่น 20 L' fullWidth />
      <CustomTextField name='symptoms' label='อาการ' placeholder='สังเกตอาการผิดปกติ' multiline rows={2} fullWidth />
      <Button type='submit' variant='contained'>
        บันทึก
      </Button>
    </form>
  )
}
