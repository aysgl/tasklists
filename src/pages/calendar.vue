<template>
  <FullCalendar ref="calendarRef" :options="calendarOptions" />

  <!-- Modal for creating/editing events -->
  <v-dialog v-model="missionStore.dialog" max-width="500px">
    <v-card :disabled="eventForm.id && eventForm.userId !== 1">
      <v-card-text>
        <p class="font-weight-bold mb-4">{{ modalTitle }}</p>
        <v-text-field v-model="eventForm.title" label="Event Title" variant="outlined" required />
        <v-textarea v-model="eventForm.description" label="Event Description" variant="outlined" required />

        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field v-model="formatStartDate" label="Start Date" type="datetime-local" :min="minDateTime"
              variant="outlined" />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="formatEndDate" label="End Date" type="datetime-local" :min="minDateTime"
              variant="outlined" />
          </v-col>
          <VCol cols="12" md="6">
            <VSelect variant="outlined" v-model="eventForm.assignedBy" :items="userStore.users" item-title="fullName"
              label="Atayan Kullanıcı" />
          </VCol>
          <VCol cols="12" md="6">
            <VSelect variant="outlined" v-model="eventForm.assignedTo" :items="userStore.users" item-title="fullName"
              label="Atanan Kullanıcı" />
          </VCol>
          <VCol cols="12" md="6">
            <VSelect variant="outlined" v-model="eventForm.priority" :items="['yüksek', 'orta', 'düşük']"
              label="Öncelik" />
          </VCol>

          <VCol cols="12" md="6">
            <VSelect variant="outlined" v-model="eventForm.status" :items="['atanmış', 'başarılı', 'başarısız']"
              label="Görev Durumu" />
          </VCol>
        </v-row>
        <v-card-actions class="pa-0 d-flex justify-end">
          <v-btn color="error" :prepend-icon="IconTrash" variant="flat" v-if="eventForm.id" @click="handleDeleteEvent">
            Delete
          </v-btn>
          <v-btn color="primary" variant="tonal" @click="closeModal">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="handleEvent">
            Save
          </v-btn>

        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useMission } from "@/stores/mission";
import { IconCalendarTime, IconCalendarCheck, IconTrash } from "@tabler/icons-vue";
import moment from "moment";
import { useUsers } from "@/stores/users";
import { getPriorityColor } from "@/utils/common";

const missionStore = useMission();
const userStore = useUsers()
const calendarRef = ref(null);
const minDateTime = ref(moment().format("YYYY-MM-DDTHH:mm"));

const modalTitle = ref("");

const eventForm = ref({
  id: null,
  title: "",
  start: new Date(),
  end: new Date(),
  description: "",
  assignedBy: "",
  assignedTo: "",
  priority: "",
  status: "",
  userId: 1,
});

const formatStartDate = computed({
  get() {
    return moment(eventForm.value.start).format("YYYY-MM-DDTHH:mm");
  },
  set(value) {
    eventForm.value.start = moment(value).toDate();
  },
});
const formatEndDate = computed({
  get() {
    return moment(eventForm.value.end).format("YYYY-MM-DDTHH:mm");
  },
  set(value) {
    eventForm.value.end = moment(value).toDate();
  },
});

// Handling Date Click Event
const handleDateClick = (arg) => {
  const clickedDate = new Date(arg.dateStr);

  if (clickedDate < new Date()) {
    alert("You cannot create an event for a past date.");
    return;
  }

  eventForm.value = {
    // id: null,
    title: "",
    start: clickedDate,
    end: clickedDate,
    description: "",
    assignedBy: "Ayşegül Avcu",
    assignedTo: "",
    priority: "",
    status: "atanmış",
    userId: 1,
  };
  modalTitle.value = "Create Event";
  missionStore.dialog = true;
};

// Handling Event Click for Editing
const handleEventClick = (info) => {
  eventForm.value = {
    id: info.event.id,
    title: info.event.title,
    start: new Date(info.event.start),
    end: new Date(info.event.end),
    description: info.event.extendedProps?.description,
    assignedBy: info.event.extendedProps?.assignedBy,
    assignedTo: info.event.extendedProps?.assignedTo,
    priority: info.event.extendedProps?.priority,
    status: info.event.extendedProps?.status,
    userId: info.event.extendedProps?.userId
  };
  modalTitle.value = "Edit Event";
  missionStore.dialog = true;
};

const handleEvent = async () => {
  console.log("Event Form Data:", eventForm.value);
  const calendarApi = calendarRef.value.getApi();

  if (eventForm.value.id) {
    const updatedEvent = {
      id: eventForm.value.id,
      title: eventForm.value.title,
      start: eventForm.value.start,
      end: eventForm.value.end,
      description: eventForm.value?.description,
      assignedBy: eventForm.value?.assignedBy,
      assignedTo: eventForm.value?.assignedTo,
      priority: eventForm.value?.priority,
      status: eventForm.value?.status,
      userId: eventForm.value?.userId,
    };


    await missionStore.updateTask(updatedEvent);

    const event = calendarApi.getEventById(eventForm.value.id);
    if (event) {
      event.setProp("title", updatedEvent.title);
      event.setDates(updatedEvent.start, updatedEvent.end);
      event.setExtendedProp("description", updatedEvent.description);
      event.setExtendedProp("assignedBy", updatedEvent.assignedBy);
      event.setExtendedProp("assignedTo", updatedEvent.assignedTo);
      event.setExtendedProp("priority", updatedEvent.priority);
      event.setExtendedProp("status", updatedEvent.status);
      event.setExtendedProp("userId", updatedEvent.userId);
    }
  } else {
    const newEvent = {
      id: Date.now(),
      title: eventForm.value.title,
      start: eventForm.value.start,
      end: eventForm.value.end,
      description: eventForm.value?.description,
      assignedBy: eventForm.value?.assignedBy,
      assignedTo: eventForm.value?.assignedTo,
      priority: eventForm.value?.priority,
      status: eventForm.value?.status,
      userId: eventForm.value?.userId,
    };
    calendarApi.addEvent(newEvent)
    await missionStore.addTask(newEvent);
  }

  closeModal();
};

const handleDeleteEvent = async () => {
  const calendarApi = calendarRef.value.getApi();
  const event = calendarApi.getEventById(eventForm.value.id);

  if (event) {
    event.remove();
    await missionStore.deleteTask(eventForm.value.id);
  }

  closeModal();
};



const closeModal = () => {
  eventForm.value = {};
  missionStore.dialog = false;
};

// Calendar Options
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
  },
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  events: missionStore.missions.map(mission => ({
    id: mission.id,
    title: mission.title,
    start: mission.startDate,
    end: mission.endDate,
    extendedProps: {
      description: mission.description,
      assignedBy: mission.assignedBy,
      assignedTo: mission.assignedTo,
      status: mission.status,
      priority: mission.priority,
      userId: mission.userId,
    },
    backgroundColor: getPriorityColor(mission.priority),
    borderColor: getPriorityColor(mission.priority),
    textColor: "#fff",
  })),
  eventContent: function (arg) {
    const bgColor = getPriorityColor(arg.event.extendedProps.priority);
    return {
      html: `
        <div class="bg-${bgColor}" style="line-height: 1.2; padding: 4px 8px; border-radius:3px">
          <strong>${arg.event.title}</strong><br>
          <small style="line-height: 1.4; display: block;">${arg.event.extendedProps?.description}</small>
        </div>
      `,
    };
  },
  minDate: moment().format("YYYY-MM-DD")
});

watch(
  () => missionStore.missions,
  (newVal) => {
    const calendarApi = calendarRef.value.getApi();
    calendarApi.refetchEvents();
  },
  { deep: true }
);

watch(
  () => missionStore.missions,
  (newMissions) => {
    calendarOptions.value.events = newMissions.map(mission => ({
      id: mission.id,
      title: mission.title,
      start: mission.startDate,
      end: mission.endDate,
      description: mission.description,
      extendedProps: {
        assignedBy: mission.assignedBy,
        assignedTo: mission.assignedTo,
        status: mission.status,
        priority: mission.priority,
        userId: mission.userId,
      }
    }));
  },
  { immediate: true }
);

</script>

<style>
.fc-daygrid-event {
  white-space: normal;
}

.fc-h-event {
  border: none;
}

.fc-icon {
  font-size: 1em !important;
  line-height: .5;
}
</style>
