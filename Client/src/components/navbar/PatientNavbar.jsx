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
  Calendar,
  MessageCircle,
  LogOut,
  SunMoon,
  Settings,
  X,
  Menu as MenuIcon,
  User,
  Stethoscope,
  Brain,
} from "lucide-react";

import { useState } from "react";
import PropTypes from "prop-types";
import Logo from "../logo/Logo";
import CustomMenu from "../common/CustomMenu";
import CustomDrawer from "../common/CustomDrawer";
import { useThemeContext } from "../../context/ThemeContext";
import { usePatientContext } from "../../context/PatientContext";

const publicLinks = [
  { title: "Home", path: "/", icon: <Home size={18} /> },
  { title: "Doctors", path: "/doctors", icon: <Stethoscope size={18} /> },
];

const patientLinks = [
  { title: "Home", path: "/home", icon: <Home size={18} /> },
  { title: "Doctors", path: "/doctors", icon: <Stethoscope size={18} /> },
  { title: "Appointments", path: "/appointments", icon: <Calendar size={18} /> },
  { title: "AI Check", path: "/symptom-checker", icon: <Brain size={18} /> },
  { title: "Messages", path: "/messages", icon: <MessageCircle size={18} /> },
];

export default function Navbar() {
  const location = useLocation();
  const { toggleTheme } = useThemeContext();
  const { loginPatient } = usePatientContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = loginPatient ? patientLinks : publicLinks;

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] backdrop-blur-sm shadow-md px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">

          <Logo />

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-200 font-medium">
            {links.map((link) => (
              <li key={link.title}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all
                    ${isActive(link.path)
                      ? "bg-green-500 text-white shadow-md"
                      : "hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  {link.icon}
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-2">

            {loginPatient ? (
              <button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                className="hidden md:flex items-center gap-3"
              >
                <span className="text-gray-600 dark:text-white text-sm font-semibold">
                  Hi, {loginPatient.firstName}
                </span>
                <Avatar
                  src={loginPatient?.image}
                  sx={{ width: 40, height: 40 }}
                  className="ring-2 ring-green-400"
                />
              </button>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  className="!border-green-500 !text-green-500"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  className="!bg-green-600 hover:!bg-green-700"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              className="md:!hidden"
            >
              <MenuIcon />
            </IconButton>
          </div>

          {/* Profile Menu */}
          {loginPatient && (
            <CustomMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              className="!mt-4 hidden md:block"
            >
              <ProfileMenuItems
                onClose={() => setAnchorEl(null)}
                toggleTheme={toggleTheme}
              />
            </CustomMenu>
          )}
        </div>
      </nav>

      {/* Drawer */}
      <CustomDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="md:hidden"
      >
        <div className="p-4 flex justify-between border-b">
          <Logo />
          <IconButton onClick={() => setDrawerOpen(false)}>
            <X />
          </IconButton>
        </div>

        <List>
          {links.map((link) => (
            <ListItem key={link.title} disablePadding>
              <ListItemButton
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
                selected={isActive(link.path)}
              >
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <div className="mt-auto p-4 border-t">
          {loginPatient ? (
            <ProfileMenuItems
              onClose={() => setDrawerOpen(false)}
              toggleTheme={toggleTheme}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                onClick={() => setDrawerOpen(false)}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                onClick={() => setDrawerOpen(false)}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </CustomDrawer>
    </>
  );
}

function ProfileMenuItems({ onClose, toggleTheme }) {
  const { patientLogout } = usePatientContext();

  return (
    <>
      <MenuItem component={Link} to="/profile" onClick={onClose}>
        <ListItemIcon>
          <User size={18} />
        </ListItemIcon>
        <ListItemText primary="My Profile" />
      </MenuItem>

      <MenuItem
        onClick={() => {
          toggleTheme();
          onClose();
        }}
      >
        <ListItemIcon>
          <SunMoon size={18} />
        </ListItemIcon>
        <ListItemText primary="Toggle Theme" />
      </MenuItem>

      <MenuItem component={Link} to="/settings" onClick={onClose}>
        <ListItemIcon>
          <Settings size={18} />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>

      <MenuItem
        onClick={() => {
          patientLogout();
          onClose();
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