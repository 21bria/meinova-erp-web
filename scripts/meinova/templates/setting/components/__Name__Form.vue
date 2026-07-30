<script setup lang="ts">
import {
  MSettingBuilder,
  useSetting,
} from "@framework"

import { __name__Config } from "../config"

const setting = useSetting(__name__Config)
</script>

<template>
  <MSettingBuilder
    :config="__name__Config"
    :data="setting.data.value"
    :loading="setting.loading.value"
    :errors="setting.errors.value"
    @save="setting.save"
  />
</template>