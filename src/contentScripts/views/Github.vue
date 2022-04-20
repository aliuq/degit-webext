<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import 'virtual:windi.css'

const props = defineProps<{
  source: string
}>()
const { copy, copied } = useClipboard({ source: props.source })

</script>

<template>
  <div v-if="props.source" class="btn d-none d-md-block" @click="() => copy()">
    Degit {{ copied ? 'Copied' : 'Copy' }}
    <span :title="props.source">
      <octicon-question class="octicon d-inline-block ml-10px text-lg" />
    </span>
  </div>
</template>
