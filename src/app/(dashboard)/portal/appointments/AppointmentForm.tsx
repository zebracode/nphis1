'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { AppointmentFormState } from './actions'
import CustomTextField from '@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

type FarmWithAnimals = {
  id: number
  name: string
  animals: { id: number; species: string; name: string | null }[]
}

type Props = {
  action: (prev: AppointmentFormState, formData: FormData) => Promise<AppointmentFormState>
  farms: FarmWithAnimals[]
}

export default function AppointmentForm({ action, farms }: Props) {
  const [state, formAction] = useActionState(action, {} as AppointmentFormState)

  return (
    <Card>
      <CardContent>
        <form action={formAction} className='flex max-w-md flex-col gap-4'>
          {state?.error && (
            <Typography component='p' color='error' className='text-sm'>
              {state.error}
            </Typography>
          )}
          <CustomTextField select name='farmId' label='ฟาร์ม' required fullWidth defaultValue=''>
            <MenuItem value=''>-- เลือกฟาร์ม --</MenuItem>
            {farms.map(f => (
              <MenuItem key={f.id} value={f.id}>
                {f.name}
              </MenuItem>
            ))}
          </CustomTextField>
          <CustomTextField select name='animalId' label='สัตว์ (ไม่บังคับ)' fullWidth defaultValue=''>
            <MenuItem value=''>-- ไม่ระบุ --</MenuItem>
            {farms.flatMap(f => f.animals.map(a => ({ ...a, farmId: f.id }))).map(a => (
              <MenuItem key={a.id} value={a.id}>
                {a.species} {a.name || ''}
              </MenuItem>
            ))}
          </CustomTextField>
          <CustomTextField select name='type' label='ประเภทนัด' required fullWidth defaultValue='NORMAL'>
            <MenuItem value='NORMAL'>ปกติ</MenuItem>
            <MenuItem value='URGENT'>ฉุกเฉิน</MenuItem>
          </CustomTextField>
          <CustomTextField name='appointmentDate' label='วันที่นัด' type='date' required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
          <CustomTextField name='note' label='หมายเหตุ' multiline rows={2} fullWidth />
          <div className='flex gap-2'>
            <Button type='submit' variant='contained'>
              ส่งคำขอนัด
            </Button>
            <Button component={Link} href='/portal/appointments' variant='outlined'>
              ยกเลิก
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
