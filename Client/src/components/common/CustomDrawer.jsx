import * as React from "react";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import { useThemeContext } from "../../context/ThemeContext";

export default function CustomDrawer({
    anchor = "left",
    open,
    onClose,
    children,
    drawerId = "custom-drawer",
    className,
    width = 280,
}) {
    const { theme } = useThemeContext();

    return (
        <Drawer
            id={drawerId}
            anchor={anchor}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width,
                    backdropFilter: "blur(12px)",
                    backgroundColor: theme === "light" ? "#ffffff" : "#171717cc",
                    color: theme === "dark" ? "#d1d5dc" : "#364153",
                    borderRight: anchor === "left" ? "1px solid rgba(0,0,0,0.1)" : "none",
                    borderLeft: anchor === "right" ? "1px solid rgba(0,0,0,0.1)" : "none",
                    boxShadow: 6,
                    borderRadius: 0,
                    height: "100vh"
                },
            }}
            className={className}
        >
            {children}
        </Drawer>
    );
}

CustomDrawer.propTypes = {
    anchor: PropTypes.oneOf(["left", "right", "top", "bottom"]),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    drawerId: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.number,
};
