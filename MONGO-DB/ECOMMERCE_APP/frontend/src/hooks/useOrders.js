import { useQuery, useMutation } from "@tanstack/react-query";
import { orderAPI } from "../services/api";
import toast from "react-hot-toast";

export const useMyOrders = () =>
  useQuery({
    queryKey: ["orders", "my"],
    queryFn:  () => orderAPI.getMyOrders().then((r) => r.data),
  });

export const useOrder = (id) =>
  useQuery({
    queryKey: ["order", id],
    queryFn:  () => orderAPI.getById(id).then((r) => r.data),
    enabled:  !!id,
  });

export const useCreateOrder = () =>
  useMutation({
    mutationFn: orderAPI.create,
    onError: (err) => toast.error(err.response?.data?.message || "Order failed"),
  });