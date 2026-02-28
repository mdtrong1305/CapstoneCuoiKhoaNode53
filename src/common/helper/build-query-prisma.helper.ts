export function buildQueryPrisma(query) {
  let { page, pageSize, filters } = query;
  // kiểm tra nếu có gửi query filters lên
  try {
    filters = JSON.parse(filters);
  } catch (error) {
    filters = {};
  }
  // xử lý filters
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === "string") {
      filters[key] = {
        contains: value,
      };
    }
  }
  const index = (page - 1) * pageSize;
  const where = {
    ...filters
  };
  return {
    page,
    pageSize,
    where,
    index,
  };
}
