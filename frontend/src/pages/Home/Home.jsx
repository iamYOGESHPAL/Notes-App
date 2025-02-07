import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import addNotesImage from "../../assets/add-notes.svg";
import noNotesImage from "../../assets/no-notes.svg";
import EmptyCard from "../../components/Cards/EmptyCard";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/Navbar";
import Toast from "../../components/Toast/Toast";
import api from "../../utils/api";
import AddEditNotes from "./AddEditNotes";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: "add",
    message: "",
  });
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  // Get UserInfo
  const getUserInfo = async () => {
    try {
      const response = await api.get("/get-user");
      if (response?.data?.user) {
        setUserInfo(response?.data?.user);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get All Notes
  const getAllNotes = async () => {
    try {
      const response = await api.get("/get-all-notes");
      if (response?.data?.notes) {
        setAllNotes(response?.data?.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
      if (error?.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Delete Note
  const handleDelete = async (noteData) => {
    try {
      const response = await api.delete(`/delete-note/${noteData?._id}`);
      if (!response?.data?.error) {
        handleShowToast("delete", "Note Deleted Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };

  // Search Notes
  const handleSearchNotes = async (query) => {
    try {
      const response = await api.get("/search-notes", { params: { query } });
      if (response?.data?.notes) {
        setIsSearch(true);
        setAllNotes(response?.data?.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };

  // Clear Search
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  // Pin Note
  const handlePinNote = async (noteData) => {
    try {
      const response = await api.put(`/pin-note/${noteData?._id}`, {
        isPinned: !noteData?.isPinned,
      });
      if (response?.data?.note) {
        handleShowToast("edit", "Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };

  // Handle Add/Edit Modal
  const handleEdit = (noteDetails) =>
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails });

  // Handle Toast
  const handleShowToast = (type, message) =>
    setShowToastMsg({ isShown: true, message, type });
  const handleCloseToast = () =>
    setShowToastMsg({ isShown: false, message: "" });

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        handleSearchNotes={handleSearchNotes}
        handleClearSearch={handleClearSearch}
      />
      <div className="mx-auto px-5 container">
        {allNotes?.length > 0 ? (
          <div className="gap-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-flow-row-dense my-8">
            {allNotes.map((note) => {
              return (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={note.createdAt}
                  content={note.content}
                  tags={note.tags}
                  isPinned={note.isPinned}
                  onEdit={() => handleEdit(note)}
                  onDelete={() => handleDelete(note)}
                  onPinNote={() => handlePinNote(note)}
                />
              );
            })}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? noNotesImage : addNotesImage}
            message={
              isSearch
                ? "Oops! No Notes found matching your search."
                : "It's time to start taking notes! Click the 'Add' button to record your thoughts, ideas, reminders, and more."
            }
          />
        )}
      </div>
      <button
        className="right-8 bottom-8 fixed flex justify-center items-center bg-primary hover:bg-primary rounded-md w-10 h-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-2xl text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal?.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="bg-white custom-scrollbar mx-auto mt-14 p-5 rounded-md w-[40%] max-h-3/4 overflow-auto"
      >
        <AddEditNotes
          onClose={() => {
            setOpenAddEditModal({
              isShown: false,
              type: "add",
              data: null,
            });
          }}
          type={openAddEditModal?.type}
          noteData={openAddEditModal?.data}
          getAllNotes={getAllNotes}
          handleShowToast={handleShowToast}
        />
      </Modal>
      <Toast
        isShown={showToastMsg?.isShown}
        type={showToastMsg?.type}
        message={showToastMsg?.message}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
