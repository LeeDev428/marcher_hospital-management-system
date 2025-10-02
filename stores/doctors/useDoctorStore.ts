import { defineStore } from "pinia";
import type { TableStaffProfile, StaffRole } from "@/types/staff";

// Client-side sort/search/pagination (your current Staff API has no paging/sort)
// If you later add server paging, you can swap the compute bits easily.

type SortKey = "name" | "profession" | "createdAt";

type SortDir = "asc" | "desc";

export const useDoctorStore = defineStore("doctors", {
  state: () => ({
    loading: true as boolean,
    // raw doctors from API
    doctors: [] as TableStaffProfile[],
    // UI state
    q: "" as string,
    sortBy: "name" as SortKey,
    sortDir: "asc" as SortDir,
    page: 1,
    pageSize: 10,
  }),
  getters: {
    filtered(state) {
      const q = state.q.trim().toLowerCase();
      let list = state.doctors.slice();

      if (q) {
        list = list.filter((d) => {
          const name = `${d.lastName}, ${d.firstName}`.toLowerCase();
          const prof = (d.profession ?? "").toLowerCase();
          return name.includes(q) || prof.includes(q);
        });
      }

      // sort
      list.sort((a, b) => {
        const dir = state.sortDir === "asc" ? 1 : -1;
        const key = state.sortBy;
        if (key === "name") {
          const an = `${a.lastName}, ${a.firstName}`.toLowerCase();
          const bn = `${b.lastName}, ${b.firstName}`.toLowerCase();
          return an < bn ? -1 * dir : an > bn ? 1 * dir : 0;
        }
        if (key === "profession") {
          const ap = (a.profession ?? "").toLowerCase();
          const bp = (b.profession ?? "").toLowerCase();
          return ap < bp ? -1 * dir : ap > bp ? 1 * dir : 0;
        }
        // createdAt as ISO string
        return (a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0) * dir;
      });

      return list;
    },
    pageCount(): number {
      return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
    },
    paged(): TableStaffProfile[] {
      const start = (this.page - 1) * this.pageSize;
      return this.filtered.slice(start, start + this.pageSize);
    },
  },
  actions: {
    async fetch() {
      const { $trpc } = useNuxtApp();
      try {
        this.loading = true;
        const role: StaffRole = "DOCTOR";
        const { success, data } = await $trpc.staff.profiles.getStaffProfiles.query(role);
        if (success && data) {
          this.doctors = data;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    setSearch(q: string) {
      this.q = q;
      this.page = 1;
    },
    clearSearch() {
      this.q = "";
      this.page = 1;
    },
    setSort(key: SortKey) {
      if (this.sortBy === key) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.sortBy = key;
        this.sortDir = "asc";
      }
    },
    setPage(p: number) {
      this.page = Math.min(Math.max(1, p), this.pageCount);
    },
    setPageSize(n: number) {
      this.pageSize = n;
      this.page = 1;
    },
  },
});