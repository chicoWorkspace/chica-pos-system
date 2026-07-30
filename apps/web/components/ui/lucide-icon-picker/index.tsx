import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import * as LucideIcons from "lucide-react";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { IconName, iconWhitelist } from "./icon-list";

const icons = iconWhitelist;

export function useLucideIconPicker(props: {
  isOpen?: boolean;
  onSelect?: (icon: IconName) => void;
}) {
  const { openDialog, closeDialog } = useDialog();
  const open = (handler?: { onSelect?: (icon: IconName) => void }) => {
    let selected: IconName = iconWhitelist[0];

    const dialogId = openDialog({
      title: "選擇圖示 Icon",
      subTitle: "設定你想要的 Icon",
      type: <Star className="text-white" />,
      content: (
        <IconsTemplate
          selected={selected}
          onSelected={(icon) => {
            selected = icon;
            props.onSelect?.(icon);
            handler?.onSelect?.(icon);
            closeDialog(dialogId);
          }}
        />
      ),
      size: "max-w-xl",
    });
  };

  return { open };
}

function IconsTemplate({
  selected,
  onSelected,
}: {
  selected: IconName;
  onSelected?: (icon: IconName) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {iconWhitelist.map((name) => {
        const LucideIcon = (LucideIcons as any)[name] || null;

        return (
          <Button
            key={name}
            className="bg-white/5 hover:bg-white/10 hover: text-white  p-4 flex items-center justify-center"
            variant={"outline"}
            onClick={() => onSelected?.(name)}
          >
            {LucideIcon && <LucideIcon className="w-8 h-8 hover: text-white" />}
          </Button>
        );
      })}
    </div>
  );
}
