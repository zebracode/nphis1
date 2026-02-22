'use client'

import Link from 'next/link'
import { deleteAnimal } from './actions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

type Animal = {
  id: number
  farmId: number
  species: string
  tagNumber: string | null
  name: string | null
}

export default function AnimalsTable({ farmId, animals }: { farmId: number; animals: Animal[] }) {
  async function handleDelete(id: number) {
    if (confirm('ต้องการลบสัตว์นี้ใช่หรือไม่?')) {
      await deleteAnimal(id, farmId)
      window.location.reload()
    }
  }

  if (animals.length === 0) {
    return (
      <Typography color='text.secondary' className='py-8 text-center'>
        ยังไม่มีสัตว์ในฟาร์มนี้
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant='outlined' sx={{ boxShadow: 'none' }}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>ชนิดสัตว์</TableCell>
            <TableCell>หมายเลข/แท็ก</TableCell>
            <TableCell>ชื่อ</TableCell>
            <TableCell align='right' width={180}>
              จัดการ
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {animals.map(a => (
            <TableRow key={a.id} hover>
              <TableCell>
                <Typography fontWeight={500}>{a.species}</Typography>
              </TableCell>
              <TableCell>{a.tagNumber || '-'}</TableCell>
              <TableCell>{a.name || '-'}</TableCell>
              <TableCell align='right'>
                <Button component={Link} href={`/portal/animals/${a.id}`} size='small' variant='outlined' className='me-2'>
                  บันทึกประจำวัน
                </Button>
                <Button component={Link} href={`/farms/${farmId}/animals/${a.id}/edit`} size='small' variant='outlined' className='me-2'>
                  แก้ไข
                </Button>
                <IconButton size='small' color='error' onClick={() => handleDelete(a.id)} aria-label='ลบ'>
                  <i className='tabler-trash' />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
