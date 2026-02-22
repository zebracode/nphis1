'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function getFarms() {
  return prisma.farm.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getFarm(id: number) {
  return prisma.farm.findUnique({ where: { id } })
}

export type FarmFormState = {
  error?: string
}

export async function createFarm(_prev: FarmFormState, formData: FormData): Promise<FarmFormState> {
  const name = formData.get('name') as string
  const description = (formData.get('description') as string) || null
  const location = (formData.get('location') as string) || null

  if (!name?.trim()) {
    return { error: 'กรุณากรอกชื่อฟาร์ม' }
  }

  try {
    await prisma.farm.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        location: location?.trim() || null
      }
    })
  } catch (e) {
    console.error(e)
    return { error: 'เกิดข้อผิดพลาดในการบันทึก' }
  }

  revalidatePath('/farms')
  redirect('/farms')
}

export async function updateFarm(
  id: number,
  _prev: FarmFormState,
  formData: FormData
): Promise<FarmFormState> {
  const name = formData.get('name') as string
  const description = (formData.get('description') as string) || null
  const location = (formData.get('location') as string) || null

  if (!name?.trim()) {
    return { error: 'กรุณากรอกชื่อฟาร์ม' }
  }

  try {
    await prisma.farm.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        location: location?.trim() || null
      }
    })
  } catch (e) {
    console.error(e)
    return { error: 'เกิดข้อผิดพลาดในการบันทึก' }
  }

  revalidatePath('/farms')
  revalidatePath(`/farms/${id}/edit`)
  redirect('/farms')
}

export async function deleteFarm(id: number) {
  try {
    await prisma.farm.delete({ where: { id } })
  } catch (e) {
    console.error(e)
    return { error: 'เกิดข้อผิดพลาดในการลบ' }
  }
  revalidatePath('/farms')
}
