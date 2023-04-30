// const host = "http://localhost:8080";
// export const host = String("http://" + window.location.host);
export const host =
  process.env.NODE_ENV === "production"
    ? String("http://" + window.location.host)
    : String("http://" + window.location.host).replace("3000", "8080");

console.log("!host: ", host);

export const loginRoute = `${host}/api/userLogin`;
export const registerRoute = `${host}/api/userRegister`;
export const checkAuth = `${host}/api/checkAuth`;
export const postMessage = `${host}/api/postMessage`;
export const getMessage = `${host}/api/getMessage`;
export const logout = `${host}/api/logout`;
