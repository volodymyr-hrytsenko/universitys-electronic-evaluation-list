function getDataFromHandbook() {
  let obj = getDataFromRouterLists();
  obj.user = getUser();
  obj.сurrentStudyYearAndSemester = studyYear.getCurrentStudyYearAndSemester();

  // let inputData = {
  //   user: getUser(),
  //   institutes: obj.handBook.institutes,
  //   educational_degree: obj.handBook.educational_degree,
  //   form_of_training: obj.handBook.form_of_training,
  //   controlForm: controlForm,
  //   сurrentStudyYearAndSemester: studyYear.getCurrentStudyYearAndSemester()
  // };
  return obj;
}

function getDataGroups(iddivision) {
  return getDataJsonFromFile(router.idFolderStudentsGroup, `handBookStudentGroups_${iddivision}.json`);
}

// function getDataStudents(groupId) {
//   let obj = getDataFromRouterLists();
//   const students = obj.handBook.students;
//   console.log(Object.values(students));
//   const arrGroupStudents = filterResources(Object.values(students), "groupId", groupId);
//   return arrGroupStudents;
// }

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