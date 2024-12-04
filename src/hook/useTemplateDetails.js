import { useQuery} from "@tanstack/react-query";
import api from "../api/http";


const useTemplateDetails = (templateID) => {
    return useQuery({
        queryKey: ["templateDetails", templateID],
        queryFn: async () => {
            try {
                const response = await api.get(`/resumeDetail/${templateID}`);
                return response.data;
            } catch (err) {
                console.log(err);
                throw err; // cần ném lỗi ra để quản lý lỗi chính xác
            }
        },
        retry: 1,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
        onError: (error) => {
            console.error("Lỗi khi lấy chi tiết template:", error);
        },
        refetchOnWindowFocus: false
    });
};
export default useTemplateDetails;