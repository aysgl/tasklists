import { defineStore } from "pinia";

interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: "atanmış" | "başarılı" | "başarısız";
  priority: "düşük" | "orta" | "yüksek";
  startDate: string;
  endDate: string;
  completedDate?: string;
  comments?: string[];
  assignedTo: string;
  assignedBy: string;
}

interface User {
  id: number;
  username: string;
  fullName: string;
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
    // tasks: ref<Task[]>([
    //   {
    //     id: 1,
    //     userId: 1,
    //     title: "Planlama Toplantısı",
    //     description: "Yıllık hedeflerin belirlenmesi için toplantı yapılacak.",
    //     status: "atanmış",
    //     priority: "yüksek",
    //     startDate: "2024-11-15",
    //     endDate: "2024-11-15",
    //     assignedBy: "Ayşegül Avcu",
    //     assignedTo: "Mehmet Fatih Serdoğan",
    //   },
    //   {
    //     id: 2,
    //     userId: 4,
    //     title: "Aylık Raporlama",
    //     description: "Aylık performans raporunun hazırlanması ve sunulması.",
    //     status: "başarılı",
    //     priority: "orta",
    //     startDate: "2024-11-05",
    //     endDate: "2024-11-05",
    //     completedDate: "2024-11-04",
    //     assignedBy: "Kaya Beşer",
    //     assignedTo: "Efe Bağcı",
    //   },
    //   {
    //     id: 3,
    //     userId: 3,
    //     title: "Eğitim Planı Hazırlığı",
    //     description: "Yeni çalışanlar için eğitim planının oluşturulması.",
    //     status: "atanmış",
    //     priority: "yüksek",
    //     startDate: "2024-11-18",
    //     endDate: "2024-11-18",
    //     assignedBy: "Ayşegül Avcu",
    //     assignedTo: "Ali Tekin",
    //   },
    //   {
    //     id: 4,
    //     userId: 4,
    //     title: "Müşteri Sunumu",
    //     description: "Müşteri için ürün sunumunun hazırlanması ve yapılması.",
    //     status: "atanmış",
    //     priority: "yüksek",
    //     startDate: "2024-11-20",
    //     endDate: "2024-11-20",
    //     assignedBy: "Simge Karaman",
    //     assignedTo: "Mehmet Fatih Serdoğan",
    //   },
    //   {
    //     id: 5,
    //     userId: 5,
    //     title: "Yıllık Bütçe Raporu",
    //     description:
    //       "Yıllık bütçe planlamasının gözden geçirilmesi ve raporlanması.",
    //     status: "başarılı",
    //     priority: "orta",
    //     startDate: "2024-11-10",
    //     endDate: "2024-11-10",
    //     completedDate: "2024-11-08",
    //     assignedBy: "Kaya Beşer",
    //     assignedTo: "Mehmet Fatih Serdoğan",
    //   },
    //   {
    //     id: 6,
    //     userId: 7,
    //     title: "Yeni Yazılım Entegrasyonu",
    //     description:
    //       "Yeni yazılımın mevcut sisteme entegrasyonu ve test edilmesi.",
    //     status: "başarısız",
    //     priority: "yüksek",
    //     startDate: "2024-11-12",
    //     endDate: "2024-11-12",
    //     assignedBy: "Hakan Taş",
    //     assignedTo: "Seda Durmaz",
    //   },
    //   {
    //     id: 7,
    //     userId: 10,
    //     title: "Müşteri Görüşmesi",
    //     description: "Müşteri ile düzenli haftalık görüşme yapılacak.",
    //     status: "atanmış",
    //     priority: "düşük",
    //     startDate: "2024-11-14",
    //     endDate: "2024-11-14",
    //     assignedBy: "Leyla Yıldız",
    //     assignedTo: "Kaya Beşer",
    //   },
    //   {
    //     id: 8,
    //     userId: 1,
    //     title: "SEO Optimizasyonu",
    //     description: "Web sitesinin SEO uyumlu hale getirilmesi.",
    //     status: "atanmış",
    //     priority: "orta",
    //     startDate: "2024-11-17",
    //     endDate: "2024-11-17",
    //     assignedBy: "Ayşegül Avcu",
    //     assignedTo: "Hakan Taş",
    //   },
    // ]),
    dialog: false,
  }),

  // getters: {
  //   getUserTaskStatus: (state) => {
  //     return (userId: number) => {
  //       const userTasks = state.tasks.filter((task) => task.userId === userId);
  //       if (userTasks.every((task) => task.status === "başarılı"))
  //         return "başarılı";
  //       if (userTasks.some((task) => task.status === "başarısız"))
  //         return "başarısız";
  //       return "atanmış";
  //     };
  //   },

  //   calculateDelayedTasks: (state) => {
  //     const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
  //     return (userId: number) => {
  //       return state.tasks.filter(
  //         (task) =>
  //           task.userId === userId &&
  //           task.status === "atanmış" &&
  //           task.endDate < today &&
  //           task.completedDate &&
  //           task.completedDate > task.endDate // Task completed after the end date
  //       ).length;
  //     };
  //   },

  //   isTaskDelayed: (state) => {
  //     return (taskId: number) => {
  //       const task = state.tasks.find((task) => task.id === taskId);
  //       if (task && task.endDate < new Date().toISOString().split("T")[0]) {
  //         return task.status === "atanmış";
  //       }
  //       return false;
  //     };
  //   },

  //   enrichedTasks: (state) => {
  //     return state.tasks.map((task) => {
  //       const user = state.users.find((user) => user.id === task.userId);
  //       return {
  //         ...task,
  //         userName: user?.fullName,
  //         userUsername: user?.username,
  //         delayed: (state as any).isTaskDelayed(task.id),
  //       };
  //     });
  //   },

  //   enrichedUsers: (state) => {
  //     return state.users.map((user) => ({
  //       ...user,
  //       status: (state as any).getUserTaskStatus(user.id),
  //       delayedTasksCount: (state as any).calculateDelayedTasks(user.id),
  //     }));
  //   },
  // },

  actions: {
    addUser(user: User) {
      this.users.unshift(user);
    },
    // addTask(task: Task) {
    //   this.tasks.push(task);
    // },
    // updateTaskStatus(taskId: number, status: Task["status"]) {
    //   const task = this.tasks.find((task) => task.id === taskId);
    //   if (task) {
    //     task.status = status;
    //   }
    // },
  },
});
