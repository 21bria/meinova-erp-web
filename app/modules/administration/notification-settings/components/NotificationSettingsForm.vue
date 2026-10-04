<script setup lang="ts">
import {
  MSettingBuilder,
  useSetting,
} from "@framework"

import { notificationSettingsConfig } from "../config"

const setting = useSetting(notificationSettingsConfig)
</script>

<template>
  <MSettingBuilder
    :config="notificationSettingsConfig"
    :data="setting.data.value"
    :loading="setting.loading.value"
    :errors="setting.errors.value"
    @save="setting.save"
  />
</template>