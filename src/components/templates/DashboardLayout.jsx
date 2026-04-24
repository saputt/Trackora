import Sidebar from '../organisms/Sidebar'
import Topbar from '../organisms/Topbar'

export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F6F3]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
