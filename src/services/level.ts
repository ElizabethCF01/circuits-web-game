import api from "./api";
import type {
  LevelListResponse,
  LevelListParams,
  ApiLevelDetail,
  LevelCompleteResponse,
  ValidateLevelRequest,
  ValidateLevelResponse,
  ReachabilityRequest,
  ReachabilityResponse,
} from "../types/level";

export async function getLevels(
  params?: LevelListParams
): Promise<LevelListResponse> {
  const response = await api.get<LevelListResponse>("/levels", { params });
  return response.data;
}

export async function getLevel(levelId: number): Promise<ApiLevelDetail> {
  const response = await api.get<{ level: ApiLevelDetail }>(
    `/levels/${levelId}`
  );
  return response.data.level;
}

export async function completeLevel(
  levelId: number,
  commands: string[]
): Promise<LevelCompleteResponse> {
  const response = await api.post<LevelCompleteResponse>(
    `/levels/${levelId}/complete`,
    { commands }
  );
  return response.data;
}

export async function validateLevel(
  data: ValidateLevelRequest
): Promise<ValidateLevelResponse> {
  const response = await api.post<ValidateLevelResponse>(
    "/levels/validate",
    data
  );
  return response.data;
}

export async function checkReachability(
  data: ReachabilityRequest
): Promise<ReachabilityResponse> {
  const response = await api.post<ReachabilityResponse>(
    "/levels/reachability",
    data
  );
  return response.data;
}
