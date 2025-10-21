import { defineStore } from "pinia"
import type { CartItem, CreatePharmacySale, TablePharmacySale, FullPharmacySale } from "@/types/pharmacy"

export const usePOSStore = defineStore("pos", {
  state: () => ({
    loading: false,
    cart: [] as CartItem[],
    availableItems: [] as any[], // Pharmacy items with stock
    sales: [] as TablePharmacySale[],
    currentSale: null as FullPharmacySale | null,
    
    // Customer info
    customerName: "" as string | null,
    customerPhone: "" as string | null,
    
    // Payment info
    paymentMethod: "CASH" as "CASH" | "CARD" | "ONLINE" | "INSURANCE",
    amountPaid: 0,
    discount: 0,
    tax: 0,
    notes: "" as string | null,
    
    // Search and filters
    searchQuery: "",
    selectedCategoryId: null as string | null,
    selectedBrandId: null as string | null,
  }),

  getters: {
    // Cart calculations
    cartSubtotal: (state) => {
      return state.cart.reduce((total, item) => total + item.subtotal, 0)
    },
    
    cartTotal: (state) => {
      const subtotal = state.cart.reduce((total, item) => total + item.subtotal, 0)
      return subtotal - state.discount + state.tax
    },
    
    // Calculate change
    change: (state) => {
      const total = state.cart.reduce((total, item) => total + item.subtotal, 0) - state.discount + state.tax
      return Math.max(0, state.amountPaid - total)
    },
    
    cartItemCount: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0)
    },
    
    // Check if cart has items
    hasItems: (state) => {
      return state.cart.length > 0
    },
    
    // Find item in cart
    findCartItem: (state) => (pharmacyItemId: string) => {
      return state.cart.find(item => item.pharmacyItemId === pharmacyItemId)
    },
  },

  actions: {
    // Fetch available items for POS
    async fetchAvailableItems() {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, data } = await $trpc.pharmacy.sales.getAvailableItems.query({
          search: this.searchQuery || undefined,
          categoryId: this.selectedCategoryId || undefined,
          brandId: this.selectedBrandId || undefined,
          minStock: 1,
        })
        
        if (success && data) {
          this.availableItems = data
        }
      } catch (error) {
        console.error(error)
        useToast("error", "Error", "Failed to fetch available items")
      } finally {
        this.loading = false
      }
    },
    
    // Add item to cart
    addToCart(item: any) {
      const existingItem = this.cart.find(
        cartItem => cartItem.pharmacyItemId === item.id
      )
      
      if (existingItem) {
        // Check stock availability
        if (existingItem.quantity + 1 > existingItem.availableStock) {
          useToast("error", "Insufficient Stock", `Only ${existingItem.availableStock} units available`)
          return
        }
        
        // Increase quantity
        existingItem.quantity += 1
        existingItem.subtotal = existingItem.quantity * existingItem.unitPrice
      } else {
        // Add new item to cart
        const cartItem: CartItem = {
          pharmacyItemId: item.id,
          name: item.name,
          strength: item.strength,
          unit: item.unit,
          unitPrice: Number(item.price || 0),
          quantity: 1,
          availableStock: item.stock,
          subtotal: Number(item.price || 0),
        }
        this.cart.push(cartItem)
      }
      
      useToast("success", "Added to Cart", `${item.name} added to cart`)
    },
    
    // Remove item from cart
    removeFromCart(pharmacyItemId: string) {
      const index = this.cart.findIndex(
        item => item.pharmacyItemId === pharmacyItemId
      )
      
      if (index !== -1) {
        const itemName = this.cart[index].name
        this.cart.splice(index, 1)
        useToast("success", "Removed", `${itemName} removed from cart`)
      }
    },
    
    // Update item quantity
    updateQuantity(pharmacyItemId: string, quantity: number) {
      const item = this.cart.find(
        cartItem => cartItem.pharmacyItemId === pharmacyItemId
      )
      
      if (!item) return
      
      // Validate quantity
      if (quantity < 1) {
        this.removeFromCart(pharmacyItemId)
        return
      }
      
      if (quantity > item.availableStock) {
        useToast("error", "Insufficient Stock", `Only ${item.availableStock} units available`)
        return
      }
      
      item.quantity = quantity
      item.subtotal = item.quantity * item.unitPrice
    },
    
    // Clear cart
    clearCart() {
      this.cart = []
      this.customerName = ""
      this.customerPhone = ""
      this.amountPaid = 0
      this.discount = 0
      this.tax = 0
      this.notes = ""
      this.paymentMethod = "CASH"
    },
    
    // Checkout - Create sale
    async checkout() {
      const { $trpc } = useNuxtApp()
      
      if (this.cart.length === 0) {
        useToast("error", "Empty Cart", "Please add items to cart before checkout")
        return null
      }
      
      // Validate payment amount
      if (this.amountPaid < this.cartTotal) {
        useToast("error", "Insufficient Payment", `Amount paid (${this.amountPaid}) is less than total (${this.cartTotal})`)
        return null
      }
      
      try {
        this.loading = true
        
        // Prepare sale data
        const saleData: CreatePharmacySale = {
          customerName: this.customerName || null,
          customerPhone: this.customerPhone || null,
          staffId: null, // TODO: Get from auth context
          items: this.cart.map(item => ({
            pharmacyItemId: item.pharmacyItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
          subtotal: this.cartSubtotal,
          discount: this.discount,
          tax: this.tax,
          total: this.cartTotal,
          amountPaid: this.amountPaid,
          changeGiven: this.change,
          paymentMethod: this.paymentMethod,
          paymentStatus: "COMPLETED",
          notes: this.notes || null,
        }
        
        const { success, message, data } = await $trpc.pharmacy.sales.createPharmacySale.mutate(saleData)
        
        if (success && data) {
          useToast("success", "Sale Completed", message || "Sale completed successfully")
          this.currentSale = data as any
          this.clearCart()
          
          // Refresh available items to update stock
          await this.fetchAvailableItems()
          
          return data
        } else {
          useToast("error", "Checkout Failed", message || "Failed to complete sale")
          return null
        }
      } catch (error: any) {
        console.error(error)
        useToast("error", "Error", error?.message || "An error occurred during checkout")
        return null
      } finally {
        this.loading = false
      }
    },
    
    // Fetch all sales
    async fetchSales() {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, data } = await $trpc.pharmacy.sales.getPharmacySales.query()
        
        if (success && data) {
          this.sales = data
        }
      } catch (error) {
        console.error(error)
        useToast("error", "Error", "Failed to fetch sales")
      } finally {
        this.loading = false
      }
    },
    
    // Fetch single sale
    async fetchSale(id: string) {
      const { $trpc } = useNuxtApp()
      
      try {
        this.loading = true
        const { success, data } = await $trpc.pharmacy.sales.getPharmacySale.query({ id })
        
        if (success && data) {
          this.currentSale = data
        }
      } catch (error) {
        console.error(error)
        useToast("error", "Error", "Failed to fetch sale details")
      } finally {
        this.loading = false
      }
    },
    
    // Set search and filters
    setSearch(query: string) {
      this.searchQuery = query
      this.fetchAvailableItems()
    },
    
    setCategory(categoryId: string | null) {
      this.selectedCategoryId = categoryId
      this.fetchAvailableItems()
    },
    
    setBrand(brandId: string | null) {
      this.selectedBrandId = brandId
      this.fetchAvailableItems()
    },
  },
})
