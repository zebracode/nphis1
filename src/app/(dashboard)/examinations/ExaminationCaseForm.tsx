'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { ExaminationFormState } from './actions'
import CustomTextField from '@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

type Props = {
  action: (prev: ExaminationFormState, formData: FormData) => Promise<ExaminationFormState>
  appointmentId: number
}

export default function ExaminationCaseForm({ action, appointmentId }: Props) {
  const [state, formAction] = useActionState(action, {} as ExaminationFormState)

  return (
    <Card>
      <CardContent>
        <form action={formAction} className='flex max-w-md flex-col gap-4'>
          <input type='hidden' name='appointmentId' value={appointmentId} />
          {state?.error && (
            <Typography component='p' color='error' className='text-sm'>
              {state.error}
            </Typography>
          )}
          <CustomTextField select name='clinicType' label='ประเภทคลินิก' fullWidth defaultValue='LIVESTOCK'>
            <MenuItem value='LIVESTOCK'>ปศุสัตว์</MenuItem>
            <MenuItem value='HORSE'>ม้า</MenuItem>
            <MenuItem value='OTHER'>อื่นๆ</MenuItem>
          </CustomTextField>
          <CustomTextField name='summary' label='สรุปการตรวจ' multiline rows={3} fullWidth placeholder='บันทึกผลการตรวจและวินิจฉัย' />
          <FormControlLabel control={<Checkbox name='isFarmVisit' value='true' />} label='ลงพื้นที่ฟาร์ม' />
          <Typography variant='body2' color='text.secondary'>
            อัปโหลดภาพอาการ (หลายรูปได้)
          </Typography>
          <input type='file' name='image0' accept='image/*' multiple={false} />
          <input type='file' name='image1' accept='image/*' multiple={false} />
          <input type='file' name='image2' accept='image/*' multiple={false} />
          <div className='flex gap-2'>
            <Button type='submit' variant='contained'>
              บันทึกการตรวจ
            </Button>
            <Button component={Link} href='/examinations' variant='outlined'>
              ยกเลิก
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
