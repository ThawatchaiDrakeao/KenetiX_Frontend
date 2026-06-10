import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [search, setSearch] = useState("");
    const [rankFilter, setRankFilter] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, [search, rankFilter]);

    const fetchUsers = async () => {
        try {
            const response = await API.get("/admin/users", {
                params: { search, rank: rankFilter }
            });
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRank = async (userId, newRank) => {
        try {
            await API.patch(`/admin/users/${userId}/rank`, { rank: newRank });
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error("Error updating rank:", error);
        }
    };

    if (loading) return <div className="p-4">Loading users...</div>;

    return (
        <div className="rounded-2xl p-5 bg-white border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">User Management</h3>

            {/* Filters */}
            <div className="flex gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                />
                <select
                    value={rankFilter}
                    onChange={(e) => setRankFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                >
                    <option value="all">All Ranks</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                    <option value="Diamond">Diamond</option>
                </select>
            </div>

            {/* Users List */}
            <div className="space-y-3">
                {users.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className="p-4 border rounded-xl cursor-pointer hover:bg-gray-50"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{user.name} {user.surname}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-xs text-gray-400">Phone: {user.phone || "-"}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs ${user.userRank === "Diamond" ? "bg-purple-100 text-purple-800" :
                                        user.userRank === "platinum" ? "bg-gray-200 text-gray-800" :
                                            user.userRank === "gold" ? "bg-yellow-100 text-yellow-800" :
                                                user.userRank === "silver" ? "bg-gray-100 text-gray-600" :
                                                    "bg-amber-100 text-amber-800"
                                    }`}>
                                    {user.userRank}
                                </span>
                                <p className="text-sm mt-1">{user.memberPoints || 0} points</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h4 className="font-semibold text-lg">User Details</h4>
                            <button onClick={() => setSelectedUser(null)} className="text-gray-500">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 text-sm">Name</p>
                                <p>{selectedUser.name} {selectedUser.surname}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Email</p>
                                <p>{selectedUser.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Phone</p>
                                <p>{selectedUser.phone || "-"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Address</p>
                                <p>{selectedUser.address || "-"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Member Rank</p>
                                <select
                                    value={selectedUser.userRank}
                                    onChange={(e) => updateUserRank(selectedUser._id, e.target.value)}
                                    className="mt-1 px-3 py-2 border rounded-lg"
                                >
                                    <option value="bronze">Bronze</option>
                                    <option value="silver">Silver</option>
                                    <option value="gold">Gold</option>
                                    <option value="platinum">Platinum</option>
                                    <option value="Diamond">Diamond</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Points Balance</p>
                                <p>{selectedUser.memberPoints} points</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Rental Summary</p>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-xs">Currently Renting</p>
                                        <p className="font-bold">{selectedUser.dashboardSummary?.currentlyRentingCount || 0}</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-xs">Total Rentals</p>
                                        <p className="font-bold">{selectedUser.dashboardSummary?.totalRentalsCount || 0}</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-xs">Total Spent</p>
                                        <p className="font-bold">฿{selectedUser.dashboardSummary?.totalSpent?.toLocaleString() || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}