import api from "../api/http";


const getTemplateDetailEditByUser = async (uid, templateName) => {
    if (!uid || !templateName) {
        throw new Error("Invalid parameters: uid or templateName is undefined");
    }
    try {
        const response = await api.get(`/resumes/user/${uid}/resume/${templateName}`);
        console.log("data from backend", response.data);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching template detail: ${error.message}`);
    }
};

export default getTemplateDetailEditByUser;
