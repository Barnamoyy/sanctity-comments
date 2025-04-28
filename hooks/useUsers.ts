import { useState } from "react";
import { Users } from "@/types/user";
import { userService } from "@/services/userService";

export const useUsers = () => {
  const [users, setUsers] = useState<Users>([]);

  const getUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createUser = async (userData: {
    creatorUserId: string;
    name: string;
    email: string;
    imageUrl: string;
  }) => {
    try {
      await userService.createUser(userData);
      await getUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const getThreadUser = (creatorUserId: string) => {
    return users.find((user) => user.creatorUserId === creatorUserId);
  };

  return {
    users,
    getUsers,
    createUser,
    getThreadUser,
  };
}; 