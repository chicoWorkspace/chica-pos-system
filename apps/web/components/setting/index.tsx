import { AnimatePresence, motion, Variants } from "framer-motion";
import { LockKeyhole, User } from "lucide-react";
import { useState } from "react";
import PagePermission from "./page-permission";
import RolePermission from "./role-permission";

import { groupActionWrapper } from "@/src/wrappers/group-action-wrapper";
import { groupPermissionActionWrapper } from "@/src/wrappers/group-permission-action-wrapper";
import { pageActionWrapper } from "@/src/wrappers/page-action-wrapper copy";

const Setting = () => {
  const groupAction = groupActionWrapper;
  const groupPermissionAction = groupPermissionActionWrapper;
  const pageAction = pageActionWrapper;
  const [activeTab, setActiveTab] = useState("role-permission");

  const tabs = [
    { id: "role-permission", label: "組別管理", icon: <User size={20} /> },
    {
      id: "page-permission",
      label: "頁面級權限",
      icon: <LockKeyhole size={20} />,
    },
  ];

  // Animation variants
  const tabVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const [isOpen, setIsOpen] = useState(false);
  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <motion.div className="">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-700 relative hidden sm:block">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id + index}
              onClick={() => setActiveTab(tab.id)}
              className={`
                  relative py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? "border-blue-400 text-blue-300"
                      : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                  }
                `}
            >
              <span className="flex items-center space-x-2">
                <motion.span className="text-lg">{tab.icon}</motion.span>
                <span>{tab.label}</span>
              </span>
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                  layoutId="activeTab"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </motion.button>
          ))}
        </nav>
      </div>
      {/* Tabs Navigation 窄屏下拉選單 */}
      <div className="bg-gray-800 border border-gray-700 relative sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2 px-4 flex items-center justify-between text-gray-300 hover:text-white"
        >
          <span className="flex items-center space-x-2">
            <span className="text-lg">{activeTabData?.icon}</span>
            <span>{activeTabData?.label}</span>
          </span>
          <span
            className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 z-10"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id + "dropdown"}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full py-2 px-4 flex items-center space-x-2 text-left transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {activeTab === "role-permission" && (
            <motion.div
              key="role-permission"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <RolePermission groupAction={groupAction} />
            </motion.div>
          )}

          {activeTab === "page-permission" && (
            <motion.div
              key="page-permission"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <PagePermission
                pageAction={pageAction}
                groupAction={groupAction}
                groupPermissionAction={groupPermissionAction}
              />
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  Preferences
                </h3>
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    className="flex items-center justify-between"
                    variants={tabVariants}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-200">
                        Email Notifications
                      </label>
                      <p className="text-sm text-gray-400">
                        Receive email about your account activity
                      </p>
                    </div>
                    <motion.button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.span
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        animate={{ x: 24 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    </motion.button>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-between"
                    variants={tabVariants}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-200">
                        Push Notifications
                      </label>
                      <p className="text-sm text-gray-400">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <motion.button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.span
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        animate={{ x: 4 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    </motion.button>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-between"
                    variants={tabVariants}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-200">
                        Marketing Emails
                      </label>
                      <p className="text-sm text-gray-400">
                        Receive emails about new features and updates
                      </p>
                    </div>
                    <motion.button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.span
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        animate={{ x: 4 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Theme</h3>
                <motion.div
                  className="grid grid-cols-3 gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {["Light", "Dark", "Auto"].map((theme, index) => (
                    <motion.button
                      key={theme}
                      className={`
                          px-4 py-3 text-sm font-medium rounded-md border-2 transition-colors duration-200
                          ${
                            theme === "Dark"
                              ? "border-blue-400 bg-blue-900/30 text-blue-300"
                              : "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }
                        `}
                      variants={tabVariants}
                      whileHover={{
                        scale: 1.05,
                        borderColor: theme === "Dark" ? "#60a5fa" : "#6b7280",
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme}
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors duration-200"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(96, 165, 250, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Save Preferences
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Setting;

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};
