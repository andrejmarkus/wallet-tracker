import { use } from "react"
import api from "../lib/api";
import type { User } from "../types";
import { toast } from "react-toastify";

const fetchUsers = async () => {
    try {
        const res = await api.get('/users');
        return res.data.data.users as User[];
    } catch (error: any) {
        toast.error(`Error fetching users: ${error.message}`);
    }
};
const usersPromise = fetchUsers();

function Home() {
    const users = use(usersPromise);

    return (
        <div className="py-4 flex flex-col gap-4">
            {users && users.length > 0 && users.map((user) => (
                <div key={user.id} className="p-4 rounded base-100 shadow mb-2">
                    <h3 className="text-xl font-semibold">{user.username}</h3>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            ))}
        </div>
    );
}

export default Home;