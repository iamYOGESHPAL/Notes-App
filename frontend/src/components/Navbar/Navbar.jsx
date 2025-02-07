import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, handleSearchNotes, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };
  const handleSearch = () => {
    if (searchQuery) {
      handleSearchNotes(searchQuery);
    }
  };

  return (
    <div className="flex justify-between items-center bg-white drop-shadow px-6 py-2">
      <h2 className="py-2 font-medium text-black text-xl">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        onClearSearch={onClearSearch}
        handleSearch={handleSearch}
      />
      {userInfo && <ProfileInfo onLogout={onLogout} userInfo={userInfo} />}
    </div>
  );
};

export default Navbar;
