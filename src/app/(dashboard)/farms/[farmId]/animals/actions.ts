'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export async function getAnimalsByFarm(farmId: number) {
  return prisma.animal.findMany({
    where: { farmId },
    orderBy: { createdAt: 'desc' },
    include: { farm: true }
  })
}

export async function getAnimal(id: number) {
  return prisma.animal.findUnique({
    where: { id },
    include: { farm: true }
  })
}

type AnimalFormState = { error?: string }

export async function createAnimal(_prev: AnimalFormState, formData: FormData): Promise<AnimalFormState> {
  const farmId = parseInt((formData.get('farmId') as string) || '0', 10)
  const species = formData.get('species') as string
  const tagNumber = (formData.get('tagNumber') as string) || null
  const name = (formData.get('name') as string) || null
  if (!farmId) return { error: 'ข้อมูลฟาร์มไม่ถูกต้อง' }
  if (!species?.trim()) return { error: 'กรุณากรอกชนิดสัตว์' }
  await prisma.animal.create({
    data: {
      farmId,
      species: species.trim(),
      tagNumber: tagNumber?.trim() || null,
      name: name?.trim() || null
    }
  })
  revalidatePath(`/farms/${farmId}/animals`)
  redirect(`/farms/${farmId}/animals`)
}

export async function updateAnimal(_prev: AnimalFormState, formData: FormData): Promise<AnimalFormState> {
  const animalId = parseInt((formData.get('animalId') as string) || '0', 10)
  const farmId = parseInt((formData.get('farmId') as string) || '0', 10)
  const species = formData.get('species') as string
  const tagNumber = (formData.get('tagNumber') as string) || null
  const name = (formData.get('name') as string) || null
  if (!animalId || !farmId) return { error: 'ข้อมูลไม่ถูกต้อง' }
  if (!species?.trim()) return { error: 'กรุณากรอกชนิดสัตว์' }
  await prisma.animal.update({
    where: { id: animalId },
    data: {
      species: species.trim(),
      tagNumber: tagNumber?.trim() || null,
      name: name?.trim() || null
    }
  })
  revalidatePath(`/farms/${farmId}/animals`)
  redirect(`/farms/${farmId}/animals`)
}

export async function deleteAnimal(id: number, farmId: number) {
  await prisma.animal.delete({ where: { id } })
  revalidatePath(`/farms/${farmId}/animals`)
}
