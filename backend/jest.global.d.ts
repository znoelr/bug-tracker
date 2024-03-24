import { DBRecords } from "./src/modules/common/types/db-records";

declare global {
  var records: DBRecords;
  var signin: (userId: string) => string[];
}