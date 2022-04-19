<script setup lang="ts">
const props = defineProps<{
  text: string
  subtext?: string
  modelValue: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const modelValue = computed(() => props.modelValue)

function onChange() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="switch-item">
    <label class="flex items-center">
      <span class="label text-dark-300 flex flex-col dark:text-gray-400">
        {{ props.text }}
        <i v-if="props.subtext" class="text-xs not-italic block leading-3 text-blue-500 dark:text-gray-200">{{ props.subtext }}</i>
      </span>
      <div class="switch">
        <input v-model="modelValue" type="checkbox" @change="onChange">
        <span class="slider round" />
      </div>
    </label>
  </div>
</template>

<style scoped>
.switch-item .label {
  display: inline-block;
  width: 100px;
  font-size: 14px;
  user-select: none;
  line-height: 1.5;
}
/* The switch - the box around the slider */
.switch-item .switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 18px;
  margin-left: 10px;
}

/* Hide default HTML checkbox */
.switch-item .switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.switch-item .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.switch-item .slider:before {
  position: absolute;
  content: "";
  height: 10px;
  width: 10px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

.switch-item input:checked + .slider {
  background-color: #2196F3;
}

.switch-item input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

.switch-item input:checked + .slider:before {
  -webkit-transform: translateX(14px);
  -ms-transform: translateX(14px);
  transform: translateX(14px);
}

/* Rounded sliders */
.switch-item .slider.round {
  border-radius: 18px;
}

.switch-item .slider.round:before {
  border-radius: 50%;
}

html.dark .switch-item .slider {
  background-color: #30363d;
}
html.dark .switch-item .slider:before {
  background-color: #999;
}
html.dark .switch-item input:checked + .slider {
  background-color: #1666e9;
}
html.dark .switch-item input:focus + .slider {
  box-shadow: 0 0 1px #30363d;
}
</style>
