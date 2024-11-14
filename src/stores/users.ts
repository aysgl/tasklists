import { defineStore } from "pinia";
interface UserTask {
  userId: number;
  fullName: string;
  username: string;
  status: string; // Add this line
  delayedTasksCount: number;
  tasks: Array<{
    title: string;
    startDate: string;
    endDate: string;
    description: string;
    assignedBy: string;
    assignedTo: string;
    status: string;
  }>;
}

interface User {
  id: number;
  username: string;
  fullName: string;
  tasks?: UserTask[];
}

export const useUsers = defineStore("user", {
  state: () => ({
    users: ref<User[]>([
      {
        id: 1,
        username: "Aysgl",
        fullName: "Ayşegül Avcu",
      },
      {
        id: 2,
        username: "ÇidoPat",
        fullName: "Çiğdem Alpat",
      },
      {
        id: 3,
        username: "MFS",
        fullName: "Mehmet Fatih Serdoğan",
      },
      {
        id: 4,
        username: "KayaBey",
        fullName: "Kaya Beşer",
      },
      {
        id: 5,
        username: "Deniz",
        fullName: "Deniz Yılmaz",
      },
      {
        id: 6,
        username: "MerveK",
        fullName: "Merve Kocabaş",
      },
      {
        id: 7,
        username: "HakanT",
        fullName: "Hakan Taş",
      },
      {
        id: 8,
        username: "Simge",
        fullName: "Simge Karaman",
      },
      {
        id: 9,
        username: "SerkanP",
        fullName: "Serkan Polat",
      },
      {
        id: 10,
        username: "LeylaY",
        fullName: "Leyla Yıldız",
      },
      {
        id: 11,
        username: "EfeBey",
        fullName: "Efe Bağcı",
      },
      {
        id: 12,
        username: "SedaD",
        fullName: "Seda Durmaz",
      },
      {
        id: 13,
        username: "GizemG",
        fullName: "Gizem Gürbüz",
      },
      {
        id: 14,
        username: "BarışS",
        fullName: "Barış Sarı",
      },
      {
        id: 15,
        username: "AliT",
        fullName: "Ali Tekin",
      },
    ]),
    dialog: false,
  }),

  actions: {
    addUser(user: User) {
      this.users.unshift(user);
    },
  },
});
