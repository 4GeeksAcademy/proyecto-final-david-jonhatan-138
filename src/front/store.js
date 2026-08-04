export const initialStore = () => {
  return {
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("token"),
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "login": {
      const { token, user } = action.payload;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      return {
        ...store,
        token,
        user,
        isAuthenticated: true,
      };
    }

    case "set_user":
      return {
        ...store,
        user: action.payload,
      };
    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        ...store,
        token: null,
        user: null,
        isAuthenticated: false,
      };
    default:
      throw Error("Unknown action.");
  }
}