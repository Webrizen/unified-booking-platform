import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', borderRight: '1px solid #ccc', padding: '20px' }}>
        <nav>
          <ul>
            <li><Link href="/admin/dashboard">Dashboard</Link></li>
            <li><Link href="/admin/resources">Resources</Link></li>
            <li><Link href="/admin/bookings">Bookings</Link></li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}