import { createContext, useContext, useEffect, useState } from "react";
import { axiosRequest } from "../api/axiosDefaults";


export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);


  const handleMount = async () => {
    try {
      const { data } = await axiosRequest.get("/auth/user/");
      setCurrentUser(data);
      // console.log(data);
    } catch (err) {
     console.error(err);
    }
  }; 

  useEffect(() => {
    handleMount();
  }, []);


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};