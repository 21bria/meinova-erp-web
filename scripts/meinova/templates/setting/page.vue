<script setup lang="ts">
import {
  MSettingBuilder,
  useSetting,
} from "@framework"

import { __camelName__Config } from "./config"

const {
  setting,
  values,
  loading,
  saving,
  errors,
  save,
  reset,
} = useSetting(__camelName__Config)
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