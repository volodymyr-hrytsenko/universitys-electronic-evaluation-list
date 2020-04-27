function getUser(){
  var obj = {};
  var email = getUserEmail();
  email = 'volodymur@vu.cdu.edu.ua';
  switch (email){
    case 'admin@vu.cdu.edu.ua':
    case 'nmv@vu.cdu.edu.ua':
      obj = {"level": 1, "role": "administrator"};
    break;
    case 'iot@vu.cdu.edu.ua':
      obj = {"level": 2, "role": "secretary", "idDepartment": 5};
    break;
    case 'anonymous':
      obj = {"level": 1000000, "role": "anonymous"};
    break;      
    default: obj = {"level": 3, "role": "teacher"};
  }
  obj.email = email;
  return obj;
}

function getDataFromRouterLists(){
    const elementId = "handBook";
    const cache = CacheService.getScriptCache();
    let handBook = {};
    const cached = cache.get(elementId); //отримуємо запис про ресурс з кешу
    
    if (cached != null) {
      handBook = JSON.parse(cached);
     console.log('Дані з кешу');
    } else {
      handBook = getDataJsonFromFile(router.idFolderDB, router.nameJsonData);
      cache.put(elementId, JSON.stringify(handBook)); //кешуємо об'єкти ресурсів
      console.log('Дані з файлу');
    }
    return handBook;
}



