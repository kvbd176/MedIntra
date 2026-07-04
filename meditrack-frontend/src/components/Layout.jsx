import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="p-8 w-full">
        {children}
      </div>
    </div>
  );
}

export default Layout;