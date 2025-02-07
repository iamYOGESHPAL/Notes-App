import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ onLogout, userInfo }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex justify-center items-center bg-slate-100 rounded-full w-12 h-12 font-medium text-slate-950">
        {getInitials(userInfo?.fullName)}
      </div>
      <div>
        <p className="font-medium text-sm">{userInfo?.fullName}</p>
        <button
          className="text-slate-700 text-sm underline cursor-pointer"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
