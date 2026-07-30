<script setup lang="ts">
import {
  MSettingBuilder,
  useSetting,
} from "@framework"

import { tenantSettingConfig } from "../config"

const setting = useSetting(tenantSettingConfig)
</script>

<template>
  <MSettingBuilder
    :config="tenantSettingConfig"
    :data="setting.data.value"
    :loading="setting.loading.value"
    :errors="setting.errors.value"
    @save="setting.save"
  />
</template>