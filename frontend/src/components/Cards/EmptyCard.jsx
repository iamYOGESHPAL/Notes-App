const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col justify-center items-center mt-20 w-full">
      <img src={imgSrc} alt="No Notes" className="w-80" />
      <p className="mt-5 w-1/3 font-medium text-center text-md text-slate-700 leading-7">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
