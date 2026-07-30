"use client";
import { systemToastSonner } from "@/components/ui/system-toast-sonner";
import { IGroupPermissionAction } from "@/src/action/group-permission/action";
import { IGroupAction } from "@/src/action/group/action";
import { IPageAction } from "@/src/action/page/action";
import { GroupPermissionsResult } from "@repo/api-client";
import { GroupsResult } from "@repo/api-client";
import {
  PagesResult,
  PermissionsParams,
} from "@repo/api-client";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { FileText, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { modalVariants } from "..";
import { useSetterAndValue } from "@repo/ui/src/hooks/use-sav";
import { useMapState } from "@repo/ui/src/hooks/use-map-state";

interface PagePermissionProps {
  pageAction: IPageAction;
  groupPermissionAction: IGroupPermissionAction;
  groupAction: IGroupAction;
}

const PagePermission = (props: PagePermissionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [reloadGroupFlag, setReloadGroupFlag] = useState(true);
  const [reloadPagesFlag, setReloadPagesFlag] = useState(false);
  const [reloadPermissionFlag, setReloadPermissionFlag] = useState(false);

  const [groups, setGroups] = useState<GroupsResult>([]);
  const [pages, setPages] = useState<PagesResult>([]);
  const [groupPermissions, setGroupPermissions] =
    useState<GroupPermissionsResult>([]);

  const loadingPermissions = useMapState<boolean>();

  const [permissions, setPermissions] = useState<PermissionsParams[]>([]);

  const getGroups = async () => {
    try {
      setReloadGroupFlag(true);
      const result = await props.groupAction.getGroups();

      setReloadGroupFlag(false);

      setGroups(result || []);
    } catch (err: any) {
      setReloadGroupFlag(false);
      systemToastSonner({
        title: "取得組別失敗",
        description: err?.message || "請稍後再試",
        type: "error",
      });
    }
  };
  const getPage = async () => {
    try {
      setReloadPagesFlag(true);
      const result = await props.pageAction.getPages({});
      setReloadPagesFlag(false);

      setPages(result || []);
    } catch (err: any) {
      setReloadPagesFlag(false);
      systemToastSonner({
        title: "取得頁面失敗",
        description: err?.message || "請稍後再試",
        type: "error",
      });
    }
  };

  const getGroupPermissions = async () => {
    try {
      const result = await props.groupPermissionAction.getGroupPermissions({});

      setGroupPermissions(result || []);
    } catch (err: any) {
      setReloadPermissionFlag(false);

      systemToastSonner({
        title: "取得頁面權限失敗",
        description: err?.message || "請稍後再試",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getPage(), getGroupPermissions()]);
      getGroups();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPage && selectedPage) {
      setReloadPermissionFlag(false);
    } else {
      setReloadPermissionFlag(true);
    }
  }, [selectedGroup, selectedPage]);

  const togglePermission = async (
    groupId: string,
    pageId: string,
    permissionKey: string
  ) => {
    try {
      loadingPermissions.set(
        `${selectedGroup}-${selectedPage}-${permissionKey}`,
        true
      );
      await props.groupPermissionAction.updatePermissionToggle({
        groupId,
        pageId,
        permissionKey,
      });
      loadingPermissions.delete(`${groupId}-${pageId}-${permissionKey}`);
      getGroupPermissions();
    } catch (err: any) {
      loadingPermissions.delete(`${groupId}-${pageId}-${permissionKey}`);

      systemToastSonner({
        title: "更新權限失敗",
        description: err?.message || "請稍後再試",
        type: "error",
      });
    }
  };

  const currentRole = groups.find(
    (role) => role._id.toString() === selectedGroup
  );
  const currentPage = pages.find(
    (page) => page._id.toString() === selectedPage
  );

  const getPermissionCount = (groupId: string, pageId: string) => {
    const current = groupPermissions.find((permission) => {
      return (
        permission.groupId.toString() == groupId &&
        permission.pageId.toString() == pageId
      );
    });

    return current ? current.permissions.length : 0;
  };

  const getPageCount = (pageId: string) => {
    const current = pages.find((page) => page._id.toString() == pageId);
    return current ? current.permissions.length : 0;
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="modal"
          className=" rounded-2xl  w-full max-w-6xl max-h-[95vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex flex-wrap md:flex-nowrap  h-[500px] will-change-scroll overflow-y-scroll scrollbar-clean ">
            {/* Role List */}
            <div className="w-full p-3 border-r border-slate-700">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white">角色列表</h3>
              </div>
              <div className="scrollbar-clean space-y-2">
                {reloadGroupFlag && (
                  <div className="w-100 flex justify-center items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  </div>
                )}
                {!reloadGroupFlag && (
                  <AnimatePresence>
                    {groups.map((role, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedGroup(role._id.toString())}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedGroup === role._id.toString()
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{role.name}</span>
                          </div>
                          <span className="text-sm opacity-75">
                            {role.members.length}人
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Page List */}
            <div className="w-full p-3 border-r flex flex-col  border-slate-700">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white">頁面列表</h3>
              </div>
              <div className="scrollbar-clean pr-1 space-y-2 overflow-y-auto">
                {!reloadPagesFlag && selectedGroup !== "" ? (
                  <AnimatePresence>
                    {pages.map((page, index) => {
                      const permCount = getPermissionCount(
                        selectedGroup,
                        page._id.toString()
                      );
                      return (
                        <motion.button
                          key={index}
                          onClick={() => {
                            setSelectedPage(page._id.toString());
                            setPermissions(page.permissions);
                          }}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedPage === page._id
                              ? "bg-green-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                          variants={listItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ delay: index * 0.1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="font-medium text-sm">
                              {page.name}
                            </span>
                          </div>
                          <div className="text-xs opacity-75">
                            {permCount}/{page.permissions.length} 項權限
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-1 mt-2">
                            <div
                              className="bg-green-500 h-1 rounded-full transition-all"
                              style={{
                                width: `${(permCount / permissions.length) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {/* Permission Settings */}
            <motion.div
              key={selectedGroup + selectedPage}
              className="w-full p-3 "
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">
                    {currentRole?.name}
                  </span>
                  <span className="text-slate-400">×</span>
                  <div className="flex items-center space-x-2">
                    {React.createElement(FileText, {
                      className: "w-4 h-4 text-green-400",
                    })}
                    <span className="font-semibold text-white">
                      {currentPage?.name}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  {getPermissionCount(selectedGroup, selectedPage)}/
                  {permissions.length} 項權限
                </div>
              </div>
              <div className="scrollbar-clean pr-1 space-y-3  overflow-y-auto">
                {!reloadPermissionFlag && selectedPage != "" ? (
                  <AnimatePresence>
                    {permissions.map((permission, index) => {
                      const currentGroupPermission = groupPermissions.find(
                        (item) =>
                          item.pageId.toString() == selectedPage &&
                          item.groupId.toString() == selectedGroup
                      );

                      const isEnabled =
                        currentGroupPermission?.permissions.includes(
                          permission.key
                        ) || false;

                      const isLoading = loadingPermissions.get(
                        `${selectedGroup}-${selectedPage}-${permission.key}`
                      )
                        ? true
                        : false;

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className={`p-4 rounded-lg border transition-colors ${
                            isEnabled
                              ? "bg-green-500 bg-opacity-10 border-green-500 border-opacity-30"
                              : "bg-slate-700 border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div>
                                <h4 className="font-medium text-white">
                                  {permission.name}權限
                                </h4>
                                <p className="text-sm text-slate-400">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                togglePermission(
                                  selectedGroup,
                                  selectedPage,
                                  permission.key
                                );
                              }}
                              disabled={isLoading}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                isLoading ? "opacity-50 " : ""
                              } ${isEnabled ? "bg-green-500" : "bg-slate-600"}`}
                            >
                              <div
                                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                                  isEnabled
                                    ? "translate-x-6"
                                    : "translate-x-0.5"
                                } ${isLoading ? "animate-pulse" : ""}`}
                              ></div>

                              {/* Loading 轉圈效果 */}
                              {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <></>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PagePermission;
