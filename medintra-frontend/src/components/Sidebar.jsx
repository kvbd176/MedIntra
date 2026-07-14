import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Pill,
  Boxes,
  Users,
  Truck,
  Receipt,
  FileText,
  Bot
} from "lucide-react";

function Sidebar() {

  const location = useLocation();

  const menu = [
    {
      name:"Dashboard",
      path:"/dashboard",
      icon:<LayoutDashboard size={18}/>
    },
    {
      name:"Medicines",
      path:"/medicines",
      icon:<Pill size={18}/>
    },
    {
      name:"Inventory",
      path:"/inventory",
      icon:<Boxes size={18}/>
    },
    {
      name:"Customers",
      path:"/customers",
      icon:<Users size={18}/>
    },
    {
      name:"Distributors",
      path:"/distributors",
      icon:<Truck size={18}/>
    },
    {
      name:"Billing",
      path:"/billing",
      icon:<Receipt size={18}/>
    },
    {
      name:"Invoices",
      path:"/invoices",
      icon:<FileText size={18}/>
    },
    {
      name:"AI Assistant",
      path:"/ai",
      icon:<Bot size={18}/>
    }
  ];

  return (
    <div
      className="
      w-72
      bg-slate-900
      border-r
      border-slate-800
      min-h-screen
      p-6
      "
    >

      <h1 className="text-3xl font-bold text-cyan-400">
        MediTrack Pro
      </h1>

      <p className="text-slate-500 text-sm mt-1">
        AI Powered Pharmacy
      </p>

      <div className="mt-10 flex flex-col gap-2">

        {menu.map((item)=>(

          <Link
            key={item.name}
            to={item.path}
            className={`
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              transition-all

              ${
                location.pathname===item.path
                ?
                "bg-cyan-500/20 text-cyan-400"
                :
                "text-slate-300 hover:bg-slate-800 hover:text-cyan-300"
              }
            `}
          >
            {item.icon}
            {item.name}
          </Link>

        ))}

      </div>

    </div>
  );
}

export default Sidebar;