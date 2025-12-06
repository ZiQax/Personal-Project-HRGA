import { useState, useEffect, useRef } from "react";
import Badge from "@mui/icons-material/Badge";
import MailIcon from "@mui/icons-material/Mail";
type NavbarProps = {
  onToggle: () => void;
  isOpen: boolean;
  butSidebar: React.RefObject<HTMLButtonElement | null>;
};
const Navbar: React.FC<NavbarProps> = ({
  onToggle,
  butSidebar,
  isOpen,
}: NavbarProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const butRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        butRef.current &&
        dropRef.current &&
        !butRef.current.contains(event.target as Node) &&
        !dropRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userDropDown = () => {
    return (
      <>
        <div
          className="z-50 absolute right-10 top-14 text-base list-none bg-neutral-primary-medium border border-gray-100 rounded-base shadow-lg w-44 bg-white rounded-10"
          id="dropdown-user"
        >
          <div className="px-4 py-3 border-b border-default-medium" role="none">
            <p className="text-sm font-medium text-heading" role="none">
              Neil Sims
            </p>
            <p className="text-sm text-body truncate" role="none">
              neil.sims@flowbite.com
            </p>
          </div>
          <ul className="p-2 text-sm text-body font-medium" role="none">
            <li>
              <a
                href="#"
                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                role="menuitem"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                role="menuitem"
              >
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                role="menuitem"
              >
                Earnings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                role="menuitem"
              >
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <div
      className={`
    fixed top-0 z-50 h-18 bg-white shadow transition-all duration-300 right-0 left-1 
    ${isOpen ? "ml-64 w-[calc(100%-256px)]" : "ml-0 w-full"}
  `}
    >
      <div className="px-3 py-3 lg:px-5 lg:pl-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              ref={butSidebar}
              onClick={onToggle}
              data-drawer-target="top-bar-sidebar"
              data-drawer-toggle="top-bar-sidebar"
              aria-controls="top-bar-sidebar"
              type="button"
              className=" text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium  focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h10"
                />
              </svg>
            </button>
            <a href="https://flowbite.com" className="flex ms-2 md:me-24">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-6 me-3"
                alt="FlowBite Logo"
              />
              <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
                Flowbite
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <Badge badgeContent={4} color="primary" className="me-4 cursor-pointer">
              <MailIcon />
            </Badge>
            <div className="flex items-center ms-3">
              <div>
                <button
                  ref={butRef}
                  onClick={() => setOpenDropdown(!openDropdown)}
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 mr-6"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full not-odd:ri"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                </button>
                {openDropdown && <div ref={dropRef}>{userDropDown()}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
