import { Table } from "antd";
import { birthdayColumns } from "./birthdayColumns";
import { Worker as IWorker } from "@/types/worker";

export const BirthdayTable = ({ data, loading }: { data: IWorker[], loading: boolean }) => (
  <Table
    columns={birthdayColumns}
    dataSource={data}
    rowKey="id"
    loading={loading}
    pagination={false}
    size="middle"
    locale={{ emptyText: "На сегодня и завтра именинников нет." }}
  />
);