export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const getInitials = (name) =>
  name
    ?.split(" ")
    ?.slice(0, 2)
    ?.map((word) => word[0]?.toUpperCase() || "")
    ?.join("");
