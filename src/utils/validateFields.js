const validateFields = (fields) => {
  for (let field of fields) {
    if (field === null || field === undefined || String(field).trim() === "") {
      return false;
    }
  }
  return true;
};

export default validateFields;
