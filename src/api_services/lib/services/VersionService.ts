import axiosInstance from "../AxiosInstance";

export interface PostVersion  {
    platform: string;
    current_version: string;
}
export interface ResponseData {
    latest_version: string;
    update_required: boolean;
    force_update: boolean;
    download_url: string;
}

export const fetchAppVersion = async (data:PostVersion): Promise<ResponseData> => {
  const res = await axiosInstance.post('/app/check-app-version', data);
  return res.data;
};
