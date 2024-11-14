<template>
  <VCard color="surface" flat>
    <VCardText class="pa-8">
      <VRow dense>
        <VCol cols="6">
          <VAutocomplete density="compact" variant="outlined" v-model="filters.title" :items="missionStore.missions"
            item-title="title" label="Görev Adı" hide-no-data clearable />
        </VCol>

        <VCol cols="3">
          <VTextField density="compact" variant="outlined" v-model="filters.startDate" label="Başlangıç Tarihi"
            type="date" />
        </VCol>

        <VCol cols="3">
          <VTextField density="compact" variant="outlined" v-model="filters.endDate" label="Bitiş Tarihi"
            :min="filters.startDate" type="date" />
        </VCol>
        <VCol cols="3">
          <VSelect density="compact" variant="outlined" v-model="filters.assignedBy" :items="userStore.users"
            item-title="fullName" label="Atayan Kullanıcı" clearable />
        </VCol>
        <VCol cols="3">
          <VSelect density="compact" variant="outlined" v-model="filters.assignedTo" :items="userStore.users"
            item-title="fullName" label="Atanan Kullanıcı" clearable />
        </VCol>
        <VCol cols="3">
          <VSelect density="compact" variant="outlined" v-model="filters.priority" :items="['yüksek', 'orta', 'düşük']"
            label="Öncelik" clearable />
        </VCol>

        <VCol cols="3">
          <VSelect density="compact" variant="outlined" v-model="filters.status"
            :items="['atanmış', 'başarılı', 'başarısız']" label="Görev Durumu" clearable />
        </VCol>
      </VRow>

      <!-- DataTable -->
      <VDataTable :items="filteredMissions" :headers="headers" item-value="id">
        <template v-slot:item="{ item }">
          <tr>
            <td class="text-truncate px-0">
              <div>
                <div class="font-weight-bold">{{ item.title }}</div>
                <small>
                  start: {{ moment(item.startDate).calendar() }}
                  end: {{ moment(item.endDate).calendar() }}
                </small>
              </div>
            </td>

            <td class="text-truncate">
              <VAvatar size="small" class="me-2" color="primary" variant="tonal">
                {{ item.assignedBy?.slice(0, 1) }}
              </VAvatar>
              {{ item.assignedBy }}
            </td>
            <td class="text-truncate">
              <VAvatar size="small" class="me-2" color="primary" variant="tonal">
                {{ item.assignedTo?.slice(0, 1) }}
              </VAvatar>{{ item.assignedTo }}
            </td>
            <td class="text-truncate">
              <VBadge dot inline :color="getPriorityColor(item.priority)"></VBadge>{{ item.priority }}
            </td>
            <td class="text-truncate">
              <VChip size="small" color="primary">{{ item.status }}</VChip>
            </td>
            <td class="d-flex align-center ga-2">
              <VBtn variant="text" size="x-small" :icon="IconPencil" @click="editTask(item)" />
              <VBtn variant="text" size="x-small" :icon="IconTrash" @click="missionStore.deleteTask(item.id)" />
            </td>
          </tr>
        </template>
      </VDataTable>
    </VCardText>
  </VCard>

  <!-- Görev Ekle/Güncelle Modalı -->
  <VDialog v-model="missionStore.dialog" max-width="600px" @after-leave="resetForm">
    <VCard>
      <VCardText>
        <p class="mb-4 font-weight-bold">
          {{ selectedTaskId ? "Görev Güncelle" : "Yeni Görev Ekle" }}
        </p>
        <VForm ref="taskForm">
          <VTextField variant="outlined" label="Görev Adı" v-model="filters.title" required />
          <VTextarea variant="outlined" label="Görev Açıklaması" v-model="filters.description" rows="4" />
          <VRow dense>
            <VCol cols="4">
              <v-select variant="outlined" label="Öncelik Seviyesi" :items="['yüksek', 'orta', 'düşük']"
                v-model="filters.priority" />
            </VCol>
            <VCol cols="4">
              <v-text-field variant="outlined" label="Başlangıç Tarihi" v-model="filters.startDate" type="date" />
            </VCol>
            <VCol cols="4">
              <v-text-field variant="outlined" label="Bitiş Tarihi" v-model="filters.endDate" type="date" />
            </VCol>
            <VCol cols="4">
              <v-select variant="outlined" label="Atayan Kişi" :items="userStore.users" item-title="fullName"
                v-model="filters.assignedBy" />
            </VCol>
            <VCol cols="4">
              <v-select variant="outlined" label="Atanan Kişi" :items="userStore.users" item-title="fullName"
                v-model="filters.assignedTo" />
            </VCol>
            <VCol cols="4">
              <v-select variant="outlined" label="Durum" :items="['atanmış', 'başarılı', 'başarısız']"
                v-model="filters.status" />
            </VCol>
          </VRow>
        </VForm>
        <VCardActions class="pa-0">
          <VSpacer />
          <VBtn color="primary" variant="tonal" @click="closeDialog">İptal</VBtn>
          <VBtn color="primary" variant="flat" @click="handleTask">
            {{ selectedTaskId ? "Güncelle" : "Ekle" }}
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { useMission } from "@/stores/mission";
import { useUsers } from "@/stores/users";
import moment from "moment";
import { reactive, computed, ref } from 'vue';
import { getPriorityColor } from "../utils/common";
import { IconTrash, IconPencil } from "@tabler/icons-vue";

const userStore = useUsers();
const missionStore = useMission();

const filters = reactive({
  title: '',
  description: '',
  startDate: "",
  endDate: "",
  assignedTo: '',
  assignedBy: '',
  priority: '',
  status: ''
});

const headers = [
  { title: 'Görev Adı', key: 'title', value: 'title', align: 'start' as const },
  { title: 'Atayan Kullanıcı', key: 'assignedBy', value: 'assignedBy', align: 'start' as const },
  { title: 'Atanan Kullanıcı', key: 'assignedTo', value: 'assignedTo', align: 'start' as const },
  { title: 'Öncelik', key: 'priority', value: 'priority', align: 'center' as const },
  { title: 'Durum', key: 'status', value: 'status', align: 'center' as const },
  { title: '', key: 'action', value: 'action', align: 'end' as const, sortable: false },
] as const;

const selectedTaskId = ref(null);

const handleTask = () => {
  // Tarihleri kontrol etmeden ekleme yapma
  if (!isValidDate(filters.startDate) || !isValidDate(filters.endDate)) {
    alert("Lütfen geçerli bir tarih girin.");
    return;
  }

  if (selectedTaskId.value) {
    missionStore.updateTask({ ...filters, id: selectedTaskId.value });
  } else {
    missionStore.addTask({ ...filters }); // Görev ekleme
  }
  missionStore.dialog = false;
};

const isValidDate = (date: any) => {
  return moment(date, "YYYY-MM-DD", true).isValid();
};

const editTask = (item: any) => {
  selectedTaskId.value = item.id;
  filters.title = item.title;
  filters.description = item.description;
  filters.startDate = item.startDate;
  filters.endDate = item.endDate;
  filters.assignedBy = item.assignedBy;
  filters.assignedTo = item.assignedTo;
  filters.priority = item.priority;
  filters.status = item.status;
  missionStore.dialog = true;
};

const closeDialog = () => {
  missionStore.dialog = false;
  resetForm();
};

const resetForm = () => {
  selectedTaskId.value = null;
  filters.title = '';
  filters.description = '';
  filters.startDate = '';
  filters.endDate = '';
  filters.assignedTo = '';
  filters.assignedBy = '';
  filters.priority = '';
  filters.status = '';
};

const filteredMissions = computed(() => {
  return missionStore.missions.filter((mission: any) => {
    const matchesTitle = filters.title ? mission.title.includes(filters.title) : true;
    const matchesStartDate = filters.startDate ? new Date(mission.startDate) >= new Date(filters.startDate) : true;
    const matchesEndDate = filters.endDate ? new Date(mission.endDate) <= new Date(filters.endDate) : true;
    const matchesAssignedTo = filters.assignedTo ? mission.assignedTo === filters.assignedTo : true;
    const matchesAssignedBy = filters.assignedBy ? mission.assignedBy === filters.assignedBy : true;
    const matchesPriority = filters.priority ? mission.priority === filters.priority : true;
    const matchesStatus = filters.status ? mission.status === filters.status : true;

    return (
      matchesTitle &&
      matchesStartDate &&
      matchesEndDate &&
      matchesAssignedTo &&
      matchesAssignedBy &&
      matchesPriority &&
      matchesStatus
    );
  });
});
</script>
