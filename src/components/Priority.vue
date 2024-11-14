<template>
  <VTooltip>
    <template #activator="{ props: tooltipProps }">
      <VBadge v-bind="tooltipProps" style="width: 8px; height: 8px" dot :color="getPriorityColor(props.priority)" />
    </template>
    <span>{{ props.priority }}</span>
  </VTooltip>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { getPriorityColor } from "../utils/common"

const props = defineProps<{
  priority: string;
}>();
</script>
