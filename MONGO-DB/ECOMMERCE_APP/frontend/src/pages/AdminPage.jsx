import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productAPI, orderAPI, userAPI } from "../services/api";
import { formatPrice, formatDate, getStatusColor } from "../utils/helpers";
import { Spinner } from "../components/ui/Feedback";
import toast from "react-hot-toast";

const TABS = ["Products", "Orders", "Users"];

const AdminPage = () => {
  const [tab, setTab] = useState("Products");
  const qc = useQueryClient();

  const { data: products, isLoading: pLoad } = useQuery({
    queryKey: ["admin-products"],
    queryFn:  () => productAPI.getAll({ limit: 100 }).then((r) => r.data.products),
    enabled:  tab === "Products",
  });

  const { data: orders, isLoading: oLoad } = useQuery({
    queryKey: ["admin-orders"],
    queryFn:  () => orderAPI.getAll().then((r) => r.data),
    enabled:  tab === "Orders",
  });

  const { data: users, isLoading: uLoad } = useQuery({
    queryKey: ["admin-users"],
    queryFn:  () => userAPI.getAll().then((r) => r.data),
    enabled:  tab === "Users",
  });

  const deleteProduct = useMutation({
    mutationFn: productAPI.delete,
    onSuccess: () => { qc.invalidateQueries(["admin-products"]); toast.success("Product deleted"); },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => orderAPI.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries(["admin-orders"]); toast.success("Status updated"); },
  });

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Products Table */}
      {tab === "Products" && (
        <div className="admin-section">
          {pLoad ? <Spinner /> : (
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Brand</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products?.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.brand}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>{p.countInStock}</td>
                    <td>
                      <button
                        className="btn-danger-sm"
                        onClick={() => deleteProduct.mutate(p._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Orders Table */}
      {tab === "Orders" && (
        <div className="admin-section">
          {oLoad ? <Spinner /> : (
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders?.map((o) => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-8)}</td>
                    <td>{o.user?.name}</td>
                    <td>{formatPrice(o.totalPrice)}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus.mutate({ id: o._id, status: e.target.value })}
                        style={{ color: getStatusColor(o.status) }}
                      >
                        {["pending","processing","shipped","delivered","cancelled"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Users Table */}
      {tab === "Users" && (
        <div className="admin-section">
          {uLoad ? <Spinner /> : (
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Admin</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.isAdmin ? "✅" : "—"}</td>
                    <td>{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;