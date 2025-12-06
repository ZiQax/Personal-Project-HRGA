// import SidebarCust from "../tables/tableCust";
import { useState, useEffect, useRef } from "react";
import Iventory from "../tables/inventoryList";
import Navbar from "../navbar/navbar";
import Side from "../navbar/side";
import BreadCumb from "../ikon/breadCumb";
// import Login from "../forms/login";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [halamanAktif, setHalamanAktif] = useState<string[]>(["Dashboard"]);
  const addHalaman = (halamanBaru : string) => {
    if (halamanBaru === "Dashboard"){
      setHalamanAktif(["Dashboard"])
      return
    }

    if (halamanAktif.includes(halamanBaru)){
      return
    }

    setHalamanAktif([...halamanAktif, halamanBaru]);
  }
  const minHalaman = (index : number) => setHalamanAktif([...halamanAktif.slice(0, index + 1)]);

  const butSidebar = useRef<HTMLButtonElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;
      if (butSidebar.current?.contains(event.target as Node)) return;
      if (sideRef.current?.contains(event.target as Node)) return;

      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="w-400sm:mp-4 sm:ml-4 mt-20 z-50">
        <Navbar
          onToggle={() => setIsOpen(!isOpen)}
          butSidebar={butSidebar}
          isOpen={isOpen}
        />
      </div>
      <Side isOpen={isOpen} sideRef={sideRef} changeMenu={addHalaman}/>

      <div
        className={`transition-all duration-300  w-470 ml-0 ${
          isOpen ? "pl-64" : "pl-4"
        }`}
      >
        <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-lg">
          <div>
              <BreadCumb  items = {halamanAktif} minHalaman = {minHalaman}/>
              <Iventory />
              {/* <Login /> */}
        </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
