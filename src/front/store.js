export const initialStore = () => {
  return {
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("token"),
    clientsList: [],
    servicesList: [],
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
    case "setClients":
      if (store.isAuthenticated) {
        const clientsList = [action.payload];
        return {
          ...store,
          clientsList: [...clientsList],
        };
      }
    case "deleteClientsList":
      const id_client = action.payload;
      const clientsListDelete = store.clientsList[0].filter(
        (client) => client.id !== id_client,
      );

      return {
        ...store,
        clientsList: [clientsListDelete],
      };
    case "addClientList":
      const clientsListAdd = store.clientsList[0];
      const client = action.payload;
      const newClientsList = [[...clientsListAdd, client]];
      return {
        ...store,
        clientsList: newClientsList,
      };
    case "updateClientList":
      const updated = store.clientsList[0].map((c) =>
        c.id === action.payload.id ? action.payload : c,
      );

      return {
        ...store,
        clientsList: [updated],
      };

    case "setServices":
      if (store.isAuthenticated) {
        const servicesList = [action.payload];
        return {
          ...store,
          servicesList: [...servicesList],
        };
      }

    case "deleteServicesList":
      const id_service = action.payload;
      const servicesListDelete = store.servicesList[0].filter(
        (service) => service.id !== id_service,
      );

      return {
        ...store,
        servicesList: [servicesListDelete],
      };

    case "addServiceList":
      const servicesListAdd = store.servicesList[0];
      const service = action.payload;
      const newServicesList = [[...servicesListAdd, service]];

      return {
        ...store,
        servicesList: newServicesList,
      };

    case "updateServiceList":
      const updatedServices = store.servicesList[0].map((s) =>
        s.id === action.payload.id ? action.payload : s,
      );

      return {
        ...store,
        servicesList: [updatedServices],
      };

    case "updateUser":
      return {
        ...store,
        user: {
          ...store.user,
          ...action.payload,
        },
      };

    default:
      throw Error("Unknown action.");
  }
}
