import { useState, useEffect } from "react";
import { OrbitProgress } from "react-loading-indicators";

interface logIzin {
  id: string;
  user_id: string;
  departement: string;
  section: string;
  position: string;
  alasan: string;
  tanggal: string;
  estimasi_keluar: string;
  status: string;
  approved_by: string;
  created_at: string;
  updated_at: string;
}

const InventoryList: React.FC = () => {
  const [data, setData] = useState<logIzin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const API_Data: string = "http://localhost:3000/api/izin/log/pagination";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_Data);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: { data: logIzin[] } = await response.json();
        // Menggunakan setData yang benar
        setData(result.data);
      } catch (e: unknown) {
        // Memastikan error yang ditangkap adalah instance dari Error
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="h-[70vh] bg-white items-center flex justify-center px-5 lg:px-0">
        <div className="w-[415px] text-center flex-col items-center justify-center mx-auto gap-[10px]">
          <div className="mb-8 md:mb-[56px]">
            <div className="max-w-[312px] w-full h-[10px] relative flex justify-center items-center mx-auto"></div>
          </div>
          <OrbitProgress color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      </div>
    );
  if (error)
    return (
      <div className="h-[70vh] bg-white items-center flex justify-center px-5 lg:px-0">
        <div className="w-[415px] text-center flex-col items-center justify-center mx-auto gap-[100px]">
          <div className="mb-8 md:mb-[56px]">
            <div className="max-w-[312px] w-full h-[160px] relative flex justify-center items-center mx-auto"></div>
          </div>
          <div>
            <h3 className="text-4xl md:text-[56px] leading-[64px] text-[#1A1C16]">
              Page Not Found
            </h3>
          </div>
          <div className="flex flex-col gap-6 mt-3">
            <div className="text-center">
              <p className="text-base leading-6 tracking-wider font-sans">
                The page you are looking for might have been removed had its
                name changed or is temporarily unavailable.
              </p>
            </div>
            <div>
              <button className="bg-[#8AC732] text-white font-sans max-w-[146px] w-full h-[48px] rounded-[100px] font-medium text-sm">
                Home Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  const inventoryData = Array.isArray(data) ? data : [];
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getStatusClases = (status: string): string => {
    switch (status) {
      case "Disetujui":
        return "bg-green-200 text-white ";
      case "Ditolak":
        return "bg-red-200 text-white ";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div
      className={`relative overflow-x-auto bg-neutral-primary-soft rounded-lg p-20 pt-5 ml-4 `}
    >
      <div className=" pb-7 mt-[-20] relative top-4">
        <h1 className="text-3xl font-bold shadow text-heading p-5 rounded-lg">
          Inventory Product List
        </h1>
      </div>

      <div className="shadow-sm rounded-xl mt-10 p-0">
        <div className="p-6  flex items-center justify-between rounded-lg">
          <label className="sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-body"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="input-group-1"
              className="block w-full max-w-96 ps-9 pe-3  bg-neutral-secondary-medium border border-gray-300 text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 py-2.5 shadow-xs placeholder:text-body rounded"
              placeholder="Search"
            />
          </div>
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className="inline-flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-gray-300 hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-0 shadow-xs font-medium leading-5 rounded text-sm px-3 py-2 focus:outline-none"
            type="button"
          >
            <svg
              className="w-4 h-4 me-1.5 -ms-0.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="2"
                d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
              />
            </svg>
            Filter by
            <svg
              className="w-4 h-4 ms-1.5 -me-0.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 9-7 7-7-7"
              />
            </svg>
          </button>
          <div
            id="dropdown"
            className="z-10 hidden bg-neutral-primary-medium border border-default-medium rounded- shadow-lg w-32"
          >
            <ul
              className="p-2 text-sm text-body font-medium"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <a
                  href="#"
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Color
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Category
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Price
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border border-gray-50 rounded-md shadow-yellow-10 p-6">
          <table className=" w-full text-sm text-left rtl:text-center text-body border-collapse border  mt-0 p-2 rounded-2xl ">
            <thead className="text-sm text-body bg-neutral-secondary-medium border-t border-gray-400 bg-indigo-400 z-[-1] w-2.5 px-0 py-0 rounded-t-lg">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="table-checkbox-20"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                    />
                    <label className="sr-only">Table checkbox</label>
                  </div>
                </th>
                <th scope="col" className="px-5 py-5 font-medium text-left">
                  NIK
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Employee
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Departement
                </th>
                <th scope="col" className="px-3 py- 5font-medium">
                  Position
                </th>
                <th scope="col" className="px-0 py-5 font-medium">
                  alasan
                </th>

                <th scope="col" className="px-0 py-5 font-medium">
                  Status
                </th>

                <th scope="col" className="px-0 py-5 font-medium">
                  Updated_At
                </th>

                <th scope="col" className="px-0 py-5 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-left">
              {inventoryData.map((item) => (
                <tr
                  key={item.id}
                  className="bg-neutral-primary-soft border-b border-gray-200 hover:bg-neutral-secondary-medium"
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id={`table-checkbox-${item.id}`}
                        type="checkbox"
                        value=""
                        className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"
                      />
                      <label className="sr-only">Table checkbox</label>
                    </div>
                  </td>

                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-heading whitespace-nowrap"
                  >
                    {item.user_id}
                  </th>

                  <td className="px-2 py-5">{item.departement}</td>

                  <td className="px-2 py-4">{item.section}</td>

                  <td className="px-2 py-2">{item.position}</td>
                  <td className="px-2 py-4">{item.alasan}</td>

                  <td className="px-2 py-4">
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full text-xs transition duration-150 ${getStatusClases(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-2 py-4">
                    {formatDate(item.created_at)} {formatTime(item.created_at)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-brand-soft hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-sm font-medium text-brand-soft hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {inventoryData.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data log izin yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
