<script setup lang="ts">
import {
  MSettingBuilder,
  useSetting,
} from "@framework"

import { systemSettingConfig } from "../config"

const setting = useSetting(systemSettingConfig)
</script>

<template>
  <MSettingBuilder
    :config="systemSettingConfig"
    :data="setting.data.value"
    :loading="setting.loading.value"
    :errors="setting.errors.value"
    @save="setting.save"
  />
</template>