'use client'

import Link from 'next/link'
import { deleteFarm } from './actions'
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

type Farm = {
  id: number
  name: string
  description: string | null
  location: string | null
  createdAt: Date
  updatedAt: Date
}

export default function FarmsTable({ farms }: { farms: Farm[] }) {
  async function handleDelete(id: number) {
    if (confirm('ต้องการลบฟาร์มนี้ใช่หรือไม่?')) {
      await deleteFarm(id)
      window.location.reload()
    }
  }

  if (farms.length === 0) {
    return (
      <Typography color='text.secondary' className='py-8 text-center'>
        ยังไม่มีรายการฟาร์ม
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant='outlined' sx={{ boxShadow: 'none' }}>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>ชื่อฟาร์ม</TableCell>
            <TableCell>ที่ตั้ง</TableCell>
            <TableCell>รายละเอียด</TableCell>
            <TableCell align='right' width={140}>
              จัดการ
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {farms.map(farm => (
            <TableRow key={farm.id} hover>
              <TableCell>
                <Typography fontWeight={500}>{farm.name}</Typography>
              </TableCell>
              <TableCell>{farm.location || '-'}</TableCell>
              <TableCell sx={{ maxWidth: 200 }}>{farm.description ? `${farm.description.slice(0, 50)}${farm.description.length > 50 ? '...' : ''}` : '-'}</TableCell>
              <TableCell align='right'>
                <Button component={Link} href={`/farms/${farm.id}/animals`} size='small' variant='outlined' className='me-2'>
                  สัตว์ในฟาร์ม
                </Button>
                <Button component={Link} href={`/farms/${farm.id}/edit`} size='small' variant='outlined' className='me-2'>
                  แก้ไข
                </Button>
                <IconButton size='small' color='error' onClick={() => handleDelete(farm.id)} aria-label='ลบ'>
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
