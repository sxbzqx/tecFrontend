
import { $api } from "@/api/api"; 
import { Worker as IWorker } from "@/types/worker";


export async function fetchUpcomingBirthdays(): Promise<IWorker[]> {
  
  const response = await $api.get<IWorker[]>("/workers/birthdays");
  return response.data;
}


export async function fetchWorkers(): Promise<IWorker[]> {
  const response = await $api.get<IWorker[]>("/workers");
  return response.data;
}
