import type { ShiftCalendarAccess } from '../types'

import { describe, expect, it } from 'vitest'

import {
  calendarRequest,
  isMyModeQuery,
  resolveSelfMode,
  SELF_SCHEDULE_ENDPOINT,
  SHIFT_CALENDAR_ENDPOINT,
  withMyMode,
} from '../selfMode'

const self = {
  id: 5,
  employee_number: 'H0005',
  name: 'Farah Anindita',
  location: 'Head Office',
}

function access(overrides: Partial<ShiftCalendarAccess> = {}): ShiftCalendarAccess {
  return {
    self_employee: self,
    default_employee: self,
    selector_required: false,
    can_adjust: false,
    ...overrides,
  }
}

describe('isMyModeQuery', () => {
  it('only mode=my is personal context', () => {
    expect(isMyModeQuery({ mode: 'my' })).toBe(true)
    expect(isMyModeQuery({})).toBe(false)
    expect(isMyModeQuery({ mode: 'team' })).toBe(false)
    expect(isMyModeQuery({ mode: ['my'] })).toBe(false)
    expect(isMyModeQuery({ employee: 'me' })).toBe(false)
  })
})

describe('resolveSelfMode', () => {
  it('honours the intent before access/ arrives, without a toggle', () => {
    expect(resolveSelfMode(true, null)).toEqual({ selfMode: true, toggleVisible: false })
    expect(resolveSelfMode(false, null)).toEqual({ selfMode: false, toggleVisible: false })
  })

  it('manager/HR (selector_required) gets the toggle in both states', () => {
    const team = access({ selector_required: true })

    expect(resolveSelfMode(true, team)).toEqual({ selfMode: true, toggleVisible: true })
    expect(resolveSelfMode(false, team)).toEqual({ selfMode: false, toggleVisible: true })
  })

  it('an ordinary employee never gets a way to switch personal mode off', () => {
    expect(resolveSelfMode(true, access())).toEqual({ selfMode: true, toggleVisible: false })
  })

  it('an account without an employee card gets no toggle', () => {
    const noCard = access({ self_employee: null, default_employee: null, selector_required: true })

    expect(resolveSelfMode(false, noCard).toggleVisible).toBe(false)
  })
})

describe('calendarRequest', () => {
  it('personal mode calls /api/me/schedule/ with the month only', () => {
    const target = calendarRequest({ selfMode: true, employeeId: 42, month: '2026-09' })

    expect(target).toEqual({ path: SELF_SCHEDULE_ENDPOINT, query: { month: '2026-09' } })
    expect(target!.path.startsWith('/api/me/')).toBe(true)
    expect(Object.keys(target!.query)).toEqual(['month'])
  })

  it('personal mode never carries an identity, whatever employeeId holds', () => {
    for (const employeeId of [null, 1, 42, 999]) {
      const target = calendarRequest({ selfMode: true, employeeId, month: '2026-09' })

      expect(target!.query).not.toHaveProperty('employee')
      expect(target!.path).not.toMatch(/\d|\?/)
    }
  })

  it('admin mode keeps the existing HR request', () => {
    expect(calendarRequest({ selfMode: false, employeeId: 42, month: '2026-09' })).toEqual({
      path: SHIFT_CALENDAR_ENDPOINT,
      query: { employee: 42, month: '2026-09' },
    })
  })

  it('admin mode without a selected employee loads nothing', () => {
    expect(calendarRequest({ selfMode: false, employeeId: null, month: '2026-09' })).toBeNull()
  })
})

describe('withMyMode', () => {
  it('toggles only the mode param', () => {
    expect(withMyMode({ foo: '1' }, true)).toEqual({ foo: '1', mode: 'my' })
    expect(withMyMode({ foo: '1', mode: 'my' }, false)).toEqual({ foo: '1' })
  })

  it('does not mutate the route query', () => {
    const query = { mode: 'my' }

    withMyMode(query, false)

    expect(query).toEqual({ mode: 'my' })
  })
})
