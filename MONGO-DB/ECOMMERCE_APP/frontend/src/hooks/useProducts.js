import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productAPI } from "../services/api";
import toast from "react-hot-toast";

// Fetch paginated/filtered products
export const useProducts = (params) =>
  useQuery({
    queryKey: ["products", params],
    queryFn:  () => productAPI.getAll(params).then((r) => r.data),
  });

// Fetch single product
export const useProduct = (id) =>
  useQuery({
    queryKey: ["product", id],
    queryFn:  () => productAPI.getById(id).then((r) => r.data),
    enabled:  !!id,
  });

// Fetch featured products
export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn:  () => productAPI.getFeatured().then((r) => r.data),
  });

// Add a review
export const useAddReview = (productId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => productAPI.addReview(productId, data),
    onSuccess:  () => {
      queryClient.invalidateQueries(["product", productId]);
      toast.success("Review submitted!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to submit review"),
  });
};