<script setup lang="ts">
import {
  MSettingBuilder,
  useSetting,
} from "@framework"

import { passwordPolicyConfig } from "../config"

const setting = useSetting(passwordPolicyConfig)
</script>

<template>
  <MSettingBuilder
    :config="passwordPolicyConfig"
    :data="setting.data.value"
    :loading="setting.loading.value"
    :errors="setting.errors.value"
    @save="setting.save"
  />
</template>