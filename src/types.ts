export type VehicleType = "car" | "motorcycle" | "pickup" | "bus" | "boat";

export type CaseKind = "help" | "report" | "supply";

export type CaseStatus =
  | "รับเรื่องแล้ว"
  | "รอตรวจสอบ"
  | "กำลังตรวจสอบ"
  | "จ่ายงาน"
  | "กำลังเดินทาง"
  | "ถึงจุดเกิดเหตุ"
  | "ช่วยเหลือแล้ว";

export type CaseUrgency = "ปกติ" | "เฝ้าระวัง" | "เร่งด่วน";

export interface CreateCaseInput {
  kind: CaseKind;
  title: string;
  location: string;
  urgency?: CaseUrgency;
  status?: CaseStatus;
  detail?: string;
}

export interface FloodCase {
  id: string;
  kind: CaseKind;
  title: string;
  location: string;
  urgency: CaseUrgency;
  time: string;
  status: CaseStatus;
  detail: string;
}

export interface RouteEvaluation {
  vehicleLabel: string;
  status: string;
  distance: string;
  duration: string;
  warning: string;
  steps: string;
  caution: boolean;
}

export type ModalState =
  | { type: "help" }
  | { type: "report" }
  | { type: "supply" }
  | { type: "alerts" }
  | { type: "privacy" }
  | { type: "guide"; title: string };
