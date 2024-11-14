<template>
  <VCard color="surface" flat>
    <VCardText class="pa-8">
      <v-data-table :headers="headers" :items="userTasks" item-key="id" :items-per-page="10">
        <template v-slot:[`item.fullName`]="{ item }">
          <VAvatar color="primary" variant="tonal">
            {{ item.fullName?.slice(0, 1) }}
          </VAvatar>
          <span class="font-weight-bold ms-2">{{ item.fullName }}</span>
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <VChip size="small" :color="getStatusColor(item.status)" variant="tonal">
            {{ item.status }}
          </VChip>
        </template>

        <template v-slot:[`item.delayedTasksCount`]="{ item }">
          <div class="font-weight-bold">{{ item.delayedTasksCount }}</div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="primary" variant="flat" size="small" class="text-capitalize rounded-pill"
            @click="viewTasks(item.userId)">
            Görevler
          </v-btn>
        </template>
      </v-data-table>
    </VCardText>
  </VCard>

  <!-- Kullanıcı Ekleme Dialog -->
  <v-dialog v-model="userStore.dialog" max-width="600px">
    <v-card>
      <v-card-text>
        <p class="font-weight-bold mb-4">Yeni Kullanıcı Ekle</p>
        <v-form ref="form" v-model="formIsValid">
          <v-text-field v-model="newUser.name" label="Kullanıcı Adı" variant="outlined" required></v-text-field>
          <v-text-field v-model="newUser.fullName" label="İsim Soyisim" variant="outlined" required></v-text-field>
        </v-form>
        <v-card-actions class="pa-0 d-flex justify-end">
          <v-btn color="primary" variant="tonal" @click="isNewUserDialogOpen = false">İptal</v-btn>
          <v-btn color="primary" variant="flat" :disabled="!formIsValid" @click="createNewUser">Ekle</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Kullanıcı Görevleri Dialog -->
  <v-dialog v-model="isTasksDialogOpen" max-width="600px">
    <v-card>
      <v-card-text>
        <p class="font-weight-bold mb-4">
          {{ selectedUser?.fullName }} Görevleri
        </p>
        <VCard>
          <VCardText>
            <div v-if="selectedUser?.tasks.length > 0" v-for="(task, index) in selectedUser.tasks" :key="index"
              class="py-2">
              <div class="w-100 d-flex justify-space-between align-center ga-2">
                <div class="font-weight-bold">
                  {{ task.title }}
                </div>
                <small class="text-medium-emphasis">
                  {{ moment(task.startDate).format('LL') }} - {{ moment(task.endDate).format('LL') }}
                </small>
              </div>
              <div class="mb-3">{{ task.description }}</div>
              <div class="d-flex align-center ga-2">
                <AssignAvatar :assignedBy="task.assignedBy" :assignedTo="task.assignedTo" />
                <div>{{ task.taskStatus }}</div>
              </div>
              <v-divider class="mt-4" v-if="index !== selectedUser.tasks.length - 1"></v-divider>
            </div>
            <div v-else>
              Henüz görev eklenmedi
            </div>
          </VCardText>
        </VCard>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useMission } from "@/stores/mission";
import { useUsers } from "@/stores/users";
import { getStatusColor } from "@/utils/common";
import moment from "moment";

const userStore = useUsers();
const missionStore = useMission();
const isTasksDialogOpen = ref(false);
const isNewUserDialogOpen = ref(false);
const selectedUser = ref(null);

const headers = [
  { title: "İsim Soyisim", align: "start", key: "fullName" },
  { title: "Kullanıcı Adı", align: "start", key: "username" },
  { title: "Görev Durumu", key: "status" },
  { title: "Geciken Görev Sayısı", key: "delayedTasksCount" },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const userTasks = computed(() => {
  const userTaskMap = new Map();
  missionStore.missions.forEach(task => {
    const user = userStore.users.find(user => user.id === task.userId);
    if (user) {
      if (!userTaskMap.has(user.id)) {
        userTaskMap.set(user.id, {
          userId: user.id,
          fullName: user.fullName,
          username: user.username,
          status: task.status || "atanmış",
          delayedTasksCount: 0,
          tasks: [],
        });
      }

      userTaskMap.get(user.id).tasks.push({ ...task });

      // Görev bitiş tarihi geçmişse geciken görev sayısını artır
      if (moment(task.endDate).isBefore(moment())) {
        userTaskMap.get(user.id).delayedTasksCount += 1;
      }
    }
  });

  return userStore.users.map(user => ({
    userId: user.id,
    fullName: user.fullName,
    username: user.username,
    status: userTaskMap.get(user.id) ? userTaskMap.get(user.id).status : 'atanmış',
    delayedTasksCount: userTaskMap.get(user.id) ? userTaskMap.get(user.id).delayedTasksCount : 0,
    tasks: userTaskMap.get(user.id) ? userTaskMap.get(user.id).tasks : [],
  }));
});

const newUser = ref({
  name: "",
  fullName: "",
});

const formIsValid = ref(false);

const createNewUser = () => {
  const newId = new Date().getTime();
  userStore.users.unshift({
    id: newId,
    username: newUser.value.name,
    fullName: newUser.value.fullName,
    status: "atanmış",
    delayedTasksCount: 0,
  });

  newUser.value.name = "";
  newUser.value.fullName = "";
  userStore.dialog = false;
};

const viewTasks = (userId) => {
  const user = userTasks.value.find(user => user.userId === userId);
  if (user) {
    selectedUser.value = user;
    isTasksDialogOpen.value = true;
  }
};
</script>

<style>
.v-data-table__td {
  padding: 0 !important;
}
</style>
