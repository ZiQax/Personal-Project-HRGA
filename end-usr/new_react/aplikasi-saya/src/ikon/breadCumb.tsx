import React from "react";

type props = {
  items: string[];
  minHalaman: (index: number) => void;
};
const breadCumb: React.FC<props> = ({ items, minHalaman}) => {
    console.log(items, minHalaman);
  return (
   <div className="w-full">
    <ul className="flex items-center pl-4 space-x-2 mt-4">
        {items.map((item, index) => {
            const isLAst = index === items.length - 1
            return (
                <li key={index} className="flex items-center">
                    <span
                       onClick={() => !isLAst && minHalaman(index)}
                       className={`text-base capitalize transition-colors
                        ${isLAst ? 'font-bold text-slate-900 cursor-default' : 'text-slate-600 hover:text-slate-900 cursor-pointer'}`}>
                            {item}
                        </span>

                     <span className="mx-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-slate-400 w-3 -rotate-90"
                            viewBox="0 0 24 24"
                        >
                            <path
                               fillRule="evenodd"
                               d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                               clipRule="evenodd"
                            ></path>
                        </svg>
                     </span>
                </li>
            )
        })}
    </ul>
   </div>
  );
};

export default breadCumb;
