import { useEffect } from "react";
import { LuCheck, LuTrash } from "react-icons/lu";

const Toast = ({ isShown, type, message, onClose }) => {
  useEffect(() => {
    const showTime = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(showTime);
  }, [onClose]);

  return (
    <div
      className={`absolute top-20 right-6 transition-all duration-400 ease-in-out border border-gray-200 rounded-md ${
        isShown ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`min-w-52 bg-white shadow-md rounded-md relative after:content-[""] 
         after:w-[4px] after:h-full after:absolute after:left-0 after:top-0 after:rounded-l-lg 
         ${type === "delete" ? "after:bg-red-500" : "after:bg-green-500"}`}
      >
        <div className="flex items-center gap-3 px-4 py-2">
          <div
            className={`flex justify-center items-center rounded-full w-10 h-10 ${
              type === "delete" ? "bg-red-100" : "bg-green-100"
            }`}
          >
            {type === "delete" ? (
              <LuTrash className="text-md text-red-500" />
            ) : (
              <LuCheck className="text-green-500 text-xl" />
            )}
          </div>
          <p className="text-slate-800 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
