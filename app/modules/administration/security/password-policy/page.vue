<script setup lang="ts">
import {
  MSettingBuilder,
  useSetting,
} from "@framework"

import { passwordPolicyConfig } from "./config"

const {
  setting,
  values,
  loading,
  saving,
  errors,
  save,
  reset,
} = useSetting(passwordPolicyConfig)
</script>

<template>
  <MSettingBuilder
    v-if="setting"
    v-model="values"
    :config="setting"
    :loading="loading"
    :saving="saving"
    :errors="errors"
    @save="save"
    @reset="reset"
  />
</template>