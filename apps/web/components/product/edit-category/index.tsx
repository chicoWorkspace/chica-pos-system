import { Button } from "@/components/ui/button";
import { useLucideIconPicker } from "@/components/ui/lucide-icon-picker";
import { systemToastSonner } from "@/components/ui/system-toast-sonner";
import { useAppTheme } from "@/src/context/theme-provider";
import {
  CategoryAddParams,
  CategoryResult,
  CategoryUpdateParams,
} from "@repo/api-client";
import * as Icons from "lucide-react";
import { Edit2, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface EditCategoryProps {
  categories?: CategoryResult;
  createCategory?: (
    params: CategoryAddParams,
    after?: (newCategory: CategoryResult) => void,
  ) => void;
  updateCategory?: (
    id: string,
    params: CategoryUpdateParams,
    after?: (newCategory: CategoryResult) => void,
  ) => void;
  deleteCategory?: (
    id: string,
    after?: (newCategory?: CategoryResult) => void,
  ) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

const EditCategory = (props: EditCategoryProps) => {
  const [categories, setCategories] = useState(props.categories || []);
  const [newCategory, setNewCategory] = useState("");
  const [newIcon, setNewIcon] = useState<keyof typeof Icons | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingIcon, setEditingIcon] = useState<string | null>(null);

  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { theme } = useAppTheme();

  const cls = theme.classes;

  const handleAdd = () => {
    const name = newCategory.trim();
    const icon = newIcon || "";
    setLoadingAdd(true);
    if (name !== "" && icon !== "") {
      props.createCategory?.({ name, icon }, (newCategory) => {
        setCategories(newCategory);
        systemToastSonner({
          title: "新增分類成功",
          description: `新增分類成功 : ${name} `,
          type: "success",
        });
      });
      setNewCategory("");
      setNewIcon(null);
      setLoadingAdd(false);
    } else {
      systemToastSonner({
        title: "新增分類失敗",
        description: `請確認名稱與圖示皆已填寫`,
        type: "error",
      });
      setLoadingAdd(false);
    }
  };

  const handleUpdate = () => {
    const id = editingId || "";
    const name = editingName.trim();
    const icon = editingIcon || "";
    setLoadingUpdate(true);

    if (id !== "" && name !== "" && icon !== "") {
      props.updateCategory?.(id, { name, icon }, (newCategory) => {
        setCategories(newCategory);
        systemToastSonner({
          title: "更新分類成功",
          description: `更新分類成功 : ${name} `,
          type: "success",
        });

        setEditingId(null);
        setEditingName("");
        setEditingIcon(null);
        setLoadingUpdate(false);
      });
    } else {
      systemToastSonner({
        title: "更新分類失敗",
        description: `請確認名稱與圖示皆已填寫`,
        type: "error",
      });
      setLoadingUpdate(false);
    }
  };

  const handleDelete = (id: string) => {
    setLoadingDelete(true);
    props.deleteCategory?.(id, (newCategory) => {
      if (newCategory) {
        setCategories(newCategory);
        systemToastSonner({
          title: "刪除分類成功",
          description: `刪除分類成功`,
          type: "success",
        });
      }
      setLoadingDelete(false);
    });
  };

  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
    const icon = categories.find((cat) => cat._id === id)?.icon || null;
    setEditingIcon(icon);
  };

  const toggleStatus = (id: string) => {
    setLoadingUpdate(true);

    const category = categories.find((cat) => cat._id === id);
    if (category) {
      props.updateCategory?.(
        id,
        { isActive: !category.isActive },
        (newCategory) => {
          setCategories(newCategory);
          systemToastSonner({
            title: "更新分類狀態成功",
            description: `更新分類狀態成功 : ${name} `,
            type: "success",
          });
          setLoadingUpdate(false);
        },
      );
    }
  };

  const { open } = useLucideIconPicker({
    //選擇icon後的接續處理
    onSelect: (setIcon) => {
      setEditingIcon(setIcon);
    },
  });

  return (
    <div className=" inset-0 flex items-center justify-center z-50">
      <div className=" rounded-xl w-[900px] max-h-[80vh] overflow-hidden  scrollbar-clean">
        <div className={`p-6  ${cls.dialog.section} mb-4`}>
          {/* Add New Category */}
          <div className="mb-6">
            <label className={`mb-2 block text-sm ${cls.text.strong}`}>
              新增分類 *
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="輸入新的商品種類名稱"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className={`${cls.input.staticField} w-full `}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
              </div>
              <Button
                onClick={() => {
                  open({
                    onSelect(icon) {
                      setNewIcon(icon);
                    },
                  });
                }}
                className={`${cls.button.secondary} h-auto`}
              >
                {newIcon ? (
                  <>
                    {(() => {
                      const LucideIcon =
                        (Icons as any)[newIcon] || Icons.Cookie;
                      return <LucideIcon className="w-5 h-5 mr-1" />;
                    })()}
                  </>
                ) : (
                  "選擇圖示"
                )}
              </Button>
              <button
                onClick={handleAdd}
                disabled={!newCategory.trim() || !newIcon}
                className={cls.button.primaryWide}
              >
                <Plus className="w-4 h-4" />
                新增種類
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <label className={`block text-sm font-medium ${cls.text.title} `}>
              分類列表
            </label>
            {(categories || []).map((category) => {
              const LucideIcon = (Icons as any)[category.icon] || Icons.Cookie;

              return (
                <div
                  key={category._id}
                  className={`${cls.button.secondary} flex items-center justify-between`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-3 h-3 rounded-full ${category.isActive ? "bg-green-500" : "bg-red-500"}`}
                    ></div>

                    {editingId === category._id ? (
                      <>
                        <Button
                          onClick={() => open()}
                          className={`${cls.button.secondary} rounded-lg`}
                        >
                          {editingIcon
                            ? React.createElement((Icons as any)[editingIcon])
                            : "選圖示"}
                        </Button>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className={`${cls.input.staticField}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdate();
                          }}
                          autoFocus
                        />
                      </>
                    ) : (
                      <>
                        <LucideIcon size={24} className="" />
                        <div className="flex-1">
                          <h3 className={` font-medium ${cls.text.strong}`}>
                            {category.name}
                          </h3>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="ml-2 flex items-center gap-2">
                    {editingId === category._id ? (
                      <>
                        <Button
                          disabled={loadingUpdate}
                          onClick={handleUpdate}
                          className={`${cls.button.primary}`}
                         
                        >
                          保存
                        </Button>
                        <Button
                          disabled={loadingUpdate}
                          onClick={() => {
                            setEditingId(null);
                            setEditingName("");
                            setEditingIcon(null);
                          }}
                          className={`${cls.button.secondary}`}
                        >
                          取消
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => toggleStatus(category._id)}
                          disabled={loadingUpdate}
                          className={` bg-transparent rounded-lg transition-colors ${
                            category.isActive
                              ? `${cls.button.green} rounded-xl p-2`
                              : `${cls.button.danger} rounded-xl p-2`
                          }`}
                          title={category.isActive ? "啟用中" : "已停用"}
                        >
                          {category.isActive ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          onClick={() =>
                            handleEdit(category._id, category.name)
                          }
                          className={`${cls.button.blue} rounded-xl p-2`}
                          title="編輯"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => handleDelete(category._id)}
                          disabled={loadingDelete}
                          className={`${cls.button.danger} rounded-xl p-2`}
                          title="刪除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
