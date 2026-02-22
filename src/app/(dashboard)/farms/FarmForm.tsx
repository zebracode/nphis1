'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { FarmFormState } from './actions'
import CustomTextField from '@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

type Farm = {
  name: string
  description: string | null
  location: string | null
}

type Props = {
  action: (prev: FarmFormState, formData: FormData) => Promise<FarmFormState>
  defaultValues?: Farm
}

export default function FarmForm({ action, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, {})

  return (
    <Card>
      <CardContent>
        <form action={formAction} className='flex max-w-md flex-col gap-4'>
          {state?.error && (
            <Typography component='p' color='error' className='text-sm'>
              {state.error}
            </Typography>
          )}
          <CustomTextField
            name='name'
            label='ชื่อฟาร์ม'
            placeholder='กรอกชื่อฟาร์ม'
            defaultValue={defaultValues?.name ?? ''}
            required
            fullWidth
          />
          <CustomTextField
            name='location'
            label='ที่ตั้ง'
            placeholder='กรอกที่อยู่หรือตำแหน่ง'
            defaultValue={defaultValues?.location ?? ''}
            fullWidth
          />
          <CustomTextField
            name='description'
            label='รายละเอียด'
            placeholder='รายละเอียดเพิ่มเติม (ถ้ามี)'
            defaultValue={defaultValues?.description ?? ''}
            multiline
            rows={3}
            fullWidth
          />
          <div className='flex gap-2'>
            <Button type='submit' variant='contained'>
              บันทึก
            </Button>
            <Button component={Link} href='/farms' variant='outlined'>
              ยกเลิก
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
