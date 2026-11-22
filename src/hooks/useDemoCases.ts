import { useEffect, useMemo, useState } from "react";
import { initialCases } from "../data/demoData";
import type { CaseKind, CaseStatus, CaseUrgency, FloodCase } from "../types";
import { floodApi } from "../services/api";

export type BackendStatus = "connecting" | "connected" | "offline";

export function useDemoCases() {
  const [cases, setCases] = useState<FloodCase[]>(initialCases);
  const [nextId, setNextId] = useState(2405);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("connecting");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        await floodApi.health();
        const apiCases = await floodApi.listCases();
        if (!active) return;
        setCases(apiCases);
        setBackendStatus("connected");
      } catch {
        if (active) setBackendStatus("offline");
      }
    })();
    return () => { active = false; };
  }, []);

  const createCase = async (input: { kind: CaseKind; title: string; location: string; urgency?: CaseUrgency; status?: CaseStatus; detail?: string }) => {
    try {
      const created = await floodApi.createCase(input);
      setCases((items) => [created, ...items]);
      setBackendStatus("connected");
      return created;
    } catch {
      setBackendStatus("offline");
    }

    const newCase: FloodCase = {
      id: `FM-DEMO-${nextId}`,
      kind: input.kind,
      title: input.title,
      location: input.location,
      urgency: input.urgency ?? "ปกติ",
      time: `${new Intl.DateTimeFormat("th-TH", { hour: "2-digit", minute: "2-digit" }).format(new Date())} น.`,
      status: input.status ?? "รับเรื่องแล้ว",
      detail: input.detail ?? "",
    };
    setNextId((id) => id + 1);
    setCases((items) => [newCase, ...items]);
    return newCase;
  };

  const updateCaseStatus = async (id: string, status: CaseStatus) => {
    setCases((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    try {
      const updated = await floodApi.updateCaseStatus(id, status);
      setCases((items) => items.map((item) => item.id === id ? updated : item));
      setBackendStatus("connected");
    } catch {
      setBackendStatus("offline");
    }
  };

  const metrics = useMemo(() => ({
    openCases: cases.filter((item) => item.kind !== "supply" && item.status !== "ช่วยเหลือแล้ว").length,
    urgentCases: cases.filter((item) => item.kind === "help" && item.urgency === "เร่งด่วน" && item.status !== "ช่วยเหลือแล้ว").length,
    supplyCases: cases.filter((item) => item.kind === "supply" && item.status !== "ช่วยเหลือแล้ว").length,
    pendingReports: cases.filter((item) => item.kind === "report" && !["ถึงจุดเกิดเหตุ", "ช่วยเหลือแล้ว"].includes(item.status)).length,
  }), [cases]);

  return { cases, createCase, updateCaseStatus, metrics, backendStatus };
}
