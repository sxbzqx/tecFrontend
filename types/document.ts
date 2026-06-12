export interface Document {
  id: number;
  idPerUser: number;
  idUser: string;
  idResource: number;
  amount: number | null;
  dateFirst: string;
  dateReshenie: string | null;
  userReshenie: string;
  commentReshenie: string;
  action: number;
  idReceiver: string;
  archive: number;
  comment: string | null;
  made: number;
  dateVyp: string | null;
  format: string;
}