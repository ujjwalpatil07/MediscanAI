import PropTypes from "prop-types";
import Footer from "../components/footer/Footer";
import PatientNavbar from "../components/Navbar/PatientNavbar";
import { useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function PatientLayout({ children }) {
    const scrollRef = useRef(null);
    const location = useLocation();

    const { loginUser } = useContext(AuthContext);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location.pathname]);

    const isProtectedRoute = location.pathname.startsWith("/p");

    return (
        <div
            ref={scrollRef}
            className="h-screen scroll-smooth flex flex-col overflow-y-auto overflow-x-hidden bg-white dark:bg-neutral-900 transition-colors duration-300"
        >
            <PatientNavbar />
            <main className="flex-1">
                {!loginUser && isProtectedRoute ? (
                    <div className="flex flex-col items-center justify-center h-full px-6 py-10 text-center">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            🔒 Access Restricted
                        </h1>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            You must login to access this page.
                        </p>

                        <Link
                            to={"/login"}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : (
                    children
                )}
            </main>
            <Footer />
        </div>
    );
}

PatientLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
