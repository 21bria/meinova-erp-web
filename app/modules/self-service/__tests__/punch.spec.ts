import type { GeoEnvironment } from '../attendance/punch'

import { describe, expect, it, vi } from 'vitest'

import en from '../../../i18n/locales/en/me'
import id from '../../../i18n/locales/id/me'
import {
  fetchPunchAvailability,
  SELF_ENDPOINTS,
  submitPunch,
  UPLOAD_ENDPOINT,
  uploadSelfie,
} from '../api/client'
import {
  acquirePosition,
  buildPunchBody,
  GEO_OPTIONS,
  GeoError,
  geoErrorCode,
  isLowAccuracy,
} from '../attendance/punch'

/*
| Tap kehadiran Self Service (ATT-GPS-1) — bagian yang bisa salah diam-diam:
| opsi geolokasi, penerjemahan galat, konteks tidak aman, dan isi
| permintaan yang benar-benar terkirim. Render komponen tidak diuji di
| sini (vitest repo ini berjalan di `node`).
*/

const reading = { latitude: -6.200000012345, longitude: 106.81666671234, accuracy: 12.345 }

function env(overrides: Partial<GeoEnvironment> = {}): GeoEnvironment {
  return {
    isSecureContext: true,
    geolocation: {
      getCurrentPosition: vi.fn((ok: PositionCallback) => ok({
        coords: { ...reading } as GeolocationCoordinates,
        timestamp: 0,
      } as GeolocationPosition)),
    },
    ...overrides,
  }
}

describe('geolocation', () => {
  it('asks for a fresh, high-accuracy fix with a 15 s timeout', async () => {
    const environment = env()

    await expect(acquirePosition(environment)).resolves.toEqual(reading)

    expect(environment.geolocation!.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
    expect(GEO_OPTIONS).toEqual({ enableHighAccuracy: true, timeout: 15000, maximumAge: 0 })
  })

  it('refuses an insecure context before touching geolocation', async () => {
    const environment = env({ isSecureContext: false })

    await expect(acquirePosition(environment)).rejects.toEqual(new GeoError('insecure_context'))
    expect(environment.geolocation!.getCurrentPosition).not.toHaveBeenCalled()
  })

  it('reports a browser without geolocation', async () => {
    await expect(acquirePosition(env({ geolocation: undefined })))
      .rejects
      .toMatchObject({ code: 'unsupported' })
  })

  it.each([
    [1, 'permission_denied'],
    [2, 'position_unavailable'],
    [3, 'timeout'],
    [undefined, 'position_unavailable'],
  ] as const)('maps error code %s to %s', async (code, expected) => {
    expect(geoErrorCode(code === undefined ? undefined : { code })).toBe(expected)

    const environment = env({
      geolocation: {
        getCurrentPosition: (_ok: PositionCallback, fail?: PositionErrorCallback | null) =>
          fail?.({ code } as GeolocationPositionError),
      },
    })

    await expect(acquirePosition(environment)).rejects.toMatchObject({ code: expected })
  })

  it('flags accuracy worse than the server limit as a hint only', () => {
    expect(isLowAccuracy({ ...reading, accuracy: 150 }, 100)).toBe(true)
    expect(isLowAccuracy({ ...reading, accuracy: 100 }, 100)).toBe(false)
    expect(isLowAccuracy(null, 100)).toBe(false)
    expect(isLowAccuracy({ ...reading, accuracy: 150 }, undefined)).toBe(false)
  })
})

describe('punch request', () => {
  it('sends only whitelisted fields, rounded to stored precision', () => {
    const body = buildPunchBody({
      clientPunchId: 'abc',
      punchType: 'in',
      reading,
      selfieId: 7,
    })

    expect(body).toEqual({
      client_punch_id: 'abc',
      punch_type: 'in',
      latitude: '-6.2000000',
      longitude: '106.8166667',
      location_accuracy: '12.35',
      selfie: 7,
    })

    for (const key of ['employee', 'employee_id', 'work_date', 'face_result', 'geofence_result', 'decision'])
      expect(body).not.toHaveProperty(key)
  })

  it('reads availability from the punch endpoint', async () => {
    const request = vi.fn(async () => ({ data: { available: true, trial: true, max_gps_accuracy_m: 100 } }))

    await expect(fetchPunchAvailability(request as never)).resolves.toEqual({
      available: true,
      trial: true,
      max_gps_accuracy_m: 100,
    })
    expect(request).toHaveBeenCalledWith(SELF_ENDPOINTS.punch)
    expect(SELF_ENDPOINTS.punch).toBe('/api/me/attendance/punch/')
  })

  it('uploads the selfie as attendance_selfie and returns its id', async () => {
    const send = vi.fn(async () => ({ id: 42, public_id: 'x' }))
    const file = new File([new Uint8Array([1, 2, 3])], 'me.jpg', { type: 'image/jpeg' })

    await expect(uploadSelfie(send as never, file)).resolves.toBe(42)

    const [path, opts] = send.mock.calls[0] as unknown as [string, { method: string, body: FormData }]

    expect(path).toBe(UPLOAD_ENDPOINT)
    expect(UPLOAD_ENDPOINT).toBe('/api/uploads/')
    expect(opts.method).toBe('POST')
    expect(JSON.parse(String(opts.body.get('metadata')))).toEqual({ category: 'attendance_selfie' })
    expect(opts.body.get('file')).toBeInstanceOf(File)
  })

  it('fails loudly when the upload response has no id', async () => {
    const send = vi.fn(async () => ({ public_id: 'x' }))

    await expect(uploadSelfie(send as never, new File([], 'a.jpg'))).rejects.toThrow()
  })

  it('posts the punch body and unwraps the envelope', async () => {
    const send = vi.fn(async () => ({ data: { result: 'rejected', trial: { mode: 'gps_trial' } } }))

    const result = await submitPunch(send as never, {
      clientPunchId: 'abc',
      punchType: 'in',
      reading,
      selfieId: 7,
    })

    expect(result.trial?.mode).toBe('gps_trial')
    expect(send).toHaveBeenCalledWith('/api/me/attendance/punch/', {
      method: 'POST',
      body: expect.objectContaining({ client_punch_id: 'abc', selfie: 7 }),
    })
  })
})

describe('punch i18n', () => {
  function keys(node: unknown, prefix = ''): string[] {
    if (node && typeof node === 'object')
      return Object.entries(node).flatMap(([key, value]) => keys(value, prefix ? `${prefix}.${key}` : key))

    return [prefix]
  }

  it('has the same keys in English and Indonesian', () => {
    expect(keys(id.punch).sort()).toEqual(keys(en.punch).sort())
  })

  it('has a message for every geolocation failure', () => {
    for (const code of ['insecure_context', 'unsupported', 'permission_denied', 'position_unavailable', 'timeout'])
      expect(en.punch.errors).toHaveProperty(code)
  })
})
