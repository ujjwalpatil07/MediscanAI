import React, { useMemo, useState } from "react";
import { PatientContext } from "./PatientContext";
import PropTypes from "prop-types";

export const PatientProvider = ({ children }) => {

    const [loginPatient, setLoginPatient] = useState(
        {
            _id: 101,
            image: "https://assets.leetcode.com/users/Nitin_Gayke/avatar_1746878155.png",
            firstName: "Nitin",
            lastName: "Gayke",
            dob: "16-07-2004",
            gender: "Male",
            email: "gaykenitin975@gmail.com",
            address: "xyz",
            phone: '9876543210'
        }
        // null    
    );

    const patientLogout = () => {
        setLoginPatient(null);
    }


    const values = useMemo(() => ({
        loginPatient,
        setLoginPatient,
        patientLogout
    }), [loginPatient]);

    return (
        <PatientContext.Provider value={values}>
            {children}
        </PatientContext.Provider>
    );
};

PatientProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
