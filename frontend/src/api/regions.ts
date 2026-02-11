import api, { USE_MOCK } from './axios';
import type { ApiResponse } from '../types/common';
import type { RegionListResult } from '../types/region';
import { MOCK_REGIONS_RESPONSE } from '../mock/region';

export const fetchRegions = async (): Promise<ApiResponse<RegionListResult>> => {
  if (USE_MOCK) {
    console.log('[MOCK] 지역 목록 요청');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_REGIONS_RESPONSE);
      }, 500);
    });
  }

  console.log('[API] 지역 목록 요청');
  const response = await api.get<ApiResponse<RegionListResult>>('/api/v1/regions');
  return response.data; 
};


// API만 fetch할 경우
// export const fetchRegions = async () => {
//   const response = await api.get<ApiResponse<RegionListResult>>('/api/v1/regions');
//   return response.data;
// };