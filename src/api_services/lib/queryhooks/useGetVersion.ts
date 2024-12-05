import { useMutation } from "react-query";
import { fetchAppVersion, PostVersion, ResponseData } from "../services/VersionService";




export const useGetVersion = () => {
  return useMutation<ResponseData, unknown, PostVersion>(
    fetchAppVersion,
    {
        onSuccess: (data) => {
            console.log("Get version successfully", data);
        },
        onError: (error) => {
            console.error("Failed to get version", error);
        },
    },
  );
};