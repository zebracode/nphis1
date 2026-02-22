'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import CustomTextField from '@core/components/mui/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

type Animal = {
  species: string
  tagNumber: string | null
  name: string | null
}

type AnimalFormState = { error?: string }

type Props = {
  action: (prev: AnimalFormState, formData: FormData) => Promise<AnimalFormState>
  defaultValues?: Animal
  farmId: number
  animalId?: number
  cancelHref: string
}

export default function AnimalForm({ action, defaultValues, farmId, animalId, cancelHref }: Props) {
  const [state, formAction] = useActionState(action, {} as AnimalFormState)

  return (
    <Card>
      <CardContent>
        <form action={formAction} className='flex max-w-md flex-col gap-4'>
          <input type='hidden' name='farmId' value={farmId} />
          {animalId != null && <input type='hidden' name='animalId' value={animalId} />}
          {state?.error && (
            <Typography component='p' color='error' className='text-sm'>
              {state.error}
            </Typography>
          )}
          <CustomTextField name='species' label='ชนิดสัตว์' placeholder='เช่น โค กระบือ สุกร' defaultValue={defaultValues?.species ?? ''} required fullWidth />
          <CustomTextField name='tagNumber' label='หมายเลข/แท็ก' placeholder='หมายเลขประจำตัว' defaultValue={defaultValues?.tagNumber ?? ''} fullWidth />
          <CustomTextField name='name' label='ชื่อ (ถ้ามี)' placeholder='ชื่อสัตว์' defaultValue={defaultValues?.name ?? ''} fullWidth />
          <div className='flex gap-2'>
            <Button type='submit' variant='contained'>
              บันทึก
            </Button>
            <Button component={Link} href={cancelHref} variant='outlined'>
              ยกเลิก
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
