<template>
  <div class="scrollable">
    <div v-for="(taskGroup, index) in filteredTaskGroups" :key="index" class="col">
      <VCard :variant="taskGroup.variant" :color="taskGroup.color" height="100%">
        <VCardTitle class="font-weight-bold text-body-1">
          {{ taskGroup.title }}
          <VBadge inline :color="taskGroup.color" :content="taskGroup.tasks.length" />
        </VCardTitle>
        <VCardText style="white-space: normal; min-width: 400px;">
          <div v-for="(item, idx) in taskGroup.tasks" :key="idx" class="border rounded mb-2 pa-3 text-black">
            <div class="w-100 d-flex justify-space-between align-center ga-2">
              <div class="font-weight-bold">
                <Priority :priority="item.priority" />
                <span class="ms-2">{{ item.title }}</span>
              </div>
              <div>
                <VBtn :disabled="!taskGroup.tasks.some(task => task.userId === formData.userId && task.id === item.id)"
                  icon size="small" variant="text" @click="openTaskDialog(item)">
                  <IconPencil size="16" />
                </VBtn>
                <VBtn :disabled="!taskGroup.tasks.some(task => task.userId === formData.userId && task.id === item.id)"
                  icon size="small" variant="text" @click="missionStore.deleteTask(item.id)">
                  <IconTrash size="16" />
                </VBtn>
              </div>
            </div>
            <small class="text-medium-emphasis">
              {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
            </small>
            <div class="mb-4">{{ item.description }}</div>
            <div class="d-flex align-center justify-space-between ga-2">
              <AssignAvatar :assignedBy="item.assignedBy" :assignedTo="item.assignedTo" />
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn
                    :disabled="!taskGroup.tasks.some(task => task.userId === formData.userId && task.id === item.id)"
                    :append-icon="IconChevronDown" color="primary" v-bind="props" class="rounded-pill" variant="tonal">
                    {{ item.status }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(s, index) in status" :key="index" @click="selectStatus(s.status, item)">
                    <v-list-item-title>{{ s.status }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </VCardText>
      </VCard>
    </div>
  </div>

  <!-- Modal Dialog -->
  <VDialog v-model="missionStore.dialog" max-width="600px" @after-leave="resetForm">
    <VCard>
      <VCardText>
        <p class="mb-4 font-weight-bold">
          {{ selectedTaskId ? "Görev Güncelle" : "Yeni Görev Ekle" }}
        </p>
        <VForm ref="taskForm">
          <VTextField variant="outlined" label="Görev Adı" v-model="formData.title" required />
          <VTextarea variant="outlined" label="Görev Açıklaması" v-model="formData.description" rows="4" />
          <VRow dense>
            <VCol cols="4">
              <v-select variant="outlined" label="Öncelik Seviyesi" :items="['yüksek', 'orta', 'düşük']"
                v-model="formData.priority" />
            </VCol>
            <VCol cols="4">
              <VTextField variant="outlined" label="Başlangıç Tarihi" v-model="formData.startDate" type="date" />
            </VCol>
            <VCol cols="4">
              <VTextField variant="outlined" label="Bitiş Tarihi" v-model="formData.endDate" type="date" />
            </VCol>
            <VCol cols="4">
              <v-select variant="outlined" label="Atayan Kişi" :items="userStore.users" item-title="fullName"
                v-model="formData.assignedBy" />
            </VCol>
            <VCol cols="4">
              <v-select variant="outlined" label="Atanan Kişi" :items="userStore.users" item-title="fullName"
                v-model="formData.assignedTo" />
            </VCol>
            <VCol cols="4">
              <v-select variant="outlined" label="Status" :items="status" item-title="status"
                v-model="formData.status" />
            </VCol>
          </VRow>
        </VForm>
        <VCardActions class="pa-0">
          <VSpacer />
          <VBtn color="primary" variant="tonal" @click="closeDialog">İptal</VBtn>
          <VBtn color="primary" variant="flat" @click="handleSaveTask">
            {{ selectedTaskId ? "Güncelle" : "Ekle" }}
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue';
import { IconPencil, IconTrash, IconChevronDown } from '@tabler/icons-vue';
import { useMission } from '@/stores/mission';
import { useUsers } from '@/stores/users';
import moment from 'moment';

const missionStore = useMission();
const userStore = useUsers();
const selectedTaskId = ref<number | null>(null);

const formData = reactive({
  title: '',
  description: '',
  priority: '',
  startDate: moment().format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  assignedBy: 'Ayşegül Avcu',
  assignedTo: '',
  status: 'atanmış',
  userId: 1
});

const status = ref([
  { status: 'başarılı' },
  { status: 'başarısız' },
  { status: 'atanmış' },
]);

const filteredTaskGroups = computed(() => taskGroups.value);

const tasks = computed(() => missionStore.missions.filter((t: any) => t.status === 'atanmış'));
const completedTasks = computed(() => missionStore.missions.filter((t: any) => t.status === 'başarılı'));
const unsuccessfulTasks = computed(() => missionStore.missions.filter((t: any) => t.status === 'başarısız'));
const overdueSuccessfulTasks = computed(() => completedTasks.value.filter((t: any) => moment(t.endDate).isBefore(moment())));
const overdueUnsuccessfulTasks = computed(() => unsuccessfulTasks.value.filter((t: any) => moment(t.endDate).isBefore(moment())));

const taskGroups = computed(() => [
  { title: 'Todo', tasks: tasks.value, color: 'primary', variant: 'tonal' },
  { title: 'Success', tasks: completedTasks.value, color: 'success', variant: 'tonal' },
  { title: 'Unsuccess', tasks: unsuccessfulTasks.value, color: 'error', variant: 'tonal' },
  { title: 'Due Success', tasks: overdueSuccessfulTasks.value, color: 'success', variant: 'tonal' },
  { title: 'Due Unsuccess', tasks: overdueUnsuccessfulTasks.value, color: 'error', variant: 'tonal' }
]);

const updateTaskGroups = () => {
  tasks.value = missionStore.missions.filter(t => t.status === 'atanmış');
  completedTasks.value = missionStore.missions.filter(t => t.status === 'başarılı');
  unsuccessfulTasks.value = missionStore.missions.filter(t => t.status === 'başarısız');
  overdueSuccessfulTasks.value = completedTasks.value.filter(t => moment(t.endDate).isBefore(moment()));
  overdueUnsuccessfulTasks.value = unsuccessfulTasks.value.filter(t => moment(t.endDate).isBefore(moment()));

  taskGroups.value = [
    { title: 'Todo', tasks: tasks.value, color: 'primary', variant: 'tonal' },
    { title: 'Success', tasks: completedTasks.value, color: 'success', variant: 'tonal' },
    { title: 'Unsuccess', tasks: unsuccessfulTasks.value, color: 'error', variant: 'tonal' },
    { title: 'Due Success', tasks: overdueSuccessfulTasks.value, color: 'success', variant: 'tonal' },
    { title: 'Due Unsuccess', tasks: overdueUnsuccessfulTasks.value, color: 'error', variant: 'tonal' }
  ];
};

const selectStatus = (selectedStatus: string, task: any) => {
  task.status = selectedStatus;
  updateTaskGroups();
};

const formatDate = (date: string) => moment(date).format('LL');

const resetForm = () => {
  Object.keys(formData).forEach(key => (formData[key] = ''));
};

const openTaskDialog = (item: any = null) => {
  resetForm();
  selectedTaskId.value = item ? item.id : null;
  if (item) Object.assign(formData, item);
  missionStore.dialog = true;
};

const handleSaveTask = () => {
  if (!formData.title || !formData.priority || !formData.startDate || !formData.endDate) return;

  const updatedTask = { ...formData, id: selectedTaskId.value };

  if (selectedTaskId.value) {
    missionStore.updateTask(updatedTask);
  } else {
    missionStore.addTask({ ...formData, id: Date.now() });
  }

  missionStore.dialog = false;
  updateTaskGroups();
};

watchEffect(() => {
  taskGroups.value = [
    { title: 'Todo', tasks: tasks.value, color: 'primary', variant: 'tonal' },
    { title: 'Success', tasks: completedTasks.value, color: 'success', variant: 'tonal' },
    { title: 'Unsuccess', tasks: unsuccessfulTasks.value, color: 'error', variant: 'tonal' },
    { title: 'Due Success', tasks: overdueSuccessfulTasks.value, color: 'success', variant: 'tonal' },
    { title: 'Due Unsuccess', tasks: overdueUnsuccessfulTasks.value, color: 'error', variant: 'tonal' }
  ];
});

watch(() => formData.status, () => {
  updateTaskGroups();
});

watch(() => missionStore.missions, () => {
  updateTaskGroups();
}, { deep: true, immediate: true });
</script>

<style scoped lang="scss">
.scrollable {
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  gap: 20px;

  &::-webkit-scrollbar {
    display: none;
  }

  .col {
    max-width: 40%;
    min-height: 600px;

    @media screen and (max-width: 600px) {
      max-width: 100%;
    }
  }

  .v-card {
    padding: 20px;
  }
}
</style>
