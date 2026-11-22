import type { CreateCaseInput, CaseStatus, FloodCase, RouteEvaluation, VehicleType } from "../types";

export interface WaterHistory {
  station: string;
  unit: string;
  window: string;
  points: { time: string; levelCm: number; confidence: string }[];
  mode: "mock";
  source: string;
}

export interface ReservoirSummary {
  id: string;
  name: string;
  levelPercent: number;
  trend: string;
  updatedAt: string;
  confidence: string;
}

interface ApiErrorBody {
  error?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({})) as ApiErrorBody;
    throw new Error(errorBody.error ?? `Mock API ตอบกลับ ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const floodApi = {
  async health() {
    return request<{ status: "ok"; mode: "mock"; message: string }>("/api/health");
  },

  async listCases() {
    const result = await request<{ cases: FloodCase[] }>("/api/cases");
    return result.cases;
  },

  async createCase(input: CreateCaseInput) {
    const endpoint = input.kind === "help"
      ? "/api/help-requests"
      : input.kind === "supply"
        ? "/api/supply-requests"
        : "/api/reports";
    const result = await request<{ case: FloodCase }>(endpoint, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return result.case;
  },

  async updateCaseStatus(id: string, status: CaseStatus) {
    const result = await request<{ case: FloodCase }>(`/api/cases/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return result.case;
  },

  async evaluateRoute(vehicle: VehicleType, destination: string) {
    const query = new URLSearchParams({ vehicle, destination });
    const result = await request<{ evaluation: RouteEvaluation }>(`/api/routes/evaluate?${query}`);
    return result.evaluation;
  },

  async waterHistory() {
    return request<WaterHistory>("/api/water-levels/history");
  },

  async reservoirs() {
    const result = await request<{ reservoirs: ReservoirSummary[] }>("/api/reservoirs");
    return result.reservoirs;
  },
};
