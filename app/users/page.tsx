"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const userSchema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Admin", "Manager", "WarehouseStaff"]),
});

type UserFormData = z.infer<typeof userSchema>;

interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const mockUsers: User[] = [
  { id: 1, name: "Admin User", email: "admin@example.com", role: "Admin", status: "active" },
  { id: 2, name: "Logistics Manager", email: "manager@example.com", role: "Manager", status: "active" },
  { id: 3, name: "Delivery Agent 1", email: "agent1@example.com", role: "WarehouseStaff", status: "active" },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [deleteUserId, setDeleteUserId] = useState<number | string | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", password: "", role: "WarehouseStaff" },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setFetchingUsers(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, using mock data");
          setUsers(mockUsers);
          return;
        }

        console.log("Fetching users from API...");
        const res = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const fetchedUsers = await res.json();
          console.log("Fetched users:", fetchedUsers);
        
          const validUsers = fetchedUsers
            .filter((user: Partial<User & { _id?: string }>) => user && typeof user.name === 'string' && user.name.trim() !== '')
            .map((user: Partial<User & { _id?: string }>) => ({
              id: user._id || user.id || 0,
              name: user.name || '',
              email: user.email || '',
              role: user.role || 'WarehouseStaff',
              status: user.status || 'active'
            })) as User[];
          
          setUsers(validUsers.length > 0 ? validUsers : mockUsers);
        } else {
          console.log("API request failed, using mock data");
          setUsers(mockUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers(mockUsers);
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add user");
      }

      const response = await res.json();
    //   console.log("API response:", response);
      const newUser = response.user || response;
    //   console.log("New user data:", newUser);
      const mappedUser: User = {
        id: newUser._id || newUser.id || Date.now(),
        name: newUser.name || data.name,
        email: newUser.email || data.email,
        role: newUser.role || data.role,
        status: newUser.status || 'active'
      };
      
      console.log("Adding user to state:", mappedUser);
      setUsers((prev) => {
        console.log("Previous users:", prev);
        const newUsers = [...prev, mappedUser];
        console.log("New users list:", newUsers);
        return newUsers;
      });
      setTableKey(prev => prev + 1);
      toast.success(`User ${mappedUser.name} created successfully.`);
      form.reset();
      setShowPassword(false);
      setDialogOpen(false);
    } catch (err: unknown) {
      const errorMessage = (err as Error).message;
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number | string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("User deleted successfully.");
    } catch (err: unknown) {
      const errorMessage = (err as Error).message;
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const confirmDeleteUser = (userId: number | string) => {
    setDeleteUserId(userId);
  };

  const filteredUsers = users.filter((user) => {
    if (!user || !user.name) {
      return false;
    }
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              form.reset();
              setShowPassword(false);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800 text-white shadow-sm">
                <span className="mr-2">+</span>
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] bg-white border border-gray-200 shadow-xl overflow-y-auto">
              <DialogHeader className="border-b border-gray-200 pb-4">
                <DialogTitle className="text-xl font-semibold text-gray-900">Add New User</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">Fill in the details to create a new user account</p>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4 pb-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                          placeholder="Enter full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          {...field} 
                          className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                          placeholder="Enter email address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            {...field} 
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white px-3 py-2 pr-10 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                            placeholder="Enter password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem className="mb-8">
                      <FormLabel className="text-sm font-medium text-gray-700">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent 
                          position="popper" 
                          side="bottom" 
                          align="start" 
                          className="z-[200] bg-white border border-gray-200 shadow-lg min-w-[200px]"
                          sideOffset={4}
                          avoidCollisions={true}
                          sticky="always"
                        >
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="WarehouseStaff">Warehouse Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <div className="flex gap-3 pt-8 mt-6 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setDialogOpen(false);
                        form.reset();
                        setShowPassword(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="flex-1 bg-blue-900 hover:bg-blue-800 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </span>
                      ) : "Add User"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden" key={tableKey}>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-gray-50">
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Role</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={`user-${user.id || index}`} className="border-gray-200 hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                  <TableCell className="text-gray-700">{user.role}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={user.status === "active" 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => confirmDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && !fetchingUsers && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </TableCell>
                </TableRow>
              )}
              {fetchingUsers && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteUserId !== null} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent className="bg-white border border-gray-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteUserId) {
                  handleDeleteUser(deleteUserId);
                  setDeleteUserId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
