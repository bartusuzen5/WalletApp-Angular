export class PaginationUtils {
   
    static updatePaginatedData(currentPage: number, itemsPerPage: number, items: any[]): any[]{
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return items.slice(startIndex, endIndex);
      }
}