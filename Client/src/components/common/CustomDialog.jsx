import * as React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { useThemeContext } from "../../context/ThemeContext";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomDialog({ open, onClose, children, width = "sm" }) {

    const { theme } = useThemeContext();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slots={{
                transition: Transition,
            }}
            slotProps={{
                paper: {
                    sx: {
                    width,
                    backdropFilter: "blur(12px)",
                    backgroundColor: theme === "light" ? "#ffffffcc" : "#171717cc",
                    color: theme === "dark" ? "#d1d5dc" : "#364153",
                    boxShadow: 6,
                    borderRadius: 2,
                },
                },
            }}
            maxWidth={width}
            fullWidth
        >
            {children}
        </Dialog>
    );
}

CustomDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    width: PropTypes.oneOfType([
        PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", false]),
        PropTypes.string,
    ]),
};
