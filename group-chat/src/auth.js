import { checkAuth, logout } from "./pages/apiRoutes";

export const Authentication = async () => {
  const res = await fetch(checkAuth, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

export const postUserInfo = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: data,
    }),
  });
  return res.json();
};

export const handleLogout = async () => {
  const res = await fetch(logout, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  localStorage.removeItem("username");
  return res.json();
};
