import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, Link, useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("auth-token");
  const userRole = localStorage.getItem("role");

  const dashboardPath =
    userRole === "employer"
      ? "/employer/dashboard"
      : userRole === "job_seeker"
      ? "/job_seeker/dashboard"
        : "/dashboard"
      ? "/admin/dashboard"
      : "/dashboard";
  const navigation = isLoggedIn
    ? [
        {
          name: "Dashboard",
          href: dashboardPath,
          current: location.pathname === dashboardPath,
        },
        { name: "Jobs", href: "/jobs", current: location.pathname === "/jobs" },
        {
          name: "Companies",
          href: "/companies",
          current: location.pathname === "/companies",
        },
        {
          name: "About Us",
          href: "/aboutus",
          current: location.pathname === "/aboutus",
        },
      ]
    : [
        { name: "Home", href: "/", current: location.pathname === "/" },
        { name: "Jobs", href: "/jobs", current: location.pathname === "/jobs" },
        {
          name: "Companies",
          href: "/companies",
          current: location.pathname === "/companies",
        },
        {
          name: "About Us",
          href: "/aboutus",
          current: location.pathname === "/aboutus",
        },
      ];

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Disclosure
      as="nav"
      className="bg-indigo-700 fixed top-0 left-0 right-0 z-50 shadow-lg"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
         
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>

       
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-center">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-auto"
                src="https://www.svgrepo.com/show/467051/heading-square-2.svg"
                alt="HireHub"
              />
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:justify-center sm:space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "bg-indigo-900 text-white"
                      : "text-white hover:bg-indigo-600 hover:text-white",
                    "rounded-md px-3 py-2 text-sm font-medium"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

      
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {localStorage.getItem("auth-token") && (
              <Menu as="div" className="relative ml-3">
                <div>
                  <button
                    onClick={handleLogout}
                    className="  px-5 py-2 text-white font-semibold   "
                  >
                    Logout
                  </button>
                </div>
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-indigo-900 text-white"
                  : "text-white hover:bg-indigo-600 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
