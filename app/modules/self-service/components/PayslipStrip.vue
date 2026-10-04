<script setup lang="ts">
import type { SelfPayslip } from '../types'

/**
 * Slip gaji terbaru — **metadata saja**.
 *
 * Yang tampil: periodenya, dan tanggal terbitnya. Tidak ada nilai gaji,
 * potongan, pajak, maupun rekening — backend pun tidak mengirimkannya,
 * jadi tidak ada yang bisa bocor lewat inspeksi jaringan sekalipun.
 * Angkanya tinggal satu klik jauhnya, di halaman yang memang dibuka
 * dengan sadar.
 *
 * Bentuknya satu baris melebar, bukan kartu ketiga di baris Layanan:
 * yang berguna di sini cuma "periode terakhir sudah terbit", dan kartu
 * setinggi tetangganya untuk satu kalimat terbaca seperti ada yang gagal
 * dimuat.
 *
 * **Dua ketinggian, dan itu disengaja.** Saat belum ada slip, barisnya
 * menyusut jadi satu baris `py-3`: keadaan kosong tidak layak memakan
 * ruang sebanyak keadaan berisi. Saat datanya ada ia mengembang ke
 * `py-4` dengan periode sebagai baris utama — bentuk yang sama yang akan
 * dipakai saat slip sungguhan mulai terbit.
 */
import { ArrowRight, ReceiptText } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { useLocaleFormat } from '~/composables/useLocaleFormat'
import { CARD_TEXT } from '../ui'

const props = defineProps<{ payslip: SelfPayslip }>()

const { t } = useI18n()
const { date } = useLocaleFormat()

const ready = computed(() => props.payslip.state === 'ready')

const period = computed(() => props.payslip.latest?.period?.name ?? '')

const issued = computed(() =>
  props.payslip.latest?.issue_date
    ? t('me.cards.payslip.issued', { date: date(props.payslip.latest.issue_date) })
    : '',
)
</script>

<template>
  <!--
    `restricted` = akun ini memang tidak berhak atas jenis datanya.
    Barisnya **tidak digambar sama sekali** — baris kosong bertuliskan
    "tidak tersedia" cuma memberi tahu bahwa ada sesuatu yang tidak boleh
    ia lihat, dan itu bukan kabar yang berguna untuknya.
  -->
  <Card
    v-if="payslip.state !== 'restricted'"
    class="gap-0"
    :class="ready ? 'py-4' : 'py-3'"
  >
    <CardContent
      class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground"
          :class="ready ? 'bg-muted' : 'border border-dashed'"
        >
          <ReceiptText class="size-3.5" aria-hidden="true" />
        </span>

        <div class="min-w-0">
          <p class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {{ t('me.cards.payslip.title') }}
          </p>

          <p
            v-if="ready"
            class="mt-0.5"
            :class="CARD_TEXT.strong"
          >
            {{ period }}

            <span v-if="issued" class="font-normal text-muted-foreground">
              · {{ issued }}
            </span>
          </p>

          <p v-else class="mt-0.5 text-sm text-muted-foreground">
            {{ t('me.cards.payslip.empty') }}
          </p>
        </div>
      </div>

      <NuxtLink
        v-if="payslip.action"
        :to="payslip.action.route"
        class="
          group -mx-1 inline-flex shrink-0 items-center gap-1.5 rounded-md px-1 py-0.5
          text-sm font-medium text-primary transition-colors
          hover:text-primary/75
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none
        "
      >
        {{ t(`me.actions.${payslip.action.code}`) }}

        <ArrowRight
          class="size-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </NuxtLink>
    </CardContent>
  </Card>
</template>
