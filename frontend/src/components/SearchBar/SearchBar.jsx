import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex items-center bg-slate-100 px-4 rounded-md w-80">
      <input
        type="text"
        placeholder="Search Notes"
        className="bg-transparent py-[11px] w-full text-xs outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <IoMdClose
          className="mr-3 text-slate-500 text-xl hover:text-black cursor-pointer"
          onClick={onClearSearch}
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 hover:text-black cursor-pointer"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
