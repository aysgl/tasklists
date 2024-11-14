<template>
  <v-layout height="100%">
    <v-navigation-drawer color="white" v-model="drawer" temporary>
      <v-divider></v-divider>
      <v-list>
        <v-list-item class="py-4" title="Dashboard" to="/">
          <template v-slot:prepend>
            <IconCategoryPlus class="text-primary me-2" />
          </template>
        </v-list-item>
        <v-list-item class="py-4" title="Missions" to="/missions">
          <template v-slot:prepend>
            <IconFolders class="text-warning me-2" />
          </template>
        </v-list-item>
        <v-list-item class="py-4" title="Calendar" to="/calendar">
          <template v-slot:prepend>
            <IconCalendar class="text-success me-2" />
          </template>
        </v-list-item>
        <v-list-item class="py-4" title="Users" to="/users">
          <template v-slot:prepend>
            <IconUsers class="text-error me-2" />
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <VContainer>
        <AppHeader @toggle-drawer="drawer = !drawer" />
        <router-view></router-view>
      </VContainer>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { IconCategoryPlus, IconFolders, IconUsers, IconCalendar } from "@tabler/icons-vue";
import { useUsers } from "@/stores/users";
import { useMission } from "@/stores/mission";

const userStore = useUsers();
const missionStore = useMission();
const drawer = ref(false);
</script>
