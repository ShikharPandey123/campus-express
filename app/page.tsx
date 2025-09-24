import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="mb-8 flex items-center gap-3">
        <Image
          src="/CE-3.jpg"
          alt="Campus Express Logo"
          width={80}
          height={80}
          className="rounded-lg"
          priority
        />
        <h1 className="text-3xl font-bold text-blue-900">Campus Express</h1>
      </div>
      <div className="text-center max-w-xl space-y-4 mb-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Manage Shipments, Warehouses & Inventory Seamlessly
        </h2>
        <p className="text-gray-600">
          Campus Express is your all-in-one logistics management solution.  
          Track shipments, monitor warehouse capacity, and manage inventory  
          with ease.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-900 text-white rounded-full font-medium hover:bg-blue-800 transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 bg-gray-100 text-blue-900 border border-gray-300 rounded-full font-medium hover:bg-gray-200 transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
