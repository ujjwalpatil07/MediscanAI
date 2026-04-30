import { Link, useLocation } from "react-router-dom";
import {
  Avatar,
  MenuItem,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  ListItemButton,
  IconButton,
  Button,
} from "@mui/material";
import {
  Home,
  Heart,
  Calendar,
  FileText,
  MessageCircle,
  LogOut,
  SunMoon,
  Settings,
  X,
  Menu as MenuIcon,
} from "lucide-react";

import { useState } from "react";
import PropTypes from "prop-types";
import Logo from "../logo/Logo";
import CustomMenu from "../common/CustomMenu";
import CustomDrawer from "../common/CustomDrawer";
import { useThemeContext } from "../../context/ThemeContext";
import { usePatientContext } from "../../context/PatientContext";

const patientLinks = [
  { title: "Home", path: "/home", icon: <Home size={18} /> },
  { title: "Symptom Checker", path: "/symptom-checker", icon: <Heart size={18} /> },
  { title: "Appointments", path: "/appointments", icon: <Calendar size={18} /> },
  { title: "Prescriptions", path: "/prescriptions", icon: <FileText size={18} /> },
  { title: "Messages", path: "/messages", icon: <MessageCircle size={18} /> },
];

export default function PatientNavbar() {
  const location = useLocation();
  const { toggleTheme } = useThemeContext();
  const { loginPatient } = usePatientContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 left-0 z-50 bg-white/70
        dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353]
        backdrop-blur-sm shadow-md px-6 py-3"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Logo />

          {/* Desktop Menu Links */}
          <ul className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-200 font-medium">
            {patientLinks?.map((link) => (
              <li key={link?.title}>
                <Link
                  to={link?.path ?? "/"}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all duration-300
                    ${(location.pathname === link?.path || location.pathname.startsWith(link?.path + "/"))
                      ? "bg-green-500 text-white shadow-md"
                      : "hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <span className="md:hidden lg:flex">{link?.icon}</span>
                  <span>{link?.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-2">
            {loginPatient ? (
              <button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                className="hidden md:flex items-center space-x-3"
              >
                <span className="text-gray-600 dark:text-blue-50 text-sm font-semibold">
                  Hi, {loginPatient.firstName}
                </span>
                <Avatar
                  alt={loginPatient?.firstName || "MediClam"}
                  src={loginPatient?.image}
                  className="cursor-pointer ring-2 ring-green-400"
                  sx={{ width: 40, height: 40 }}
                />
              </button>
            ) : (
              <div className="hidden md:flex">
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size=""
                  className="!border-green-500 !text-green-500"
                >
                  Login
                </Button>
              </div>
            )}

            <IconButton
              onClick={() => setDrawerOpen(true)}
              className="md:!hidden !text-gray-700 dark:!text-gray-200"
            >
              <MenuIcon />
            </IconButton>
          </div>

          {loginPatient && (
            <CustomMenu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              menuId="profile-menu"
              buttonId="profile-button"
              className={"!mt-4 hidden md:block"}
            >
              <ProfileMenuItems
                onClose={() => setAnchorEl(null)}
                toggleTheme={toggleTheme}
              />
            </CustomMenu>
          )}
        </div>
      </nav>

      {/* Drawer for mobile */}
      <CustomDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={"md:hidden"}
      >
        <div className="p-4 flex justify-between border-b border-gray-200 dark:border-gray-700">
          <Logo />

          <IconButton
            onClick={() => setDrawerOpen(false)}
            className="!text-gray-700 dark:!text-gray-200"
          >
            <X />
          </IconButton>
        </div>

        <List>
          {patientLinks.map((link) => (
            <ListItem key={link.title} disablePadding>
              <ListItemButton
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                selected={location.pathname === link.path}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(34,197,94,0.15)",
                    color: "#22c55e",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(34,197,94,0.25)",
                  },
                }}
              >
                <ListItemIcon className="!text-gray-700 dark:!text-gray-200 !min-w-8">
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <div className="mt-auto py-3 border-t border-gray-200 dark:border-gray-700">
          {loginPatient ? (
            <ProfileMenuItems
              onClose={() => setDrawerOpen(false)}
              toggleTheme={toggleTheme}
            />
          ) : (
            <div className="flex flex-col px-4">
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="medium"
                className="!border-green-500 !text-green-500"
                onClick={() => setDrawerOpen(false)}
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </CustomDrawer>
    </>
  );
}

function ProfileMenuItems({ onClose, toggleTheme }) {
  const { loginPatient, patientLogout } = usePatientContext();

  return (
    <>
      <MenuItem className="!py-2" component={Link} to="/profile" onClick={onClose}>
        <ListItemIcon>
          <Avatar
            alt={loginPatient?.firstName || "MediClam"}
            src={loginPatient?.image}
            className="cursor-pointer ring-2 ring-green-400"
            sx={{ width: 20, height: 20 }}
          />
        </ListItemIcon>
        <ListItemText primary="My Profile" />
      </MenuItem>

      <MenuItem
        onClick={() => {
          toggleTheme();
          onClose?.();
        }}
        className="!py-2"
      >
        <ListItemIcon>
          <SunMoon size={18} className="dark:text-white" />
        </ListItemIcon>
        <ListItemText primary="Toggle Theme" />
      </MenuItem>

      <MenuItem className="!py-2" component={Link} to="/settings" onClick={onClose}>
        <ListItemIcon>
          <Settings size={18} className="dark:text-white" />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>

      <MenuItem
        className="!py-2"
        onClick={() => {
          patientLogout();
          onClose?.();
        }}
      >
        <ListItemIcon>
          <LogOut size={18} className="text-red-500" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </>
  );
}

ProfileMenuItems.propTypes = {
  onClose: PropTypes.func,
  toggleTheme: PropTypes.func.isRequired,
};
