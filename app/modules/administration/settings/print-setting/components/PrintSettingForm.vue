<script setup lang="ts">
import {
  MSettingBuilder,
  useSetting,
} from "@framework"

import { printSettingConfig } from "../config"

const setting = useSetting(printSettingConfig)
</script>

<template>
  <MSettingBuilder
    :config="printSettingConfig"
    :data="setting.data.value"
    :loading="setting.loading.value"
    :errors="setting.errors.value"
    @save="setting.save"
  />
</template>