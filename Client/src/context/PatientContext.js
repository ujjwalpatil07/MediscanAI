import { createContext, useContext } from "react";

export const PatientContext = createContext();

export const usePatientContext = () => useContext(PatientContext);
