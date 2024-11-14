export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "yüksek":
      return "error";
    case "orta":
      return "warning";
    case "düşük":
      return "primary";
    default:
      return "primary";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "atanmış":
      return "primary";
    case "başarılı":
      return "success";
    case "başarısız":
      return "error";
    default:
      return "grey";
  }
};

export const formatDate = (date: Date) => {};
