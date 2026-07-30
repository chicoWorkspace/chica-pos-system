"use client";
import { systemToastSonner } from "@/components/ui/system-toast-sonner";
import { IGroupAction } from "@/src/action/group/action";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GroupAddMemberParams,
  GroupResult,
  GroupsResult,
} from "@repo/api-client";
import {CheckerZod} from "@repo/lib";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Crown, Plus, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { modalVariants } from "..";
import { Loader2, Trash2, CircleX } from "lucide-react";

interface RolePermissionProps {
  groupAction: IGroupAction;
}

const RolePermission = (props: RolePermissionProps) => {
  const groupAction = props.groupAction;
  const [isOpen, setIsOpen] = useState(true);
  const [groups, setGroups] = useState<GroupsResult>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupResult | undefined>(
    undefined
  );
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [loadAddGroup, setLoadAddGroup] = useState(false);

  useEffect(() => {
    reloadGroups();
  }, []);

  const reloadGroups = async () => {
    const prevSelectedGroupId = selectedGroup?._id;
    setSelectedGroup(undefined);

    setReloadFlag(true);
    const fetchedGroups = await groupAction.getGroups();
    setGroups(fetchedGroups || []);
    if (prevSelectedGroupId) {
      const updatedSelectedGroup = fetchedGroups?.find(
        (g) => g._id === selectedGroup._id
      );
      setSelectedGroup(updatedSelectedGroup);
    }
    setReloadFlag(false);
  };

  const childVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
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

  const formVariants: Variants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: "auto",
      opacity: 1,
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  const memberVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  if (!isOpen) return null;

  const defaultValues: GroupAddMemberParams = {
    username: "",
    password: "",
  };
  const AddMemberSchema = z
    .object({
      username: CheckerZod.adminUsernameSchema,
      password: CheckerZod.passwordSchema,
      confirmPassword: z.string().min(1, "請再次輸入密碼"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "兩次輸入的密碼不一致",
      path: ["confirmPassword"],
    });

  type FormValues = z.infer<typeof AddMemberSchema>;
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(AddMemberSchema),
    defaultValues,
  });
  const { errors } = formState;

  const addGroupDefaultValues = {
    name: "",
    description: "",
  };

  const AddGroupSchema = z.object({
    name: z.string().min(1, "請輸入群組名稱").max(30, "群組名稱最長 30 字"),
    description: z.string().optional(),
  });

  type AddGroupFormValues = z.infer<typeof AddGroupSchema>;

  const useAddGroupForm = () =>
    useForm<AddGroupFormValues>({
      resolver: zodResolver(AddGroupSchema),
      defaultValues: addGroupDefaultValues,
    });

  const {
    register: registerGroup,
    handleSubmit: handleSubmitGroup,
    formState: { errors: groupErrors },
    reset: resetGroup,
  } = useAddGroupForm();

  const onAddMemberSubmit = async (data: FormValues) => {
    if (!selectedGroup) return;
    await groupAction
      .addMember(selectedGroup._id.toString(), {
        username: data.username,
        password: data.password,
      })
      .then((res) => {
        reloadGroups();
        setShowAddUser(false);
        reset();
      })
      .catch((err) => {
        systemToastSonner({
          title: "新增成員失敗",
          description: err?.message || "請稍後再試",
          type: "error",
        });
      });
  };

  const onAddGroupSubmit = async (data: AddGroupFormValues) => {
    setLoadAddGroup(true);
    await groupAction
      .create({
        name: data.name,
        description: data.description,
      })
      .then((res) => {
        reloadGroups();
        setShowAddGroup(false);
        setLoadAddGroup(false);
        resetGroup();
      })
      .catch((err) => {
        setLoadAddGroup(false);
        systemToastSonner({
          title: "新增組別失敗",
          description: err?.message || "請稍後再試",
          type: "error",
        });
      });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="flex items-center justify-center 
       md:flex-row 
      "
      >
        <motion.div
          className="rounded-2xl w-full max-h-[80vh] overflow-hidden "
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div
            className="
              flex 
              flex-col 
              min-h-96
              items-center
              md:flex-row
              md:items-stretch 
           "
          >
            <motion.div
              className="border-r-0 border-b border-gray-700 p-4
              w-full
              md:w-1/3
              md:border-r
              md:border-b-0
              "
              variants={childVariants}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">組別管理</h3>
                <motion.button
                  onClick={() => setShowAddGroup(true)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              <AnimatePresence>
                <motion.div
                  className=" bg-gray-700 rounded-lg overflow-hidden"
                  variants={formVariants}
                  transition={{ duration: 0.2 }}
                  initial="hidden"
                  animate={showAddGroup ? "visible" : "hidden"}
                  exit="exit"
                >
                  <div className="p-3">
                    <form onSubmit={handleSubmitGroup(onAddGroupSubmit)}>
                      <motion.input
                        type="text"
                        {...registerGroup("name")}
                        placeholder="輸入組別名稱"
                        className="w-full p-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-blue-500"
                      />
                      {groupErrors.name && (
                        <p className=" mt-1 text-red-500 text-sm">
                          {groupErrors.name.message}
                        </p>
                      )}
                      <motion.input
                        type="text"
                        {...registerGroup("description")}
                        placeholder="輸入描述 (選填)"
                        className="w-full mt-2 p-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-blue-500"
                      />
                      <motion.div className="flex space-x-2 mt-2">
                        <motion.button
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={loadAddGroup}
                        >
                          {loadAddGroup ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            "確認新增"
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setShowAddGroup(false);
                          }}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          取消
                        </motion.button>
                      </motion.div>
                    </form>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Groups List */}
              <div className="mt-2 space-y-2 overflow-y-scroll max-h-[50vh] pr-2 scrollbar-clean">
                {reloadFlag && (
                  <div className="w-100 flex justify-center items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  </div>
                )}
                {!reloadFlag && (
                  <AnimatePresence>
                    {groups.map((group, index) => (
                      <motion.div
                        key={index}
                        onClick={() => setSelectedGroup(group)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedGroup?._id === group._id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        }`}
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">{group.name}</div>
                            <div className="font-medium text-sm text-gray-400">
                              {group.description}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* 人數 */}
                            <motion.span
                              className="text-sm opacity-75"
                              key={group.members.length}
                            >
                              {group.members.length} 人
                            </motion.span>

                            {/* 刪除 ICON */}
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLoadAddGroup(true);

                                groupAction
                                  .deleteGroup(group._id.toString())
                                  .then(() => {
                                    reloadGroups();
                                    setLoadAddGroup(false);
                                  })
                                  .catch((err) => {
                                    setLoadAddGroup(false);
                                    systemToastSonner({
                                      title: "移除組別失敗",
                                      description: err?.message || "請稍後再試",
                                      type: "error",
                                    });
                                  });
                              }}
                              className="p-1 rounded-md "
                              disabled={loadAddGroup}
                            >
                              {loadAddGroup ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                              ) : (
                                <CircleX className="w-4 h-4 text-red-500 hover:text-red-500/60" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>

            <motion.div
              className="flex-1 p-4
            w-full
            "
              variants={childVariants}
            >
              <AnimatePresence mode="wait">
                {selectedGroup ? (
                  <motion.div key={selectedGroup._id.toString()}>
                    <motion.div
                      className="flex items-center justify-between mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-lg font-medium text-white">
                        {selectedGroup.name} - 成員管理
                      </h3>
                      <motion.button
                        onClick={() => setShowAddUser(true)}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </motion.div>

                    {/* Add User Form */}
                    <AnimatePresence>
                      {showAddUser && (
                        <motion.div
                          className=" bg-gray-700 rounded-lg overflow-hidden"
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <form onSubmit={handleSubmit(onAddMemberSubmit)}>
                            <div className="p-4">
                              <motion.input
                                type="text"
                                {...register("username")}
                                placeholder="輸入使用者名稱"
                                className="w-full p-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-blue-500"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              />
                              {errors.username && (
                                <p className=" mt-1 text-red-500 text-sm">
                                  {errors.username.message}
                                </p>
                              )}
                              <motion.input
                                type="password"
                                {...register("password")}
                                placeholder="輸入使用者密碼"
                                className="w-full mt-2 p-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-blue-500"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              />
                              {errors.password && (
                                <p className="mt-1 text-red-500 text-sm">
                                  {errors.password.message}
                                </p>
                              )}
                              <motion.input
                                type="password"
                                {...register("confirmPassword")}
                                placeholder="再次輸入使用者密碼"
                                className="w-full mt-2 p-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-blue-500"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              />
                              {errors.confirmPassword && (
                                <p className=" mt-1 text-red-500 text-sm">
                                  {errors.confirmPassword.message}
                                </p>
                              )}
                              <motion.div
                                className="flex space-x-2 mt-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                <motion.button
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  確認新增
                                </motion.button>
                                <motion.button
                                  onClick={() => {
                                    setShowAddUser(false);
                                  }}
                                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  取消
                                </motion.button>
                              </motion.div>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Members List */}
                    <motion.div
                      className="mt-4 space-y-3 overflow-y-scroll max-h-[50vh] pr-2 scrollbar-clean"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <AnimatePresence>
                        {[...selectedGroup.members]
                          .sort((a, b) =>
                            a.role === "leader"
                              ? -1
                              : b.role === "leader"
                                ? 1
                                : 0
                          )
                          .map((member, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                              variants={memberVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center space-x-3">
                                <motion.div
                                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 300,
                                  }}
                                >
                                  {member.userId.username
                                    .charAt(0)
                                    .toUpperCase()}
                                </motion.div>
                                <div>
                                  <div className="text-white font-medium">
                                    {member.userId.username}
                                  </div>
                                  <motion.div
                                    className="flex items-center space-x-1 text-sm"
                                    key={member.role}
                                    initial={{ scale: 1.1, opacity: 0.5 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                      type: "spring",
                                      damping: 15,
                                      stiffness: 300,
                                    }}
                                  >
                                    {member.role == "leader" ? (
                                      <>
                                        <Crown className="w-4 h-4 text-yellow-500" />
                                        <span className="text-yellow-500">
                                          組長
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-400">
                                          組員
                                        </span>
                                      </>
                                    )}
                                  </motion.div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-3 ">
                                {member.role === "member" && (
                                  <motion.button
                                    onClick={() => {
                                      groupAction
                                        .setMemberAsLeader(
                                          selectedGroup._id.toString(),
                                          member.userId._id.toString()
                                        )
                                        .then(() => {
                                          reloadGroups();
                                        })
                                        .catch((err) => {
                                          systemToastSonner({
                                            title: "設為組長失敗",
                                            description:
                                              err?.message || "請稍後再試",
                                            type: "error",
                                          });
                                        });
                                    }}
                                    className={`max-w-24 w-full px-3 py-1 rounded-lg text-sm transition-colors
                                      bg-yellow-600 hover:bg-yellow-700 text-white`}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{
                                      type: "spring",
                                      damping: 15,
                                      stiffness: 300,
                                    }}
                                  >
                                    設為組長
                                  </motion.button>
                                )}

                                <motion.button
                                  onClick={() => {
                                    groupAction
                                      .deleteMember(
                                        selectedGroup._id.toString(),
                                        member.userId._id.toString()
                                      )
                                      .then(() => {
                                        reloadGroups();
                                      })
                                      .catch((err) => {
                                        systemToastSonner({
                                          title: "移除成員失敗",
                                          description:
                                            err?.message || "請稍後再試",
                                          type: "error",
                                        });
                                      });
                                  }}
                                  className="max-w-24 w-full px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                                  whileTap={{ scale: 0.95 }}
                                  transition={{
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 300,
                                  }}
                                >
                                  移除
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                      </AnimatePresence>
                      {selectedGroup.members.length === 0 && (
                        <motion.div
                          className="text-center py-8 text-gray-400"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              damping: 15,
                              stiffness: 300,
                              delay: 0.4,
                            }}
                          >
                            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          </motion.div>
                          <p>此組別暫無成員</p>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex items-center justify-center h-full text-gray-400"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      </motion.div>
                      <motion.p
                        className="text-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        請選擇一個組別來管理成員
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Footer */}
          {/* <motion.div
            className="flex justify-end space-x-3 p-6 border-t border-gray-700"
            variants={childVariants}
          >
            <motion.button
              onClick={() => closeDialog()}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              取消
            </motion.button>
            <motion.button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              儲存設定
            </motion.button>
          </motion.div> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RolePermission;
