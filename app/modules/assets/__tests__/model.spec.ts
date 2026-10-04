import { describe, expect, it } from 'vitest'

import { badgeTone, movementRoute, movementSides, rowsOf, trailRows } from '../shared/model'

/*
| Penolong tampilan Asset Management — fungsi murni, tanpa aturan bisnis.
| Yang dijaga: asal/tujuan dibaca dari kolom serializer yang benar per
| jenis dokumen, amplop `{data}` terbaca, dan rute dokumen sama dengan
| `register_route` backend.
*/

describe('movementSides', () => {
  it('assignment: dari STORAGE ke pemegang tujuan', () => {
    const sides = movementSides('assignments', {
      source_location_name: 'HO',
      target_custody_type: 'ORGANIZATION',
      department_name: 'Mining',
      pic_employee_name: 'Budi',
      location_name: 'Site',
    })

    expect(sides?.source).toMatchObject({ custodyType: 'STORAGE', location: 'HO', holder: null })
    expect(sides?.target).toMatchObject({ custodyType: 'ORGANIZATION', holder: 'Mining', pic: 'Budi', location: 'Site' })
  })

  it('return: dari pemegang ke STORAGE tujuan', () => {
    const sides = movementSides('returns', {
      source_custody_type: 'EMPLOYEE',
      source_employee_name: 'Ani',
      source_location_name: 'Site',
      destination_location_name: 'HO',
      destination_facility_name: 'Gudang',
    })

    expect(sides?.source).toMatchObject({ custodyType: 'EMPLOYEE', holder: 'Ani' })
    expect(sides?.target).toMatchObject({ custodyType: 'STORAGE', location: 'HO', facility: 'Gudang' })
  })

  it('transfer: dua sisi dari kolom source_/target_', () => {
    const sides = movementSides('transfers', {
      source_custody_type: 'ORGANIZATION',
      source_department_name: 'Mining',
      source_pic_employee_name: 'PIC A',
      source_location_name: 'Site',
      target_custody_type: 'ORGANIZATION',
      target_department_name: 'Mining',
      target_pic_employee_name: 'PIC B',
      target_location_name: 'Site',
    })

    expect(sides?.source.pic).toBe('PIC A')
    expect(sides?.target.pic).toBe('PIC B')
  })

  it('tanpa record → null', () => {
    expect(movementSides('transfers', null)).toBeNull()
  })
})

describe('penolong lain', () => {
  it('rowsOf membaca amplop backend', () => {
    expect(rowsOf({ data: [1, 2], meta: {} })).toEqual([1, 2])
    expect(rowsOf({ results: [3] })).toEqual([3])
    expect(rowsOf(undefined)).toEqual([])
  })

  it('rute dokumen sama dengan register_route backend', () => {
    expect(movementRoute('transfers', 7)).toBe('/assets/transfers/7')
    expect(movementRoute('assignments', '3')).toBe('/assets/assignments/3')
  })

  it('jejak persetujuan memetakan blok approval', () => {
    const rows = trailRows({
      steps: [{ approval_id: 1, sequence: 1, name: 'Admin', decision: 'PENDING', decision_label: 'Pending', approver: 'X', notes: '', decided_at: null }],
    })

    expect(rows).toEqual([{ id: 1, sequence: 1, name: 'Admin', status: 'PENDING', status_label: 'Pending', approver_name: 'X', comment: '', acted_at: null }])
    expect(trailRows(null)).toEqual([])
  })

  it('warna lencana tidak pernah kosong untuk kode tak dikenal', () => {
    expect(badgeTone('condition', 'UNSERVICEABLE')).toContain('destructive')
    expect(badgeTone('status', 'SOMETHING')).toBe('border-slate-300')
  })
})
