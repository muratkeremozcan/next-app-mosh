import type {ReactNode} from 'react'
import '../globals.css'

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({children}: AdminLayoutProps) {
  return (
    <div className="flex">
      <aside data-cy="admin-sidebar" className="bg-slate-200 p-5 mr-5">
        Admin Sidebar
      </aside>
      <div>{children}</div>
    </div>
  )
}
