function getRouterInstituteId(instituteId){
  const routsheet = SpreadsheetApp.openById(mainRouter.id).getSheetByName(mainRouter.sheet);
  let routerInstituteId = routsheet.getRange(instituteId,1).getValue(); 
  if(routerInstituteId == ''){//якщо не існує ідентифікатора роутера інституту то створюємо новий документ
    routerInstituteId = createFileSpreadsheet(router.idFolderRouters, instituteId);
    //ід нового документу записуємо до роутера
    routsheet.getRange(instituteId,1).setValue(routerInstituteId);
  }
  return routerInstituteId;
}

function writeDataToInstituteRouter(obj){
  try{
    const routerInstituteId = getRouterInstituteId(obj.instituteId);
    //const sheetName = (obj.sheetSwitch == "summary") ? currentSheetsName.summaryInformation() : currentSheetsName.mainInformation();
    const sheetName = currentSheetsName.mainInformation();
    let currentSheet = SpreadsheetApp.openById(routerInstituteId).getSheetByName(sheetName);
    if(!currentSheet) currentSheet = SpreadsheetApp.openById(routerInstituteId).insertSheet(sheetName);
    obj.uid = uid(); // додавання до запису унікального ідентифікатора
    currentSheet.appendRow([JSON.stringify(obj)]); 
    obj.recordNumber = searchRecordInSheet(obj.uid, currentSheet);
    currentSheet.getRange(obj.recordNumber, 1).setValue(JSON.stringify(obj))
    return true;
  } catch(e){
    return 'Error: ' + e.toString();
  }
}
 
function searchRecordInSheet(uId,currentSheet){
    //визначення порядкового номера рядка, що містить запис з унікальним ідентифікатором
    let list = currentSheet.getRange(1,1,currentSheet.getRange("A1").getDataRegion().getLastRow(),1).getValues(); 
    let recordNumber = 0;
    for(let i = list.length; i > 0; i--){
       if(JSON.parse(list[i-1]).uid == uId){recordNumber = i; break;}
     }
    return recordNumber;
}
//============================================================

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function uid() {
  let x = new Date().getTime();
  return x + '-' + uuidv4(); 
}

//====================================================================



