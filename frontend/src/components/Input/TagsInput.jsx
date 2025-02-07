import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagsInput = ({ tags = [], setTags }) => {
  const [inputValues, setInputValues] = useState("");
  const handleInputChange = (e) => {
    setInputValues(e.target.value);
  };
  const handleAddTag = () => {
    if (inputValues?.trim() !== "" && !tags.includes(inputValues)) {
      setTags([...tags, inputValues]);
      setInputValues("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };
  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded text-slate-900 text-sm"
            >
              #{tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          className="border-gray-300 bg-transparent px-3 py-2 border rounded text-sm outline-none"
          placeholder="Add Tags"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={inputValues}
        />
        <button
          className="flex justify-center items-center border-primary/[1.5] hover:bg-primary border rounded w-9 h-9 text-primary text-xl hover:text-white outline-none"
          onClick={handleAddTag}
        >
          <MdAdd />
        </button>
      </div>
    </div>
  );
};

export default TagsInput;
