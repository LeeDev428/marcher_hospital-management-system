import { createTRPCRouter } from "../../init"
import { pharmacyBrandsRouter } from "./pharmacyBrands"
import { pharmacyCategoriesRouter } from "./pharmacyCategories"
import { pharmacyItemsRouter } from "./pharmacyItems"
import { pharmacySuppliersRouter } from "./pharmacySuppliers"

export const pharmacyRouter = createTRPCRouter({
	brands: pharmacyBrandsRouter,
	categories: pharmacyCategoriesRouter,
	items: pharmacyItemsRouter,
	suppliers: pharmacySuppliersRouter,
})