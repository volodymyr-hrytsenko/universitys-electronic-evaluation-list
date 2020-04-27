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

function moveFileToFolder(fileId, folderId){
  try{
    const file = DriveApp.getFileById(fileId);
    const source_folder = DriveApp.getFileById(fileId).getParents().next();
    const folder = DriveApp.getFolderById(folderId);
    folder.addFile(file);
    source_folder.removeFile(file);
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

