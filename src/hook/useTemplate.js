import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../api/http";

const useTemplate = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      try {
        const response = await api.get("/templates");
        console.log(response.data);
        return response.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    onError: (error) => {
      console.error("Error fetching templates:", error);
      if (error.response && error.response.status === 400) {
        window.location.replace("login");
      }
    },
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async ({ templateDTO, file }) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", templateDTO.name);
      formData.append("title", templateDTO.title);

      const response = await api.post("/templates-add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("templates");
      toast.success("Template created successfully");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/templates-del/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("templates");
      toast.success("Template deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
    mutation,
    deleteMutation,
  };
};

export default useTemplate;

