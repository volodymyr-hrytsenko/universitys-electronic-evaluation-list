function getUserEmail(){
  if(Session.getActiveUser().getEmail()){
     return Session.getActiveUser().getEmail();
  }
  else
    return "anonymous";
}

function getDataJsonFromFile(idFolder, fileName){
   try{  
    var files = DriveApp.getFolderById(idFolder).getFilesByName(fileName);
    var file = files.next();
    var fileId = file.getId();
    var content = DriveApp.getFileById(fileId)
      .getBlob()
      .getDataAsString();
    return JSON.parse(content);
   } catch(e){
       return 'Error: ' + e.toString();
   }     
}

function moveFileToFolder(fileId, toFolderId) {
   try{
     var file = DriveApp.getFileById(fileId);
     var source_folder = DriveApp.getFileById(fileId).getParents().next();
     var folder = DriveApp.getFolderById(toFolderId);
     folder.addFile(file);
     source_folder.removeFile(file);
    return true;
  } catch(e){
    return 'Error: ' + e.toString();
  }
}

function createFileSpreadsheet(folderID, fileName){
  try{
     var id_spreadsheets = SpreadsheetApp.create(fileName).getId();
     moveFileToFolder(id_spreadsheets, folderID);
     return id_spreadsheets;
  } catch(e){
    return 'Error: ' + e.toString();
  }
}

function createCopySpreadsheet(folderID, spreadsheetId, newFileName){
  try{
     const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
     const spreadsheetCopyId = spreadsheet.copy(newFileName).getId()
     moveFileToFolder(spreadsheetCopyId, folderID);
     Logger.log(spreadsheetCopyId)
     return spreadsheetCopyId;
  } catch(e){
    return 'Error: ' + e.toString();
  }
}

function createEvaluationList(data, newFileName) {
  const evaluationListId = createCopySpreadsheet(router.idEvaluationListsFolder, router.templateId, newFileName);
  const evaluationList = SpreadsheetApp.openById(evaluationListId);
  let sheet = evaluationList.getSheetByName("1");
  for(let key in data) {
    let range = propertyToRange[key];
    if(key === 'students') {
      let students = data.students;
      let rangeNum = 23;
      students.forEach(function (student, ind) {
        if(ind >= 14) {
          rangeNum = -11;
          sheet = evaluationList.getSheetByName("2");
        }
        let position = ind + rangeNum;
        sheet.getRange('B' + position).setValue(student.name)
        sheet.getRange('D' + position).setValue(student.gradebookNumber)
        sheet.getRange('E' + position).setValue(student.currentGrade)
        sheet.getRange('F' + position).setValue(student.semesterGrade)
      })
      sheet = evaluationList.getSheetByName("1");
    } else if(key === 'aditionalTeachers') {
      let teachers = data[key].join(', ')
      sheet.getRange(range).setValue(teachers)
    } else if(range) {
      sheet.getRange(range).setValue(data[key])
    }
  }
  return evaluationListId
}

