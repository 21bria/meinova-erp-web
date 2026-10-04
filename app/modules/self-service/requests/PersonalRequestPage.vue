<script setup lang="ts">
import type { SelfContext, SelfError } from '../types'
import type { PersonalRequestKind } from './personalRequest'

import {
  MEmpty,
  MFormBuilder,
  MLoading,
  normalizeApiErrors,
} from '@framework'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useApi } from '@/composables/useApi'

import { attendancePermissionsForm } from '@/modules/hr/attendance-permissions/form'
import { leaveForm } from '@/modules/hr/leave/form'
import { fetchSelfContext, toSelfError } from '../api/client'
import {
  buildPersonalPayload,
  identityLabel,
  PERSONAL_REQUESTS,
  personalFormSchema,
} from './personalRequest'

/*
 * Ajukan Cuti / Ajukan Izin dari My Workspace.
 *
 * Subjeknya tidak dipilih di sini dan tidak dikirim dari sini: backend
 * (`/api/me/*`) mengambilnya dari akun yang login. Identitas yang tampil
 * di atas formulir hanya konteks bacaan, dari `/api/me/`.
 *
 * Formulirnya **bukan salinan**: field diambil dari definisi generator
 * modul HR lalu disaring ke daftar putih pribadi. Tab HR (Override HR,
 * Organization, Review & Attendance) tidak ikut karena field-nya tidak
 * ada di daftar itu.
 */

const props = defineProps<{
  kind: PersonalRequestKind
}>()

const { t } = useI18n()
const { request } = useApi()
const { success, error: notifyError } = useNotify()
const router = useRouter()

const config = computed(() => PERSONAL_REQUESTS[props.kind])

const schema = computed(() => personalFormSchema(
  (props.kind === 'leave' ? leaveForm : attendancePermissionsForm) as any[],
  config.value,
))

const context = ref<SelfContext | null>(null)
const contextError = ref<SelfError | null>(null)
const loading = ref(true)

const model = ref<Record<string, any>>({})
const errors = ref<Record<string, any> | null>(null)
const saving = ref(false)

const identity = computed(() => identityLabel(context.value))

const generalError = computed(() => {
  const detail = errors.value?.detail ?? errors.value?.non_field_errors

  return Array.isArray(detail) ? detail.join(' ') : (detail ?? '')
})

const unavailableText = computed(() => {
  switch (contextError.value?.code) {
    case 'employee_not_linked':
      return t('me.states.notLinked')
    case 'employee_inactive':
      return t('me.states.inactive')
    case 'not_authenticated':
      return t('me.states.notAuthenticated')
    default:
      return t('me.states.genericError')
  }
})

onMounted(async () => {
  try {
    context.value = await fetchSelfContext(request as any)
  }
  catch (caught) {
    contextError.value = toSelfError(caught)
  }
  finally {
    loading.value = false
  }
})

async function submit() {
  if (saving.value)
    return

  saving.value = true
  errors.value = null

  try {
    await request(config.value.endpoint, {
      method: 'POST',
      body: buildPersonalPayload(model.value, config.value),
    })

    success(t('me.requests.submitted'))

    await router.push('/me')
  }
  catch (caught) {
    errors.value = normalizeApiErrors(caught)

    notifyError(t('me.requests.failed'))
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="space-y-5 p-4 sm:space-y-6 sm:p-6">
    <div class="flex flex-col gap-1">
      <h1 class="text-xl font-semibold tracking-tight sm:text-2xl">
        {{ t(config.titleKey) }}
      </h1>
      <p class="text-muted-foreground text-sm">
        {{ t('me.requests.personalHint') }}
      </p>
    </div>

    <MLoading v-if="loading" />

    <MEmpty
      v-else-if="contextError"
      :title="t(config.titleKey)"
      :description="unavailableText"
    />

    <Card v-else>
      <CardContent class="space-y-6 p-4 sm:p-6">
        <!-- Konteks subjek: teks, bukan pilihan. -->
        <div
          class="grid gap-2 sm:max-w-md"
          data-personal-subject
        >
          <span class="text-sm font-medium">
            {{ t('me.requests.employee') }}
          </span>
          <div
            class="
              bg-muted/40 flex h-9 items-center rounded-md border px-3
              text-sm
            "
          >
            <span class="truncate">{{ identity || '—' }}</span>
          </div>
        </div>

        <MFormBuilder
          v-model="model"
          :schema="schema"
          :errors="errors"
          mode="create"
          :disabled="saving"
        />

        <p
          v-if="generalError"
          class="text-destructive text-sm"
        >
          {{ generalError }}
        </p>

        <div class="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            :disabled="saving"
            @click="router.push('/me')"
          >
            {{ t('me.requests.cancel') }}
          </Button>

          <Button
            :disabled="saving"
            data-personal-submit
            @click="submit"
          >
            {{ saving ? t('me.requests.submitting') : t('me.requests.submit') }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
