import PropTypes from "prop-types";

export default function DoctorSignupLayout({ children }) {

    return (
        <div className="w-full h-screen overflow-hidden md:flex">
            {children}
            <LoginCover />
        </div>
    );
}

DoctorSignupLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
