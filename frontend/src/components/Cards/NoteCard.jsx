import moment from "moment";
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border-gray-300 bg-white hover:shadow-md p-4 border rounded h-auto transition-all ease-in-out">
      <div className="relative flex justify-between items-center">
        <div>
          <h6 className="font-medium text-sm">{title}</h6>
          <span className="text-slate-500 text-xs">
            {moment(date).format("DD MMM YYYY")}
          </span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${
            isPinned ? "text-primary" : "text-slate-300"
          } absolute -top-0.5 -right-0`}
          onClick={onPinNote}
        />
      </div>
      <p className="mt-2 text-slate-600 text-xs">{content}</p>
      <div className="flex justify-between items-center mt-2">
        <div className="text-slate-500 text-xs">
          {tags?.map((tag) => `#${tag} `)}
        </div>
        <div className="flex items-center gap-2">
          <MdCreate
            className="hover:text-green-600 icon-btn"
            onClick={onEdit}
          />
          <MdDelete
            className="hover:text-red-500 icon-btn"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
