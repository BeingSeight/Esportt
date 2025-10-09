import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <aside className="w-64 flex-shrink-0 p-4 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin" className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800">
            Metrics Dashboard
          </Link>
          <Link href="/admin/leads" className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800">
            Prioritized Leads
          </Link>
          <Link href="/admin/operations" className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800">
            Operations
          </Link>
        </nav>
      </aside>

      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
}