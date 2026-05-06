import React, { useMemo } from "react";
import { PatientContext } from "./PatientContext";
import PropTypes from "prop-types";

export const PatientProvider = ({ children }) => {

    const values = useMemo(() => ({

    }), []);

    return (
        <PatientContext.Provider value={values}>
            {children}
        </PatientContext.Provider>
    );
};

PatientProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
