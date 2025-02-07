import { useState } from "react";
import { MdClose } from "react-icons/md";
import TagsInput from "../../components/Input/TagsInput";
import api from "../../utils/api";

const AddEditNotes = ({
  noteData,
  type,
  onClose,
  getAllNotes,
  handleShowToast,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);
  // Add Note
  const addNote = async () => {
    try {
      const response = await api.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response?.data?.note) {
        handleShowToast("add", "Note Added Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message);
      }
    }
  };
  // Edit Note
  const editNote = async () => {
    try {
      const response = await api.put(`/edit-note/${noteData?._id}`, {
        title,
        content,
        tags,
      });
      if (response?.data?.note) {
        handleShowToast("edit", "Note Updated Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message);
      }
    }
  };
  const handleAddEditNote = () => {
    if (title.trim() === "") {
      setError("Please enter a title");
      return;
    }
    if (content.trim() === "") {
      setError("Please enter the content");
      return;
    }
    setError(null);
    if (type === "edit") {
      editNote();
    } else {
      addNote();
    }
    onClose();
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="-top-3 -right-3 absolute flex justify-center items-center hover:bg-slate-100 rounded-full w-8 h-8"
      >
        <MdClose className="text-slate-400 text-xl" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-md text-slate-950 outline-none"
          placeholder="Enter Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="bg-slate-50 p-2 rounded text-slate-950 text-sm outline-none"
          placeholder="Enter Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagsInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="pt-4 text-red-500 text-sm">{error}</p>}
      <button
        className="mt-5 p-3 font-medium btn-primary"
        onClick={handleAddEditNote}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
