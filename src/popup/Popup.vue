<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { enableShortcut, shortcut, showElement } from '~/logic'
import Switch from '~/components/Switch.vue'

useDark()

</script>

<template>
  <main class="text-center overflow-x-hidden w-200px min-w-200px dark:bg-[#0d1117] border-0">
    <h2 class="text-lg text-dark-200 mb-0 dark:text-gray-400">
      <Logo />
    </h2>
    <ul class="text-base w-full ml-0 pl-0 mt-0">
      <li class="flex items-center px-15px py-12px hover:bg-[#eee] hover:dark:bg-dark-[#161b22] border-0 border-t-1px border-b-1px border-solid border-[#eee] dark:border-gray-500/50">
        <Switch key="show-element" v-model="showElement" text="Display element" />
      </li>
      <li class="flex items-center px-15px py-12px hover:bg-[#eee] hover:dark:bg-dark-[#161b22] border-0 border-b-1px border-solid border-[#eee] dark:border-gray-500/50">
        <Switch
          key="enable-shortcut"
          v-model="enableShortcut"
          text="Enable shortcut"
          :subtext="shortcut"
        />
      </li>
    </ul>
    <p class="pb-2 text-dark-500/80 text-[12px] select-none dark:text-gray-400/80">
      <span class="block">
        <a href="https://github.com/aliuq/degit-webext/issues/new" class="hover:text-black hover:dark:text-gray-400">Send feedback?</a>
      </span>
      <span class="block mt-5px">
        Powered by <a href="https://github.com/aliuq/degit-webext" class="hover:text-black hover:dark:text-gray-400">degit-webext</a>
      </span>
    </p>
  </main>
</template>
