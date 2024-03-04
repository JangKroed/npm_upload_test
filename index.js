const multer = require('multer');
const xlsx = require('xlsx');
const Joi = require('joi');

// 파일 업로드 및 처리 함수
function processExcel(file, schema) {
  // 엑셀 파일 읽기
  const workbook = xlsx.readFile(file);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // 헤더 추출
  const headers = [];
  let headerIndex = 0;
  let colIndex = 1;
  let header = sheet[xlsx.utils.encode_cell({ r: headerIndex, c: colIndex })];
  while (header && header.v) {
    headers.push(header.v);
    colIndex++;
    header = sheet[xlsx.utils.encode_cell({ r: headerIndex, c: colIndex })];
  }

  // 빈칸 제거
  let rows = xlsx.utils.sheet_to_json(sheet, { header: headers });

  // 각 row를 JSON 형식으로 변환
  rows = rows.map((row) => {
    let newRow = {};
    headers.forEach((header) => {
      newRow[header] = row[header];
    });
    return newRow;
  });

  // 유효성 검사
  const validationResults = validateRows(rows, schema);

  // 검증 결과 확인
  const invalidRows = validationResults.filter((result) => !result.valid);
  if (invalidRows.length > 0) {
    return { success: false, errors: invalidRows };
  }

  return { success: true, data: rows };
}

// 유효성 검사 함수
function validateRows(rows, schema) {
  const joiSchema = Joi.object().keys(schema);

  const validationResults = [];
  for (let i = 0; i < rows.length; i++) {
    const { error } = joiSchema.validate(rows[i]);
    if (error) {
      validationResults.push({
        row: i + 1,
        valid: false,
        error: error.details[0].message,
      });
    } else {
      validationResults.push({ row: i + 1, valid: true });
    }
  }

  return validationResults;
}

module.exports = {
  processExcel,
};
//
