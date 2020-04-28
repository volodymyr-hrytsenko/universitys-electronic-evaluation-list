function getRouterInstituteId(instituteId) {
  const routsheet = SpreadsheetApp.openById(mainRouter.id).getSheetByName(mainRouter.sheet);
  let routerInstituteId = routsheet.getRange(instituteId, 1).getValue();
  if (routerInstituteId == '') { //якщо не існує ідентифікатора роутера інституту то створюємо новий документ
    routerInstituteId = createFileSpreadsheet(router.idFolderRouters, instituteId);
    //ід нового документу записуємо до роутера
    routsheet.getRange(instituteId, 1).setValue(routerInstituteId);
  }
  return routerInstituteId;
}

function writeDataToInstituteRouter(obj) {
  try {
    const routerInstituteId = getRouterInstituteId(obj.instituteId);
    const sheetName = studyYear.getCurrentSheetsName();
    let currentSheet = SpreadsheetApp.openById(routerInstituteId).getSheetByName(sheetName);
    if (obj.recordNumber !== -1) {
      currentSheet.getRange(obj.recordNumber, 1).setValue(JSON.stringify(obj));
    } else {
      if (!currentSheet) currentSheet = SpreadsheetApp.openById(routerInstituteId).insertSheet(sheetName);
      obj.uid = uid(); // додавання до запису унікального ідентифікатора
      currentSheet.appendRow([JSON.stringify(obj)]);
      obj.recordNumber = searchRecordInSheet(obj.uid, currentSheet);
      currentSheet.getRange(obj.recordNumber, 1).setValue(JSON.stringify(obj));
    }
    return {
      recordNumber: obj.recordNumber,
      uid: obj.uid
    };
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}

function searchRecordInSheet(uId, currentSheet) {
  //визначення порядкового номера рядка, що містить запис з унікальним ідентифікатором
  let list = currentSheet.getRange(1, 1, currentSheet.getRange("A1").getDataRegion().getLastRow(), 1).getValues();
  let recordNumber = 0;
  for (let i = list.length; i > 0; i--) {
    if (JSON.parse(list[i - 1]).uid == uId) {
      recordNumber = i;
      break;
    }
  }
  return recordNumber;
}

function createEvaluationList(data, newFileName) {
  const evaluationListId = createCopySpreadsheet(router.idEvaluationListsFolder, router.templateId, newFileName);
  const evaluationList = SpreadsheetApp.openById(evaluationListId);
  data.date = Utilities.formatDate(new Date(data.date), "Europe/Kiev", "dd.MM.yyyy");
  let sheet = evaluationList.getSheetByName("1");
  for (let key in data) {
    let range = propertyToRange[key];
    if (key === 'students') {
      let students = data.students;
      let rangeNum = 23;
      students.forEach(function (student, ind) {
        if (ind >= 14) {
          rangeNum = -11;
          sheet = evaluationList.getSheetByName("2");
        }
        let position = ind + rangeNum;
        sheet.getRange('B' + position).setValue(student.name);
        sheet.getRange('D' + position).setValue(student.gradebookNumber);
        sheet.getRange('E' + position).setValue(student.currentGrade);
        sheet.getRange('F' + position).setValue(student.semesterGrade);
      });
      sheet = evaluationList.getSheetByName("1");
    } else if (key === 'aditionalTeachers') {
      let teachers = data[key].join(', ');
      sheet.getRange(range).setValue(teachers);
    } else if (range) {
      sheet.getRange(range).setValue(data[key]);
    }
  }
  //evaluationList;
  return evaluationListId;
}



function spreedshetToPDF(SpreadsheetId, pdfFileName) {
  try {
    // SpreadsheetId = '1aiABIEYCX21uouznbSqBUxIfrpDMA8CM8cRIWLrvvcM';
    let folder = DriveApp.getFolderById(router.pdfFolder);
    let spreedsheets = SpreadsheetApp.openById(SpreadsheetId);
    let theBlob = spreedsheets.getBlob().getAs('application/pdf').setName(pdfFileName + ".pdf");
    let newFile = folder.createFile(theBlob);
    let newFileId = newFile.getId();
    // DriveApp.getFileById(destSpreadSheet.getId()).setTrashed(true);//видалення файлу в корзину
    return newFileId;
  } catch (e) {
    return 'Error: sending mail ' + e.toString();
  }
}

function sendEmail(email, messageTitle, messageBody, organization, attachmentFileId) {
  try {
    GmailApp.sendEmail(email, messageTitle, messageBody, {
      name: organization,
      attachments: [DriveApp.getFileById(attachmentFileId)]
    });
    return true;
  } catch (e) {
    return 'Error: sending mail ' + e.toString();
  }
}

function subscribeEvolutionsList(obj) {
  try {
    obj.spreadsheetId = createEvaluationList(obj.evaluationListData, `${obj.evaluationListData.groupName} ${obj.evaluationListData.academicDiscipline}`);
    writeDataToInstituteRouter(obj);
    return obj;
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}

function sendPdfToEmail(obj) {
  try {
    let emailParametrs = {
      pdfName: obj.evaluationListData.groupName + " " + obj.evaluationListData.academicDiscipline,
      title: "Відомість(" + obj.evaluationListData.groupName + " " + obj.evaluationListData.academicDiscipline + ")",
      description: "Роздрукуйте і підпишить. Передайте до дирекції " + obj.evaluationListData.institute,
      resourseName: "е-Відомість ЧНУ"
    };
    obj.pdfId = spreedshetToPDF(obj.spreadsheetId, emailParametrs.pdfName);
    writeDataToInstituteRouter(obj);
    sendEmail(getUser().email, emailParametrs.title, emailParametrs.description, emailParametrs.resourseName, obj.pdfId);
    return true;
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}
//============================================================

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function uid() {
  let x = new Date().getTime();
  return x + '-' + uuidv4();
}

//====================================================================