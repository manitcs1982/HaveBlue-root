import React from "react";

export const setUnitsImages = (
  units: any[],
  setter: React.Dispatch<React.SetStateAction<any[]>>
): void => {
  let temp: any[] = [];

  if (units) {
    for (const unit of units) {
      temp.push(...unit.unit_images);
    }

    setter(temp);
  }
};

export const setCratesImages = (
  crates: any[],
  setter: React.Dispatch<React.SetStateAction<any[]>>
): void => {
  let extractedImages: any[] = [];

  if (crates) {
    for (const crate of crates) {
      extractedImages.push(...crate.create_images);
    }

    setter(extractedImages);
  }
};

export const setActionsImages = (
  actions: any[],
  setter: React.Dispatch<React.SetStateAction<any[]>>
) => {
  let extractedImages: any[] = [];

  if (actions) {
    for (const action of actions) {
      extractedImages.push(...action.attachments);
    }
  }

  setter(extractedImages);
};

export const calculateTextColor = (hexColor: string) => {
  let r = parseInt(hexColor.substr(1, 2), 16);
  let g = parseInt(hexColor.substr(3, 2), 16);
  let b = parseInt(hexColor.substr(5, 2), 16);

  const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);

  return brightness > 125 ? "black" : "white";
};
