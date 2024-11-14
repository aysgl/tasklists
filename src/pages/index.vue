<template>
  <div class="scrollable">
    <div v-for="(taskGroup, index) in filteredTaskGroups" :key="index" class="col">
      <VCard variant="tonal" :color="taskGroup.color" height="100%">
        <VCardTitle class="font-weight-bold text-body-1">
          {{ taskGroup.title }}
          <VBadge inline :color="taskGroup.color" :content="taskGroup?.tasks?.length" />
        </VCardTitle>
        <VCardText style="white-space: normal;">
          <div v-for="(item, idx) in taskGroup?.tasks" :key="idx" class="border rounded mb-2 pa-3 text-black">
            <div class="w-100 d-flex justify-space-between align-center ga-2">
              <div class="font-weight-bold">
                <Priority :priority="item.priority" />
                <span class="ms-2">{{ item.title }}</span>
              </div>
              <div>
                <VBtn :disabled="!isTaskEditable(item)" icon size="small" variant="text" @click="openTaskDialog(item)">
                  <IconPencil size="16" />
                </VBtn>
                <VBtn :disabled="!isTaskEditable(item)" icon size="small" variant="text"
                  @click="missionStore.deleteTask(item.id)">
                  <IconTrash size="16" />
                </VBtn>
              </div>
            </div>
            <small class="text-medium-emphasis">
              {{ formatDate(item.startDate) }} - {{ formatDate(item.endDate) }}
            </small>
            <div class="mb-4">{{ item?.description }}</div>
            <div class="d-flex align-center justify-space-between ga-2">
              <AssignAvatar :assignedBy="item.assignedBy" :assignedTo="item.assignedTo" />
              <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                  <v-btn :disabled="!isTaskEditable(item)" :append-icon="IconChevronDown" color="primary" v-bind="props"
                    class="rounded-pill" variant="tonal">
                    {{ item.status }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(s, index) in status" :key="index" @click="selectStatus(s, item)">
                    <v-list-item-title>{{ s }}</v-list-item-title>
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
          <VBtn color="primary" variant="tonal" @click="missionStore.dialog = false">İptal</VBtn>
          <VBtn color="primary" variant="flat" @click="handleSaveTask">
            {{ selectedTaskId ? "Güncelle" : "Ekle" }}
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useMission } from '@/stores/mission';
import moment from 'moment';
import { IconPencil, IconTrash, IconChevronDown } from '@tabler/icons-vue';
import { useUsers } from '@/stores/users';

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

const status = ref(['başarılı', 'başarısız', 'atanmış']);

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  startDate: string;
  endDate: string;
  assignedBy: string;
  assignedTo: string;
  status: string;
  userId: number;
}

const taskGroups = ref<{ title: string; status: string; color: string; tasks: Task[] }[]>([
  { title: 'Todo', status: 'atanmış', color: 'primary', tasks: [] },
  { title: 'Success', status: 'başarılı', color: 'success', tasks: [] },
  { title: 'Unsuccess', status: 'başarısız', color: 'error', tasks: [] },
  { title: 'Due Success', status: 'başarılı', color: 'success', tasks: [] },
  { title: 'Due Unsuccess', status: 'başarısız', color: 'error', tasks: [] }
]);

const filteredTaskGroups = computed(() => taskGroups.value.filter((group) => group.tasks && group.tasks.length > 0));

const updateTaskGroups = () => {
  taskGroups.value.forEach((group: any) => {
    group.tasks = missionStore.missions.filter((t: any) => t.status === group.status);

    if (group.title.includes('Due')) {
      group.tasks = group.tasks.filter((t: any) => moment(t.endDate).isBefore(moment()));
    }
  });
};


const formatDate = (date: string) => moment(date).format('LL');

const selectStatus = (selectedStatus: string, task: Task) => {
  task.status = selectedStatus;
  updateTaskGroups();
};

const resetForm = () => {
  Object.assign(formData, {
    title: '', description: '', priority: '', startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'), assignedBy: 'Ayşegül Avcu', assignedTo: '', status: 'atanmış', userId: 1
  });
};

const openTaskDialog = (item: any = null) => {
  resetForm();
  selectedTaskId.value = item?.id || null;
  if (item) Object.assign(formData, item);
  missionStore.dialog = true;
};

const isTaskEditable = (task: Task) => task.userId === formData.userId;

const handleSaveTask = () => {
  if (!formData.title || !formData.priority || !formData.startDate || !formData.endDate) return;

  const updatedTask: Task = { ...formData, id: selectedTaskId.value || 0, userId: formData.userId };

  if (selectedTaskId.value) {
    missionStore.updateTask(updatedTask);
  } else {
    missionStore.addTask(updatedTask);
  }

  missionStore.dialog = false;
  updateTaskGroups();
};


watch(() => missionStore.missions, updateTaskGroups, { deep: true, immediate: true });
watch(() => formData.status, updateTaskGroups);

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
    min-width: 40%;
    min-height: 600px;

    @media screen and (max-width: 600px) {
      min-width: 100%;
    }
  }

  .v-card {
    padding: 20px;
  }
}
</style>
