
export enum CategoryEnum {
  CERVEZA = 0,
  COPA = 1,
  COPA_PREMIUM = 2,
  COCTEL = 3,
  VINO = 4,
  CHUPITO = 5,
  OTRO = 6,
}

export const CategoryLabelMap: Record<CategoryEnum, string> = {
  [CategoryEnum.CERVEZA]: "Beer",
  [CategoryEnum.COPA]: "Mixed Drink",
  [CategoryEnum.COPA_PREMIUM]: "Premium Mixed Drink",
  [CategoryEnum.COCTEL]: "Cocktail",
  [CategoryEnum.VINO]: "Wine",
  [CategoryEnum.CHUPITO]: "Shot",
  [CategoryEnum.OTRO]: "Other",
};
