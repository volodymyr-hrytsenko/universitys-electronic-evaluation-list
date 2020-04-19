function getDataFromHandbook(){
  let obj = getDataFromRouterLists();
  
  let inputData = {
    user: getUser(),
    institutes: obj.handBook.institutes,
    educational_degree: obj.handBook.educational_degree,
    form_of_training: obj.handBook.form_of_training
  }
  console.log(inputData);
  return inputData;
}

function getDataGroups (instituteId) {
  let obj = getDataFromRouterLists();
  const groups = obj.handBook.groups;
  console.log(Object.values(groups));
  const arrChosenGroup = filterResources(Object.values(groups), "instituteId", instituteId);
  return arrChosenGroup;
}

function filterResources(arr, key, query) {
  return arr.filter(function(element) {
      return (element[key] === query) ? true : false;//елемент співпадає з рядком запиту
  })
}

function moveFileBadDocs(fileId){
  moveFileToFolder(fileId, router.idFolderBadDocs);
} 

function saveResource(data) {
  try{
  const sheet = SpreadsheetApp.openById(router.idDb).getSheetByName('data');
      sheet.appendRow(data);
  return true;
  } catch(e){
    return 'Error: ' + e.toString();
  }  
}


