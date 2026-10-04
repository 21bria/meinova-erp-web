<script setup lang="ts">
import {
  MSettingBuilder,
  useSetting,
} from "@framework"

import { reminderPolicyConfig } from "../config"

const setting = useSetting(reminderPolicyConfig)
</script>

<template>
  <MSettingBuilder
    :config="reminderPolicyConfig"
    :data="setting.data.value"
    :loading="setting.loading.value"
    :errors="setting.errors.value"
    @save="setting.save"
  />
</template>