function getDataFromHandbook() {
  let obj = getDataFromRouterLists();

  let inputData = {
    user: getUser(),
    institutes: obj.handBook.institutes,
    educational_degree: obj.handBook.educational_degree,
    form_of_training: obj.handBook.form_of_training,
    controlForm: controlForm,
    сurrentStudyYearAndSemester: studyYear.getCurrentStudyYearAndSemester()
  };
  console.log(inputData);
  return inputData;
}

function getDataGroups(instituteId) {
  let obj = getDataFromRouterLists();
  const groups = obj.handBook.groups;
  console.log(Object.values(groups));
  const arrChosenGroup = filterResources(Object.values(groups), "instituteId", instituteId);
  return arrChosenGroup;
}

function getDataStudents(groupId) {
  let obj = getDataFromRouterLists();
  const students = obj.handBook.students;
  console.log(Object.values(students));
  const arrGroupStudents = filterResources(Object.values(students), "groupId", groupId);
  return arrGroupStudents;
}

function getEvolutionListsByTeacher(instituteId) {
  try {
    const routerInstituteId = getRouterInstituteId(instituteId);
    const sheetName = studyYear.getCurrentSheetsName();
    let currentSheet = SpreadsheetApp.openById(routerInstituteId).getSheetByName(sheetName);
    if (!currentSheet) currentSheet = SpreadsheetApp.openById(routerInstituteId).insertSheet(sheetName);
    let list = currentSheet.getRange(1, 1, currentSheet.getRange("A1").getDataRegion().getLastRow(), 1).getValues();

    if (Object.keys(list)[0] == "0" && Object.values(list)[0] == 0) {
      list = [JSON.stringify({})];
    }
    return filterResources(list.map(el => {
      return JSON.parse(el);
    }), "emailTeacher", getUser().email);

  } catch (e) {
    return 'Error:5 ' + e.toString();
  }
}

function getEvListsByGroup(instituteId, groupId) {
  try {
    const routerInstituteId = getRouterInstituteId(instituteId);
    const sheetName = studyYear.getCurrentSheetsName();
    let currentSheet = SpreadsheetApp.openById(routerInstituteId).getSheetByName(sheetName);
    if (!currentSheet) currentSheet = SpreadsheetApp.openById(routerInstituteId).insertSheet(sheetName);
    let list = currentSheet.getRange(1, 1, currentSheet.getRange("A1").getDataRegion().getLastRow(), 1).getValues();

    if (Object.keys(list)[0] == "0" && Object.values(list)[0] == 0) {
      list = [JSON.stringify({})];
    }
    return filterResources(list.map(el => {
      return JSON.parse(el);
    }), "groupId", groupId);

  } catch (e) {
    return 'Error:5 ' + e.toString();
  }
}

function filterResources(arr, key, query) {
  return arr.filter(function (element) {
    return (element[key] === query) ? true : false; //елемент співпадає з рядком запиту
  });
}

function moveFileBadDocs(fileId) {
  moveFileToFolder(fileId, router.idFolderBadDocs);
}

// function saveResource(data) {
//   try{
//   const sheet = SpreadsheetApp.openById(router.idDb).getSheetByName('data');
//       sheet.appendRow(data);
//   return true;
//   } catch(e){
//     return 'Error: ' + e.toString();
//   }  
// }



function sendEmail(dataObject, pdfName, messageTitle, messageBody, organization) {
  const ss = SpreadsheetApp.openById(dataObject.templateId);
  let sheet = ss.getSheets()[0];
  let sheetPdf = ss.getSheets()[1];

  let data = sheet.getRange(...pageRange.mainPage).getValues();

  let folderID = router.pdfFolder;
  let folder = DriveApp.getFolderById(folderID);

  let destSpreadSheet = SpreadsheetApp.open(DriveApp.getFileById(ss.getId()).makeCopy("tmp_pdf", folder));
  let sheetsPdf = destSpreadSheet.getSheets();

  let theBlob = destSpreadSheet.getBlob().getAs('application/pdf').setName(pdfName);
  let newFile = folder.createFile(theBlob);
  let newFileId = newFile.getId();

  DriveApp.getFileById(destSpreadSheet.getId()).setTrashed(true);

  if (1) {
    GmailApp.sendEmail(dataObject.email, messageTitle, messageBody, {
      name: organization,
      attachments: [DriveApp.getFileById(newFileId)]
    })
  }
  return newFileId
}

// function saveEvaluationListData(recordData) {
//   // for (let key in recordData) {
//   //   recordData[key] = recordData[key];
//   // }
//   return writeDataToInstituteRouter(recordData);
// }