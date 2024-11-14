<template>
  <v-row align="center" justify="end">
    <v-col cols="auto" class="d-flex align-center font-weight-bold">
      <IconMenu @click.stop="handleIconMenuClick" class="me-2" />
      NARBULUT
    </v-col>
    <v-col cols="auto">
      <v-breadcrumbs :items="breadcrumbs" class="mx-4"> </v-breadcrumbs>
    </v-col>
    <v-col class="d-flex justify-end">
      <VBtn icon elevation="0" color="primary" variant="tonal" class="me-2" @click="handleAddClick">+
      </VBtn>
      <v-btn icon color="primary" elevation="0">
        <v-avatar color="primary">
          <span class="text-white">AA</span>
        </v-avatar>
        <v-menu activator="parent">
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index" :value="index" @click="handleMenuItemClick(item)">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-col>
  </v-row>

  <h1 class="text-h2 mb-6 text-capitalize"> {{ route.name == "/" ? "Dashboard" : route.name.slice(1) }} </h1>
</template>

<script setup>
import { useMission } from "@/stores/mission";
import { useUsers } from "@/stores/users";
import { IconMenu, IconHomeFilled } from "@tabler/icons-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const userStore = useUsers();
const missionStore = useMission();
const emit = defineEmits();

const items = [
  { title: "Profil Güncelle", action: "changeProfile" },
  { title: "Logout", action: "logout" },
];

const missionOpen = ref(false);

const toggleMissionSubItems = () => {
  missionOpen.value = !missionOpen.value;
};

const handleIconMenuClick = () => {
  emit("toggle-drawer");
};

const handleMenuItemClick = (item) => {
  if (item.action === "logout") {
    logout();
  } else if (item.action === "changeProfile") {
    changeProfile();
  }
};

const logout = () => {
  console.log("User logged out");
  router.push({ path: "/login" });
};

const changeProfile = () => {
  console.log("Change profile");
};

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split("/").filter(Boolean);

  const breadcrumbItems = [
    { title: "Dashboard", to: "/" },
    ...pathSegments.map((segment, index) => {
      const accumulatedPath = "/" + pathSegments.slice(0, index + 1).join("/");
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        to: accumulatedPath,
      };
    }),
  ];

  return breadcrumbItems;
});

const handleAddClick = () => {
  switch (route.name) {
    case "/":
      missionStore.dialog = true;
      break;
    case "/missions":
      missionStore.dialog = true;
      break;
    case "/calendar":
      missionStore.dialog = true;
      break;
    case "/users":
      userStore.dialog = true;
      break;
    default:
      console.log("Default action");
  }
};
</script>
