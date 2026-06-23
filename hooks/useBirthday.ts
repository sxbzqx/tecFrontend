import { useState, useEffect } from "react";
import { message } from "antd";
import { fetchUpcomingBirthdays } from "@/services/workerService";
import { $api } from "@/api/api";
import { Worker as IWorker } from "@/types/worker";

export const useBirthday = () => {
  const [data, setData] = useState<IWorker[]>([]);
  const [allWorkers, setAllWorkers] = useState<IWorker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [upcoming, allRes] = await Promise.all([
          fetchUpcomingBirthdays(),
          $api.get<IWorker[]>("/workers"),
        ]);

        // Сортировка: сегодня (первые) -> остальные по дате
        const todayDay = new Date().getDate();
        const sorted = [...upcoming].sort((a, b) => {
          const dayA = new Date(a.dr).getDate();
          const dayB = new Date(b.dr).getDate();
          if (dayA === todayDay) return -1;
          if (dayB === todayDay) return 1;
          return dayA - dayB;
        });

        setData(sorted);
        setAllWorkers(allRes.data);
      } catch (err: any) {
        message.error("Не удалось загрузить именинников: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { upcomingBirthdays: data, allWorkers, loading };
};