<template>
  <VSheet class="d-flex align-center bg-primary rounded-pill ga-2 pa-1" style="overflow: hidden;">
    <div class="avatar-expandable">
      <VAvatar color="white" size="small" variant="tonal">
        <small>{{ assignedByInitials }}</small>
      </VAvatar>
      <span class="full-name">{{ assignedBy }}</span>
    </div>

    <IconArrowRight size="16" color="rgb(var(--v-theme-white))" />

    <div class="avatar-expandable">
      <VAvatar color="white" size="small" variant="flat">
        <small>{{ assignedToInitials }}</small>
      </VAvatar>
      <span class="full-name">{{ assignedTo }}</span>
    </div>
  </VSheet>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { IconArrowRight } from "@tabler/icons-vue";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

const assignedByInitials = computed(() => getInitials(props.assignedBy));
const assignedToInitials = computed(() => getInitials(props.assignedTo));

const props = defineProps<{
  assignedBy: string;
  assignedTo: string;
}>();
</script>

<style scoped>
.avatar-expandable {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--v-theme-white);
  border-radius: 16px;
  padding: 0 2px;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  flex-shrink: 0;
  width: 35px;
  max-width: 100px;
  cursor: pointer;
}

.full-name {
  opacity: 0;
  margin-left: 5px;
  white-space: nowrap;
  transition: opacity 0.6s ease-in-out;
  overflow: ellipsis;
}

.avatar-expandable:hover {
  width: 100%;
  max-width: 120px;
  padding-right: 8px;
}

.avatar-expandable:hover .full-name {
  opacity: 1;
}
</style>
