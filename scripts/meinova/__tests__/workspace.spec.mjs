import { describe, expect, it } from 'vitest'

import { generateWorkspaceTabs, getWorkspaceTabs } from '../generators/workspace.mjs'

/*
| Tab workspace (TR-CLEANUP-1).
|
| `readonly_when` dari schema diteruskan sebagai `readonlyWhen`, dan
| `create=False` tetap mematikan Add Row. Tab tanpa `readonly_when`
| tidak mendapat kunci baru sama sekali — modul lain yang diregenerate
| tidak berubah satu byte pun.
*/

const LOCK = { field: 'is_editable', op: 'is_false' }

const schema = {
  tabs: [
    { key: 'general', type: 'form', fields: ['name'], order: 10 },
    {
      key: 'rows',
      type: 'resource',
      inline: true,
      fields: {},
      readonly_when: LOCK,
      order: 20,
    },
    { key: 'fixed', type: 'resource', inline: true, fields: {}, create: false, order: 30 },
    {
      key: 'stays',
      type: 'resource',
      inline: true,
      fields: {},
      delete: false,
      description: 'Stays belong to a leg.',
      order: 40,
    },
  ],
}

function tab(key) {
  return getWorkspaceTabs(schema).find(item => item.key === key)
}

describe('getWorkspaceTabs', () => {
  it('meneruskan readonly_when sebagai readonlyWhen', () => {
    expect(tab('rows').readonlyWhen).toEqual(LOCK)
  })

  it('tab tanpa readonly_when tidak membawa kunci itu', () => {
    expect('readonlyWhen' in tab('general')).toBe(false)
    expect('readonlyWhen' in tab('fixed')).toBe(false)
  })

  it('Add Row hanya mati oleh create=False eksplisit', () => {
    expect(tab('rows').canCreate).toBe(true)
    expect(tab('fixed').canCreate).toBe(false)
  })
})

describe('canDelete + description (TR-CLEANUP-2)', () => {
  it('delete=False menjadi canDelete false', () => {
    expect(tab('stays').canDelete).toBe(false)
  })

  it('tab tanpa delete=False tidak membawa canDelete', () => {
    expect('canDelete' in tab('rows')).toBe(false)
    expect('canDelete' in tab('general')).toBe(false)
  })

  it('description diteruskan dan diberi kunci tabHints', () => {
    const tabs = JSON.parse(generateWorkspaceTabs(schema, 'x.mod'))
    const stays = tabs.find(item => item.key === 'stays')

    expect(stays.description).toBe('Stays belong to a leg.')
    expect(stays.descriptionKey).toBe('x.mod.tabHints.stays')
    expect('description' in tabs.find(item => item.key === 'rows')).toBe(false)
  })
})
