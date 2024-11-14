import { defineStore } from "pinia";

interface Mission {
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

export const useMission = defineStore("mission", {
  state: () => ({
    missions: ref<Mission[]>([
      {
        id: 1,
        userId: 1,
        title: "Planlama Toplantısı",
        description: "Yıllık hedeflerin belirlenmesi için toplantı yapılacak.",
        status: "atanmış",
        priority: "yüksek",
        startDate: "2024-11-15",
        endDate: "2024-11-15",
        assignedBy: "Ayşegül Avcu",
        assignedTo: "Mehmet Fatih Serdoğan",
      },
      {
        id: 2,
        userId: 4,
        title: "Aylık Raporlama",
        description: "Aylık performans raporunun hazırlanması ve sunulması.",
        status: "başarılı",
        priority: "orta",
        startDate: "2024-11-05",
        endDate: "2024-11-05",
        completedDate: "2024-11-04",
        assignedBy: "Kaya Beşer",
        assignedTo: "Efe Bağcı",
      },
      {
        id: 3,
        userId: 1,
        title: "Eğitim Planı Hazırlığı",
        description: "Yeni çalışanlar için eğitim planının oluşturulması.",
        status: "atanmış",
        priority: "yüksek",
        startDate: "2024-11-18",
        endDate: "2024-11-18",
        assignedBy: "Ayşegül Avcu",
        assignedTo: "Ali Tekin",
      },
      {
        id: 4,
        userId: 4,
        title: "Müşteri Sunumu",
        description: "Müşteri için ürün sunumunun hazırlanması ve yapılması.",
        status: "atanmış",
        priority: "yüksek",
        startDate: "2024-11-20",
        endDate: "2024-11-20",
        assignedBy: "Simge Karaman",
        assignedTo: "Mehmet Fatih Serdoğan",
      },
      {
        id: 5,
        userId: 5,
        title: "Yıllık Bütçe Raporu",
        description:
          "Yıllık bütçe planlamasının gözden geçirilmesi ve raporlanması.",
        status: "başarılı",
        priority: "orta",
        startDate: "2024-11-10",
        endDate: "2024-11-10",
        completedDate: "2024-11-08",
        assignedBy: "Kaya Beşer",
        assignedTo: "Mehmet Fatih Serdoğan",
      },
      {
        id: 6,
        userId: 7,
        title: "Yeni Yazılım Entegrasyonu",
        description:
          "Yeni yazılımın mevcut sisteme entegrasyonu ve test edilmesi.",
        status: "başarısız",
        priority: "düşük",
        startDate: "2024-11-12",
        endDate: "2024-11-12",
        assignedBy: "Hakan Taş",
        assignedTo: "Seda Durmaz",
      },
      {
        id: 7,
        userId: 10,
        title: "Müşteri Görüşmesi",
        description: "Müşteri ile düzenli haftalık görüşme yapılacak.",
        status: "atanmış",
        priority: "düşük",
        startDate: "2024-11-14",
        endDate: "2024-11-14",
        assignedBy: "Leyla Yıldız",
        assignedTo: "Kaya Beşer",
      },
      {
        id: 8,
        userId: 1,
        title: "SEO Optimizasyonu",
        description: "Web sitesinin SEO uyumlu hale getirilmesi.",
        status: "atanmış",
        priority: "düşük",
        startDate: "2024-11-17",
        endDate: "2024-11-17",
        assignedBy: "Ayşegül Avcu",
        assignedTo: "Hakan Taş",
      },
    ]),
    dialog: false,
  }),
  actions: {
    addTask(task: any) {
      this.missions.push(task);
    },
    deleteTask(taskId: number) {
      const index = this.missions.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        this.missions.splice(index, 1);
      }
    },
    updateTask(updatedTask: any) {
      const index = this.missions.findIndex(
        (t) => String(t.id) === String(updatedTask.id)
      );

      if (index !== -1) {
        this.missions[index] = { ...this.missions[index], ...updatedTask };
      } else {
        console.error("Task not found for update:", updatedTask.id);
      }
    },
  },
});
