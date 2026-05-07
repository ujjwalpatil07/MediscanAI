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
  Badge,
} from "@mui/material";
import {
  Home,
  Calendar,
  MessageCircle,
  LogOut,
  SunMoon,
  X,
  Menu as MenuIcon,
  User,
  Stethoscope,
  Brain,
  LayoutDashboard,
  FileText,
  Folder,
  Phone,
  UserSearch,
  Bell,
} from "lucide-react";

import { useState, useContext } from "react";
import PropTypes from "prop-types";
import Logo from "../logo/Logo";
import CustomMenu from "../common/CustomMenu";
import CustomDrawer from "../common/CustomDrawer";
import { useThemeContext } from "../../context/ThemeContext";
import AuthContext from "../../context/AuthContext";

const publicLinks = [
  { title: "Home", path: "/home", icon: <Home size={18} /> },
  { title: "Doctors", path: "/doctors", icon: <Stethoscope size={18} /> },
  { title: "About us", path: "/about", icon: <UserSearch size={18} /> },
  { title: "Contact us", path: "/contact", icon: <Phone size={18} /> },
];

const patientLinks = [
  { title: "Home", path: "/home", icon: <Home size={18} /> },
  { title: "Doctors", path: "/doctors", icon: <Stethoscope size={18} /> },
  { title: "Appointments", path: "/p/my-appointments", icon: <Calendar size={18} /> },
  { title: "AI Check", path: "/p/symptom-checker", icon: <Brain size={18} /> },
];

const dummyNotifications = [
  {
    id: 1,
    title: "Appointment Confirmed",
    message: "Dr. Ujjwal Patil confirmed your appointment for May 9, 2026 at 8:30 AM.",
    time: "2 hours ago",
    read: false,
    type: "appointment",
  },
  {
    id: 2,
    title: "New Prescription",
    message: "Dr. Ujjwal Patil has issued a new prescription for you.",
    time: "5 hours ago",
    read: false,
    type: "prescription",
  },
  {
    id: 3,
    title: "Appointment Reminder",
    message: "Your appointment with Dr. Ujjwal Patil is tomorrow at 8:30 AM.",
    time: "1 day ago",
    read: true,
    type: "reminder",
  },
  {
    id: 4,
    title: "Message Received",
    message: "You have a new message from Dr. Ujjwal Patil.",
    time: "2 days ago",
    read: true,
    type: "message",
  },
];

export default function Navbar() {
  const location = useLocation();
  const { toggleTheme } = useThemeContext();
  const { loginUser } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread messages (you can replace with actual API data later)
  const unreadMessages = 2; // Dummy unread count

  const links = loginUser && loginUser?.role === "patient" ? patientLinks : publicLinks;
  const loginPatient = loginUser && loginUser?.role === "patient" ? loginUser : null;

  // Calculate unread notifications
  useState(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleClearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleDismissNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-gradient-to-r dark:from-[#182c43] dark:to-[#175353] backdrop-blur-sm shadow-md px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Logo />

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-gray-700 dark:text-gray-200 font-medium">
            {links.map((link) => (
              <li key={link.title}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1.5 rounded-md transition-all text-sm xl:text-base
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
          <div className="flex items-center gap-1 sm:gap-2">
            {loginPatient && (
              <>
                {/* Messages Icon */}
                <IconButton
                  component={Link}
                  to="/p/messages"
                  className="relative"
                  size="small"
                >
                  <Badge badgeContent={unreadMessages} color="error">
                    <MessageCircle size={20} className="text-gray-600 dark:text-gray-300" />
                  </Badge>
                </IconButton>

                {/* Notifications Icon */}
                <IconButton
                  onClick={(e) => setNotificationAnchor(e.currentTarget)}
                  className="relative"
                  size="small"
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                  </Badge>
                </IconButton>

                {/* User Avatar - Desktop */}
                <button
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  className="hidden sm:flex items-center gap-2 ml-1"
                >
                  <span className="text-gray-600 dark:text-white text-sm font-semibold hidden md:inline">
                    Hi, {loginUser?.firstName}
                  </span>
                  <Avatar
                    src={loginPatient?.profilePhoto}
                    sx={{ width: 36, height: 36 }}
                    className="ring-2 ring-green-400"
                  >
                    {loginPatient?.firstName?.[0]}
                  </Avatar>
                </button>
              </>
            )}

            {!loginPatient && (
              <div className="hidden sm:flex gap-2">
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  className="!border-green-500 !text-green-500 !text-xs sm:!text-sm"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  className="!bg-green-600 hover:!bg-green-700 !text-xs sm:!text-sm"
                >
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              className="lg:!hidden ml-1"
            >
              <MenuIcon className="text-gray-600 dark:text-gray-300" />
            </IconButton>
          </div>

          {/* Profile Menu */}
          {loginPatient && (
            <CustomMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              className="!mt-2 hidden sm:block"
            >
              <ProfileMenuItems
                onClose={() => setAnchorEl(null)}
                toggleTheme={toggleTheme}
              />
            </CustomMenu>
          )}

          {/* Notifications Menu */}
          {loginPatient && (
            <CustomMenu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={() => setNotificationAnchor(null)}
              className="!mt-2"
            >
              <div className="w-80 sm:w-96 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Notifications
                  </h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAllNotifications}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No notifications
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`relative px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition ${!notification.read ? "bg-green-50/50 dark:bg-green-900/10" : ""
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDismissNotification(notification.id, e)}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition flex-shrink-0"
                        >
                          <X size={14} className="text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CustomMenu>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <CustomDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="lg:hidden"
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <Logo />
          <IconButton onClick={() => setDrawerOpen(false)}>
            <X className="text-gray-600 dark:text-gray-300" />
          </IconButton>
        </div>

        {/* Mobile User Info */}
        {loginPatient && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            <Avatar
              src={loginPatient?.profilePhoto}
              sx={{ width: 40, height: 40 }}
            >
              {loginPatient?.firstName?.[0]}
            </Avatar>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {loginPatient?.firstName} {loginPatient?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {loginPatient?.email}
              </p>
            </div>
          </div>
        )}

        <List className="flex-1">
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

          {/* Mobile Messages */}
          {loginPatient && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/p/messages"
                onClick={() => setDrawerOpen(false)}
                selected={isActive("/p/messages")}
              >
                <ListItemIcon>
                  <Badge badgeContent={unreadMessages} color="error">
                    <MessageCircle size={18} />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Messages" />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          {loginPatient ? (
            <ProfileMenuItems
              onClose={() => setDrawerOpen(false)}
              toggleTheme={toggleTheme}
              isMobile
            />
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                onClick={() => setDrawerOpen(false)}
                fullWidth
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                onClick={() => setDrawerOpen(false)}
                fullWidth
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </CustomDrawer>
    </>
  );
}

function ProfileMenuItems({ onClose, toggleTheme, isMobile }) {
  const { logout } = useContext(AuthContext);

  return (
    <div className={isMobile ? "space-y-1" : ""}>
      <MenuItem component={Link} to="/p/profile" onClick={onClose}>
        <ListItemIcon>
          <User size={18} className="dark:text-white" />
        </ListItemIcon>
        <ListItemText primary="My Profile" />
      </MenuItem>

      <MenuItem component={Link} to="/p/dashboard" onClick={onClose}>
        <ListItemIcon>
          <LayoutDashboard size={18} className="dark:text-white" />
        </ListItemIcon>
        <ListItemText primary="My Dashboard" />
      </MenuItem>

      <MenuItem component={Link} to="/p/prescriptions" onClick={onClose}>
        <ListItemIcon>
          <FileText size={18} className="dark:text-white" />
        </ListItemIcon>
        <ListItemText primary="Prescriptions" />
      </MenuItem>

      <MenuItem component={Link} to="/p/medical-records" onClick={onClose}>
        <ListItemIcon>
          <Folder size={18} className="dark:text-white" />
        </ListItemIcon>
        <ListItemText primary="Medical Records" />
      </MenuItem>

      <MenuItem component={Link} to="/p/messages" onClick={onClose}>
        <ListItemIcon>
          <MessageCircle size={18} className="dark:text-white" />
        </ListItemIcon>
        <ListItemText primary="Messages" />
      </MenuItem>

      <MenuItem
        onClick={() => {
          toggleTheme();
          onClose();
        }}
      >
        <ListItemIcon>
          <SunMoon size={18} className="dark:text-white" />
        </ListItemIcon>
        <ListItemText primary="Toggle Theme" />
      </MenuItem>

      <MenuItem
        onClick={() => {
          logout();
          onClose();
        }}
      >
        <ListItemIcon>
          <LogOut size={18} className="text-red-500" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </div>
  );
}

ProfileMenuItems.propTypes = {
  onClose: PropTypes.func,
  toggleTheme: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
};