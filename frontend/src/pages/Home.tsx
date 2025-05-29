import { useEffect, useState } from "react"
import api from "../lib/api";
import { toast } from "react-toastify";

const Home = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const repsonse = await api.get('/users');
            if (repsonse.status === 200) {
                setUsers(repsonse.data.data.users);
                console.log(repsonse.data);
            } else {
                toast.error("Failed to fetch users", repsonse.data);
            }
        }

        getUsers();
    }, []);

  return (
    <>
        {users.length > 0 && users.map((user) => (
            <div key={user.id} className="p-4 border rounded mb-2">
                <h3 className="text-xl font-semibold">{user.username}</h3>
                <p className="text-gray-600">{user.email}</p>
            </div>
        ))}
    </>
  )
}

export default Home