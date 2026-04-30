import * as React from "react";
import PropTypes from "prop-types";
import Menu from "@mui/material/Menu";
import { useThemeContext } from "../../context/ThemeContext";

export default function CustomMenu({
  anchorEl,
  open,
  onClose,
  children,
  menuId = "custom-menu",
  buttonId = "custom-button",
  className
}) {

  const { theme } = useThemeContext();

  return (
    <Menu
      id={menuId}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        list: {
          "aria-labelledby": buttonId,
        },
      }}
      PaperProps={{
        sx: {
          backdropFilter: "blur(12px)",
          backgroundColor: theme === "light" ? "#ffffff70" : "#17171770",
          color: theme === "dark" ? "#d1d5dc" : "#364153",
          borderRadius: 2,
          boxShadow: 6,
        },
      }}
      className={className}
    >
      {children}
    </Menu>
  );
}

CustomMenu.propTypes = {

  anchorEl: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
    PropTypes.node,
  ]),

  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  menuId: PropTypes.string,
  buttonId: PropTypes.string,
  className: PropTypes.string,
};
