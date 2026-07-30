import { Button } from "@/components/ui/button";
import { useLucideIconPicker } from "@/components/ui/lucide-icon-picker";
import { systemToastSonner } from "@/components/ui/system-toast-sonner";
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
    after?: (newCategory: CategoryResult) => void
  ) => void;
  updateCategory?: (
    id: string,
    params: CategoryUpdateParams,
    after?: (newCategory: CategoryResult) => void
  ) => void;
  deleteCategory?: (
    id: string,
    after?: (newCategory?: CategoryResult) => void
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
    setCategories(
      categories.map((cat) =>
        cat._id === id ? { ...cat, status: !cat.isActive } : cat
      )
    );
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
        <div className="p-6">
          {/* Add New Category */}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="輸入新的商品種類名稱"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="p-4 h-100 bg-slate-800 border border-slate-700/50 hover:bg-slate-800/50 shadow-lg rounded-lg"
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                新增種類
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {(categories || []).map((category) => {
              const LucideIcon = (Icons as any)[category.icon] || Icons.Cookie;

              return (
                <div
                  key={category._id}
                  className="bg-slate-700 rounded-lg p-4 flex items-center justify-between hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-3 h-3 rounded-full ${category.isActive ? "bg-green-500" : "bg-red-500"}`}
                    ></div>

                    {editingId === category._id ? (
                      <>
                        <Button
                          onClick={() => open()}
                          className="p-2 bg-slate-800 border border-slate-700/50 hover:bg-slate-800/50 shadow-lg rounded"
                        >
                          {editingIcon
                            ? React.createElement((Icons as any)[editingIcon])
                            : "選圖示"}
                        </Button>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          <h3 className="text-white font-medium">
                            {category.name}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {category.count} 個商品
                          </p>
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
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
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
                          className="px-3 py-1 bg-slate-600 text-white rounded text-sm hover:bg-slate-500 transition-colors"
                        >
                          取消
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => toggleStatus(category._id)}
                          className={`p-2 bg-transparent rounded-lg transition-colors ${
                            category.isActive
                              ? "text-green-400 hover:bg-green-500/20"
                              : "text-red-400 hover:bg-red-500/20"
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
                          className="p-2 bg-transparent text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="編輯"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>

                        <Button
                          onClick={() => handleDelete(category._id)}
                          disabled={loadingDelete}
                          className="p-2 bg-transparent text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
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

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end p-6 border-t border-slate-700 bg-slate-750">
          <div className="text-sm text-slate-400">
            上次更新：2024/08/24 15:30 | 當前種類數：{categories.length} 個
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => props.onCancel?.()}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => {
                props.onSave?.();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              儲存變更
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
