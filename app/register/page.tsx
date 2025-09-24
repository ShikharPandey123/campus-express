"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Mail, User, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "WarehouseStaff",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  type Role = "Admin" | "Manager" | "WarehouseStaff";

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.terms) {
      alert("You must agree to Terms & Conditions");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-between p-8 lg:p-12">
        <div className="flex items-center">
          <Image src="/CE-3.jpg" alt="CX Logo" width={120} height={60} className="h-12 w-auto" priority />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <Image
              src="/CE-5.jpg"
              alt="Logistics illustration"
              width={400}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
            </div>
          </div>
          <span className="text-xl font-semibold text-gray-800">Campus Express</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-blue-900">Create Account!</h1>
            <p className="text-gray-600">Sign up to start managing your logistics</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-full text-gray-700"
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-full text-gray-700"
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <Select
                value={form.role}
                onValueChange={(value: Role) => updateField("role", value)}
              >
                <SelectTrigger className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-full text-gray-700">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WarehouseStaff">Warehouse Staff</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <UserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-full text-gray-700"
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={form.terms}
                onCheckedChange={(checked) => updateField("terms", !!checked)}
                className="rounded-sm mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                I agree to the{" "}
                <Link href="#" className="text-teal-500 hover:text-teal-600">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-teal-500 hover:text-teal-600">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white rounded-full font-semibold text-sm tracking-wide"
            >
              {loading ? "Signing up..." : "SIGN UP"}
            </Button>
          </form>
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-teal-500 hover:text-teal-600 font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
