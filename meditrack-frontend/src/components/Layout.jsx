import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex bg-slate-950 min-h-screen text-white">
      <Sidebar />

      <div className="p-8 w-full">
        {children}
      </div>
    </div>
  );
}

export default Layout;