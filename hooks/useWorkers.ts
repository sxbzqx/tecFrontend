import { useQuery } from "@tanstack/react-query";
import { fetchWorkers } from "@/services/workerService"; 

export const useWorkers = () => {
  return useQuery({
    queryKey: ["workers"],
    queryFn: fetchWorkers,
    staleTime: 5 * 60000, 
  });
};