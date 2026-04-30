export const filterByQuery = (items, query, field = "title") => {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return items;
  }
  return items.filter(item => {
    const fieldValue = String(item[field] ?? "").toLowerCase();
    return fieldValue.includes(trimmedQuery);
  });
};
